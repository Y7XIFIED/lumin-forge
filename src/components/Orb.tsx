import { useEffect, useRef } from 'react';

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
}

export default function Orb({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  backgroundColor = '#000000'
}: OrbProps) {
  const ctn = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ctn.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let hover = forceHoverState ? 1 : 0;
    let targetHover = forceHoverState ? 1 : 0;
    let rot = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      if (forceHoverState) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetHover = Math.hypot(x, y) < Math.min(rect.width, rect.height) * 0.35 ? 1 : 0;
    };

    const onLeave = () => {
      if (!forceHoverState) targetHover = 0;
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      t += 0.016;
      hover += (targetHover - hover) * 0.08;
      if (rotateOnHover && hover > 0.5) rot += 0.01;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.32;

      const grad = ctx.createRadialGradient(
        cx + Math.cos(rot + t) * r * 0.15,
        cy + Math.sin(rot + t * 0.9) * r * 0.15,
        r * 0.15,
        cx,
        cy,
        r
      );
      grad.addColorStop(0, `hsla(${hue + 220}, 90%, 70%, 0.95)`);
      grad.addColorStop(0.5, `hsla(${hue + 280}, 90%, 60%, 0.8)`);
      grad.addColorStop(1, `hsla(${hue + 320}, 90%, 30%, 0.08)`);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot * 0.5);
      ctx.translate(-cx, -cy);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * (1 + hover * hoverIntensity), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState, backgroundColor]);

  return <canvas ref={ctn} className="w-full h-full" />;
}
