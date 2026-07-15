"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

export default function SourcesSettingsPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", type: "manual" });

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/admin/crm/sources');
      const json = await res.json();
      setSources(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchSources(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/crm/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ name: "", type: "manual" });
        fetchSources();
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const toggleStatus = async (source) => {
    setSources(sources.map(s => s.id === source.id ? { ...s, status: !s.status } : s));
    try {
      await fetch('/api/admin/crm/sources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: source.id, status: !source.status })
      });
    } catch (e) { console.error(e); fetchSources(); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити це джерело?')) return;
    setSources(sources.filter(s => s.id !== id));
    try {
      await fetch(`/api/admin/crm/sources?id=${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); fetchSources(); }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          <span>Налаштування</span>
          <Icon name="chevron-right" size={14} className="text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-white">Джерела лідів</span>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center gap-2">
          <Icon name="plus" size={16} /> Додати джерело
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">Завантаження...</div>
        ) : sources.length === 0 ? (
          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-500 dark:text-gray-400">
            Ще немає жодного джерела. Натисніть «Додати джерело».
          </SpotlightCard>
        ) : (
          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-black/10 dark:border-white/10">
                  <th className="p-4 font-bold">Назва</th>
                  <th className="p-4 font-bold">Тип</th>
                  <th className="p-4 font-bold text-center">Статус</th>
                  <th className="p-4 font-bold text-right">Дії</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Icon name="share-2" size={16} className="text-indigo-500 dark:text-indigo-400" />
                      {s.name}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm capitalize">{s.type}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleStatus(s)} className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors ${s.status ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20'}`}>
                        {s.status ? 'Активне' : 'Вимкнене'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(s.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="trash" size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </SpotlightCard>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[400px] shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Нове джерело</h3>
              <form onSubmit={handleAdd} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Назва *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="напр. Facebook Ads" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Тип</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-indigo-500/50 transition-colors">
                    <option value="manual">Вручну</option>
                    <option value="website">Сайт</option>
                    <option value="social">Соцмережі</option>
                    <option value="referral">Реферал</option>
                    <option value="ads">Реклама</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold transition-colors">Скасувати</button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-indigo-500 text-white font-bold transition-all ${saving ? 'opacity-70' : 'hover:bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]'}`}>{saving ? 'Створення...' : 'Створити'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
