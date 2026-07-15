"use client";
/* KompasCRM — Deals & Opportunities Management Page */
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Spinner, EmptyState, Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";
import KanbanBoard from "@/components/admin/KanbanBoard";
import Timeline from "@/components/admin/Timeline";

const FILTERS = [
  { id: "", label: "Всі" },
  { id: "prospecting", label: "Пошук" },
  { id: "qualification", label: "Кваліфікація" },
  { id: "proposal", label: "Пропозиція" },
  { id: "negotiation", label: "Переговори" },
  { id: "closed_won", label: "Успішно" },
  { id: "closed_lost", label: "Втрачено" },
];

const COLUMNS = [
  { id: "prospecting", title: "Пошук / Prospecting", color: "#3b82f6" },
  { id: "qualification", title: "Кваліфікація / Qualification", color: "#f59e0b" },
  { id: "proposal", title: "Пропозиція / Proposal", color: "#8b5cf6" },
  { id: "negotiation", title: "Переговори / Negotiation", color: "#f97316" },
  { id: "closed_won", title: "Закрито Успішно", color: "#10b981" },
  { id: "closed_lost", title: "Втрачено", color: "#ef4444" },
];

const EMPTY_FORM = {
  title: "", amount: "", currency: "PLN", stage: "prospecting", probability: 0,
  lead_id: "", member_id: "", assigned_to: "", expected_close: "", notes: ""
};

export default function DealsPage() {
  const [deals, setDeads] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "list"
  
  const [form, setForm] = useState(null); // null | form data object
  const [detail, setDetail] = useState(null); // null | deal object
  const [isEditMode, setIsEditMode] = useState(false);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    setMounted(true); 
    
    // Preload relational data for dropdowns
    fetch("/api/admin/team").then(r => r.json()).then(d => setWorkers(d.team || [])).catch(() => {});
    fetch("/api/admin/leads").then(r => r.json()).then(d => setLeads(d.leads || [])).catch(() => {});
    fetch("/api/admin/members").then(r => r.json()).then(d => setMembers(d.members || [])).catch(() => {});
  }, []);

  const flash = (msg) => { 
    setToast(msg); 
    setTimeout(() => setToast(""), 3000); 
  };

  const loadDeals = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/deals?stage=" + encodeURIComponent(filter));
      const d = await res.json();
      setDeads(d.deals || []);
    } catch {
      flash("Помилка завантаження угод");
    }
  }, [filter]);

  useEffect(() => {
    loadDeals();
  }, [filter, loadDeals]);

  const handleStageChange = async (dealId, newStage) => {
    // Optimistic UI update
    setDeads(prev => prev.map(d => String(d.id) === String(dealId) ? { ...d, stage: newStage } : d));
    
    try {
      const res = await fetch(`/api/admin/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
        loadDeals();
      } else {
        flash(`Статус угоди оновлено`);
      }
    } catch {
      flash("Помилка при перетягуванні угоди");
      loadDeals();
    }
  };

  const handleCreateDeal = async () => {
    if (!form.title) {
      flash("Введіть назву угоди");
      return;
    }
    setBusy("create");
    try {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Угоду створено успішно!");
        setForm(null);
        loadDeals();
      }
    } catch {
      flash("Помилка з'єднання");
    } finally {
      setBusy("");
    }
  };

  const handleUpdateDeal = async () => {
    if (!detail.title) {
      flash("Введіть назву угоди");
      return;
    }
    setBusy("update");
    try {
      const res = await fetch(`/api/admin/deals/${detail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detail)
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Угоду оновлено");
        setIsEditMode(false);
        setDetail(null);
        loadDeals();
      }
    } catch {
      flash("Помилка при оновленні");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!confirm("Ви впевнені, що хочете видалити цю угоду?")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Угоду видалено");
        setDetail(null);
        loadDeals();
      }
    } catch {
      flash("Помилка при видаленні");
    } finally {
      setBusy("");
    }
  };

  const visibleDeals = deals ? deals.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (d.title || "").toLowerCase().includes(q) ||
      (d.lead_name || "").toLowerCase().includes(q) ||
      (d.member_name || "").toLowerCase().includes(q) ||
      (d.notes || "").toLowerCase().includes(q)
    );
  }) : [];

  const kanbanCards = visibleDeals.map(d => ({
    id: String(d.id),
    title: d.title || "Без назви",
    subtitle: d.lead_name ? `Лід: ${d.lead_name}` : d.member_name ? `Учасник: ${d.member_name}` : "Не прив'язано",
    columnId: d.stage || "prospecting",
    amount: parseFloat(d.amount) || 0,
    tags: [d.currency || "PLN", `${d.probability || 0}%`],
    badge: null,
    assignee: d.assigned_to_name ? { name: d.assigned_to_name } : null
  }));

  const tableColumns = [
    { header: "Назва угоди", cell: (row) => <div style={{ fontWeight: 600 }}>{row.title}</div> },
    { header: "Сума", cell: (row) => <div className="kc-mono">{new Intl.NumberFormat('pl-PL', { style: 'currency', currency: row.currency || 'PLN' }).format(row.amount)}</div> },
    { header: "Ймовірність", cell: (row) => <span>{row.probability}%</span> },
    { header: "Етап", cell: (row) => <Badge status={row.stage === 'closed_won' ? 'paid' : row.stage === 'closed_lost' ? 'unpaid' : 'pending'} text={row.stage} /> },
    { header: "Лід / Клієнт", cell: (row) => <span>{row.lead_name || row.member_name || "—"}</span> },
    { header: "Виконавець", cell: (row) => <span>{row.assigned_to_name || "—"}</span> },
    { header: "Дата закриття", cell: (row) => row.expected_close ? new Date(row.expected_close).toLocaleDateString() : "—" },
  ];

  if (deals === null) return <Spinner />;

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 1000 }} className="kc-note">
          {toast}
        </div>
      )}

      {/* Header controls */}
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
              placeholder="Пошук угод..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36, minHeight: 36 }}
            />
          </div>
        </div>

        {/* View toggles & Add action */}
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <div style={{ display: "flex", background: "var(--panel-2)", padding: 4, borderRadius: "var(--radius-md)" }}>
            <button 
              className={`kc-btn ${viewMode === 'kanban' ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
              style={{ padding: "4px 8px", minHeight: 30 }}
              onClick={() => setViewMode('kanban')}
              title="Канбан"
            >
              <Icon name="grid" size={16} />
            </button>
            <button 
              className={`kc-btn ${viewMode === 'list' ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
              style={{ padding: "4px 8px", minHeight: 30 }}
              onClick={() => setViewMode('list')}
              title="Список"
            >
              <Icon name="layers" size={16} />
            </button>
          </div>
          <button className="kc-btn kc-btn-primary" onClick={() => setForm({ ...EMPTY_FORM })}>
            <Icon name="plus" size={16} /> Нова угода
          </button>
        </div>
      </div>

      {visibleDeals.length === 0 ? (
        <EmptyState 
          title="Угод не знайдено" 
          description="Спробуйте змінити критерії пошуку або створіть нову угоду." 
          icon="target" 
        />
      ) : (
        viewMode === "kanban" ? (
          <KanbanBoard 
            columns={COLUMNS} 
            cards={kanbanCards} 
            onCardMove={handleStageChange}
            onCardClick={(card) => {
              const deal = visibleDeals.find(d => String(d.id) === card.id);
              setDetail(deal);
              setIsEditMode(false);
            }}
          />
        ) : (
          <DataTable 
            columns={tableColumns} 
            data={visibleDeals} 
            onRowClick={(row) => {
              setDetail(row);
              setIsEditMode(false);
            }}
          />
        )
      )}

      {/* Detail panel */}
      {mounted && detail && createPortal(
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 440,
          background: "var(--panel)", borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)", overflowY: "auto", zIndex: 150, padding: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>
              {isEditMode ? "Редагування угоди" : "Деталі угоди"}
            </h2>
            <button className="kc-btn kc-btn-ghost" onClick={() => { setDetail(null); setIsEditMode(false); }}>✕</button>
          </div>

          {isEditMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="kc-field">
                <label className="kc-label">Назва угоди *</label>
                <input className="kc-input" value={detail.title} onChange={e => setDetail({ ...detail, title: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Сума</label>
                  <input className="kc-input" type="number" value={detail.amount} onChange={e => setDetail({ ...detail, amount: e.target.value })} />
                </div>
                <div className="kc-field" style={{ width: 100 }}>
                  <label className="kc-label">Валюта</label>
                  <select className="kc-select" value={detail.currency} onChange={e => setDetail({ ...detail, currency: e.target.value })}>
                    <option value="PLN">PLN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Ймовірність (%)</label>
                  <input className="kc-input" type="number" min="0" max="100" value={detail.probability} onChange={e => setDetail({ ...detail, probability: e.target.value })} />
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Етап</label>
                  <select className="kc-select" value={detail.stage} onChange={e => setDetail({ ...detail, stage: e.target.value })}>
                    <option value="prospecting">Пошук</option>
                    <option value="qualification">Кваліфікація</option>
                    <option value="proposal">Пропозиція</option>
                    <option value="negotiation">Переговори</option>
                    <option value="closed_won">Закрито Успішно</option>
                    <option value="closed_lost">Втрачено</option>
                  </select>
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Лід (з воронки)</label>
                <select className="kc-select" value={detail.lead_id || ""} onChange={e => setDetail({ ...detail, lead_id: e.target.value })}>
                  <option value="">Не обрано</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.service})</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Учасник (клієнт)</label>
                <select className="kc-select" value={detail.member_id || ""} onChange={e => setDetail({ ...detail, member_id: e.target.value })}>
                  <option value="">Не обрано</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Виконавець</label>
                <select className="kc-select" value={detail.assigned_to || ""} onChange={e => setDetail({ ...detail, assigned_to: e.target.value })}>
                  <option value="">Не призначено</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.full_name}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Дата закриття</label>
                <input className="kc-input" type="date" value={detail.expected_close ? detail.expected_close.substring(0, 10) : ""} onChange={e => setDetail({ ...detail, expected_close: e.target.value })} />
              </div>

              <div className="kc-field">
                <label className="kc-label">Примітки</label>
                <textarea className="kc-textarea" rows={3} value={detail.notes || ""} onChange={e => setDetail({ ...detail, notes: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button className="kc-btn kc-btn-ghost" onClick={() => setIsEditMode(false)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" disabled={busy === "update"} onClick={handleUpdateDeal}>
                  {busy === "update" ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "var(--panel-2)", padding: 16, borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Сума угоди</div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)", marginTop: 4 }}>
                  {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: detail.currency || 'PLN' }).format(detail.amount)}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Етап</span>
                  <div style={{ marginTop: 4 }}>
                    <Badge status={detail.stage === 'closed_won' ? 'paid' : detail.stage === 'closed_lost' ? 'unpaid' : 'pending'} text={detail.stage} />
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Ймовірність</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 4 }}>{detail.probability}%</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Лід</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{detail.lead_name || "—"}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Учасник</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{detail.member_name || "—"}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Виконавець</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{detail.assigned_to_name || "—"}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Дата закриття</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>
                    {detail.expected_close ? new Date(detail.expected_close).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>

              {detail.notes && (
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Примітки</span>
                  <div style={{ background: "var(--panel-2)", padding: 12, borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", marginTop: 4, whiteSpace: "pre-wrap" }}>
                    {detail.notes}
                  </div>
                </div>
              )}

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 20 }}>
                <h3 className="kc-card-cap" style={{ marginBottom: "var(--space-md)" }}>Історія взаємодій</h3>
                <Timeline entityType="deal" entityId={detail.id} />
              </div>

              <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 20 }}>
                <button className="kc-btn kc-btn-ghost" style={{ flex: 1 }} onClick={() => setIsEditMode(true)}>
                  Редагувати
                </button>
                <button className="kc-btn kc-btn-danger" onClick={() => handleDeleteDeal(detail.id)}>
                  Видалити
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Creation panel */}
      {mounted && form && createPortal(
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}
          onClick={e => { if (e.target === e.currentTarget) setForm(null); }}
        >
          <div className="kc-card" style={{ width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>Нова угода</h2>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="kc-field">
                <label className="kc-label">Назва угоди *</label>
                <input className="kc-input" placeholder="Наприклад: Карта побуту для Івана" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Сума</label>
                  <input className="kc-input" type="number" placeholder="500" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="kc-field" style={{ width: 100 }}>
                  <label className="kc-label">Валюта</label>
                  <select className="kc-select" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    <option value="PLN">PLN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Ймовірність (%)</label>
                  <input className="kc-input" type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} />
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Етап</label>
                  <select className="kc-select" value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                    <option value="prospecting">Пошук</option>
                    <option value="qualification">Кваліфікація</option>
                    <option value="proposal">Пропозиція</option>
                    <option value="negotiation">Переговори</option>
                    <option value="closed_won">Закрито Успішно</option>
                    <option value="closed_lost">Втрачено</option>
                  </select>
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Лід (з воронки)</label>
                <select className="kc-select" value={form.lead_id} onChange={e => setForm({ ...form, lead_id: e.target.value })}>
                  <option value="">Не обрано</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.service})</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Учасник (клієнт)</label>
                <select className="kc-select" value={form.member_id} onChange={e => setForm({ ...form, member_id: e.target.value })}>
                  <option value="">Не обрано</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Виконавець</label>
                <select className="kc-select" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
                  <option value="">Не призначено</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.full_name}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Дата закриття</label>
                <input className="kc-input" type="date" value={form.expected_close} onChange={e => setForm({ ...form, expected_close: e.target.value })} />
              </div>

              <div className="kc-field">
                <label className="kc-label">Примітки</label>
                <textarea className="kc-textarea" rows={3} placeholder="Контекст угоди..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" disabled={busy === "create"} onClick={handleCreateDeal}>
                  {busy === "create" ? "Створення..." : "Створити"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
