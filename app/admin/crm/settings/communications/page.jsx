"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

const ICON_COLOR_CLASSES = {
  green: "bg-green-500/20 text-green-500 dark:text-green-400 border-green-500/30",
  sky: "bg-sky-500/20 text-sky-500 dark:text-sky-400 border-sky-500/30",
  purple: "bg-purple-500/20 text-purple-500 dark:text-purple-400 border-purple-500/30",
  blue: "bg-blue-500/20 text-blue-500 dark:text-blue-400 border-blue-500/30",
  amber: "bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30",
};

const CHANNELS = [
  { name: "WhatsApp", icon: "message-square", color: "green", desc: "Вхідні/вихідні через lib/whatsapp.ts, webhook app/api/bot/*" },
  { name: "Telegram", icon: "send", color: "sky", desc: "Бот-канал через lib/telegram.ts" },
  { name: "Viber", icon: "phone", color: "purple", desc: "Webhook app/api/bot/viber" },
  { name: "Facebook Messenger", icon: "message-circle", color: "blue", desc: "Webhook app/api/bot/facebook" },
  { name: "Email", icon: "mail", color: "amber", desc: "SMTP-акаунти через /admin/emails" },
];

export default function CommunicationsSettingsPage() {
  const [activeTab, setActiveTab] = useState("chats");
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    fetch('/api/admin/templates')
      .then(r => r.json())
      .then(j => setTemplates(j.templates || []))
      .catch(console.error)
      .finally(() => setLoadingTemplates(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
        <span>Налаштування</span>
        <Icon name="chevron-right" size={14} className="text-gray-400 dark:text-gray-600" />
        <span className="text-gray-900 dark:text-white">Комунікації</span>
      </div>

      {/* Main Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-full">

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
            {[
              { id: "chats", label: "Канали зв'язку", icon: "message-circle" },
              { id: "templates", label: "Шаблони", icon: "file-text" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-sm transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-500 dark:text-blue-400 font-bold bg-blue-500/5"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium hover:bg-black/5 dark:hover:bg-white/5"
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
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {CHANNELS.map((c) => (
                    <div key={c.name} className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${ICON_COLOR_CLASSES[c.color]}`}>
                        <Icon name={c.icon} size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{c.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={c.desc}>{c.desc}</div>
                      </div>
                      <span className="ml-auto inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                        Підключено
                      </span>
                    </div>
                  ))}
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
                  {loadingTemplates ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">Завантаження...</div>
                  ) : templates.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">Шаблонів ще немає</div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-black/10 dark:border-white/10">
                          <th className="pb-4 font-bold">Назва</th>
                          <th className="pb-4 font-bold">Категорія</th>
                          <th className="pb-4 font-bold text-center">Автовідправка</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((t, i) => (
                          <motion.tr
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                              <Icon name="file-text" size={16} className="text-blue-500 dark:text-blue-400" />
                              {t.title}
                            </td>
                            <td className="py-4 text-gray-500 dark:text-gray-400 text-sm">{t.category}</td>
                            <td className="py-4 text-center">
                              {t.auto_send ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                                  Увімкнено
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20">
                                  Вручну
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
