"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const MOCK_STATUSES = [
  { id: 1, name: "Новий", color: "bg-red-500/20 text-red-400 border-red-500/30", qty: 1, conv: "100%", sum: "0 zł" },
  { id: 2, name: "Перший контакт", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 3, name: "Аналіз документів", color: "bg-lime-500/20 text-lime-400 border-lime-500/30", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 4, name: "Аванс", color: "bg-sky-500/20 text-sky-400 border-sky-500/30", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 5, name: "Підписання умови", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 6, name: "Виставлення рахунку", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 7, name: "Успішно", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", qty: 0, conv: "0%", sum: "0 zł" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [statuses, setStatuses] = useState(MOCK_STATUSES);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/crm/dashboard');
        if (res.ok) {
          const json = await res.json();
          setStatuses(json.data || MOCK_STATUSES);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800">
      
      {/* Top Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-black/10 px-8 py-5 flex items-center gap-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h2 className="m-0 text-xl font-bold text-gray-900 tracking-tight">Аналитика</h2>
          <select className="bg-black/40 border border-black/10 rounded-lg px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-500/50 transition-colors">
            <option>Воронки</option>
            <option>Заказы</option>
          </select>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 ml-4">
          <button 
            className={`pb-1 text-sm font-semibold transition-colors relative ${activeTab === "general" ? "text-blue-400" : "text-gray-500 hover:text-gray-800"}`} 
            onClick={() => setActiveTab("general")}
          >
            Общее
            {activeTab === "general" && <motion.div layoutId="dashTab" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
          <button 
            className={`pb-1 text-sm font-semibold transition-colors relative ${activeTab === "managers" ? "text-blue-400" : "text-gray-500 hover:text-gray-800"}`} 
            onClick={() => setActiveTab("managers")}
          >
            По менеджерам
            {activeTab === "managers" && <motion.div layoutId="dashTab" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
          <button 
            className={`pb-1 text-sm font-semibold transition-colors relative ${activeTab === "pivot" ? "text-blue-400" : "text-gray-500 hover:text-gray-800"}`} 
            onClick={() => setActiveTab("pivot")}
          >
            Сводная таблица
            {activeTab === "pivot" && <motion.div layoutId="dashTab" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="p-8 flex flex-col gap-6"
      >
        
        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Период</div>
            <div className="flex items-center bg-white/60 border border-black/10 rounded-xl px-4 py-3 gap-3 text-sm text-gray-700 hover:border-black/20 transition-colors cursor-pointer">
              <Icon name="calendar" size={16} className="text-gray-500" />
              <span>30.05.2026 — 30.06.2026</span>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Дата для группировки</div>
            <select className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none hover:border-black/20 focus:border-blue-500/50 transition-colors">
              <option>Дата добавления</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Воронка</div>
            <select className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none hover:border-black/20 focus:border-blue-500/50 transition-colors">
              <option>Одежа</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Менеджеры</div>
            <select className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none hover:border-black/20 focus:border-blue-500/50 transition-colors">
              <option>Все</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/60 border border-black/10 text-gray-500 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-white/80 hover:text-white transition-colors flex items-center gap-2">
              <Icon name="x" size={16} /> Очистить
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
              <Icon name="filter" size={16} /> Все фильтры
            </button>
          </div>
        </motion.div>

        {/* Main Content: Conversion by Status */}
        <motion.div variants={itemVariants}>
          <SpotlightCard className="flex flex-col border border-black/10 bg-white/60 rounded-2xl overflow-hidden p-0">
            <div className="px-6 py-5 border-b border-black/10 font-semibold text-lg text-gray-900 flex items-center gap-3">
              <Icon name="bar-chart" size={20} className="text-blue-400" />
              Конверсия по статусам
            </div>
            <div className="flex flex-col lg:flex-row">
              
              {/* Visual Funnel */}
              <div className="flex-1 border-b lg:border-b-0 lg:border-r border-black/10 p-10 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="w-4/5 h-20 bg-gradient-to-b from-red-500/80 to-red-600/80 backdrop-blur-md border border-red-400/50 text-gray-900 font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]" style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" }}>
                  {statuses.find(s => s.key === 'new')?.conv || '0%'} Новий
                </div>
                <div className="w-[68%] h-16 bg-gradient-to-b from-cyan-400/80 to-cyan-500/80 backdrop-blur-md border border-cyan-300/50 text-gray-900 font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]" style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" }}>
                  {statuses.find(s => s.key === 'contacted')?.conv || '0%'} В роботі
                </div>
                <div className="w-[58%] h-16 bg-gradient-to-b from-lime-500/80 to-lime-600/80 backdrop-blur-md border border-lime-400/50 rounded-b-xl text-gray-900 font-bold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                  {statuses.find(s => s.key === 'won')?.conv || '0%'} Успішно
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-[1.5] p-6">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase font-semibold border-b border-black/10">
                    <tr>
                      <th className="px-4 py-4 font-semibold tracking-wider">Статус</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-center">Количество</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-center">Конверсия</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center p-4">Завантаження...</td></tr>
                    ) : statuses.map((status, index) => (
                      <tr key={status.id} className={`border-black/5 transition-colors hover:bg-white/60 ${index !== statuses.length - 1 ? 'border-b' : ''}`}>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${status.color}`}>
                            {status.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-800">{status.qty}</td>
                        <td className="px-4 py-4 text-center text-gray-500">{status.conv}</td>
                        <td className="px-4 py-4 text-right font-medium text-gray-800">{status.sum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Bottom Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="h-full">
            <SpotlightCard className="h-full flex flex-col border border-black/10 bg-white/60 rounded-2xl min-h-[300px] p-0">
              <div className="px-6 py-5 border-b border-black/10 font-semibold text-lg text-gray-900 flex items-center gap-3">
                <Icon name="trending-down" size={20} className="text-red-400" />
                Отклонения по статусам
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Icon name="bar-chart-2" size={40} className="opacity-20 mb-4" />
                <span className="text-sm">Нет доступных данных</span>
              </div>
            </SpotlightCard>
          </motion.div>
          
          <motion.div variants={itemVariants} className="h-full">
            <SpotlightCard className="h-full flex flex-col border border-black/10 bg-white/60 rounded-2xl min-h-[300px] p-0">
              <div className="px-6 py-5 border-b border-black/10 font-semibold text-lg text-gray-900 flex items-center gap-3">
                <Icon name="alert-circle" size={20} className="text-orange-400" />
                Причины отклонения
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Icon name="pie-chart" size={40} className="opacity-20 mb-4" />
                <span className="text-sm">Нет доступных данных</span>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
