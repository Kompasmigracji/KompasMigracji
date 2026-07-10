"use client";

import React, { useEffect, useRef } from 'react';
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

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <motion.div 
        style={{ rotate, scale, opacity }}
        className="relative w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]"
      >
        {/* Deep Parallax Spiral Layers */}
        <div className="absolute inset-0 bg-[url('/spiral.svg')] bg-no-repeat bg-center bg-contain opacity-20 mix-blend-screen animate-pulse" />
        
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
