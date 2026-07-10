"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';

export default function ProductHuntBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="w-full bg-gradient-to-r from-[#DA552F] to-[#E96643] text-white py-2 px-4 relative z-[9999] shadow-[0_0_20px_rgba(218,85,47,0.4)]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center text-sm md:text-base font-bold tracking-wide">
          <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-bounce" />
          <span>We are launching soon on Product Hunt! Support Kompas Migracji & iPhoenix.</span>
          <a 
            href="https://producthunt.com" 
            target="_blank" 
            rel="noreferrer"
            className="ml-4 px-4 py-1 bg-white text-[#DA552F] rounded-full text-xs md:text-sm font-black uppercase hover:scale-105 transition-transform"
          >
            Notify Me
          </a>
          <button 
            onClick={() => setIsVisible(false)} 
            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
