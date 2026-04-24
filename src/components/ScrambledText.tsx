import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:;!@#$%^&*';

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const chars = useMemo(() => (scrambleChars && scrambleChars.length > 0 ? scrambleChars : defaultChars), [scrambleChars]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [display, setDisplay] = useState(text.split(''));

  useEffect(() => {
    setDisplay(text.split(''));
  }, [text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const original = text.split('');
    const timers: Array<ReturnType<typeof setInterval>> = [];

    const scrambleIndex = (idx: number) => {
      const maxTicks = Math.max(6, Math.floor((duration * 1000) / Math.max(16, speed * 60)));
      let tick = 0;
      const iv = setInterval(() => {
        tick++;
        setDisplay(prev => {
          const next = [...prev];
          if (tick >= maxTicks) {
            next[idx] = original[idx];
          } else {
            next[idx] = chars[Math.floor(Math.random() * chars.length)] || original[idx];
          }
          return next;
        });
        if (tick >= maxTicks) clearInterval(iv);
      }, Math.max(16, speed * 60));
      timers.push(iv);
    };

    const onMove = (e: PointerEvent) => {
      charRefs.current.forEach((el, i) => {
        if (!el || text[i] === ' ') return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < radius) scrambleIndex(i);
      });
    };

    root.addEventListener('pointermove', onMove);
    return () => {
      root.removeEventListener('pointermove', onMove);
      timers.forEach(clearInterval);
    };
  }, [text, radius, duration, speed, chars]);

  return (
    <div ref={rootRef} className={`m-[7vw] max-w-[800px] font-mono text-[clamp(14px,4vw,32px)] text-white ${className}`} style={style}>
      <p>
        {display.map((ch, i) => (
          <span key={i} ref={el => { charRefs.current[i] = el; }} className="inline-block will-change-transform">
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
};

export default ScrambledText;
