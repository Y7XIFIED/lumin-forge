import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import FaultyTerminal from './FaultyTerminal';

type LineKind = 'input' | 'output' | 'error' | 'system';

type TerminalLine = {
  kind: LineKind;
  text: string;
};

type Props = {
  onNavigate?: (id: string) => void;
  liteMode?: boolean;
};

const BOOT_LINES: TerminalLine[] = [
  { kind: 'system', text: '[BOOT] Y7XIFIED terminal channel online' },
  { kind: 'system', text: '[INFO] Type "help" for available commands' }
];

const tintMap: Record<string, string> = {
  red: '#ff5f5f',
  cyan: '#61dca3',
  amber: '#ffc169'
};

export default function InteractiveTerminal({ onNavigate, liteMode = false }: Props) {
  const [username, setUsername] = useState(() => window.localStorage.getItem('luminforge-username') || 'guest');
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [tint, setTint] = useState('#ff5f5f');
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem('luminforge-username', username);
  }, [username]);

  useEffect(() => {
    if (!outputRef.current) return;
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines]);

  const prompt = useMemo(() => `Y7XIFIED@${username}:~$`, [username]);

  const append = (...nextLines: TerminalLine[]) => setLines(prev => [...prev, ...nextLines]);

  const runCommand = (raw: string) => {
    const command = raw.trim();
    if (!command) return;

    append({ kind: 'input', text: `${prompt} ${command}` });

    const [base, ...rest] = command.split(/\s+/);
    const arg = rest.join(' ').trim();
    const cmd = base.toLowerCase();

    if (cmd === 'help') {
      append({
        kind: 'output',
        text: 'Commands: help, whoami, setname <name>, goto <home|identity|philosophy|vision|terminal|final>, theme <red|cyan|amber>, time, clear'
      });
      return;
    }

    if (cmd === 'whoami') {
      append({ kind: 'output', text: username });
      return;
    }

    if (cmd === 'setname') {
      if (!arg) {
        append({ kind: 'error', text: 'Usage: setname <new-name>' });
        return;
      }
      setUsername(arg);
      append({ kind: 'system', text: `Username changed to "${arg}"` });
      return;
    }

    if (cmd === 'theme') {
      const nextTint = tintMap[arg.toLowerCase()];
      if (!nextTint) {
        append({ kind: 'error', text: 'Usage: theme <red|cyan|amber>' });
        return;
      }
      setTint(nextTint);
      append({ kind: 'system', text: `Theme switched to ${arg.toLowerCase()}` });
      return;
    }

    if (cmd === 'goto') {
      const allowed = ['home', 'identity', 'philosophy', 'vision', 'terminal', 'final'];
      if (!allowed.includes(arg.toLowerCase())) {
        append({ kind: 'error', text: 'Usage: goto <home|identity|philosophy|vision|terminal|final>' });
        return;
      }
      const target = arg.toLowerCase() === 'final' ? 'final-signal' : arg.toLowerCase();
      onNavigate?.(target);
      append({ kind: 'system', text: `Navigating to #${target}` });
      return;
    }

    if (cmd === 'time') {
      append({ kind: 'output', text: new Date().toLocaleString() });
      return;
    }

    if (cmd === 'clear') {
      setLines(BOOT_LINES);
      return;
    }

    append({ kind: 'error', text: `Unknown command: ${cmd}. Type "help".` });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const current = input;
    setInput('');
    runCommand(current);
  };

  return (
    <section id="terminal" className="relative py-14 md:py-20 px-6 md:px-14 border-t border-white/10 bg-black/80">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-lumin-red">Interactive Terminal</p>
          <button
            className="top-nav-btn h-9 min-w-0 px-4 font-mono text-[10px]"
            onClick={() => inputRef.current?.focus()}
            type="button"
          >
            Focus Input
          </button>
        </div>

        <div className="relative min-h-[62vh] overflow-hidden rounded-2xl border border-white/15">
          <div className="absolute inset-0">
            <FaultyTerminal
              className="h-full w-full"
              tint={tint}
              gridMul={[2.2, 1.2]}
              brightness={0.8}
              scanlineIntensity={0.42}
              glitchAmount={1.16}
              flickerAmount={0.8}
              chromaticAberration={0.9}
              dither={0.8}
              curvature={0.13}
              mouseReact={!liteMode}
              mouseStrength={0.12}
            />
          </div>
          <div className="absolute inset-0 bg-black/72 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_4px] opacity-25" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <p className="font-mono text-xs tracking-[0.2em] text-white/60">Y7XIFIED TERMINAL</p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/35">{prompt}</p>
            </div>

            <div ref={outputRef} className="flex-1 overflow-auto px-5 py-4 font-mono text-sm leading-7">
              {lines.map((line, idx) => (
                <p
                  key={`${line.text}-${idx}`}
                  className={
                    line.kind === 'input'
                      ? 'text-white'
                      : line.kind === 'error'
                        ? 'text-red-300'
                        : line.kind === 'system'
                          ? 'text-cyan-200'
                          : 'text-white/80'
                  }
                >
                  {line.text}
                </p>
              ))}
            </div>

            <form onSubmit={onSubmit} className="border-t border-white/10 bg-black/45 px-5 py-4">
              <label className="flex items-center gap-3">
                <span className="font-mono text-xs text-lumin-red">{prompt}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/35"
                  placeholder='Type command, e.g. "help"'
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
