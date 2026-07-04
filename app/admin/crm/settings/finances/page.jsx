"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function FinancesSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500">
        <span>Настройки</span>
        <Icon name="chevron-right" size={14} className="text-gray-600" />
        <span className="text-gray-900">Финансы</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center">
        <SpotlightCard className="flex flex-col items-center justify-center p-12 text-center max-w-md w-full bg-white/60 border border-black/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-amber-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] text-amber-400 relative z-10">
            <Icon name="dollar-sign" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Финансы</h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10 mb-6">
            Настройки платежных шлюзов, валют, налогов и интеграций с банками.
          </p>

          <button className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:bg-amber-500/30 transition-all flex items-center gap-2 relative z-10">
            <Icon name="plus" size={16} /> Добавить интеграцию
          </button>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
