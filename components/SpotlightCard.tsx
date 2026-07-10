'use client';
import { MouseEvent, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function SpotlightCard({ 
  children, 
  className = '', 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number 
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(tiltY, { stiffness: 300, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Calculate tilt (-5 to 5 degrees) based on mouse position relative to center
    const xPct = (x / width - 0.5) * 2; // -1 to 1
    const yPct = (y / height - 0.5) * 2; // -1 to 1
    tiltX.set(yPct * -5);
    tiltY.set(xPct * 5);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group relative rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 overflow-hidden shadow-2xl transition-all ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
