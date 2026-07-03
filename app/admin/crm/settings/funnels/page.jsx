"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function FunnelsSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-400">
        <span>Настройки</span>
        <Icon name="chevron-right" size={14} className="text-gray-600" />
        <span className="text-white">Воронки</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center">
        <SpotlightCard className="flex flex-col items-center justify-center p-12 text-center max-w-md w-full bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-purple-400 relative z-10">
            <Icon name="filter" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Воронки продаж</h3>
          <p className="text-gray-400 text-sm leading-relaxed relative z-10 mb-6">
            Управление этапами воронок продаж, триггерами и автоматизациями.
          </p>

          <button className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-purple-500/30 transition-all flex items-center gap-2 relative z-10">
            <Icon name="plus" size={16} /> Создать воронку
          </button>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
