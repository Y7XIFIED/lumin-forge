import { useCallback, useEffect, useRef, useState } from 'react';

const vertexShader = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vUv;
void main(){
  vUv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D u_tex;
uniform float u_time;
uniform float u_speed;
uniform float u_refraction;
uniform float u_blur;
uniform float u_liquid;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_noise;
uniform float u_chroma;
uniform vec3 u_tint;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.123);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main(){
  float t = u_time * 0.001 * u_speed;
  vec2 uv = vUv;
  vec2 center = uv - 0.5;
  float radius = length(center);

  float n = noise(uv * (12.0 + u_noise * 8.0) + vec2(t * 1.3, -t * 0.9));
  float wave = sin((uv.x + uv.y + t) * 8.0) * 0.5 + 0.5;
  float distort = (n * 0.7 + wave * 0.3 - 0.5) * (u_refraction * 2.2 + u_liquid * 0.012);

  vec2 dir = normalize(center + vec2(1e-5));
  vec2 uvR = uv + dir * distort * (1.0 + u_chroma * 0.05);
  vec2 uvG = uv + dir * distort;
  vec2 uvB = uv - dir * distort * (1.0 + u_chroma * 0.05);

  float blurStep = u_blur * 0.5;
  vec4 rS = texture(u_tex, uvR);
  vec4 gS = texture(u_tex, uvG + vec2(blurStep, 0.0));
  vec4 bS = texture(u_tex, uvB - vec2(blurStep, 0.0));

  vec3 col = vec3(rS.r, gS.g, bS.b);

  float edgeGlow = smoothstep(0.78, 0.15, radius);
  col += edgeGlow * vec3(0.18, 0.2, 0.28);

  col *= u_brightness;
  col = (col - 0.5) * u_contrast + 0.5;
  col = clamp(col, 0.0, 1.0);

  col = mix(col, col * u_tint, 0.35);
  float alpha = texture(u_tex, uv).a;
  outColor = vec4(col, alpha);
}`;

interface MetallicPaintProps {
  imageSrc: string;
  seed?: number;
  scale?: number;
  refraction?: number;
  blur?: number;
  liquid?: number;
  speed?: number;
  brightness?: number;
  contrast?: number;
  angle?: number;
  fresnel?: number;
  lightColor?: string;
  darkColor?: string;
  patternSharpness?: number;
  waveAmplitude?: number;
  noiseScale?: number;
  chromaticSpread?: number;
  mouseAnimation?: boolean;
  distortion?: number;
  contour?: number;
  tintColor?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function MetallicPaint({
  imageSrc,
  refraction = 0.01,
  blur = 0.015,
  liquid = 0.75,
  speed = 0.3,
  brightness = 1.6,
  contrast = 1.1,
  noiseScale = 0.5,
  chromaticSpread = 2,
  tintColor = '#feb3ff'
}: MetallicPaintProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const initGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
    if (!gl) return null;

    const compile = (src: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };

    const vs = compile(vertexShader, gl.VERTEX_SHADER);
    const fs = compile(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    return { gl, program };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const glData = initGL(canvas);
    if (!glData) return;
    const { gl, program } = glData;

    const uniforms = {
      tex: gl.getUniformLocation(program, 'u_tex'),
      time: gl.getUniformLocation(program, 'u_time'),
      speed: gl.getUniformLocation(program, 'u_speed'),
      refraction: gl.getUniformLocation(program, 'u_refraction'),
      blur: gl.getUniformLocation(program, 'u_blur'),
      liquid: gl.getUniformLocation(program, 'u_liquid'),
      brightness: gl.getUniformLocation(program, 'u_brightness'),
      contrast: gl.getUniformLocation(program, 'u_contrast'),
      noise: gl.getUniformLocation(program, 'u_noise'),
      chroma: gl.getUniformLocation(program, 'u_chroma'),
      tint: gl.getUniformLocation(program, 'u_tint')
    };

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      setReady(true);
    };
    img.src = imageSrc;

    const tint = hexToRgb(tintColor);

    let start = performance.now();
    const render = (now: number) => {
      const t = now - start;
      gl.useProgram(program);
      gl.uniform1i(uniforms.tex, 0);
      gl.uniform1f(uniforms.time, t);
      gl.uniform1f(uniforms.speed, speed);
      gl.uniform1f(uniforms.refraction, refraction);
      gl.uniform1f(uniforms.blur, blur);
      gl.uniform1f(uniforms.liquid, liquid);
      gl.uniform1f(uniforms.brightness, brightness);
      gl.uniform1f(uniforms.contrast, contrast);
      gl.uniform1f(uniforms.noise, noiseScale);
      gl.uniform1f(uniforms.chroma, chromaticSpread);
      gl.uniform3f(uniforms.tint, tint[0], tint[1], tint[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (texture) gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [imageSrc, initGL, speed, refraction, blur, liquid, brightness, contrast, noiseScale, chromaticSpread, tintColor]);

  return <canvas ref={canvasRef} className="block h-full w-full object-contain" data-ready={ready} />;
}
