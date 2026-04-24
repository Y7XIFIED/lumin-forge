import { useEffect, useRef } from 'react';

const TRAIL_COUNT = 6;

type Point = { x: number; y: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function PixelCursor() {
  const mainRef = useRef<HTMLSpanElement | null>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const targetRef = useRef<Point>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const headRef = useRef<Point>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const trailRef = useRef<Array<Point>>(Array.from({ length: TRAIL_COUNT }, () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 })));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const snappedX = Math.round(e.clientX / 4) * 4;
      const snappedY = Math.round(e.clientY / 4) * 4;
      targetRef.current.x = clamp(snappedX, 0, window.innerWidth);
      targetRef.current.y = clamp(snappedY, 0, window.innerHeight);
    };

    const tick = () => {
      const head = headRef.current;
      const target = targetRef.current;

      head.x += (target.x - head.x) * 0.42;
      head.y += (target.y - head.y) * 0.42;

      const points = trailRef.current;
      points[0].x = head.x;
      points[0].y = head.y;

      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.38;
        points[i].y += (points[i - 1].y - points[i].y) * 0.38;
      }

      if (mainRef.current) {
        mainRef.current.style.transform = `translate3d(${head.x}px, ${head.y}px, 0) translate(-50%, -50%)`;
      }

      for (let i = 0; i < points.length; i++) {
        const el = trailRefs.current[i];
        if (!el) continue;
        const p = points[i];
        const scale = Math.max(0.5, 1 - i * 0.09);
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="pixel-cursor-trail"
          style={{ opacity: Math.max(0.12, 0.64 - index * 0.09) }}
        />
      ))}
      <span ref={mainRef} className="pixel-cursor-main" />
    </>
  );
}
