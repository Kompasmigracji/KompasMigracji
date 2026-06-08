"use client";
/* iPhoenixCRM — Leads Management Page (Kanban & List Views) */
import React, { useEffect, useState, useCallback } from "react";
import { Spinner, EmptyState, Icon, Badge, DataTable } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";

const FILTERS = [
  { id: "", label: "Всi" },
  { id: "new", label: "Новi" },
  { id: "contacted", label: "В контакті" },
  { id: "in_progress", label: "В роботі" },
  { id: "closed", label: "Успішно" },
  { id: "dropped", label: "Вiдмова" },
];

const COLUMNS = [
  { id: "new", title: "Новi ліди", color: "var(--color-info)" },
  { id: "contacted", title: "В контакті", color: "var(--color-warning)" },
  { id: "in_progress", title: "В роботі", color: "var(--color-primary)" },
  { id: "closed", title: "Успішно", color: "var(--color-success)" },
  { id: "dropped", title: "Вiдмова", color: "var(--color-danger)" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("kanban"); // "list" | "kanban"
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = useCallback(async (statusFilter) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/leads?status=" + encodeURIComponent(statusFilter));
      const d = await res.json();
      setLeads(d.leads || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads(filter);
  }, [filter, loadLeads]);

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
      loadLeads(filter); // Revert on failure
    }
  };

  // Filter for Search
  const visibleLeads = leads ? leads.filter(l => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (l.name || "").toLowerCase().includes(q) ||
      (l.contact || "").toLowerCase().includes(q) ||
      (l.service || "").toLowerCase().includes(q)
    );
  }) : [];

  // Map to Kanban Format
  const kanbanCards = visibleLeads.map(l => ({
    id: String(l.id),
    title: l.name || "Без імені",
    subtitle: l.contact || "Немає контактів",
    columnId: l.status || "new",
    amount: 0, // Placeholder for deal value
    tags: [l.source],
    badge: { status: l.status, text: null }
  }));

  // List View Columns
  const tableColumns = [
    { header: "ID", accessor: "id", style: { width: 60 } },
    { header: "Ім'я", cell: (row) => <div style={{ fontWeight: 500 }}>{row.name || "—"}</div> },
    { header: "Контакт", accessor: "contact" },
    { header: "Джерело", cell: (row) => <Badge status="dim" text={row.source} /> },
    { header: "Послуга", accessor: "service" },
    { header: "Статус", cell: (row) => <Badge status={row.status} /> },
    { header: "Дата", cell: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {FILTERS.map(f => (
            <button 
              key={f.id}
              className={`kc-btn ${filter === f.id ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
          
          <div style={{ position: "relative", marginLeft: "var(--space-sm)", width: 240 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dim)" }}>
              <Icon name="search" size={16} />
            </div>
            <input 
              className="kc-input" 
              placeholder="Пошук лідів..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36, minHeight: 36 }}
            />
          </div>
        </div>

        {/* View Toggles & Actions */}
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <div style={{ display: "flex", background: "var(--panel-2)", padding: 4, borderRadius: "var(--radius-md)" }}>
            <button 
              className={`kc-btn ${viewMode === 'kanban' ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
              style={{ padding: "4px 8px", minHeight: 30 }}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <Icon name="grid" size={16} />
            </button>
            <button 
              className={`kc-btn ${viewMode === 'list' ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
              style={{ padding: "4px 8px", minHeight: 30 }}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <Icon name="layers" size={16} />
            </button>
          </div>
          <button className="kc-btn kc-btn-primary">
            <Icon name="plus" size={16} /> Створити лід
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : visibleLeads.length === 0 ? (
        <EmptyState 
          title="Лідів не знайдено" 
          description="Спробуйте змінити фільтри або створити новий лід." 
          icon="target" 
        />
      ) : (
        viewMode === "kanban" ? (
          <KanbanBoard 
            columns={COLUMNS} 
            cards={kanbanCards} 
            onCardMove={(cardId, newColId) => handleStatusChange(cardId, newColId)} 
            onCardClick={(card) => window.location.href = `/admin/leads/${card.id}`}
          />
        ) : (
          <DataTable 
            columns={tableColumns} 
            data={visibleLeads} 
            onRowClick={(row) => window.location.href = `/admin/leads/${row.id}`} 
          />
        )
      )}
    </div>
  );
}
