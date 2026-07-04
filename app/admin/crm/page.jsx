"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function CrmDemoPage() {
  return (
    <div className="flex flex-col gap-8 p-8 bg-[#f5f5f7] text-gray-800 h-full max-w-5xl mx-auto">
      
      {/* Welcome Banner */}
      <SpotlightCard className="bg-white/60 border border-black/10 p-8 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-gray-900 m-0 tracking-tight">Добро пожаловать в KompasCRM</h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-lg m-0">
            Это новая концепция админ-панели с двухколоночным сайдбаром (в стиле iPhoenix), адаптированная под дизайн-систему Spatial UI.
          </p>
        </div>
        
        <div className="relative z-10 w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)] text-amber-500">
          <Icon name="zap" size={32} />
        </div>
      </SpotlightCard>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Новых лидов", val: "14", icon: "user-plus", color: "blue" },
          { label: "Заказов в работе", val: "38", icon: "shopping-bag", color: "amber" },
          { label: "Успешных сделок", val: "12", icon: "check-circle", color: "emerald" },
          { label: "Выручка", val: "48,500 zł", icon: "dollar-sign", color: "indigo" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SpotlightCard className="bg-white/60 border border-black/10 p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${m.color}-500/20 border border-${m.color}-500/30 text-${m.color}-400 flex items-center justify-center shadow-[0_0_15px_rgba(var(--${m.color}-500-rgb),0.2)]`}>
                  <Icon name={m.icon} size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-500">{m.label}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">{m.val}</div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
      
      {/* Recent Activity Table Placeholder */}
      <SpotlightCard className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden p-0">
        <div className="p-6 border-b border-black/10 flex items-center justify-between bg-black/20">
          <h3 className="m-0 text-lg font-bold text-gray-900 tracking-tight">Последние заказы</h3>
          <button className="bg-transparent border-none text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold cursor-pointer flex items-center gap-2">
            Смотреть все <Icon name="arrow-right" size={14} />
          </button>
        </div>
        <div className="p-12 text-center text-gray-500 text-sm font-medium">
          Выберите раздел слева, чтобы просмотреть данные.
        </div>
      </SpotlightCard>
    </div>
  );
}
