"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";

export default function PaymentsDemoPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/payments');
        const json = await res.json();
        setPayments(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200">
      
      {/* Top Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Icon name="credit-card" size={16} />
          </div>
          <h2 className="m-0 text-xl font-bold text-white tracking-tight">Журнал платежів</h2>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-emerald-500/50">
          <Icon name="search" size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            className="bg-transparent border-none outline-none text-gray-200 w-full text-sm placeholder:text-gray-600"
          />
        </div>

        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <Icon name="sliders" size={16} />
        </button>

        <button className="ml-auto bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all">
          <Icon name="plus" size={16} />
          Добавить оплату
        </button>
      </div>

      <div className="p-8">
        {/* Data Table */}
        <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-black/20 text-xs text-gray-500 uppercase font-semibold border-b border-white/10">
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
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Загрузка платежей...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Журнал пуст</td></tr>
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
                    className={`transition-colors hover:bg-white/5 border-white/5 cursor-pointer ${index !== payments.length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap font-medium">
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
                        <Avatar name={pay.manager} size={32} className="border border-white/10" />
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-bold">{pay.manager}</span>
                          <span className="text-xs text-gray-500 font-medium">Administrator</span>
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
    </div>
  );
}
