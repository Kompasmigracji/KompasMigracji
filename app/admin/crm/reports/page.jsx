"use client";

import React, { useState, useEffect } from "react";
import DualSidebarShell from "@/components/admin/DualSidebarShell";
import { Icon } from "@/components/admin/ui";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeLeads: 0,
    conversionRate: 0,
    archPackages: { starter: 0, pro: 0, premium: 0 }
  });

  useEffect(() => {
    // In production this would be a fetch to /api/admin/reports
    setTimeout(() => {
      setStats({
        totalRevenue: 12500,
        activeLeads: 24,
        conversionRate: 15,
        archPackages: { starter: 3, pro: 8, premium: 1 }
      });
    }, 1000);
  }, []);

  return (
    <DualSidebarShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Аналітика та Звіти</h1>
          <p className="text-gray-500 dark:text-gray-400">Фінансові показники та ефективність воронок продажу.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Icon name="dollar-sign" className="text-green-500" /> Дохід (Поточний місяць)
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-500 font-bold mt-2">+12% до минулого місяця</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Icon name="users" className="text-blue-500" /> Активні Ліди
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.activeLeads}</div>
            <div className="text-sm text-gray-500 mt-2">В роботі зараз</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
              <Icon name="percent" className="text-orange-500" /> Конверсія
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.conversionRate}%</div>
            <div className="text-sm text-green-500 font-bold mt-2">+2% до минулого місяця</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 text-white/80 mb-4">
              <Icon name="target" /> Ціль: 5090 64GB
            </div>
            <div className="text-4xl font-black">45%</div>
            <div className="w-full bg-black/20 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-white h-full" style={{ width: '45%' }}></div>
            </div>
            <div className="text-xs text-white/80 mt-2">$2,500 зібрано</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Продажі Архітектурних Пакетів</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Starter ($1.5k)</span><span className="font-bold dark:text-white">{stats.archPackages.starter}</span></div>
                <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2"><div className="bg-gray-400 h-full rounded-full" style={{ width: `${(stats.archPackages.starter / 12) * 100}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-blue-500 font-bold">Pro ($2.5k)</span><span className="font-bold dark:text-white">{stats.archPackages.pro}</span></div>
                <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${(stats.archPackages.pro / 12) * 100}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-purple-500 font-bold">Premium ($4.5k)</span><span className="font-bold dark:text-white">{stats.archPackages.premium}</span></div>
                <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2"><div className="bg-purple-500 h-full rounded-full" style={{ width: `${(stats.archPackages.premium / 12) * 100}%` }}></div></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-sm flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Icon name="pie-chart" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Графіки доходів завантажуються...</p>
            </div>
          </div>
        </div>
      </div>
    </DualSidebarShell>
  );
}
