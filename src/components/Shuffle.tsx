import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ShuffleProps {
  text: string;
  shuffleDirection?: 'left' | 'right';
  duration?: number;
  animationMode?: 'evenodd' | 'normal';
  shuffleTimes?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  respectReducedMotion?: boolean;
  loop?: boolean;
  loopDelay?: number;
  className?: string;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

export default function Shuffle({
  text,
  duration = 0.35,
  shuffleTimes = 1,
  threshold = 0.1,
  triggerOnce = true,
  triggerOnHover = false,
  respectReducedMotion = true,
  loop = false,
  loopDelay = 0,
  className = ''
}: ShuffleProps) {
  const [out, setOut] = useState(text);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const hasRun = useRef(false);

  const reduced = useMemo(
    () => respectReducedMotion && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [respectReducedMotion]
  );

  const runShuffle = () => {
    if (reduced) {
      setOut(text);
      return;
    }
    let step = 0;
    const totalSteps = Math.max(1, Math.floor(text.length * 6 * shuffleTimes));
    const iv = setInterval(() => {
      step++;
      setOut(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            const reveal = (step / totalSteps) * text.length;
            return i < reveal ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      if (step >= totalSteps) {
        clearInterval(iv);
        setOut(text);
      }
    }, Math.max(12, (duration * 1000) / totalSteps));
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el || triggerOnHover) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && (!triggerOnce || !hasRun.current)) {
            hasRun.current = true;
            setStarted(true);
            runShuffle();
            if (triggerOnce) obs.disconnect();
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerOnHover, threshold, triggerOnce]);

  useEffect(() => {
    if (!loop || !started) return;
    const t = setInterval(runShuffle, (duration + loopDelay + 1.0) * 1000);
    return () => clearInterval(t);
  }, [loop, started, duration, loopDelay]);

  return (
    <motion.span
      ref={rootRef}
      className={className}
      onMouseEnter={triggerOnHover ? runShuffle : undefined}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {out}
    </motion.span>
  );
}
