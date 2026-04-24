import { motion } from 'framer-motion';

export default function DataThought() {
  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,42,42,0.08)_0%,transparent_45%,rgba(255,42,42,0.05)_100%)]" />
      <motion.div
        className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-lumin-red/80 to-transparent"
        animate={{ y: ['0%', '1000%'], opacity: [0, 0.8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative max-w-7xl mx-auto px-6 text-center space-y-14">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-7xl font-bold tracking-tight text-white/15"
        >
          I study patterns.
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-5xl md:text-8xl font-bold tracking-tight text-white/35"
        >
          I observe systems.
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-5xl md:text-8xl font-bold tracking-tight text-white"
        >
          I design digital <span className="text-lumin-red italic">atmospheres.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/45 font-mono text-xs tracking-[0.35em] uppercase"
        >
              [ LIVE SIGNAL FLOW // ACTIVE SYSTEM INTUITION ]
        </motion.p>
      </div>
    </section>
  );
}
