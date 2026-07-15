"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

const OUTCOME_LABEL = {
  answered: { label: "Відповів", color: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20" },
  no_answer: { label: "Не відповів", color: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20" },
  voicemail: { label: "Голосова пошта", color: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" },
  busy: { label: "Зайнято", color: "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20" },
};

function formatDuration(sec) {
  const s = Number(sec) || 0;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export default function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ lead_id: "", direction: "outgoing", phone: "", duration_seconds: "", outcome: "answered", notes: "" });

  const fetchCalls = async () => {
    try {
      const res = await fetch('/api/admin/crm/calls');
      const json = await res.json();
      setCalls(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchCalls();
    fetch('/api/admin/crm/leads').then(r => r.json()).then(j => setLeads(j.data || [])).catch(() => {});
  }, []);

  const handleAddCall = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/crm/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ lead_id: "", direction: "outgoing", phone: "", duration_seconds: "", outcome: "answered", notes: "" });
        fetchCalls();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 dark:text-green-400 border border-green-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Icon name="phone-call" size={16} />
          </div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Дзвінки</h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Icon name="plus" size={16} />
          Записати дзвінок
        </button>
      </div>

      <div className="p-8">
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-sm text-left">
            <thead className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Дата</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Напрямок</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Лід / Телефон</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Тривалість</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Результат</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Менеджер</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Нотатки</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">Завантаження дзвінків...</td></tr>
              ) : calls.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-500 dark:text-gray-400">Ще немає записаних дзвінків. Натисніть «Записати дзвінок».</td></tr>
              ) : calls.map((call, index) => {
                const outcome = OUTCOME_LABEL[call.outcome] || OUTCOME_LABEL.answered;
                return (
                  <motion.tr
                    key={call.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5 ${index !== calls.length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(call.created_at).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${call.direction === 'incoming' ? 'text-blue-500 dark:text-blue-400' : 'text-purple-500 dark:text-purple-400'}`}>
                        <Icon name={call.direction === 'incoming' ? 'arrow-down-left' : 'arrow-up-right'} size={14} />
                        {call.direction === 'incoming' ? 'Вхідний' : 'Вихідний'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{call.lead_name || "Без ліда"}</div>
                      {call.phone && <div className="text-xs text-gray-500 dark:text-gray-400">{call.phone}</div>}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-medium tabular-nums">{formatDuration(call.duration_seconds)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${outcome.color}`}>
                        {outcome.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={call.manager_name || "?"} size={24} />
                        <span className="text-gray-700 dark:text-gray-300">{call.manager_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[220px] truncate" title={call.notes}>{call.notes || "—"}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </SpotlightCard>
      </div>

      {/* Log Call Modal */}
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
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[440px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Записати дзвінок</h3>

              <form onSubmit={handleAddCall} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Лід (опційно)</label>
                  <select value={form.lead_id} onChange={e => setForm({ ...form, lead_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-green-500/50 transition-colors">
                    <option value="">— Без прив'язки —</option>
                    {leads.map(l => <option key={l.id} value={l.id}>{l.name || l.contact}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Напрямок</label>
                    <select value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-green-500/50 transition-colors">
                      <option value="outgoing">Вихідний</option>
                      <option value="incoming">Вхідний</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Результат</label>
                    <select value={form.outcome} onChange={e => setForm({ ...form, outcome: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-green-500/50 transition-colors">
                      <option value="answered">Відповів</option>
                      <option value="no_answer">Не відповів</option>
                      <option value="voicemail">Голосова пошта</option>
                      <option value="busy">Зайнято</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Телефон</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+48..." className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-green-500/50 transition-colors placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Тривалість (сек)</label>
                    <input type="number" value={form.duration_seconds} onChange={e => setForm({ ...form, duration_seconds: e.target.value })} placeholder="120" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-green-500/50 transition-colors placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Нотатки</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-green-500/50 transition-colors resize-none" />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold transition-colors">Скасувати</button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-green-500 text-white font-bold transition-all ${saving ? 'opacity-70' : 'hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]'}`}>{saving ? 'Збереження...' : 'Зберегти'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
