import React, { useEffect, useRef } from 'react';

type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 4,
  color = '#B19EEF',
  className,
  style,
  patternScale = 1,
  patternDensity = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.2,
  rippleSpeed = 0.5,
  autoPauseOffscreen = true,
  speed = 0.6,
  transparent = true,
  edgeFade = 0.25,
  noiseAmount = 0.02
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const clicks = useRef<Array<{ x: number; y: number; t: number }>>([]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawShape = (x: number, y: number, s: number, alpha: number) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      if (variant === 'circle') {
        ctx.beginPath();
        ctx.arc(x + s / 2, y + s / 2, s * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else if (variant === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x + s / 2, y);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x, y + s);
        ctx.closePath();
        ctx.fill();
      } else if (variant === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x + s / 2, y);
        ctx.lineTo(x + s, y + s / 2);
        ctx.lineTo(x + s / 2, y + s);
        ctx.lineTo(x, y + s / 2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(x, y, s, s);
      }
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (autoPauseOffscreen && !visible) return;
      t += 0.016 * speed;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (!transparent) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
      }

      const step = Math.max(2, pixelSize);
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const nx = x / w;
          const ny = y / h;
          let v = (Math.sin((nx * 10 * patternScale + t * rippleSpeed) * Math.PI) + Math.cos((ny * 8 * patternScale - t * rippleSpeed) * Math.PI)) * 0.25 + 0.5;
          v = Math.max(0, Math.min(1, v * patternDensity));

          if (enableRipples) {
            for (const c of clicks.current) {
              const age = t - c.t;
              const r = age * 120 * rippleSpeed;
              const d = Math.hypot(x - c.x, y - c.y);
              const ring = Math.exp(-Math.pow((d - r) / Math.max(6, rippleThickness * 40), 2));
              v += ring * rippleIntensityScale * 0.5;
            }
          }

          v += (Math.random() - 0.5) * noiseAmount;
          const fadeEdge = Math.min(nx, ny, 1 - nx, 1 - ny);
          const edge = Math.max(0, Math.min(1, fadeEdge / Math.max(0.001, edgeFade)));
          const alpha = Math.max(0, Math.min(1, v * edge));

          if (alpha > 0.08) {
            const jitter = 1 + (Math.random() - 0.5) * pixelSizeJitter;
            drawShape(x, y, step * jitter, alpha);
          }
        }
      }

      ctx.globalAlpha = 1;
      clicks.current = clicks.current.filter(c => t - c.t < 4.2);
    };

    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      clicks.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t });
    };

    const io = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
    });

    resize();
    draw();
    io.observe(canvas);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', onClick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onClick);
    };
  }, [variant, pixelSize, color, patternScale, patternDensity, pixelSizeJitter, enableRipples, rippleIntensityScale, rippleThickness, rippleSpeed, autoPauseOffscreen, speed, transparent, edgeFade, noiseAmount]);

  return <canvas ref={ref} className={`w-full h-full block ${className || ''}`} style={style} aria-label="PixelBlast interactive background" />;
};

export default PixelBlast;
