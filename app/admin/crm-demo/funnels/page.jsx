"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";

const FUNNEL_COLUMNS = [
  { id: "new", title: "Новый", color: "#ef4444" },
  { id: "first_contact", title: "Первый контакт", color: "#f97316" },
  { id: "follow_up", title: "Дотискання", color: "#eab308" },
  { id: "marriage", title: "Шлюб", color: "#8b5cf6" },
  { id: "notary", title: "Нотаріус", color: "#ec4899" },
  { id: "translation", title: "Переклад", color: "#6366f1" },
  { id: "residence", title: "Побут", color: "#14b8a6" },
  { id: "dpo", title: "DPO", color: "#10b981" },
  { id: "doc_analysis", title: "Аналіз документів", color: "#84cc16" },
  { id: "invoice", title: "Виставлено рахунок", color: "#0ea5e9" },
  { id: "payment", title: "Підтвердження оплати", color: "#3b82f6" },
  { id: "feedback", title: "Фідбек", color: "#64748b" },
];

export default function FunnelsPage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all leads (no filter)
      const res = await fetch("/api/admin/leads");
      const d = await res.json();
      setLeads(d.leads || []);
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
    // Optimistic UI update
    setLeads(prev => prev.map(l => String(l.id) === String(leadId) ? { ...l, status: newStatus } : l));
    
    // API Call
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to update status", e);
      loadLeads(); // Revert on failure
    }
  };

  // Map database leads to Kanban cards
  const cards = leads.map(l => {
    // Determine how long ago it was created
    const createdDate = new Date(l.created_at);
    const timeFormatted = createdDate.toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    
    // Some basic logic to assign a random urgency just for UI demo purposes if it's "new"
    const isUrgent = l.status === 'new' && (Date.now() - createdDate.getTime()) > 86400000; 
    
    return {
      id: String(l.id),
      title: l.name ? `Чат з ${l.name}` : "Новий лід",
      subtitle: timeFormatted,
      timeAgo: l.contact || "", // Put contact info in timeAgo spot or just leave it
      columnId: l.status || "new",
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
