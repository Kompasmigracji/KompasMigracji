"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function PublicationsPage() {
  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Публикации (Marketplace)</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 flex-1 flex flex-col items-center justify-center"
      >
        <SpotlightCard className="flex flex-col items-center justify-center p-12 text-center max-w-md w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-pink-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.15)] text-pink-500 dark:text-pink-400 relative z-10">
            <Icon name="share-2" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 relative z-10 tracking-tight">Модуль в разработке</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed relative z-10">
            Здесь вы сможете управлять выгрузкой товаров на внешние маркетплейсы и витрины.
          </p>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
