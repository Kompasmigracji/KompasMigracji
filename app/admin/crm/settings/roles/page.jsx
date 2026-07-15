"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const COLOR_CLASSES = {
  blue: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20",
  sky: "bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20",
  emerald: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",
  gray: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-500 dark:text-fuchsia-400 border-fuchsia-500/20",
};

export default function RolesSettingsPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/crm/roles')
      .then(r => r.json())
      .then(j => setRoles(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          <span>Налаштування</span>
          <Icon name="chevron-right" size={14} className="text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-white">Ролі</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-black/10 dark:border-white/10">
                  <th className="p-4 font-bold">Назва ролі</th>
                  <th className="p-4 font-bold text-center">Кіл-ть користувачів</th>
                  <th className="p-4 font-bold text-center">Доступних розділів</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">Завантаження...</td></tr>
                ) : roles.map((item, i) => (
                  <motion.tr
                    key={item.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border ${COLOR_CLASSES[item.color] || COLOR_CLASSES.gray}`}>
                        {item.name}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                      {item.users}
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                      {item.rights}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Ролі та доступи керуються на рівні коду (<code>lib/rbac.js</code>) — ця сторінка показує реальний стан системи.
        </p>
      </motion.div>
    </div>
  );
}
