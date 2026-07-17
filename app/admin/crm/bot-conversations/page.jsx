"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LABEL = { active: "Активна", handed_off: "Передано людині", closed: "Завершено" };
const STATUS_COLOR = {
  active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  handed_off: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function BotConversationsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [thread, setThread] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);

  const fetchRows = async (status) => {
    setLoading(true);
    try {
      const url = status && status !== "all" ? `/api/admin/crm/bot-conversations?status=${status}` : "/api/admin/crm/bot-conversations";
      const res = await fetch(url);
      const json = await res.json();
      setRows(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchRows(statusFilter); }, [statusFilter]);

  const toggleThread = async (id) => {
    if (openId === id) { setOpenId(null); setThread(null); return; }
    setOpenId(id);
    setThreadLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/bot-conversations/${id}`);
      const json = await res.json();
      setThread(json.data || null);
    } catch (e) { console.error(e); }
    setThreadLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20 flex-wrap">
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Розмови бота (Мілена)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">AI-асистент продажу платних юридичних послуг — лог розмов та передач людині</p>
        </div>
      </div>

      <div className="px-8 pt-6 flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: "Всі" },
          { key: "active", label: "Активні" },
          { key: "handed_off", label: "Передано людині" },
          { key: "closed", label: "Завершені" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              statusFilter === f.key
                ? "bg-blue-500 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-black/10 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">Завантаження...</div>
        ) : rows.length === 0 ? (
          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-500 dark:text-gray-400">
            Поки що жодної розмови. Щойно клієнт напише боту — розмова з'явиться тут.
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rows.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 cursor-pointer" onClick={() => toggleThread(r.id)}>
                  <div className="flex items-start gap-4 flex-wrap">
                    <Avatar name={r.full_name_latin || "?"} size={44} className="border border-black/10 dark:border-white/10 shrink-0" />
                    <div className="min-w-[180px] flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 dark:text-white">{r.full_name_latin || "Клієнт без імені"}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLOR[r.status] || STATUS_COLOR.active}`}>
                          {STATUS_LABEL[r.status] || r.status}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] text-gray-500 dark:text-gray-400 border border-black/10 dark:border-white/10 uppercase">{r.channel}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3 flex-wrap">
                        {r.service_direction && <span>{r.service_direction}{r.service_subservice ? ` — ${r.service_subservice}` : ""}</span>}
                        {r.phone_pl && <span>{r.phone_pl}</span>}
                        <span>{new Date(r.updated_at).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {r.last_message && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-2xl truncate">{r.last_message}</div>
                      )}
                    </div>
                    <Icon name={openId === r.id ? "chevron-up" : "chevron-down"} size={16} className="text-gray-400 mt-2" />
                  </div>

                  <AnimatePresence>
                    {openId === r.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                          {threadLoading ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">Завантаження треду...</div>
                          ) : (
                            thread?.messages?.map((m) => (
                              <div key={m.id} className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                                m.sender === "client"
                                  ? "self-start bg-black/5 dark:bg-white/5 text-gray-800 dark:text-gray-200"
                                  : m.sender === "bot"
                                    ? "self-end bg-blue-500/10 text-blue-700 dark:text-blue-300"
                                    : "self-end bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              }`}>
                                <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
                                  {m.sender === "client" ? "Клієнт" : m.sender === "bot" ? "Бот" : "Менеджер"}
                                </div>
                                {m.content}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
