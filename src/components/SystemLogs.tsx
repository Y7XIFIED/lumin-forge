import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const logMessages = [
  "INITIALIZING NEURAL LINK...",
  "ESTABLISHING SECURE CONNECTION...",
  "LOADING CORE GEOMETRY...",
  "CALIBRATING VOLUMETRIC LIGHTING...",
  "SYNCING DATA PATTERNS...",
  "ATMOSPHERE STABILIZED.",
  "SYSTEM READY.",
  "CURIOUSITY ENGINE ENGAGED.",
  "SCANNING FOR PATTERNS...",
  "INTERFACE PHILOSOPHY LOADED.",
  "VISION FORWARD ACTIVE.",
];

export default function SystemLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
        const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ${nextMessage}`];
        return newLogs.slice(-5); // Keep last 5
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-[100] pointer-events-none hidden md:block">
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => (
            <motion.div
              key={log + i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-[10px] font-mono text-lumin-red/40 tracking-widest"
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
