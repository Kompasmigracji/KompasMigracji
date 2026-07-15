"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";

export default function PaymentsDemoPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: "income", description: "", amount: "", currency: "PLN" });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/crm/payments');
      const json = await res.json();
      setPayments(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/crm/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ type: "income", description: "", amount: "", currency: "PLN" });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      
      {/* Top Header */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Icon name="credit-card" size={16} />
          </div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Журнал платежів</h2>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-emerald-500/50">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>

        <button className="w-10 h-10 rounded-xl bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
          <Icon name="sliders" size={16} />
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Icon name="plus" size={16} />
          Добавить оплату
        </button>
      </div>

      <div className="p-8">
        {/* Data Table */}
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider flex items-center gap-2">
                  Дата и время <Icon name="arrow-down" size={12} className="text-emerald-500" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider">Детали платежа</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Пользователь</th>
                <th className="px-4 py-4 font-semibold tracking-wider text-right">Сумма</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка платежей...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">Журнал пуст</td></tr>
              ) : payments.map((pay, index) => {
                const isIncome = pay.type === "income";
                const isCancelled = pay.status === "cancelled";
                
                const dateObj = new Date(pay.created_at);
                const dateStr = dateObj.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                
                return (
                  <motion.tr 
                    key={pay.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`transition-colors hover:bg-black/5 dark:hover:bg-white/10 border-black/5 dark:border-white/5 cursor-pointer ${index !== payments.length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                      {dateStr}
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex flex-col gap-1.5 pl-4 border-l-2 ${isIncome ? 'border-emerald-500' : 'border-red-500'}`}>
                        <div>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                            ${isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {pay.type_label}
                          </span>
                        </div>
                        <span className="text-blue-400 font-medium">{pay.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={pay.manager} size={32} className="border border-black/10 dark:border-white/10" />
                        <div className="flex flex-col">
                          <span className="text-gray-800 dark:text-gray-200 font-bold">{pay.manager}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Administrator</span>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-4 text-right font-bold text-base ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pay.amount} {pay.currency}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isCancelled ? (
                        <div className="inline-flex items-center gap-1.5 border border-red-500/30 bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <Icon name="x" size={12} /> Отменено
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                          <Icon name="check" size={12} /> Оплачено
                        </div>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </SpotlightCard>
      </div>

      {/* Add Payment Modal */}
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
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />

              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Новий запис у журналі</h3>

              <form onSubmit={handleAddPayment} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Тип</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setForm({ ...form, type: "income" })} className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${form.type === "income" ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/30" : "bg-white/60 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-black/10 dark:border-white/10"}`}>Надходження</button>
                    <button type="button" onClick={() => setForm({ ...form, type: "expense" })} className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${form.type === "expense" ? "bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/30" : "bg-white/60 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-black/10 dark:border-white/10"}`}>Списання</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Опис</label>
                  <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="напр. Оплата за консультацію" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Сума</label>
                    <input required type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Валюта</label>
                    <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors">
                      <option value="PLN">PLN</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer transition-colors">
                    Відмінити
                  </button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-emerald-500 text-white font-bold cursor-pointer transition-all ${saving ? 'opacity-70' : 'hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                    {saving ? 'Збереження...' : 'Зберегти'}
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
