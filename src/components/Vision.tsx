import { motion } from 'framer-motion';

export default function Vision() {
  return (
    <section className="relative py-24 md:py-36 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,42,42,0.14),transparent_55%)]" />
      <motion.div
        className="absolute -left-20 top-16 h-48 w-48 rounded-full bg-lumin-red/15 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -20, 0], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-lumin-red/10 blur-3xl"
        animate={{ x: [0, -55, 0], y: [0, 24, 0], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 8.5, repeat: Infinity }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white/45"
        >
          The future is immersive.
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white/70"
        >
          The future is intelligent.
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="text-5xl md:text-8xl font-bold tracking-tight text-white"
        >
          The future is <span className="text-lumin-red italic">built.</span>
        </motion.h2>

        <motion.div
          className="mx-auto h-[1px] w-56 bg-gradient-to-r from-transparent via-lumin-red to-transparent"
          animate={{ width: ['40%', '70%', '40%'], opacity: [0.4, 0.95, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        />

        <div className="pt-3 text-white/35 text-xs font-mono tracking-[0.35em] uppercase">
              [ SIGNAL INTERPRETATION LOCKED ]
        </div>
      </div>
    </section>
  );
}
