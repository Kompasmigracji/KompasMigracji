"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-400">
        <span>Настройки</span>
        <Icon name="chevron-right" size={14} className="text-gray-600" />
        <span className="text-white">Основные</span>
      </div>

      {/* Main Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        <SpotlightCard className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <form className="flex flex-col gap-8 relative z-10">
            
            {/* Row: Название компании */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-white/5 pb-8">
              <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-300 pt-3">
                <span className="text-red-500 mr-1">*</span> Название компании
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  defaultValue="kompasm"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors shadow-inner"
                />
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  Название компании будет использоваться при генерации разного типа документов
                </div>
              </div>
            </div>

            {/* Row: Доменное имя */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-white/5 pb-8">
              <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-300 pt-3">
                Доменное имя
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  defaultValue="kompasm.keycrm.app"
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row: Страна */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-white/5 pb-8">
              <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-300 pt-3">
                <span className="text-red-500 mr-1">*</span> Страна
              </div>
              <div className="flex-1 relative">
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors shadow-inner appearance-none cursor-pointer">
                  <option>Польша</option>
                </select>
                <Icon name="chevron-down" size={16} className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  Используется для определения телефонного кода страны по умолчанию
                </div>
              </div>
            </div>

            {/* Row: Часовой пояс */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-white/5 pb-8">
              <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-300 pt-3">
                <span className="text-red-500 mr-1">*</span> Часовой пояс
              </div>
              <div className="flex-1 relative">
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors shadow-inner appearance-none cursor-pointer">
                  <option>(UTC +02:00) Warsaw</option>
                </select>
                <Icon name="chevron-down" size={16} className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  Используется для отображения всех дат в системе
                </div>
              </div>
            </div>

            {/* Row: Логотип компании */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 pb-4">
              <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-300 pt-3">
                Логотип компании
              </div>
              <div className="flex-1">
                <div className="relative w-[120px] h-[120px] bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center group overflow-hidden shadow-inner">
                  {/* Fallback avatar if no image */}
                  <Icon name="image" size={32} className="text-gray-600 group-hover:scale-110 transition-transform" />
                  
                  <button type="button" className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 z-10">
                    <Icon name="x" size={14} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-3 font-medium">
                  Логотип компании будет использоваться при генерации разного типа документов
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                <Icon name="save" size={16} /> Сохранить изменения
              </button>
            </div>
            
          </form>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
