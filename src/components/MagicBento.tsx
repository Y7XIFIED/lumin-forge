import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface BentoProps {
  disableAnimations?: boolean;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

type CardDef = { title: string; description: string; label: string };

const cardData: CardDef[] = [
  { title: 'Analytics', description: 'Track user behavior', label: 'Insights' },
  { title: 'Dashboard', description: 'Centralized data view', label: 'Overview' },
  { title: 'Collaboration', description: 'Work together seamlessly', label: 'Teamwork' },
  { title: 'Automation', description: 'Streamline workflows', label: 'Efficiency' },
  { title: 'Integration', description: 'Connect favorite tools', label: 'Connectivity' },
  { title: 'Security', description: 'Enterprise-grade protection', label: 'Protection' }
];

const MagicBento: React.FC<BentoProps> = ({
  disableAnimations = false,
  enableTilt = true,
  glowColor = '132, 0, 255',
  clickEffect = true,
  enableMagnetism = true
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>{`
        .magic-bento-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 0.6rem;
        }
        @media (min-width: 640px) {
          .magic-bento-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .magic-bento-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .magic-bento-grid .magic-card:nth-child(3) { grid-column: span 2; grid-row: span 2; }
          .magic-bento-grid .magic-card:nth-child(4) { grid-column: span 2; }
        }
      `}</style>
      <div className="magic-bento-grid">
        {cardData.map((card, index) => (
          <MagicCard
            key={index}
            title={card.title}
            description={card.description}
            label={card.label}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
            disableAnimations={shouldDisableAnimations}
          />
        ))}
      </div>
    </>
  );
};

const MagicCard: React.FC<{
  title: string;
  description: string;
  label: string;
  glowColor: string;
  enableTilt: boolean;
  clickEffect: boolean;
  enableMagnetism: boolean;
  disableAnimations: boolean;
}> = ({ title, description, label, glowColor, enableTilt, clickEffect, enableMagnetism, disableAnimations }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disableAnimations) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const centerX = r.width / 2;
      const centerY = r.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(el, { rotateX, rotateY, duration: 0.12, ease: 'power2.out', transformPerspective: 1000 });
      }

      if (enableMagnetism) {
        gsap.to(el, { x: (x - centerX) * 0.04, y: (y - centerY) * 0.04, duration: 0.2, ease: 'power2.out' });
      }

      const relX = ((x / r.width) * 100).toFixed(2);
      const relY = ((y / r.height) * 100).toFixed(2);
      el.style.setProperty('--glow-x', `${relX}%`);
      el.style.setProperty('--glow-y', `${relY}%`);
    };

    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const r = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height) * 1.2;
      ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:9999px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;background:radial-gradient(circle, rgba(${glowColor}, 0.35), transparent 65%);pointer-events:none;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('click', onClick);
    };
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <article
      ref={ref}
      className="magic-card relative overflow-hidden rounded-2xl border border-[#392e4e] bg-[#060010] min-h-[190px] p-5 text-white"
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%'
      } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(220px circle at var(--glow-x) var(--glow-y), rgba(${glowColor}, 0.18), transparent 55%)`
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <span className="text-sm text-white/80">{label}</span>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-white/70 mt-1">{description}</p>
        </div>
      </div>
    </article>
  );
};

export default MagicBento;
