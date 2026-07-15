"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const ROLE_LABEL = {
  admin: "Адміністратор",
  moderator: "Модератор",
  manager: "Менеджер",
  sales: "Продажі",
  lawyer: "Юрист",
};

export default function EfficiencyPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/crm/efficiency')
      .then(r => r.json())
      .then(j => setRows(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxValue = Math.max(1, ...rows.map(r => Number(r.value_won) || 0));

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20">
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Ефективність менеджерів</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">Реальні показники по лідах, угодах та завданнях</p>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">Завантаження...</div>
        ) : rows.length === 0 ? (
          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-500 dark:text-gray-400">
            Немає користувачів з роллю менеджера/продажів у системі.
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rows.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Avatar name={r.full_name || "?"} size={44} className="border border-black/10 dark:border-white/10 shrink-0" />
                    <div className="min-w-[160px]">
                      <div className="font-bold text-gray-900 dark:text-white">{r.full_name || "Без імені"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{ROLE_LABEL[r.role] || r.role}</div>
                    </div>

                    <div className="flex items-center gap-6 ml-auto flex-wrap">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-500 dark:text-blue-400 tabular-nums">{r.leads_count}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Лідів</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-500 dark:text-purple-400 tabular-nums">{r.deals_count}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Угод</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400 tabular-nums">{r.deals_won}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Виграно</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{r.tasks_done}/{r.tasks_total}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Завдань</div>
                      </div>
                    </div>
                  </div>

                  {Number(r.value_won) > 0 && (
                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500 dark:text-gray-400 font-semibold">Сума виграних угод</span>
                        <span className="font-bold text-gray-900 dark:text-white tabular-nums">{Number(r.value_won).toLocaleString('uk-UA')} PLN</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(Number(r.value_won) / maxValue) * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
