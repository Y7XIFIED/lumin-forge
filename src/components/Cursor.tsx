import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);
  const magneticTarget = useRef<DOMRect | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (isMagnetic && magneticTarget.current) {
        const target = magneticTarget.current;
        const centerX = target.left + target.width / 2;
        const centerY = target.top + target.height / 2;
        
        // Pull towards center
        const pullX = (e.clientX - centerX) * 0.2;
        const pullY = (e.clientY - centerY) * 0.2;
        
        mouseX.set(centerX + pullX);
        mouseY.set(centerY + pullY);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magneticElement = target.closest('.magnetic');
      
      if (magneticElement) {
        setIsMagnetic(true);
        magneticTarget.current = magneticElement.getBoundingClientRect();
      } else {
        setIsMagnetic(false);
        magneticTarget.current = null;
      }

      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('glass-card')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMagnetic]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-lumin-red rounded-full pointer-events-none z-[1000001] mix-blend-screen"
        style={{ x: x, y: y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-lumin-red/20 rounded-full pointer-events-none z-[1000000] blur-xl mix-blend-screen"
        style={{ x: x, y: y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
      />
    </>
  );
}
