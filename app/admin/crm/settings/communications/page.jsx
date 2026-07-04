"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_COMMS = [
  { id: 1, name: "Viber основной", channel: "Viber Номерной", icon: "phone", iconColor: "purple", account: "+48729417050", paidUntil: "Оплачен до 24.07", status: true },
  { id: 2, name: "Фейсбук", channel: "Facebook Messenger", icon: "facebook", iconColor: "blue", account: "Kompas Migracji", status: true },
  { id: 3, name: "Телеграм", channel: "Telegram Номерной", icon: "send", iconColor: "sky", account: "+48729417050", paidUntil: "Оплачен до 02.07", status: true },
  { id: 4, name: "Марьяна (співробітник)", channel: "Telegram Bot", icon: "bot", iconColor: "sky", account: "—", status: false },
  { id: 5, name: "Пошта", channel: "Email", icon: "mail", iconColor: "amber", account: "info@kompasmigracji.app", status: true },
  { id: 6, name: "Телеграм", channel: "Telegram Bot", icon: "bot", iconColor: "sky", account: "—", status: false },
  { id: 7, name: "Inst", channel: "camera", icon: "camera", iconColor: "pink", account: "Kompas Migracji", status: true },
  { id: 8, name: "Chatbot", channel: "Telegram Bot", icon: "bot", iconColor: "sky", account: "—", status: true },
];

const MOCK_TEMPLATES = [
  { name: "1000", context: "Общее", status: true },
  { name: "Інструкція kyc", context: "Общее", status: true },
  { name: "Інструкція трансферго", context: "Общее", status: true },
  { name: "Алімп", context: "Общее", status: true },
  { name: "Апостиль", context: "Общее", status: true },
  { name: "Відмова у співпраці", context: "Общее", status: false },
];

export default function CommunicationsSettingsPage() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500">
        <span>Настройки</span>
        <Icon name="chevron-right" size={14} className="text-gray-600" />
        <span className="text-gray-900">Коммуникации</span>
      </div>

      {/* Main Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        <SpotlightCard className="bg-white/60 border border-black/10 rounded-3xl overflow-hidden flex flex-col h-full">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-black/10 bg-black/40">
            {[
              { id: "chats", label: "Чаты / SMS / Email", icon: "message-circle" },
              { id: "telephony", label: "Телефония", icon: "phone-call" },
              { id: "widgets", label: "Виджеты", icon: "layout" },
              { id: "templates", label: "Шаблоны", icon: "file-text" },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-sm transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id 
                    ? "border-blue-500 text-blue-400 font-bold bg-blue-500/5" 
                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium hover:bg-white/60"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-6 relative">
            <AnimatePresence mode="wait">
              {activeTab === "chats" && (
                <motion.div 
                  key="chats"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className="w-full"
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-black/10">
                        <th className="pb-4 font-bold">Название</th>
                        <th className="pb-4 font-bold">Канал</th>
                        <th className="pb-4 font-bold">Аккаунт</th>
                        <th className="pb-4 font-bold text-center">Статус</th>
                        <th className="pb-4 font-bold text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_COMMS.map((c, i) => (
                        <motion.tr 
                          key={c.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-black/5 hover:bg-white/60 transition-colors group"
                        >
                          <td className="py-4 font-bold text-gray-900 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-${c.iconColor}-500/20 text-${c.iconColor}-400 flex items-center justify-center border border-${c.iconColor}-500/30`}>
                              <Icon name={c.icon} size={18} />
                            </div>
                            {c.name}
                          </td>
                          <td className="py-4 text-gray-500 text-sm font-medium">{c.channel}</td>
                          <td className="py-4 text-gray-700 text-sm">{c.account}</td>
                          <td className="py-4 text-center">
                            {c.status ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Включен
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                Выключен
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-gray-500 hover:text-white transition-colors p-2 opacity-0 group-hover:opacity-100">
                              <Icon name="more-horizontal" size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === "templates" && (
                <motion.div 
                  key="templates"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className="w-full"
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-black/10">
                        <th className="pb-4 font-bold">Название</th>
                        <th className="pb-4 font-bold">Контекст</th>
                        <th className="pb-4 font-bold text-center">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TEMPLATES.map((t, i) => (
                        <motion.tr 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-black/5 hover:bg-white/60 transition-colors"
                        >
                          <td className="py-4 font-bold text-gray-900 flex items-center gap-3">
                            <Icon name="file-text" size={16} className="text-blue-500" />
                            {t.name}
                          </td>
                          <td className="py-4 text-gray-500 text-sm">{t.context}</td>
                          <td className="py-4 text-center">
                            {t.status ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Включен
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                                Отключен
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {(activeTab === "telephony" || activeTab === "widgets") && (
                <motion.div 
                  key="other"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/60 border border-black/10 flex items-center justify-center text-gray-500 mb-4">
                    <Icon name={activeTab === "telephony" ? "phone" : "layout"} size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Модуль в разработке</h3>
                  <p className="text-gray-500 text-sm max-w-sm">Настройки для этого раздела скоро появятся в новом Spatial UI.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
