import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassCard from './GlassCard';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: 'Atmosynk', desc: 'Atmospheric synchronization engine.' },
  { name: 'Voxaura', desc: 'Voice-driven aura generation.' },
  { name: 'QuotifyX', desc: 'Next-gen quote visualization.' },
  { name: 'Typingo', desc: 'Kinetic typography playground.' },
  { name: 'LockBox', desc: 'Secure digital vault interface.' },
  { name: 'CoinFlux', desc: 'Real-time crypto flow analytics.' },
  { name: 'NeoSnapX', desc: 'Futuristic photo manipulation.' },
  { name: 'Qraze', desc: 'Quantum randomizer engine.' },
  { name: 'VoidScraper', desc: 'Deep web data extraction.' },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container) return;

    const scrollWidth = container.scrollWidth - window.innerWidth;

    const tween = gsap.to(container, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-lumin-dark overflow-hidden flex items-center">
      <div className="absolute top-20 left-20 z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white/80">
          The <span className="text-lumin-red">Forge</span>
        </h2>
      </div>

      <div ref={containerRef} className="flex gap-12 px-20 pt-32 pb-20 h-full items-center w-max">
        {projects.map((project, index) => (
          <div key={index} className="w-[400px] md:w-[500px] h-[500px] md:h-[600px] shrink-0">
            <GlassCard className="w-full h-full flex flex-col justify-between p-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-lumin-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <div className="text-lumin-red/50 text-sm font-mono mb-4">0{index + 1} // SYSTEM</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-lumin-red transition-colors duration-300">
                  {project.name}
                </h3>
                <p className="text-white/60 text-lg max-w-[80%] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {project.desc}
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-end">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-lumin-red/50 group-hover:bg-lumin-red/10 transition-all duration-500">
                  <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-lumin-red group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <button className="text-sm font-medium tracking-widest uppercase text-white/40 group-hover:text-white transition-colors duration-300 relative overflow-hidden">
                  <span className="relative z-10">Enter Project</span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-lumin-red scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </button>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
}
