import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import SmoothScroll from './components/SmoothScroll';
import Hero from './components/Hero';
import Consciousness from './components/Consciousness';
import DataThought from './components/DataThought';
import Philosophy from './components/Philosophy';
import Vision from './components/Vision';
import DecryptedText from './components/DecryptedText';
import Shuffle from './components/Shuffle';
import TargetCursor from './components/TargetCursor';
import LetterGlitch from './components/LetterGlitch';
import StaggeredMenu, { StaggeredMenuItem } from './components/StaggeredMenu';
import ScrollVelocity from './components/ScrollVelocity';
import TextType from './components/TextType';

const MOBILE_MENU_ITEMS: StaggeredMenuItem[] = [
  { label: 'Main', ariaLabel: 'Go to mainscreen', link: '#home' },
  { label: 'Identity', ariaLabel: 'Go to identity section', link: '#identity' },
  { label: 'Philosophy', ariaLabel: 'Go to philosophy section', link: '#philosophy' },
  { label: 'Vision', ariaLabel: 'Go to vision section', link: '#vision' },
  { label: 'Terminal', ariaLabel: 'Go to terminal section', link: '#terminal' },
  { label: 'Final', ariaLabel: 'Go to final signal section', link: '#final-signal' }
];

const BRAND_TICKERS = [
  'Y7XIFIED',
  'Y7XIFIED'
];

function App() {
  const [showTopButton, setShowTopButton] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePerformanceMode = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const width = window.innerWidth;
      const cores = navigator.hardwareConcurrency || 4;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
      setIsLiteMode(reduceMotion || cores <= 6 || mem <= 6 || width < 1100);
    };

    updatePerformanceMode();
    window.addEventListener('resize', updatePerformanceMode, { passive: true });
    return () => window.removeEventListener('resize', updatePerformanceMode);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const animateNavTap = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    el.classList.remove('nav-click-pop');
    void el.offsetWidth;
    el.classList.add('nav-click-pop');
    window.setTimeout(() => el.classList.remove('nav-click-pop'), 460);
  }, []);

  const smoothScrollToId = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const headerOffset = id === 'home' ? 0 : 104;
    const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
    const startY = window.scrollY;
    const deltaY = targetY - startY;
    const duration = Math.min(1100, Math.max(580, Math.abs(deltaY) * 0.55));
    const startTime = performance.now();

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);
      window.scrollTo({ top: startY + deltaY * eased });
      if (progress < 1) {
        scrollRafRef.current = requestAnimationFrame(animate);
      } else {
        scrollRafRef.current = null;
      }
    };

    scrollRafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleHeaderJump = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      animateNavTap(event.currentTarget);
      smoothScrollToId(id);
    },
    [animateNavTap, smoothScrollToId]
  );

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <SmoothScroll>
      <div className={`font-mode-normal ${isLiteMode ? 'perf-lite' : ''}`}>
        <div className="noise-overlay" />
        {!isLiteMode && <TargetCursor targetSelector="a, button, [role='button'], .cursor-target" />}
        <div className="md:hidden">
          <StaggeredMenu
            isFixed
            position="right"
            items={MOBILE_MENU_ITEMS}
            displaySocials={false}
            displayItemNumbering
            logoUrl=""
            colors={['#130c0c', '#3a1515', '#ff2a2a']}
            accentColor="#ff2a2a"
            menuButtonColor="#ffffff"
            openMenuButtonColor="#0b0b0b"
            closeOnClickAway
            className="font-mono"
          />
        </div>

        <header className="topbar-ascii fixed top-0 left-0 w-full z-50 hidden md:block border-b border-white/10 bg-black/58 backdrop-blur-md">
          <div className="relative z-10 flex justify-between items-center p-2 md:p-2.5">
            <div className="flex items-center gap-3">
              <button
                className="logo-home-btn cursor-target"
                aria-label="Go to home section"
                title="Go to home section"
                onClick={handleHeaderJump('home')}
              >
                <div className="luminforge-logo-v2">
                  <span className="lf-mark" aria-hidden="true">
                    <span className="lf-mark-ring" />
                    <span className="lf-mark-core" />
                    <span className="lf-mark-bars" />
                  </span>
                  <span className="lf-word">
                    <span className="lf-title always-ascii">LUMIN_FORGE</span>
                    <span className="lf-sub always-ascii hidden lg:block">[Y7XIFIED::BUILD_CORE]</span>
                  </span>
                </div>
              </button>
            </div>

          <div className="flex items-center gap-1.5">
            <nav className="hidden md:flex items-center gap-1.5">
              <a href="#identity" className="top-nav-btn cursor-target" onClick={handleHeaderJump('identity')}>
                <DecryptedText
                  text="[IDENTITY]"
                  animateOn="hover"
                  speed={26}
                  sequential
                  className="text-white/80 always-ascii"
                  encryptedClassName="text-lumin-red/70 always-ascii"
                />
              </a>
              <a href="#vision" className="top-nav-btn cursor-target" onClick={handleHeaderJump('vision')}>
                <Shuffle text="[VISION]" triggerOnHover duration={0.32} className="text-white/80 always-ascii" />
              </a>
              <a href="#terminal" className="top-nav-btn cursor-target" onClick={handleHeaderJump('terminal')}>
                <Shuffle text="[TERMINAL]" triggerOnHover duration={0.32} className="text-white/80 always-ascii" />
              </a>
            </nav>
          </div>
          </div>
        </header>

        <main className="relative z-10 w-full bg-black/68">
          <section id="home">
            <Hero />
          </section>

          <div className="relative border-y border-white/10 bg-black/70 py-3">
            <ScrollVelocity
              texts={BRAND_TICKERS}
              velocity={isLiteMode ? 30 : 85}
              numCopies={isLiteMode ? 4 : 7}
              className="px-4 font-mono text-[clamp(1rem,4.5vw,2.4rem)] font-semibold tracking-[0.24em] text-lumin-red/65 uppercase"
              parallaxClassName="py-1"
              scrollerClassName="items-center"
              velocityMapping={{ input: [0, 900], output: [0, 4] }}
            />
          </div>

          <section id="identity">
            <Consciousness />
            <DataThought />
          </section>

          <div className="relative border-y border-white/10 bg-black/65 py-2">
            <ScrollVelocity
              texts={['Y7XIFIED']}
              velocity={isLiteMode ? 24 : 70}
              numCopies={isLiteMode ? 3 : 6}
              className="px-4 font-mono text-[clamp(0.9rem,4vw,2rem)] font-bold tracking-[0.2em] text-white/45 uppercase"
              parallaxClassName="py-1"
              scrollerClassName="items-center"
              velocityMapping={{ input: [0, 900], output: [0, 3] }}
            />
          </div>

          <section id="philosophy">
            <Philosophy />
          </section>

          <div className="relative border-y border-white/10 bg-black/65 py-2">
            <ScrollVelocity
              texts={['Y7XIFIED']}
              velocity={isLiteMode ? 26 : 76}
              numCopies={isLiteMode ? 3 : 6}
              className="px-4 font-mono text-[clamp(0.9rem,4vw,2rem)] font-bold tracking-[0.2em] text-lumin-red/55 uppercase"
              parallaxClassName="py-1"
              scrollerClassName="items-center"
              velocityMapping={{ input: [0, 900], output: [0, 3] }}
            />
          </div>

          <section id="vision">
            <Vision />
          </section>

          <div id="terminal" />


          <footer id="final-signal" className="relative min-h-[52vh] border-t border-white/10 overflow-hidden bg-black">
            <div className="absolute inset-0">
              <LetterGlitch
                glitchColors={['#2b0000', '#8f0000', '#ff2a2a']}
                glitchSpeed={45}
                centerVignette={false}
                outerVignette={false}
                smooth
                characters="Y7XIFIED"
              />
            </div>

            <div className="absolute left-1/2 top-1/2 z-10 w-[min(100%-3rem,64rem)] -translate-x-1/2 -translate-y-1/2 px-6 md:px-10 py-8 text-center">
              <p className="w-full text-center font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-lumin-red/75">
                Y7XIFIED
              </p>
              <h2 className="always-ascii mt-5 w-full text-center text-[clamp(1.8rem,5.6vw,4.8rem)] text-white">
                Y7XIFIED
              </h2>
              <div className="mt-6 w-full max-w-3xl mx-auto rounded-xl border border-lumin-red/30 bg-black/70 p-5 md:p-6 backdrop-blur-sm">
                <p className="font-mono text-xs md:text-sm leading-7 text-[#ffc0c0] whitespace-pre-line">
                  <TextType
                    text={`$ git commit -m "another day, another dent in the universe"\n[main] another day, another dent in the universe\n 7 files changed, 42 insertions, 13 deletions\n\n$ alias work="obsess until it's perfect"\n$ work\nrefining details until they feel inevitable\n\n$ netstat -memory | tail -n 1\nthe internet still remembers my fingerprints`}
                    typingSpeed={22}
                    initialDelay={350}
                    loop={false}
                    pauseDuration={999999}
                    deletingSpeed={0}
                    showCursor
                    cursorClassName="text-lumin-red"
                    className="w-full"
                  />
                </p>
              </div>
            </div>
          </footer>
        </main>

        {showTopButton && (
          <button
            onClick={() => smoothScrollToId('home')}
            className="top-float-btn"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUp size={16} />
          </button>
        )}
      </div>
    </SmoothScroll>
  );
}

export default App;


