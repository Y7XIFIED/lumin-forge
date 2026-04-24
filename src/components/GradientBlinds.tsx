import React, { useEffect, useRef } from 'react';

export interface GradientBlindsProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: 'left' | 'right';
  mixBlendMode?: string;
}

const GradientBlinds: React.FC<GradientBlindsProps> = ({
  className,
  paused = false,
  gradientColors = ['#FF9FFC', '#5227FF'],
  angle = 0,
  noise = 0.2,
  blindCount = 16,
  mouseDampening = 0.15,
  spotlightRadius = 0.4,
  spotlightOpacity = 0.7,
  mixBlendMode = 'lighten'
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const colorA = gradientColors[0] || '#FF9FFC';
    const colorB = gradientColors[1] || '#5227FF';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!paused) t += 0.008;

      mouse.current.x += (mouse.current.tx - mouse.current.x) * Math.max(0.02, mouseDampening * 0.1);
      mouse.current.y += (mouse.current.ty - mouse.current.y) * Math.max(0.02, mouseDampening * 0.1);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.translate(-w / 2, -h / 2);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const stripeW = Math.max(8, w / Math.max(2, blindCount));
      for (let i = 0; i < blindCount; i++) {
        const x = i * stripeW;
        const shine = 0.15 + 0.1 * Math.sin(t * 3 + i * 0.8);
        ctx.fillStyle = `rgba(255,255,255,${shine})`;
        ctx.fillRect(x, 0, stripeW * 0.5, h);
      }

      for (let i = 0; i < 80; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * noise * 0.12})`;
        ctx.fillRect(nx, ny, 1, 1);
      }

      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;
      const r = Math.max(60, Math.min(w, h) * spotlightRadius);
      const spot = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      spot.addColorStop(0, `rgba(255,255,255,${spotlightOpacity})`);
      spot.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = (e.clientX - rect.left) / rect.width;
      mouse.current.ty = (e.clientY - rect.top) / rect.height;
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [paused, gradientColors, angle, blindCount, noise, mouseDampening, spotlightRadius, spotlightOpacity]);

  return <canvas ref={ref} className={`w-full h-full block ${className || ''}`} style={{ mixBlendMode: mixBlendMode as any }} />;
};

export default GradientBlinds;
