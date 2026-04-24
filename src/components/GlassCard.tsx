import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}

export default function GlassCard({ children, className, tilt = true }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className={twMerge(
        'glass-card relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-colors duration-500',
        isHovered ? 'border-lumin-red/30 bg-white/10 shadow-neon' : 'shadow-glass',
        className
      )}
    >
      {/* Inner glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none bg-red-glow"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full w-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
