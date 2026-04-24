import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from 'framer-motion';

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [ref]);

  return width;
}

function VelocityText({
  children,
  baseVelocity,
  scrollContainerRef,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle
}: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smoothVelocity, velocityMapping.input, velocityMapping.output, {
    clamp: false
  });

  const copyRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const viewportWidth = useElementWidth(viewportRef);
  const directionFactor = useRef(1);

  const wrap = (min: number, max: number, value: number): number => {
    const range = max - min;
    const mod = (((value - min) % range) + range) % range;
    return mod + min;
  };

  const x = useTransform(baseX, value => {
    if (copyWidth === 0) return '0px';
    return `${wrap(-copyWidth, 0, value)}px`;
  });

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const requiredCopies = copyWidth > 0 ? Math.ceil(viewportWidth / copyWidth) + 2 : numCopies;
  const totalCopies = Math.max(2, numCopies, requiredCopies);

  const spans = Array.from({ length: totalCopies }, (_, i) => (
    <span className={`flex-shrink-0 ${className}`} key={i} ref={i === 0 ? copyRef : null}>
      {children}
    </span>
  ));

  return (
    <div ref={viewportRef} className={`${parallaxClassName ?? ''} relative w-full overflow-hidden`} style={parallaxStyle}>
      <motion.div
        className={`${scrollerClassName ?? ''} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] md:text-[5rem] md:leading-[5rem]`}
        style={{ x, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  );
}

const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts,
  velocity = 100,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle
}) => {
  return (
    <section>
      {texts.map((text, index) => (
        <VelocityText
          key={`${text}-${index}`}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
