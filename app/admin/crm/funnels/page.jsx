"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";
import LeadDetailsModal from "@/components/admin/LeadDetailsModal";

const FUNNEL_COLUMNS = [
  { id: "new", title: "Нові", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
  { id: "contacted", title: "Взяті в роботу", color: "border-purple-500 bg-purple-500/10 text-purple-400" },
  { id: "pending", title: "Думають", color: "border-amber-500 bg-amber-500/10 text-amber-400" },
  { id: "won", title: "Успіх", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
  { id: "lost", title: "Відмова", color: "border-red-500 bg-red-500/10 text-red-400" },
];

export default function FunnelsPage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: '', contact: '', source: 'manual' });
  const [selectedLead, setSelectedLead] = useState(null);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/crm/leads');
      const json = await res.json();
      if (json.data) {
        setLeads(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleStatusChange = async (leadId, newStatus) => {
    // Optimistic update
    setLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, status: newStatus } : l));
    
    try {
      await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error(e);
      // Revert if error
      loadLeads();
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLeadForm, status: 'new' })
      });
      if (res.ok) {
        await loadLeads();
        setIsModalOpen(false);
        setNewLeadForm({ name: '', contact: '', source: 'manual' });
      } else {
        const data = await res.json();
        alert(data.error || "Помилка");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cards = leads.map(l => {
    const createdDate = new Date(l.created_at);
    const timeFormatted = createdDate.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const isUrgent = l.status === 'new' && (Date.now() - createdDate.getTime()) > 86400000; 
    
    return {
      id: String(l.id),
      title: l.name ? `Клієнт: ${l.name}` : "Новий лід",
      subtitle: timeFormatted,
      timeAgo: l.contact || l.email || "Без контактів", 
      columnId: l.status || "new",
      amount: 0,
      tags: [l.source || "website"],
      assignee: { name: "Менеджер" }, 
      isUrgent: isUrgent,
      originalLead: l
    };
  });

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Воронка продажів</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg> Додати ліда
        </button>
      </div>
      
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <KanbanBoard 
            columns={FUNNEL_COLUMNS} 
            cards={cards} 
            onCardMove={handleStatusChange} 
            onCardClick={(card) => setSelectedLead(card.originalLead)}
          />
        )}
      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-down">
            <div className="flex justify-between items-center p-5 border-b border-black/10 dark:border-white/10">
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white tracking-tight">Новий Лід</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ім'я</label>
                <input 
                  type="text" 
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({...newLeadForm, name: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  placeholder="Олексій"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Телефон / Контакт</label>
                <input 
                  type="text" 
                  required
                  value={newLeadForm.contact}
                  onChange={(e) => setNewLeadForm({...newLeadForm, contact: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                  placeholder="+48 111 222 333"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Джерело</label>
                <select 
                  value={newLeadForm.source}
                  onChange={(e) => setNewLeadForm({...newLeadForm, source: e.target.value})}
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all dark:text-white"
                >
                  <option value="manual">Додано вручну</option>
                  <option value="telegram">Telegram</option>
                  <option value="instagram">Instagram</option>
                  <option value="viber">Viber</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  Скасувати
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all">
                  Створити Ліда
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal 
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updatedLead) => {
            setLeads(prev => prev.map(l => String(l.id) === String(updatedLead.id) ? updatedLead : l));
          }}
        />
      )}
    </div>
  );
}
