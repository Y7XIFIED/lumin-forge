import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { useState, useRef, useEffect } from 'react';

const philosophies = [
  { title: 'Render Pipeline', desc: 'Every frame is treated with care. We tune graphics, layering, and memory use so motion stays smooth and reliable.' },
  { title: 'Latency First', desc: 'Response time comes first. The interface should feel instant, clear, and calm when you interact with it.' },
  { title: 'State Topology', desc: 'State is organized as clean flow, not tangled events, so the system can grow without turning brittle.' },
  { title: 'Motion Physics', desc: 'Animation follows believable rhythm and weight. Movement should guide attention, not distract from intent.' },
  { title: 'Protocol Precision', desc: 'Naming, spacing, hierarchy, and interaction rules are shared standards that keep the product coherent.' },
  { title: 'Failure Resilience', desc: 'When pressure hits, the interface bends instead of breaking and still gives users a stable experience.' },
];

function KineticText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((_, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.span onMouseEnter={scramble} className="cursor-default inline-block">
      {displayText}
    </motion.span>
  );
}

function LiquidMetalTitle({ text }: { text: string }) {
  return (
    <h2 className="philosophy-ascii-main text-white relative group">
      <span className="relative z-10">{text}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-lumin-red/20 via-white/20 to-lumin-red/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </h2>
  );
}

export default function Philosophy() {
  return (
    <section className="philosophy-ascii-scope relative py-40 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 space-y-4">
          <span className="philosophy-ascii-kicker text-lumin-red block">02 // INTERFACE PHILOSOPHY</span>
          <LiquidMetalTitle text="The principles of the forge." />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {philosophies.map((phil, index) => (
            <motion.div
              key={phil.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-10 h-full flex flex-col justify-between group magnetic relative overflow-hidden">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-lumin-red group-hover:bg-lumin-red/10 group-hover:border-lumin-red/50 transition-all duration-500">
                    <span className="philosophy-ascii-index">0{index + 1}</span>
                  </div>
                  <h3 className="philosophy-ascii-card-title text-white group-hover:text-lumin-red transition-colors duration-300">
                    <KineticText text={phil.title} />
                  </h3>
                  <p className="philosophy-ascii-card-copy text-white/52 group-hover:text-white/68 transition-colors duration-300">
                    {phil.desc}
                  </p>
                </div>

                <div className="mt-10 h-[1px] w-full bg-white/10 group-hover:bg-lumin-red/50 transition-colors duration-500" />

                <motion.div
                  className="absolute inset-0 border border-transparent group-hover:border-lumin-red/20 rounded-2xl transition-all duration-700"
                  animate={{ borderColor: ['rgba(255,42,42,0)', 'rgba(255,42,42,0.2)', 'rgba(255,42,42,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <motion.div
                  className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 pointer-events-none"
                  animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
