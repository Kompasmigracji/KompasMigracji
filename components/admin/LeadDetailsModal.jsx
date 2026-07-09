"use client";
import React, { useState, useEffect } from "react";

export default function LeadDetailsModal({ lead, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    contact: lead?.contact || lead?.phone || '',
    email: lead?.email || '',
    source: lead?.source || 'manual',
    status: lead?.status || 'new'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        contact: lead.contact || lead.phone || '',
        email: lead.email || '',
        source: lead.source || 'manual',
        status: lead.status || 'new'
      });
    }
  }, [lead]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onUpdate({ ...lead, ...formData });
        setIsEditing(false);
      } else {
        const err = await res.json();
        alert(err.error || "Помилка збереження");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvert = async () => {
    if (!confirm("Ви впевнені, що хочете конвертувати цього ліда в Клієнта (Buyer)?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${lead.id}/convert`, {
        method: 'POST'
      });
      if (res.ok) {
        alert("Ліда успішно конвертовано в клієнта!");
        onUpdate({ ...lead, status: 'won' });
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || "Помилка конвертації");
      }
    } catch (e) {
      console.error(e);
      alert("Помилка");
    } finally {
      setIsSaving(false);
    }
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-down flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-black/10 dark:border-white/10">
          <h3 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Деталі Ліда</h3>
          <div className="flex items-center gap-2">
            {!isEditing && lead.status !== 'won' && (
              <button 
                onClick={handleConvert} 
                disabled={isSaving}
                className="text-white bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-1.5"
                title="Перетворити Ліда на реального Клієнта (перенести в Покупці)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Зробити Клієнтом
              </button>
            )}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors">
                Редагувати
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isEditing ? (
            <form id="edit-lead-form" onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ім'я</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Телефон / Контакт</label>
                <input 
                  type="text" 
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Етап Воронки</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                >
                  <option value="new">Новий</option>
                  <option value="contacted">Взяті в роботу</option>
                  <option value="pending">Думають</option>
                  <option value="won">Успіх</option>
                  <option value="lost">Відмова</option>
                </select>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white m-0">{lead.name || 'Анонім'}</h4>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    {lead.status === 'new' ? 'Новий' : 
                     lead.status === 'contacted' ? 'В роботі' : 
                     lead.status === 'pending' ? 'Думає' : 
                     lead.status === 'won' ? 'Успіх' : 
                     lead.status === 'lost' ? 'Відмова' : lead.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Контакт</span>
                  <span className="text-gray-900 dark:text-white font-medium">{lead.contact || lead.phone || '—'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email</span>
                  <span className="text-gray-900 dark:text-white font-medium">{lead.email || '—'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Джерело</span>
                  <span className="text-gray-900 dark:text-white font-medium capitalize">{lead.source || 'Manual'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Дата створення</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(lead.created_at).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Ситуація / Повідомлення</span>
                  <span className="text-gray-900 dark:text-white font-medium">{lead.situation || lead.message || '—'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {isEditing && (
          <div className="p-5 border-t border-black/10 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-[#1a1a1a]">
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setFormData(lead); }} 
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              Скасувати
            </button>
            <button 
              form="edit-lead-form"
              type="submit" 
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              Зберегти
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
