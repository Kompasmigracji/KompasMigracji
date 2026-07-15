"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function CosmicSpiral() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 0]);

  // Continuously-spinning blurred layers force WebKit to recomposite the
  // blur every frame forever — cheap on desktop GPUs, but this is what was
  // making the effect a real cost on phones (same class of issue StarField
  // already had to skip on mobile for). No value added on a small screen
  // anyway, so just skip it there.
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)');
    const apply = () => setSkip(mq.matches || window.innerWidth < 768);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (skip) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <motion.div 
        style={{ rotate, scale, opacity }}
        className="relative w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]"
      >
        {/* Deep Parallax Spiral Layers - replaced SVG with CSS gradient to prevent 404 */}
        <div className="absolute inset-0 bg-[conic-gradient(var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-30 mix-blend-screen animate-[spin_10s_linear_infinite] rounded-full blur-xl" />
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]" />
        
        {/* Orbital rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.1)]" />
        <div className="absolute inset-10 rounded-full border border-purple-500/10 shadow-[0_0_50px_rgba(168,85,247,0.1)]" />
        <div className="absolute inset-20 rounded-full border border-white/5" />
      </motion.div>
    </div>
  );
}
