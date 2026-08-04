"use client";
/* KompasCRM — Client Service Contracts (Умови обслуговування клієнтів DOMUS V) */
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Spinner, EmptyState, Icon, Badge, DataTable, StatCard, SearchInput } from "@/components/admin/ui";

const CONTRACT_TYPE_LABEL = {
  karta_pobytu: "Карта побуту",
  obywatelstwo: "Громадянство",
  zezwolenie_pracy: "Дозвіл на роботу",
  legalizacja_firmy: "Легалізація фірми",
  inne: "Інше",
};

const STATUS_META = {
  draft:      { badge: "dim",   label: "Чернетка" },
  active:     { badge: "green", label: "Активний" },
  completed:  { badge: "blue",  label: "Завершено" },
  terminated: { badge: "red",   label: "Розірвано" },
  expired:    { badge: "brass", label: "Термін дії закінчився" },
};

const STATUS_FILTERS = [
  { id: "", label: "Всі" },
  { id: "draft", label: "Чернетка" },
  { id: "active", label: "Активний" },
  { id: "completed", label: "Завершено" },
  { id: "terminated", label: "Розірвано" },
  { id: "expired", label: "Термін дії закінчився" },
];

const EMPTY_FORM = {
  client_full_name: "", client_contact: "", contract_type: "inne", title: "",
  value_pln: "", signed_date: "", valid_from: "", valid_until: "", notes: ""
};

function fmtPLN(v) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(parseFloat(v) || 0);
}

function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("uk-UA");
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState(null);
  const [workers, setWorkers] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(null);           // null | new-contract form data
  const [detail, setDetail] = useState(null);        // null | { contract, logs }
  const [isEditMode, setIsEditMode] = useState(false);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/team").then(r => r.json()).then(d => setWorkers(d.team || [])).catch(() => {});
  }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadContracts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch("/api/admin/contracts?" + params.toString());
      const d = await res.json();
      setContracts(d.contracts || []);
    } catch {
      flash("Помилка завантаження договорів");
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { loadContracts(); }, [loadContracts]);

  const openDetail = async (row) => {
    setIsEditMode(false);
    setDetail({ contract: row, logs: [] });
    try {
      const r = await fetch(`/api/admin/contracts/${row.id}`);
      const d = await r.json();
      if (!d.error) setDetail(d);
    } catch { /* keep optimistic view */ }
  };

  const handleCreateContract = async () => {
    if (!form.client_full_name) { flash("Введіть ПІБ клієнта"); return; }
    if (!form.title) { flash("Введіть назву договору"); return; }
    setBusy("create");
    try {
      const res = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Договір створено успішно!");
        setForm(null);
        loadContracts();
      }
    } catch {
      flash("Помилка з'єднання");
    } finally {
      setBusy("");
    }
  };

  const handleUpdateContract = async () => {
    const c = detail.contract;
    if (!c.client_full_name) { flash("Введіть ПІБ клієнта"); return; }
    if (!c.title) { flash("Введіть назву договору"); return; }
    setBusy("update");
    try {
      const res = await fetch(`/api/admin/contracts/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_full_name: c.client_full_name,
          client_contact: c.client_contact,
          contract_type: c.contract_type,
          title: c.title,
          value_pln: c.value_pln,
          status: c.status,
          signed_date: c.signed_date,
          valid_from: c.valid_from,
          valid_until: c.valid_until,
          assigned_to: c.assigned_to,
          notes: c.notes,
        })
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Договір оновлено");
        setIsEditMode(false);
        openDetail(d.contract);
        loadContracts();
      }
    } catch {
      flash("Помилка при оновленні");
    } finally {
      setBusy("");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!detail || !detail.contract || newStatus === detail.contract.status) return;
    setBusy("status");
    try {
      const res = await fetch(`/api/admin/contracts/${detail.contract.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Статус договору оновлено");
        openDetail(d.contract);
        loadContracts();
      }
    } catch {
      flash("Помилка при зміні статусу");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteContract = async (id) => {
    if (!confirm("Ви впевнені, що хочете видалити цей договір? Дію неможливо скасувати.")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/contracts/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Договір видалено");
        setDetail(null);
        loadContracts();
      }
    } catch {
      flash("Помилка при видаленні");
    } finally {
      setBusy("");
    }
  };

  const visibleContracts = contracts ? contracts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.title || "").toLowerCase().includes(q) ||
      (c.client_full_name || "").toLowerCase().includes(q) ||
      (c.client_contact || "").toLowerCase().includes(q) ||
      (c.assigned_to_name || "").toLowerCase().includes(q) ||
      (c.notes || "").toLowerCase().includes(q)
    );
  }) : [];

  // --- Stats (computed from real fetched data) ---
  const totalContracts = contracts ? contracts.length : 0;
  const activeContracts = contracts ? contracts.filter(c => c.status === "active").length : 0;
  const totalValuePln = contracts ? contracts.reduce((sum, c) => sum + (parseFloat(c.value_pln) || 0), 0) : 0;
  const expiringSoon = (() => {
    if (!contracts) return 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const in30 = new Date(today); in30.setDate(in30.getDate() + 30);
    return contracts.filter(c => {
      if (!c.valid_until || c.status !== "active") return false;
      const vu = new Date(c.valid_until);
      return vu >= today && vu <= in30;
    }).length;
  })();

  const tableColumns = [
    { header: "Назва договору", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.title}</div>
        <div style={{ fontSize: 11, color: "var(--dim)" }}>{CONTRACT_TYPE_LABEL[row.contract_type] || row.contract_type}</div>
      </div>
    ) },
    { header: "Клієнт", cell: (row) => (
      <div>
        <div>{row.client_full_name}</div>
        {row.client_contact && <div style={{ fontSize: 11, color: "var(--dim)" }}>{row.client_contact}</div>}
      </div>
    ) },
    { header: "Сума", cell: (row) => <div className="kc-mono">{fmtPLN(row.value_pln)}</div> },
    { header: "Статус", cell: (row) => {
      const meta = STATUS_META[row.status] || { badge: "dim", label: row.status };
      return <Badge status={meta.badge} text={meta.label} />;
    } },
    { header: "Діє до", cell: (row) => fmtDate(row.valid_until) },
    { header: "Виконавець", cell: (row) => row.assigned_to_name || "—" },
  ];

  if (contracts === null) return <Spinner />;

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 1000 }} className="kc-note">
          {toast}
        </div>
      )}

      {/* Stat row */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom: "var(--space-lg)" }}>
        <StatCard icon="file-text" value={totalContracts} label="Всього договорів" />
        <StatCard icon="check-circle" value={activeContracts} label="Активні договори" />
        <StatCard icon="cash" value={fmtPLN(totalValuePln)} label="Загальна сума (PLN)" />
        <StatCard icon="clock" value={expiringSoon} label="Спливають за 30 днів" />
      </div>

      {/* Header controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "var(--space-md)" }}>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              className={`kc-btn ${statusFilter === f.id ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
            </button>
          ))}

          <select className="kc-select" style={{ minHeight: 36 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Всі типи</option>
            {Object.entries(CONTRACT_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <SearchInput value={search} onChange={setSearch} placeholder="Пошук договорів..." style={{ width: 240 }} />
        </div>

        <button className="kc-btn kc-btn-primary" onClick={() => setForm({ ...EMPTY_FORM })}>
          <Icon name="plus" size={16} /> Новий договір
        </button>
      </div>

      {visibleContracts.length === 0 ? (
        <EmptyState
          title="Договорів не знайдено"
          description="Спробуйте змінити критерії пошуку/фільтри або створіть новий договір."
          icon="file-text"
        />
      ) : (
        <DataTable
          columns={tableColumns}
          data={visibleContracts}
          onRowClick={openDetail}
        />
      )}

      {/* Detail panel */}
      {mounted && detail && detail.contract && createPortal(
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 460,
          background: "var(--panel)", borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)", overflowY: "auto", zIndex: 150, padding: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>
              {isEditMode ? "Редагування договору" : "Деталі договору"}
            </h2>
            <button className="kc-btn kc-btn-ghost" onClick={() => { setDetail(null); setIsEditMode(false); }}>✕</button>
          </div>

          {isEditMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="kc-field">
                <label className="kc-label">ПІБ клієнта *</label>
                <input className="kc-input" value={detail.contract.client_full_name || ""}
                  onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, client_full_name: e.target.value } }))} />
              </div>
              <div className="kc-field">
                <label className="kc-label">Контакт клієнта</label>
                <input className="kc-input" value={detail.contract.client_contact || ""}
                  onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, client_contact: e.target.value } }))} />
              </div>
              <div className="kc-field">
                <label className="kc-label">Назва договору *</label>
                <input className="kc-input" value={detail.contract.title || ""}
                  onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, title: e.target.value } }))} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Тип договору</label>
                  <select className="kc-select" value={detail.contract.contract_type || "inne"}
                    onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, contract_type: e.target.value } }))}>
                    {Object.entries(CONTRACT_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Сума (PLN)</label>
                  <input className="kc-input" type="number" step="0.01" value={detail.contract.value_pln || ""}
                    onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, value_pln: e.target.value } }))} />
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Статус</label>
                <select className="kc-select" value={detail.contract.status}
                  onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, status: e.target.value } }))}>
                  {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Дата підписання</label>
                  <input className="kc-input" type="date" value={detail.contract.signed_date ? detail.contract.signed_date.substring(0, 10) : ""}
                    onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, signed_date: e.target.value } }))} />
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Діє з</label>
                  <input className="kc-input" type="date" value={detail.contract.valid_from ? detail.contract.valid_from.substring(0, 10) : ""}
                    onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, valid_from: e.target.value } }))} />
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Діє до</label>
                  <input className="kc-input" type="date" value={detail.contract.valid_until ? detail.contract.valid_until.substring(0, 10) : ""}
                    onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, valid_until: e.target.value } }))} />
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Виконавець</label>
                <select className="kc-select" value={detail.contract.assigned_to || ""}
                  onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, assigned_to: e.target.value } }))}>
                  <option value="">Не призначено</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.full_name}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Примітки</label>
                <textarea className="kc-textarea" rows={3} value={detail.contract.notes || ""}
                  onChange={e => setDetail(d => ({ ...d, contract: { ...d.contract, notes: e.target.value } }))} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button className="kc-btn kc-btn-ghost" onClick={() => setIsEditMode(false)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" disabled={busy === "update"} onClick={handleUpdateContract}>
                  {busy === "update" ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "var(--panel-2)", padding: 16, borderRadius: "var(--radius-lg)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Сума договору</div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)", marginTop: 4 }}>
                  {fmtPLN(detail.contract.value_pln)}
                </div>
                <div style={{ marginTop: 8, fontWeight: 600 }}>{detail.contract.title}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{detail.contract.client_full_name}</div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Статус</label>
                <select className="kc-select" disabled={busy === "status"} value={detail.contract.status}
                  onChange={e => handleStatusChange(e.target.value)}>
                  {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Тип договору</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>
                    {CONTRACT_TYPE_LABEL[detail.contract.contract_type] || detail.contract.contract_type}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Контакт клієнта</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{detail.contract.client_contact || "—"}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Дата підписання</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{fmtDate(detail.contract.signed_date)}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Виконавець</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{detail.contract.assigned_to_name || "—"}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Діє з</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{fmtDate(detail.contract.valid_from)}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Діє до</span>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginTop: 4 }}>{fmtDate(detail.contract.valid_until)}</div>
                </div>
              </div>

              {detail.contract.notes && (
                <div>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>Примітки</span>
                  <div style={{ background: "var(--panel-2)", padding: 12, borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", marginTop: 4, whiteSpace: "pre-wrap" }}>
                    {detail.contract.notes}
                  </div>
                </div>
              )}

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 4 }}>
                <h3 className="kc-card-cap" style={{ marginBottom: "var(--space-md)" }}>Історія подій</h3>
                {(detail.logs || []).length === 0 ? (
                  <div style={{ color: "var(--faint)", fontSize: 12 }}>Поки немає подій</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {detail.logs.map(l => (
                      <div key={l.id} style={{
                        fontSize: 12, padding: "8px 12px",
                        background: "var(--panel-2)", borderRadius: 8,
                        borderLeft: "3px solid var(--color-primary)",
                      }}>
                        <div style={{ fontWeight: 500 }}>{l.event}</div>
                        <div style={{ color: "var(--dim)", marginTop: 2 }}>
                          {new Date(l.created_at).toLocaleString("uk-UA")} · {l.actor}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 4 }}>
                <button className="kc-btn kc-btn-ghost" style={{ flex: 1 }} onClick={() => setIsEditMode(true)}>
                  Редагувати
                </button>
                <button className="kc-btn kc-btn-danger" disabled={busy === "delete"} onClick={() => handleDeleteContract(detail.contract.id)}>
                  Видалити
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* New Contract modal */}
      {mounted && form && createPortal(
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}
          onClick={e => { if (e.target === e.currentTarget) setForm(null); }}
        >
          <div className="kc-card" style={{ width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>Новий договір</h2>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="kc-field">
                <label className="kc-label">ПІБ клієнта *</label>
                <input className="kc-input" placeholder="Іван Петренко" value={form.client_full_name}
                  onChange={e => setForm({ ...form, client_full_name: e.target.value })} />
              </div>
              <div className="kc-field">
                <label className="kc-label">Контакт клієнта</label>
                <input className="kc-input" placeholder="+48 xxx xxx xxx / email" value={form.client_contact}
                  onChange={e => setForm({ ...form, client_contact: e.target.value })} />
              </div>

              <div className="kc-field">
                <label className="kc-label">Тип договору</label>
                <select className="kc-select" value={form.contract_type} onChange={e => setForm({ ...form, contract_type: e.target.value })}>
                  {Object.entries(CONTRACT_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              <div className="kc-field">
                <label className="kc-label">Назва / номер договору *</label>
                <input className="kc-input" placeholder="Umowa o świadczenie usług prawnych nr 12/2026" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="kc-field">
                <label className="kc-label">Сума (PLN)</label>
                <input className="kc-input" type="number" step="0.01" placeholder="1500.00" value={form.value_pln}
                  onChange={e => setForm({ ...form, value_pln: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Дата підписання</label>
                  <input className="kc-input" type="date" value={form.signed_date}
                    onChange={e => setForm({ ...form, signed_date: e.target.value })} />
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Діє з</label>
                  <input className="kc-input" type="date" value={form.valid_from}
                    onChange={e => setForm({ ...form, valid_from: e.target.value })} />
                </div>
                <div className="kc-field" style={{ flex: 1 }}>
                  <label className="kc-label">Діє до</label>
                  <input className="kc-input" type="date" value={form.valid_until}
                    onChange={e => setForm({ ...form, valid_until: e.target.value })} />
                </div>
              </div>

              <div className="kc-field">
                <label className="kc-label">Примітки</label>
                <textarea className="kc-textarea" rows={3} placeholder="Контекст договору..." value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" disabled={busy === "create"} onClick={handleCreateContract}>
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
