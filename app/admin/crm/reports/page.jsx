"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const SOURCE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#ec4899", "#6366f1"];

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/crm/reports')
      .then(r => r.json())
      .then(j => setData(j.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300 p-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Фінансові звіти</h1>
        <p className="text-gray-500 dark:text-gray-400 m-0">Реальні показники продажів та воронки Kompas Migracji.</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">Завантаження звітів...</div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-4">
                  <Icon name="cash" size={18} className="text-green-500" /> Дохід (цей місяць)
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{data.totalRevenue.toLocaleString('uk-UA')} zł</div>
                {data.revenueDelta !== null ? (
                  <div className={`text-sm font-bold mt-2 ${data.revenueDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.revenueDelta >= 0 ? '+' : ''}{data.revenueDelta}% до минулого місяця
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Немає даних за минулий місяць</div>
                )}
              </SpotlightCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-4">
                  <Icon name="users" size={18} className="text-blue-500" /> Активні ліди
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{data.activeLeads}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">з {data.totalLeads} усього в системі</div>
              </SpotlightCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-4">
                  <Icon name="percent" size={18} className="text-orange-500" /> Конверсія
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{data.conversionRate}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{data.wonLeads} успішних із {data.totalLeads}</div>
              </SpotlightCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SpotlightCard className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white border-none">
                <div className="flex items-center gap-3 text-white/80 mb-4">
                  <Icon name="target" size={18} /> Джерел лідів
                </div>
                <div className="text-4xl font-black">{data.bySource.length}</div>
                <div className="text-xs text-white/80 mt-2">активних каналів залучення</div>
              </SpotlightCard>
            </motion.div>
          </div>

          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Ліди за джерелами</h3>
            {data.bySource.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6">Ще немає даних</div>
            ) : (
              <div className="space-y-4">
                {data.bySource.map((s, i) => (
                  <div key={s.source}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-700 dark:text-gray-300 font-semibold capitalize">{s.source}</span>
                      <span className="font-bold text-gray-900 dark:text-white tabular-nums">{s.count} ({s.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SpotlightCard>
        </div>
      )}
    </div>
  );
}
