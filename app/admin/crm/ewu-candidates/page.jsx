"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const STATUS_LABEL = { new: "Новий", contacted: "В роботі", in_progress: "В обробці", pending: "Думає", won: "Успіх", lost: "Відмова" };
const STATUS_COLOR = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contacted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-500 border-red-500/20",
};

function roleFromService(service) {
  if (!service) return { label: "—", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" };
  if (service.includes("Роботодав")) return { label: "Роботодавець", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" };
  return { label: "Зварювальник", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" };
}

export default function EwuCandidatesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/admin/crm/ewu-candidates");
      const json = await res.json();
      setRows(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const updateStatus = async (id, status) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await fetch("/api/admin/crm/ewu-candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) { console.error(e); fetchRows(); }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter(r => {
      const role = roleFromService(r.service).label;
      if (roleFilter === "worker" && role !== "Зварювальник") return false;
      if (roleFilter === "employer" && role !== "Роботодавець") return false;
      if (!term) return true;
      return [r.name, r.contact, r.email, r.message].filter(Boolean).some(v => v.toLowerCase().includes(term));
    });
  }, [rows, search, roleFilter]);

  const workerCount = rows.filter(r => roleFromService(r.service).label === "Зварювальник").length;
  const employerCount = rows.filter(r => roleFromService(r.service).label === "Роботодавець").length;

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20 flex-wrap">
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Кандидати EWU</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">Заявки зі сторінки Оракула (/orakul) — European Welding Union</p>
        </div>

        <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[320px] transition-colors focus-within:border-orange-500/50 ml-auto">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук за іменем, контактом..."
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="px-8 pt-6 flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: `Всі (${rows.length})` },
          { key: "worker", label: `Зварювальники (${workerCount})` },
          { key: "employer", label: `Роботодавці (${employerCount})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setRoleFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              roleFilter === f.key
                ? "bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
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
        ) : filtered.length === 0 ? (
          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-500 dark:text-gray-400">
            {rows.length === 0
              ? "Поки що жодної заявки. Щойно хтось заповнить форму на сторінці Оракула — кандидат з'явиться тут."
              : "Нічого не знайдено за цим фільтром."}
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((r, i) => {
              const role = roleFromService(r.service);
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5">
                    <div className="flex items-start gap-4 flex-wrap">
                      <Avatar name={r.name || "?"} size={44} className="border border-black/10 dark:border-white/10 shrink-0" />
                      <div className="min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white">{r.name || "Без імені"}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.color}`}>{role.label}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3 flex-wrap">
                          {r.contact && <span>{r.contact}</span>}
                          {r.email && <span>{r.email}</span>}
                          <span>{new Date(r.created_at).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {r.message && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">{r.message}</div>
                        )}
                      </div>

                      <select
                        value={r.status || "new"}
                        onChange={e => updateStatus(r.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none ${STATUS_COLOR[r.status] || STATUS_COLOR.new}`}
                      >
                        {Object.entries(STATUS_LABEL).map(([k, label]) => (
                          <option key={k} value={k} className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white">{label}</option>
                        ))}
                      </select>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
