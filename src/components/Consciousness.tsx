import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';

function DecryptText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

  useEffect(() => {
    let iteration = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((_, index) => (index < iteration ? text[index] : chars[Math.floor(Math.random() * chars.length)]))
            .join('')
        );

        if (iteration >= text.length && interval) {
          clearInterval(interval);
          interval = null;
        }
        iteration += 1 / 2;
      }, 24);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return <span>{displayText}</span>;
}

export default function Consciousness() {
  return (
    <section className="system-core-scope relative py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 space-y-8 md:space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <GlassCard className="w-full p-10 md:p-14 border-white/5 bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lumin-red/20 to-transparent" />
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="system-core-label text-lumin-red block">[ SYSTEM_CORE // 01 ]</span>
                <h2 className="system-core-title text-white">
                  Curiosity is the <span className="system-core-accent text-lumin-red">primary engine.</span>
                </h2>
              </div>
              <div className="system-core-grid grid md:grid-cols-2 gap-10 text-white/55">
                <p className="system-core-copy">
                  <DecryptText
                    text="I am obsessed with how digital systems are built. I love tracing signals, shaping behavior, and turning raw logic into experiences you can actually feel."
                    delay={250}
                  />
                </p>
                <p className="system-core-copy">
                  <DecryptText
                    text="My work is a constant build cycle of code, motion, and interface craft. I do not just design screens. I build tech atmospheres that move with intent."
                    delay={700}
                  />
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <GlassCard className="w-full p-10 md:p-14 border-white/5 bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lumin-red/20 to-transparent" />
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="system-core-label text-lumin-red block">[ SYSTEM_CORE // 02 ]</span>
                <h2 className="system-core-title text-white">
                  Obsession with <span className="system-core-accent text-lumin-red">precision.</span>
                </h2>
              </div>
              <div className="system-core-grid grid md:grid-cols-2 gap-10 text-white/55">
                <p className="system-core-copy">
                  <DecryptText
                    text="Every pixel, frame, and interaction is intentional. We build living systems that respond, adapt, and feel alive under your hands."
                    delay={250}
                  />
                </p>
                <p className="system-core-copy">
                  <DecryptText
                    text="Real impact happens when hard logic meets human feeling. This forge is where that connection is designed and refined."
                    delay={700}
                  />
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
