"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const MOCK_ROLES = [
  { id: 1, name: "Administrator", color: "blue", users: 15, rights: 40 },
  { id: 2, name: "Manager", color: "purple", users: 1, rights: 20 },
  { id: 3, name: "Content Manager", color: "sky", users: 3, rights: 5 },
  { id: 4, name: "Courier", color: "emerald", users: 3, rights: 5 },
  { id: 5, name: "Analyst", color: "red", users: 3, rights: 15 },
  { id: 6, name: "Producer", color: "fuchsia", users: 3, rights: 5 },
  { id: 7, name: "Supplier", color: "emerald", users: 3, rights: 5 },
];

export default function RolesSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
          <span>Настройки</span>
          <Icon name="chevron-right" size={14} className="text-gray-600" />
          <span className="text-gray-900">Роли</span>
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
          <Icon name="plus" size={16} /> Добавить роль
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        <SpotlightCard className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-xs uppercase tracking-wider text-gray-500 border-b border-black/10">
                  <th className="p-4 font-bold">Название роли</th>
                  <th className="p-4 font-bold text-center">Кол-во пользователей</th>
                  <th className="p-4 font-bold text-center">Кол-во прав доступа</th>
                  <th className="p-4 font-bold text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ROLES.map((item, i) => (
                  <motion.tr 
                    key={item.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-black/5 hover:bg-white/60 transition-colors group"
                  >
                    <td className="p-4">
                      <span className={`inline-block bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide`}>
                        {item.name}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-gray-700">
                      {item.users}
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-gray-700">
                      {item.rights}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-500 hover:text-blue-400 transition-colors p-1.5 bg-white/60 rounded-md hover:bg-blue-500/10">
                          <Icon name="edit-2" size={14} />
                        </button>
                        <button className="text-gray-500 hover:text-white transition-colors p-1.5 bg-white/60 rounded-md hover:bg-white/80">
                          <Icon name="copy" size={14} />
                        </button>
                        <button className="text-gray-500 hover:text-red-400 transition-colors p-1.5 bg-white/60 rounded-md hover:bg-red-500/10">
                          <Icon name="trash-2" size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
