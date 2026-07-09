"use client";

import { motion } from 'framer-motion';
import { Coins, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function KompasCoinsBadge() {
  return (
    <Link href="/member/rewards" className="fixed top-4 right-4 z-50 group">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
      >
        <div className="bg-yellow-100 dark:bg-yellow-500/20 p-1.5 rounded-full">
          <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-none mb-1">Баланс</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">1,250 KC</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform ml-1" />
      </motion.div>
    </Link>
  );
}
