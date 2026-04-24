import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Activity, Cpu } from 'lucide-react';

interface CommandTerminalProps {
  isOpen?: boolean;
  onToggle?: (next: boolean) => void;
  showFloatingButton?: boolean;
}

export default function CommandTerminal({ isOpen: controlledIsOpen, onToggle, showFloatingButton = true }: CommandTerminalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalOpen;
  const setIsOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    const value = typeof next === 'function' ? (next as (prev: boolean) => boolean)(isOpen) : next;
    if (controlledIsOpen === undefined) setInternalOpen(value);
    onToggle?.(value);
  };
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') setIsOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const updateStats = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
        setMemory(Math.floor(Math.random() * 50) + 150);
      }
      rafId = requestAnimationFrame(updateStats);
    };

    rafId = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(rafId);
  }, [isOpen]);

  const terminalFeed = [
    '[BOOT] LuminForge terminal protocol online',
    '[SYNC] Y7XIFIED preference profile loaded',
    '[INFO] Customization engine active',
    `[STATS] render fps=${fps} memory=${memory}MB`,
    '[TASK] refreshing system directives',
    '[READY] waiting for command input...'
  ];

  return (
    <>
      {showFloatingButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 z-[100] w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-lumin-red hover:border-lumin-red/50 transition-all duration-500 group"
          aria-label="Open system panel"
          title="Open system panel"
        >
          <Terminal size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[430px] h-full z-[1000] border-l border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/95" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,42,42,0.12),transparent_45%)]" />

            <div className="relative z-10 h-full p-8 md:p-10 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Terminal className="text-lumin-red" size={20} />
                  <span className="font-mono text-sm tracking-[0.28em] text-white">SYSTEM TERMINAL</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-7 flex-1">
                <div className="rounded-xl border border-white/15 bg-black/45 p-4">
                  <div className="mb-3 flex items-center gap-3 text-white/60">
                    <Terminal size={15} />
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase">Live Feed</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-white/75">
                    {terminalFeed.map((line) => (
                      <p key={line}>&gt; {line}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/50">
                    <Activity size={16} />
                    <span className="text-[10px] font-mono tracking-[0.24em] uppercase">Forge Stability</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg border border-white/15 bg-black/45">
                      <div className="text-[10px] font-mono text-white/45 mb-1">FPS</div>
                      <div className="text-2xl font-bold text-lumin-red">{fps}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-white/15 bg-black/45">
                      <div className="text-[10px] font-mono text-white/45 mb-1">MEMORY</div>
                      <div className="text-2xl font-bold text-white">{memory}MB</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/50">
                    <Cpu size={16} />
                    <span className="text-[10px] font-mono tracking-[0.24em] uppercase">System Protocols</span>
                  </div>
                  <div className="space-y-3">
                    {['NEURAL LINK', 'CURSOR PROFILE', 'TERMINAL OVERLAY', 'SHADER OVERRIDE', 'CUSTOM MODE'].map((protocol) => (
                      <div
                        key={protocol}
                        className="flex justify-between items-center p-3 rounded-lg border border-white/15 bg-black/45 group hover:border-lumin-red/40 transition-colors"
                      >
                        <span className="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">{protocol}</span>
                        <div className="w-10 h-5 rounded-full bg-lumin-red/20 border border-lumin-red/50 relative">
                          <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-lumin-red" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <div className="text-[10px] font-mono text-white/30 tracking-widest leading-relaxed">
                  <div>LuminForge TERMINAL v3.0.12</div>
                  <sub className="text-lumin-red/60 tracking-[0.2em]">powered by FaultyTerminal + OGL</sub>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
