"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function CallsPage() {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800">
      <div className="bg-white/60 backdrop-blur-xl border-b border-black/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 tracking-tight">Звонки</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 flex-1 flex flex-col items-center justify-center"
      >
        <SpotlightCard className="flex flex-col items-center justify-center p-12 text-center max-w-md w-full bg-white/60 border border-black/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-green-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)] text-green-400 relative z-10">
            <Icon name="phone-call" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10 tracking-tight">Модуль Телефонії</h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10 mb-8 max-w-sm">
            Інтеграція з IP-телефонією для здійснення дзвінків та запису розмов скоро буде доступна.
          </p>
          <button className="relative z-10 bg-green-500 hover:bg-green-600 text-white border-none px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 cursor-pointer flex items-center gap-2">
            <Icon name="bell" size={16} /> Повідомити про готовність
          </button>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
