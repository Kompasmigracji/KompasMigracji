"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200">
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-white tracking-tight">Настройки CRM</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 flex-1 flex flex-col items-center justify-center"
      >
        <SpotlightCard className="flex flex-col items-center justify-center p-12 text-center max-w-md w-full bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-gray-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-gray-500/10 border border-gray-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(107,114,128,0.15)] text-gray-400 relative z-10">
            <Icon name="settings" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Модуль настроек</h3>
          <p className="text-gray-400 text-sm leading-relaxed relative z-10">
            Здесь вы можете управлять общими параметрами, ролями, доступами и другими настройками системы. Выберите раздел слева.
          </p>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
