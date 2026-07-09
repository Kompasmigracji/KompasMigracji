"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', contact: '', source: 'manual', situation: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/crm/leads');
      const json = await res.json();
      setLeads(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      if (res.ok) {
        await fetchLeads();
        setIsModalOpen(false);
        setNewLead({ name: '', email: '', contact: '', source: 'manual', situation: '' });
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка добавления');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка');
    }
    setIsSubmitting(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'contacted': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'won': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'lost': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'new': return 'Новый';
      case 'contacted': return 'В работе';
      case 'pending': return 'Думает';
      case 'won': return 'Успех';
      case 'lost': return 'Отказ';
      default: return status || 'Новый';
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      
      {/* Top Header */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Входящие Лиды</h2>
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[400px] transition-colors focus-within:border-blue-500/50">
          <Icon name="search" size={16} className="text-gray-500 dark:text-gray-400" />
          <input 
            type="text" 
            placeholder="Поиск лида..." 
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>

        <button className="bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 p-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
          <Icon name="sliders" size={16} className="text-gray-500 dark:text-gray-400" />
        </button>

        <button 
          onClick={() => setIsModalOpen(true)} 
          className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <Icon name="plus" size={16} />
          Добавить лид
        </button>
      </div>

      <div className="p-8">
        {/* Data Table */}
        <SpotlightCard className="bg-white/60 dark:bg-[#1a1a1a]/60 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto p-0">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-white/80 dark:bg-[#222]/80 backdrop-blur-md text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-black/10 dark:border-white/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="accent-blue-500 cursor-pointer" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider flex items-center gap-2">
                  Дата <Icon name="arrow-down" size={12} className="text-blue-500" />
                </th>
                <th className="px-4 py-4 font-semibold tracking-wider">Имя</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Контакты</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Источник</th>
                <th className="px-4 py-4 font-semibold tracking-wider">Запрос (Ситуация)</th>
                <th className="px-4 py-4 font-semibold tracking-wider text-center">Статус</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">Загрузка данных из базы...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">Нет лидов</td></tr>
              ) : leads.map((lead, index) => (
                <tr key={lead.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5 ${index !== leads.length - 1 ? 'border-b' : ''}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="accent-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        {lead.name ? lead.name[0].toUpperCase() : '?'}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{lead.name || "Без имени"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {lead.contact && <span className="text-gray-700 dark:text-gray-300 font-medium">{lead.contact}</span>}
                      {lead.email && <span className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10 capitalize">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-[250px] truncate text-gray-600 dark:text-gray-400" title={lead.situation || lead.message}>
                      {lead.situation || lead.message || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                      {getStatusLabel(lead.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-500 dark:text-gray-400">
                      <Icon name="message-square" size={16} className="cursor-pointer hover:text-blue-400 transition-colors" title="Открыть чат" />
                      <Icon name="edit-2" size={16} className="cursor-pointer hover:text-amber-400 transition-colors" title="Редактировать" />
                      <Icon name="trash-2" size={16} className="cursor-pointer hover:text-red-400 transition-colors" title="Удалить" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SpotlightCard>
      </div>

      {/* Add Lead Modal */}
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
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[450px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
              
              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Новый Лид</h3>
              
              <form onSubmit={handleAddLead} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Имя *</label>
                  <input required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Телефон / Контакт *</label>
                  <input required value={newLead.contact} onChange={e => setNewLead({...newLead, contact: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Email</label>
                  <input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Запрос / Ситуация</label>
                  <textarea value={newLead.situation} onChange={e => setNewLead({...newLead, situation: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 resize-none" />
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold transition-colors">Отмена</button>
                  <button type="submit" disabled={isSubmitting} className={`px-5 py-2.5 rounded-xl border-none bg-blue-500 text-white font-bold transition-all ${isSubmitting ? 'opacity-70' : 'hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>{isSubmitting ? 'Добавление...' : 'Добавить'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
