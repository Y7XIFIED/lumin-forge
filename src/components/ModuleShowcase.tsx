import CardNav, { CardNavItem } from './CardNav';
import GooeyNav from './GooeyNav';
import ChromaGrid from './ChromaGrid';
import PixelCard from './PixelCard';
import MagicBento from './MagicBento';
import SpotlightCard from './SpotlightCard';
import ProfileCard from './ProfileCard';
import PillNav from './PillNav';
import GradualBlur from './GradualBlur';
import LaserFlow from './LaserFlow';
import LogoLoop, { LogoItem } from './LogoLoop';
import MetallicPaint from './MetallicPaint';
import Dither from './Dither';
import GradientBlinds from './GradientBlinds';
import LetterGlitch from './LetterGlitch';
import Lightning from './Lightning';
import Orb from './Orb';
import PixelBlast from './PixelBlast';

const logoSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='28' viewBox='0 0 120 28'%3E%3Ctext x='0' y='20' fill='%23ff2a2a' font-family='monospace' font-size='18'%3ELuminForge%3C/text%3E%3C/svg%3E";

const navItems: CardNavItem[] = [
  {
    label: 'Docs',
    bgColor: '#0b0b0b',
    textColor: '#fff',
    links: [
      { label: 'API', href: '#', ariaLabel: 'Open API docs' },
      { label: 'Guides', href: '#', ariaLabel: 'Open guides' }
    ]
  },
  {
    label: 'Design',
    bgColor: '#17070a',
    textColor: '#fff',
    links: [
      { label: 'Tokens', href: '#', ariaLabel: 'Open token docs' },
      { label: 'Motion', href: '#', ariaLabel: 'Open motion docs' }
    ]
  },
  {
    label: 'Launch',
    bgColor: '#12060f',
    textColor: '#fff',
    links: [
      { label: 'Deploy', href: '#', ariaLabel: 'Open deploy' },
      { label: 'Monitor', href: '#', ariaLabel: 'Open monitor' }
    ]
  }
];

export default function ModuleShowcase() {
  const logos: LogoItem[] = [
    { node: <span className="text-lumin-red font-mono text-base">LuminForge</span> },
    { node: <span className="text-white/80 font-mono text-base">LUMINFORGE</span> },
    { node: <span className="text-cyan-300 font-mono text-base">NEURAL-X</span> },
    { node: <span className="text-white/70 font-mono text-base">CIPHER LAB</span> },
    { node: <span className="text-lumin-red/80 font-mono text-base">VOID OPS</span> }
  ];

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 space-y-14">
        <div>
          <p className="text-lumin-red font-mono text-xs tracking-[0.45em] uppercase">04 // MODULE STACK</p>
          <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight text-white">Integrated Module Playground</h2>
        </div>

        <div className="relative h-[320px] rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <CardNav
            logo={logoSvg}
            items={navItems}
            baseColor="#f7f7f7"
            buttonBgColor="#ff2a2a"
            buttonTextColor="#fff"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <GooeyNav
            items={[
              { label: 'Overview', href: '#' },
              { label: 'Modules', href: '#' },
              { label: 'Pricing', href: '#' },
              { label: 'Contact', href: '#' }
            ]}
          />
        </div>

        <div className="relative h-[180px] rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <PillNav
            logo={logoSvg}
            activeHref="#mods"
            baseColor="#f5f5f5"
            pillColor="#0b0b0b"
            hoveredPillTextColor="#ff2a2a"
            items={[
              { label: 'Home', href: '#home' },
              { label: 'Mods', href: '#mods' },
              { label: 'Labs', href: '#labs' },
              { label: 'Contact', href: '#contact' }
            ]}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 md:p-6 min-h-[720px]">
          <ChromaGrid />
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-black/60 p-6 overflow-hidden min-h-[220px]">
          <div className="absolute inset-0 opacity-85">
            <LaserFlow color="#ff2a2a" flowSpeed={0.42} fogIntensity={0.38} wispIntensity={4.2} />
          </div>
          <GradualBlur preset="footer" strength={2.8} opacity={0.95} />
          <div className="relative z-10">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase">Laser Flow + Gradual Blur</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Shader Layer Stack</h3>
            <p className="mt-2 text-white/70 max-w-2xl">Realtime beam motion with depth blur fade integrated into the module playground.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <PixelCard variant="pink" className="h-[220px] w-[220px] rounded-2xl border-lumin-red/40">
            <div className="absolute inset-0 flex items-center justify-center text-lumin-red font-mono tracking-widest text-sm">PIXEL CORE</div>
          </PixelCard>
          <PixelCard variant="blue" className="h-[220px] w-[220px] rounded-2xl border-cyan-400/40">
            <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-mono tracking-widest text-sm">BLUE GRID</div>
          </PixelCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <SpotlightCard spotlightColor="rgba(255, 42, 42, 0.22)" className="min-h-[220px]">
            <p className="text-xs text-lumin-red tracking-[0.3em] font-mono">LuminForge // SPOTLIGHT</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Reactive Focus Card</h3>
            <p className="mt-3 text-white/70 leading-relaxed">
              Pointer-reactive radial glow integrated from React Bits with existing red-black identity styling.
            </p>
          </SpotlightCard>
          <div className="flex justify-center">
            <ProfileCard
              className="w-full max-w-[380px]"
              name="LuminForge"
              title="Neural Aesthetics Engineer"
              handle="luminforge"
              status="Syncing"
              contactText="Ping"
              onContactClick={() => window.alert('LuminForge contact module active')}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 md:p-6">
          <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-4">Logo Loop</p>
          <LogoLoop logos={logos} speed={58} fadeOut fadeOutColor="#000000" logoHeight={24} gap={42} scaleOnHover />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 md:p-6">
          <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-4">Metallic Paint</p>
          <div className="w-full max-w-[520px] h-[320px] mx-auto rounded-xl overflow-hidden border border-white/10">
            <MetallicPaint
              imageSrc="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=80"
              tintColor="#ff7abf"
              speed={0.28}
              brightness={1.45}
              contrast={1.1}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-3">Dither Waves</p>
            <div className="h-[220px] rounded-xl overflow-hidden border border-white/10 cursor-target">
              <Dither waveColor={[1, 0.22, 0.22]} pixelSize={3} colorNum={5} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-3">Gradient Blinds</p>
            <div className="h-[220px] rounded-xl overflow-hidden border border-white/10 cursor-target">
              <GradientBlinds gradientColors={['#ff2a2a', '#5227FF']} blindCount={22} noise={0.15} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-3">Letter Glitch</p>
            <div className="h-[220px] rounded-xl overflow-hidden border border-white/10 cursor-target">
              <LetterGlitch glitchColors={['#2b4539', '#ff2a2a', '#61b3dc']} glitchSpeed={45} centerVignette={false} outerVignette smooth characters="LuminForge0123456789#$%&*" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-3">Lightning</p>
            <div className="h-[220px] rounded-xl overflow-hidden border border-white/10 cursor-target">
              <Lightning hue={355} intensity={1.2} speed={1.1} size={1.1} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-3">Orb</p>
            <div className="h-[220px] rounded-xl overflow-hidden border border-white/10 cursor-target">
              <Orb hue={-30} hoverIntensity={0.3} rotateOnHover />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-lumin-red font-mono text-xs tracking-[0.32em] uppercase mb-3">Pixel Blast</p>
            <div className="h-[220px] rounded-xl overflow-hidden border border-white/10 cursor-target">
              <PixelBlast variant="diamond" color="#ff4c7a" pixelSize={5} rippleIntensityScale={1.4} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-3 md:p-4">
          <MagicBento glowColor="255, 42, 42" enableTilt enableMagnetism clickEffect />
        </div>
      </div>
    </section>
  );
}
