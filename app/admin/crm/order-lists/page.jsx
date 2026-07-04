"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function OrderListsPage() {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800">
      <div className="bg-white/60 backdrop-blur-xl border-b border-black/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 tracking-tight">Списки заказов</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 flex-1 flex flex-col items-center justify-center"
      >
        <SpotlightCard className="flex flex-col items-center justify-center p-12 text-center max-w-md w-full bg-white/60 border border-black/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] text-blue-400 relative z-10">
            <Icon name="list" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Модуль в разработке</h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10">
            Здесь вы сможете создавать и управлять массовыми списками заказов для логистики и отправки.
          </p>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
