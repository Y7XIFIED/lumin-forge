import { useMemo } from 'react';

const GLYPHS = '01ABCDEF!@#$%^&*';

function makeCipherBlock(lines: number, length: number) {
  return Array.from({ length: lines })
    .map(() =>
      Array.from({ length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('')
    )
    .join('\n');
}

export default function EncryptionRain() {
  const columns = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${i * 8.5}%`,
        delay: `${(i % 5) * 0.8}s`,
        duration: `${10 + (i % 4) * 2}s`,
        text: makeCipherBlock(16, 14),
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,42,42,0.06),transparent_60%)]" />
      {columns.map((col) => (
        <pre
          key={col.id}
          className="cipher-column absolute top-[-40%] whitespace-pre font-mono text-[8px] leading-[1.15] text-lumin-red/15"
          style={{
            left: col.left,
            animationDelay: col.delay,
            animationDuration: col.duration,
          }}
        >
          {col.text}
        </pre>
      ))}
      <div className="cipher-scan-line absolute left-0 top-0 h-[1px] w-full" />
    </div>
  );
}
