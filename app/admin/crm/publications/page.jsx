"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_COLOR = {
  Draft: "bg-gray-500/10 text-gray-500",
  Published: "bg-emerald-500/10 text-emerald-500",
  Archived: "bg-red-500/10 text-red-500",
};

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", status: "Draft" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/crm/publications");
      const json = await res.json();
      setPublications(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/crm/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title.trim(), status: form.status }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Ошибка"); return; }
      setPublications((prev) => [json.data, ...prev]);
      setIsModalOpen(false);
      setForm({ title: "", status: "Draft" });
    } catch (e) {
      console.error(e);
      setError("Ошибка подключения к серверу");
    }
    setSaving(false);
  };

  const q = search.trim().toLowerCase();
  const filtered = !q ? publications : publications.filter((p) => p.title && p.title.toLowerCase().includes(q));

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Публикации (Marketplace)</h2>

        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-pink-500/50">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по заголовку"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-pink-500 hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <Icon name="plus" size={16} />
          Добавить публикацию
        </button>
      </div>

      <div className="p-8">
        <SpotlightCard className="bg-white/60 dark:bg-[#1a1a1a]/60 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/80 dark:bg-[#222]/80 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Заголовок</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Статус</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка данных из базы...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">{q ? "Ничего не найдено" : "Нет публикаций"}</td></tr>
              ) : filtered.map((p, index) => (
                <tr key={p.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5 ${index !== filtered.length - 1 ? "border-b" : ""}`}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.title}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${STATUS_COLOR[p.status] || "bg-gray-500/10 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">
                    {new Date(p.created_at).toLocaleString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SpotlightCard>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[420px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Новая публикация</h3>

              <form onSubmit={handleAdd} className="flex flex-col gap-4 relative z-10">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div>
                  <label htmlFor="publication-title" className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Заголовок *</label>
                  <input
                    id="publication-title"
                    required
                    autoFocus
                    placeholder="Название публикации"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-pink-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Статус</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-pink-500/50"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                    Отмена
                  </button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-pink-500 text-white font-bold transition-all ${saving ? "opacity-70" : "hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]"}`}>
                    {saving ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
