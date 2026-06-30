"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";
import { getSupabase } from "@/lib/supabase";

const FUNNEL_COLUMNS = [
  { id: "Новый", title: "Новый", color: "#10b981" },
  { id: "Кваліфікація", title: "Квалификация", color: "#3b82f6" },
  { id: "Переговори", title: "Переговоры", color: "#eab308" },
  { id: "Оплата", title: "Оплата", color: "#f97316" },
  { id: "Реалізація", title: "Реализация", color: "#8b5cf6" },
];

export default function FunnelsPage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabase();

  const loadLeads = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setLeads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadLeads();

    if (!supabase) return;
    const channel = supabase.channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        loadLeads(); // Refresh on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadLeads, supabase]);

  const handleStatusChange = async (leadId, newStatus) => {
    // Optimistic UI update
    setLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, funnel_step: newStatus } : l));
    
    // API Call
    if (supabase) {
      await supabase
        .from('leads')
        .update({ funnel_step: newStatus })
        .eq('id', leadId);
    }
  };

  // Map database leads to Kanban cards
  const cards = leads.map(l => {
    // Determine how long ago it was created
    const createdDate = new Date(l.created_at);
    const timeFormatted = createdDate.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    
    // Some basic logic to assign a random urgency just for UI demo purposes if it's "Новый"
    const isUrgent = l.funnel_step === 'Новый' && (Date.now() - createdDate.getTime()) > 86400000; 
    
    return {
      id: String(l.id),
      title: l.title || l.name ? `Чат з ${l.name}` : "Новый лид",
      subtitle: timeFormatted,
      timeAgo: l.phone || l.email || "", // Put contact info in timeAgo spot or just leave it
      columnId: l.funnel_step || "Новый",
      amount: 0,
      tags: [l.source || "direct"],
      assignee: { name: "Олександр" }, // Mock assignee
      isUrgent: isUrgent
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)" }}>Воронка продажів</h2>
      </div>
      
      {isLoading ? (
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
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
  );
}
