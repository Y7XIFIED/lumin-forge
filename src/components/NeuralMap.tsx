import { motion } from 'framer-motion';

const nodes = ['CORE', 'TECH CRAFT', 'IMMERSIVE UI', 'ANALYTICS', 'SYSTEMS', 'VISION'];

export default function NeuralMap() {
  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 md:mb-14">
          <span className="text-lumin-red font-mono text-xs tracking-[0.5em] uppercase">03 // NEURAL MAP</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mt-4">
            The <span className="text-lumin-red italic">interconnected</span> mind.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {nodes.map((node, idx) => (
            <motion.div
              key={node}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.015 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,42,42,0.17),transparent_60%)] opacity-40"
                animate={{ opacity: [0.35, 0.62, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: idx * 0.12 }}
              />
              <motion.div
                className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-lumin-red/35 to-transparent"
                animate={{ x: ['0%', '330%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', delay: idx * 0.18 }}
              />
              <div className="relative flex items-center justify-between gap-4">
                <span className="text-white font-medium tracking-wide group-hover:text-lumin-red transition-colors duration-300">{node}</span>
                <span className="text-lumin-red/70 font-mono text-xs">0{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-white/35 text-xs font-mono tracking-[0.35em] uppercase">
          [ CONNECTIONS STABILIZED // DRIFT-FREE MODE ]
        </p>
      </div>
    </section>
  );
}
