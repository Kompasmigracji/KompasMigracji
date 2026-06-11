"use client";
/* /admin/enforcement — Виконавчі справи (Kanban-дошка).
   Етапи: Аналіз справи → Переговори/Медіація → У виконавця → Судовий етап */
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon, Spinner } from "@/components/admin/ui";
import ImportWizard from "@/components/admin/ImportWizard";

const STAGES = [
  {
    key:   "analysis",
    label: "Аналіз справи",
    color: "#6fa3d4",
    bg:    "#eef4fb",
    desc:  "Збір документів, оцінка боргу/стягнення",
  },
  {
    key:   "negotiation",
    label: "Переговори/Медіація",
    color: "#d99e54",
    bg:    "#fff8ed",
    desc:  "Спроба досудового врегулювання з боржником/кредитором",
  },
  {
    key:   "execution",
    label: "У виконавця",
    color: "#a855f7",
    bg:    "#faf5ff",
    desc:  "Справа передана виконавцю (Komornik)",
  },
  {
    key:   "court",
    label: "Судовий етап",
    color: "#d96c6c",
    bg:    "#fdf0f0",
    desc:  "Оскарження, судове засідання, апеляція",
  },
];

const EMPTY_FORM = {
  full_name:"", contact:"", case_number:"", executor_name:"",
  debt_amount:"", deadline_date:"", notes:"",
};

export default function EnforcementPage() {
  const [cases, setCases]     = useState(null);
  const [form, setForm]       = useState(null);     // null | EMPTY_FORM
  const [detail, setDetail]   = useState(null);     // { case, logs } | null
  const [busy, setBusy]       = useState("");
  const [toast, setToast]     = useState("");
  const [mounted, setMounted] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/enforcement?status=active");
      const d = await r.json();
      setCases(d.cases || []);
    } catch { flash("Помилка завантаження"); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id) => {
    const r = await fetch(`/api/admin/enforcement/${id}`);
    const d = await r.json();
    setDetail(d);
  };

  const byStage = (stage) => (cases || []).filter(c => c.stage === stage);

  const moveStage = async (c, stage) => {
    setBusy(c.id);
    try {
      await fetch(`/api/admin/enforcement/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      flash(`${c.full_name} → ${STAGES.find(s=>s.key===stage)?.label}`);
      load();
      if (detail?.case?.id === c.id) loadDetail(c.id);
    } catch { flash("Помилка"); }
    finally { setBusy(""); }
  };

  const closeCase = async (id) => {
    if (!confirm("Закрити справу? Вона зникне з активної дошки.")) return;
    await fetch(`/api/admin/enforcement/${id}`, { method:"DELETE" });
    flash("Справу закрито");
    setDetail(null);
    load();
  };

  const createCase = async () => {
    if (!form.full_name) { flash("Введіть ПІБ клієнта"); return; }
    setBusy("create");
    try {
      const r = await fetch("/api/admin/enforcement", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          ...form,
          debt_amount: form.debt_amount ? parseFloat(form.debt_amount) : null
        }),
      });
      const d = await r.json();
      if (d.error) { flash(d.error); return; }
      flash("Справу створено");
      setForm(null);
      load();
    } catch { flash("Помилка при створенні"); }
    finally { setBusy(""); }
  };

  const daysColor = (n) => {
    if (n === null || n === undefined) return "#8a96a3";
    if (n < 0)  return "#d96c6c";
    if (n < 14) return "#d99e54";
    return "#7cbf8e";
  };

  if (!cases) return <Spinner />;

  return (
    <div>
      {toast && <div className="kc-note" style={{ marginBottom:12 }}>{toast}</div>}

      {/* Header */}
      <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:16, gap: "var(--space-sm)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:17 }}>Виконавчі справи (Komornik & Борги)</div>
          <div style={{ color:"var(--dim)", fontSize:12, marginTop:2 }}>
            {cases.length} активних справ
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <a href="/api/admin/export?entity_type=enforcement_cases" download className="kc-btn">
            <Icon name="download" size={16} /> Експорт
          </a>
          <button onClick={() => setIsImportOpen(true)} className="kc-btn">
            <Icon name="upload" size={16} /> Імпорт
          </button>
          
          <button className="kc-btn kc-btn-primary" onClick={() => setForm({ ...EMPTY_FORM })}>
            <Icon name="plus" size={14} /> Нова справа
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kc-grid" style={{ gap: 14, alignItems: "start", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {STAGES.map((stage, si) => {
          const stageCases = byStage(stage.key);
          return (
            <div key={stage.key} style={{
              background: `color-mix(in srgb, ${stage.color} 4%, var(--panel))`,
              borderRadius: "var(--radius-lg)", padding: 14,
              border: `1px solid color-mix(in srgb, ${stage.color} 20%, var(--border))`,
            }}>
              {/* Column Header */}
              <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color: stage.color }}>{stage.label}</div>
                  <div style={{ fontSize:11, color:"var(--dim)", marginTop:2 }}>{stage.desc}</div>
                </div>
                <div style={{
                  background: stage.color, color:"#fff",
                  borderRadius:"50%", width:22, height:22,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700, flexShrink:0,
                }}>
                  {stageCases.length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {stageCases.length === 0 && (
                  <div style={{ textAlign:"center", padding:"20px 0", color:"var(--faint)", fontSize:12 }}>
                    Немає справ
                  </div>
                )}
                {stageCases.map(c => (
                  <div key={c.id}
                    className="kc-card"
                    style={{ padding:"12px 14px", cursor:"pointer", transition:"box-shadow .15s" }}
                    onClick={() => { loadDetail(c.id); setDetail({ case:c, logs:[] }); }}
                  >
                    <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>{c.full_name}</div>
                      {c.days_left !== null && (
                        <div style={{
                          fontSize:11, fontWeight:700, padding:"2px 7px",
                          borderRadius:10, background: daysColor(c.days_left) + "22",
                          color: daysColor(c.days_left),
                        }}>
                          {c.days_left < 0 ? `+${Math.abs(c.days_left)}д прострочено`
                           : c.days_left === 0 ? "Сьогодні!"
                           : `${c.days_left}д`}
                        </div>
                      )}
                    </div>

                    {c.case_number && (
                      <div style={{ fontSize:11, color:"var(--dim)" }}>Справа: {c.case_number}</div>
                    )}
                    {c.debt_amount && (
                      <div style={{ fontSize:11, color:"#d96c6c", fontWeight:600, marginTop:4 }}>
                        Сума: {parseFloat(c.debt_amount).toLocaleString('pl-PL')} PLN
                      </div>
                    )}

                    <div className="kc-row" style={{ gap:4, marginTop:8, justifyContent:"flex-end" }}>
                      {si > 0 && (
                        <button
                          className="kc-btn kc-btn-ghost"
                          style={{ fontSize:10, padding:"2px 8px" }}
                          disabled={busy===c.id}
                          onClick={e => { e.stopPropagation(); moveStage(c, STAGES[si-1].key); }}
                          title={STAGES[si-1].label}
                        >
                          ← Назад
                        </button>
                      )}
                      {si < STAGES.length - 1 && (
                        <button
                          className="kc-btn kc-btn-primary"
                          style={{ fontSize:10, padding:"2px 8px" }}
                          disabled={busy===c.id}
                          onClick={e => { e.stopPropagation(); moveStage(c, STAGES[si+1].key); }}
                          title={STAGES[si+1].label}
                        >
                          Далі →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Details Sidebar */}
      {mounted && detail && createPortal(
        <div style={{
          position:"fixed", top:0, right:0, bottom:0, width:"100%", maxWidth:400,
          background:"var(--panel)", borderLeft:"1px solid var(--border)",
          boxShadow:"var(--shadow-lg)", overflowY:"auto", zIndex:150, padding:24,
        }}>
          <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:16 }}>{detail.case?.full_name}</div>
            <button className="kc-btn kc-btn-ghost" onClick={() => setDetail(null)}>✕</button>
          </div>

          {detail.case && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  ["Контакт",   detail.case.contact],
                  ["№ справи (Sygnatura)",  detail.case.case_number],
                  ["Виконавець", detail.case.executor_name],
                  ["Сума (PLN)", detail.case.debt_amount ? parseFloat(detail.case.debt_amount).toLocaleString('pl-PL') : null],
                  ["Дедлайн",  detail.case.deadline_date
                    ? new Date(detail.case.deadline_date).toLocaleDateString("uk-UA")
                    : null],
                  ["Залишилось дн.", detail.case.days_left !== null
                    ? detail.case.days_left + " днів"
                    : null],
                ].map(([label, val]) => val ? (
                  <div key={label} style={{ fontSize:12 }}>
                    <div style={{ color:"var(--dim)" }}>{label}</div>
                    <div style={{ fontWeight:500 }}>{val}</div>
                  </div>
                ) : null)}
              </div>

              {detail.case.notes && (
                <div style={{ fontSize:13, color:"var(--faint)", marginBottom:16,
                  background:"var(--panel-2)", borderRadius:8, padding:10 }}>
                  {detail.case.notes}
                </div>
              )}

              <div className="kc-row" style={{ gap:8, marginBottom:20 }}>
                <button className="kc-btn kc-btn-danger" style={{ fontSize:12 }}
                  onClick={() => closeCase(detail.case.id)}>
                  Закрити справу
                </button>
              </div>
            </>
          )}

          <div style={{ fontWeight:600, fontSize:13, marginBottom:10 }}>Історія подій</div>
          {(detail.logs || []).length === 0 ? (
            <div style={{ color:"var(--faint)", fontSize:12 }}>Поки немає подій</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {detail.logs.map(l => (
                <div key={l.id} style={{
                  fontSize:12, padding:"8px 12px",
                  background:"var(--panel-2)", borderRadius:8,
                  borderLeft:"3px solid var(--color-primary)",
                }}>
                  <div style={{ fontWeight:500 }}>{l.event}</div>
                  <div style={{ color:"var(--dim)", marginTop:2 }}>
                    {new Date(l.created_at).toLocaleString("uk-UA")} · {l.actor}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}

      {/* New Case Form Modal */}
      {mounted && form && createPortal(
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          overflowY:"auto", zIndex:200,
          padding:"32px 16px",
        }}
          onClick={e => { if (e.target===e.currentTarget) setForm(null); }}
        >
          <div className="kc-card" style={{ width:"100%", maxWidth:480, margin:"0 auto" }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Нова Виконавча Справа</div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">ПІБ клієнта *</label>
                <input className="kc-input" value={form.full_name}
                  onChange={e => setForm(f=>({...f,full_name:e.target.value}))}
                  placeholder="Іван Петренко" />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Контакт (телефон/TG)</label>
                <input className="kc-input" value={form.contact}
                  onChange={e => setForm(f=>({...f,contact:e.target.value}))}
                  placeholder="+48 xxx xxx xxx" />
              </div>
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">№ справи (Sygnatura akt)</label>
                <input className="kc-input" value={form.case_number}
                  onChange={e => setForm(f=>({...f,case_number:e.target.value}))}
                  placeholder="Km 1234/26" />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Виконавець (Komornik)</label>
                <input className="kc-input" value={form.executor_name}
                  onChange={e => setForm(f=>({...f,executor_name:e.target.value}))}
                  placeholder="Jan Kowalski" />
              </div>
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Сума боргу (PLN)</label>
                <input className="kc-input" type="number" step="0.01" value={form.debt_amount}
                  onChange={e => setForm(f=>({...f,debt_amount:e.target.value}))}
                  placeholder="5000.00" />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Кінцевий дедлайн</label>
                <input className="kc-input" type="date" value={form.deadline_date}
                  onChange={e => setForm(f=>({...f,deadline_date:e.target.value}))} />
              </div>
            </div>

            <div className="kc-field" style={{ marginBottom:16 }}>
              <label className="kc-label">Примітки</label>
              <textarea className="kc-textarea" rows={3} value={form.notes}
                onChange={e => setForm(f=>({...f,notes:e.target.value}))}
                placeholder="Контекст справи, особливості..." />
            </div>

            <div className="kc-row" style={{ justifyContent:"flex-end", gap:8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" disabled={busy==="create"} onClick={createCase}>
                {busy==="create" ? "Створення..." : "Створити справу"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      <ImportWizard 
        entityType="enforcement_cases"
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={load}
      />
    </div>
  );
}
