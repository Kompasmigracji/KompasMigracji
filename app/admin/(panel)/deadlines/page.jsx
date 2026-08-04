"use client";
/* KompasCRM — Deadline Tracker (kompas_deadlines). Infra existed since 038_kompas_deadlines_hardening
   (table + daily cron) but nothing in the app ever wrote a row or showed one — this is that missing UI. */
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Spinner, EmptyState, Icon, Badge, DataTable, StatCard, SearchInput } from "@/components/admin/ui";

const TYPE_LABEL = {
  karta_pobytu_expiry: "Закінчення карти побуту",
  karta_pobytu_application_window: "Вікно подачі на продовження карти побуту",
  ukr_status_expiry: "Закінчення статусу UKR",
  appeal_deadline: "Термін на оскарження",
  passport_expiry: "Закінчення паспорта",
  visa_expiry: "Закінчення візи",
  benefit_800plus: "Продовження 800+",
  other: "Інше",
};

const LOCALE_LABEL = { uk: "UA", pl: "PL", en: "EN", ru: "RU", rom: "RM" };

const STATUS_META = {
  active: { badge: "blue", label: "Активний" },
  completed: { badge: "green", label: "Виконано" },
  cancelled: { badge: "dim", label: "Скасовано" },
};

const STATUS_FILTERS = [
  { id: "", label: "Всі" },
  { id: "active", label: "Активні" },
  { id: "completed", label: "Виконані" },
  { id: "cancelled", label: "Скасовані" },
];

const EMPTY_FORM = {
  title: "", deadline_type: "other", target_date: "", locale: "uk",
  contact_email: "", telegram_chat_id: "", notes: "",
};

function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("uk-UA");
}

function daysUntil(v) {
  if (!v) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(v); target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadDeadlines = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch("/api/admin/deadlines?" + params.toString());
      const d = await res.json();
      setDeadlines(d.deadlines || []);
    } catch {
      flash("Помилка завантаження термінів");
    }
  }, [statusFilter]);

  useEffect(() => { loadDeadlines(); }, [loadDeadlines]);

  const handleCreate = async () => {
    if (!form.title) { flash("Введіть назву терміну"); return; }
    if (!form.target_date) { flash("Вкажіть дату терміну"); return; }
    if (!form.contact_email && !form.telegram_chat_id) {
      flash("Вкажіть email або Telegram chat_id для нагадувань");
      return;
    }
    setBusy("create");
    try {
      const res = await fetch("/api/admin/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Термін створено");
        setForm(null);
        loadDeadlines();
      }
    } catch {
      flash("Помилка з'єднання");
    } finally {
      setBusy("");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setBusy(`status-${id}`);
    try {
      const res = await fetch(`/api/admin/deadlines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const d = await res.json();
      if (d.error) flash(d.error);
      else loadDeadlines();
    } catch {
      flash("Помилка при зміні статусу");
    } finally {
      setBusy("");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити цей термін? Дію неможливо скасувати.")) return;
    setBusy(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/deadlines/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.error) flash(d.error);
      else { flash("Термін видалено"); loadDeadlines(); }
    } catch {
      flash("Помилка при видаленні");
    } finally {
      setBusy("");
    }
  };

  const visible = deadlines ? deadlines.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (d.title || "").toLowerCase().includes(s) ||
      (d.client_name || "").toLowerCase().includes(s) ||
      (d.contact_email || "").toLowerCase().includes(s)
    );
  }) : [];

  const totalActive = deadlines ? deadlines.filter((d) => d.status === "active").length : 0;
  const dueSoon = deadlines ? deadlines.filter((d) => {
    if (d.status !== "active") return false;
    const days = daysUntil(d.target_date);
    return days !== null && days >= 0 && days <= 30;
  }).length : 0;
  const overdue = deadlines ? deadlines.filter((d) => {
    if (d.status !== "active") return false;
    const days = daysUntil(d.target_date);
    return days !== null && days < 0;
  }).length : 0;

  const columns = [
    { header: "Термін", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.title}</div>
        <div style={{ fontSize: 11, color: "var(--dim)" }}>{TYPE_LABEL[row.deadline_type] || row.deadline_type}</div>
      </div>
    ) },
    { header: "Клієнт / контакт", cell: (row) => (
      <div>
        <div>{row.client_name || "—"}</div>
        <div style={{ fontSize: 11, color: "var(--dim)" }}>
          {row.contact_email || (row.telegram_chat_id ? `TG: ${row.telegram_chat_id}` : "—")}
        </div>
      </div>
    ) },
    { header: "Дата", cell: (row) => {
      const days = daysUntil(row.target_date);
      const color = days !== null && days < 0 ? "var(--danger, #ef4444)" : days !== null && days <= 14 ? "var(--warning, #f59e0b)" : "var(--dim)";
      return (
        <div>
          <div className="kc-mono">{fmtDate(row.target_date)}</div>
          {row.status === "active" && days !== null && (
            <div style={{ fontSize: 11, color }}>{days < 0 ? `Прострочено на ${-days} дн.` : `Залишилось ${days} дн.`}</div>
          )}
        </div>
      );
    } },
    { header: "Мова", cell: (row) => LOCALE_LABEL[row.locale] || row.locale },
    { header: "Статус", cell: (row) => {
      const meta = STATUS_META[row.status] || { badge: "dim", label: row.status };
      return <Badge status={meta.badge} text={meta.label} />;
    } },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
        {row.status === "active" && (
          <button className="kc-btn kc-btn-ghost" disabled={busy === `status-${row.id}`}
            onClick={() => handleStatusChange(row.id, "completed")}>Виконано</button>
        )}
        <button className="kc-btn kc-btn-danger" disabled={busy === `delete-${row.id}`}
          onClick={() => handleDelete(row.id)}>Видалити</button>
      </div>
    ) },
  ];

  if (deadlines === null) return <Spinner />;

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 1000 }} className="kc-note">
          {toast}
        </div>
      )}

      <div className="kc-grid kc-grid-4" style={{ marginBottom: "var(--space-lg)" }}>
        <StatCard icon="clock" value={totalActive} label="Активні терміни" />
        <StatCard icon="alert-triangle" value={dueSoon} label="Спливають за 30 днів" />
        <StatCard icon="alert-circle" value={overdue} label="Прострочені" />
        <StatCard icon="check-circle" value={deadlines.filter((d) => d.status === "completed").length} label="Виконано" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {STATUS_FILTERS.map((f) => (
            <button key={f.id} className={`kc-btn ${statusFilter === f.id ? "kc-btn-primary" : "kc-btn-ghost"}`}
              onClick={() => setStatusFilter(f.id)}>{f.label}</button>
          ))}
          <SearchInput value={search} onChange={setSearch} placeholder="Пошук термінів..." style={{ width: 240 }} />
        </div>

        <button className="kc-btn kc-btn-primary" onClick={() => setForm({ ...EMPTY_FORM })}>
          <Icon name="plus" size={16} /> Новий термін
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Термінів не знайдено" description="Створіть перший термін — нагадування розсилає щоденний крон /api/cron/deadlines за 90/60/30/14/7/1 днів до дати." icon="clock" />
      ) : (
        <DataTable columns={columns} data={visible} />
      )}

      {mounted && form && createPortal(
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
          onClick={(e) => { if (e.target === e.currentTarget) setForm(null); }}>
          <div className="kc-card" style={{ width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>Новий термін</h2>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="kc-field">
                <label className="kc-label">Назва *</label>
                <input className="kc-input" placeholder="Продовження карти побуту — Іван Петренко" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Тип терміну</label>
                  <select className="kc-select" value={form.deadline_type} onChange={(e) => setForm({ ...form, deadline_type: e.target.value })}>
                    {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Дата *</label>
                  <input className="kc-input" type="date" value={form.target_date}
                    onChange={(e) => setForm({ ...form, target_date: e.target.value })} />
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Мова нагадувань</label>
                <select className="kc-select" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })}>
                  {Object.entries(LOCALE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Email клієнта</label>
                <input className="kc-input" type="email" placeholder="client@example.com" value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
              </div>
              <div className="kc-field">
                <label className="kc-label">Telegram chat_id</label>
                <input className="kc-input" type="number" placeholder="123456789" value={form.telegram_chat_id}
                  onChange={(e) => setForm({ ...form, telegram_chat_id: e.target.value })} />
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}>
                  Заповнюється автоматично, якщо клієнт створив термін командою /termin у Telegram-боті.
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Примітки</label>
                <textarea className="kc-textarea" rows={3} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" disabled={busy === "create"} onClick={handleCreate}>
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
