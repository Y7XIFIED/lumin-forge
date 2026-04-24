import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, TerminalSquare } from 'lucide-react';
import LaserFlow from './LaserFlow';

export default function Hero() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black pt-16 md:pt-20">
      <div className="absolute inset-0">
        <LaserFlow
          className="h-full w-full"
          color="#ff2a2a"
          wispDensity={1.35}
          horizontalBeamOffset={0.2}
          verticalBeamOffset={0.05}
          fogIntensity={0.33}
          fogScale={0.35}
          flowSpeed={0.48}
          horizontalSizing={0.64}
          verticalSizing={2.2}
          wispSpeed={19}
          wispIntensity={5.2}
          flowStrength={0.42}
          decay={1.18}
          falloffStart={1.25}
          mouseSmoothTime={0.16}
          mouseTiltStrength={reducedMotion ? 0 : 0.012}
        />
      </div>
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute right-[-4%] top-[12%] h-[52%] w-[62%] bg-[radial-gradient(ellipse_at_center,rgba(255,42,42,0.4)_0%,rgba(255,42,42,0.1)_44%,transparent_72%)] blur-3xl"
            initial={{ x: 180, opacity: 0 }}
            animate={{ x: [180, 0, -26, 0], opacity: [0, 0.88, 0.62, 0.88], scale: [0.94, 1.03, 1, 1.03] }}
            transition={{ duration: 5.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.16)_45%,rgba(0,0,0,0.72)_100%)]" />

      <div className="relative z-10 flex min-h-[calc(100vh-4.5rem)] w-full items-end px-6 pb-12 md:px-10 md:pb-16 lg:px-14 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: 'easeOut' }}
          className="w-full max-w-4xl"
        >
          <div className="inline-flex rounded-full border border-lumin-red/50 bg-black/40 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-lumin-red">
            LUMINFORGE
          </div>          <h1 className="hero-ascii-title mt-5 max-w-4xl text-white">
            <span className="block">Clean interface.</span>
            <span className="hero-ascii-line block text-lumin-red">Reactive visuals.</span>
            <span className="hero-ascii-line block text-white/90">Custom by design.</span>
          </h1>

          <p className="hero-ascii-copy mt-5 max-w-2xl text-white/74">Polished skin. Savage engine.</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => jumpTo('identity')}
              className="group inline-flex items-center gap-2 rounded-full border border-lumin-red/70 bg-lumin-red/20 px-6 py-3 text-sm font-semibold tracking-[0.12em] text-white transition-all duration-300 hover:bg-lumin-red/28 hover:shadow-[0_0_20px_rgba(255,42,42,0.32)]"
            >
              ENTER CORE
              <ArrowDownRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </button>
            <button
              onClick={() => jumpTo('terminal')}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/[0.05] px-6 py-3 text-sm font-medium tracking-[0.12em] text-white/88 transition-all duration-300 hover:border-white/55 hover:text-white"
            >
              <TerminalSquare size={15} />
              OPEN TERMINAL
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


