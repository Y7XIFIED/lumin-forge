import React, { useEffect, useRef } from 'react';

interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

const Lightning: React.FC<LightningProps> = ({ hue = 230, xOffset = 0, speed = 1, intensity = 1, size = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

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
      ctx.clearRect(0, 0, w, h);
      t += 0.016 * speed;

      const centerX = w * (0.5 + xOffset);
      const grad = ctx.createLinearGradient(centerX - 20, 0, centerX + 20, h);
      grad.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.0)`);
      grad.addColorStop(0.5, `hsla(${hue}, 100%, 70%, ${0.8 * intensity})`);
      grad.addColorStop(1, `hsla(${hue}, 100%, 75%, 0.0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1, size * 2);
      ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${0.7 * intensity})`;
      ctx.shadowBlur = 18 * size;

      ctx.beginPath();
      const steps = 18;
      for (let i = 0; i <= steps; i++) {
        const y = (h / steps) * i;
        const x = centerX + Math.sin(i * 1.7 + t * 3.2) * (16 * size) + Math.cos(i * 0.8 + t) * (8 * size);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} className="w-full h-full relative" />;
};

export default Lightning;
