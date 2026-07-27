"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/crm/order-lists");
      const json = await res.json();
      setLists(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/crm/order-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Ошибка"); return; }
      setLists((prev) => [json.data, ...prev]);
      setIsModalOpen(false);
      setName("");
    } catch (e) {
      console.error(e);
      setError("Ошибка подключения к серверу");
    }
    setSaving(false);
  };

  const q = search.trim().toLowerCase();
  const filtered = !q ? lists : lists.filter((l) => l.name && l.name.toLowerCase().includes(q));

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Списки заказов</h2>

        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <Icon name="plus" size={16} />
          Добавить список
        </button>
      </div>

      <div className="p-8">
        <SpotlightCard className="bg-white/60 dark:bg-[#1a1a1a]/60 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/80 dark:bg-[#222]/80 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Название</th>
                <th className="px-4 py-4 font-semibold tracking-wider text-right">Заказов в списке</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка данных из базы...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">{q ? "Ничего не найдено" : "Нет списков заказов"}</td></tr>
              ) : filtered.map((l, index) => (
                <tr key={l.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5 ${index !== filtered.length - 1 ? "border-b" : ""}`}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{l.name}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-500">{l.count ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">
                    {new Date(l.created_at).toLocaleString("ru-RU")}
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
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[400px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Новый список заказов</h3>

              <form onSubmit={handleAdd} className="flex flex-col gap-4 relative z-10">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div>
                  <label htmlFor="order-list-name" className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Название *</label>
                  <input
                    id="order-list-name"
                    required
                    autoFocus
                    placeholder="Например, Отправка на этой неделе"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                    Отмена
                  </button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-blue-500 text-white font-bold transition-all ${saving ? "opacity-70" : "hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]"}`}>
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
