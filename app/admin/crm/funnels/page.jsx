"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";
import { supabase } from "@/lib/supabase";

const FUNNEL_COLUMNS = [
  { id: "Новый", title: "Новый", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
  { id: "Кваліфікація", title: "Квалификация", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
  { id: "Переговори", title: "Переговоры", color: "border-amber-500 bg-amber-500/10 text-amber-400" },
  { id: "Оплата", title: "Оплата", color: "border-orange-500 bg-orange-500/10 text-orange-400" },
  { id: "Реалізація", title: "Реализация", color: "border-purple-500 bg-purple-500/10 text-purple-400" },
];

export default function FunnelsPage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setLeads(data);
        }
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
    setLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, funnel_step: newStatus } : l));
    if (supabase) {
      await supabase.from('leads').update({ funnel_step: newStatus }).eq('id', leadId);
    }
  };

  const cards = leads.map(l => {
    const createdDate = new Date(l.created_at);
    const timeFormatted = createdDate.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const isUrgent = l.funnel_step === 'Новый' && (Date.now() - createdDate.getTime()) > 86400000; 
    
    return {
      id: String(l.id),
      title: l.title || l.name ? `Чат з ${l.name}` : "Новый лид",
      subtitle: timeFormatted,
      timeAgo: l.phone || l.email || "", 
      columnId: l.funnel_step || "Новый",
      amount: 0,
      tags: [l.source || "direct"],
      assignee: { name: "Олександр" }, 
      isUrgent: isUrgent
    };
  });

  return (
    <div className="flex flex-col h-full bg-[#050505] text-gray-200">
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-white tracking-tight">Воронка продажів</h2>
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
          />
        )}
      </div>
    </div>
  );
}
