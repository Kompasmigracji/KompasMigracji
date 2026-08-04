"use client";
/* /admin/work-permits — Дозволи на працю (Kanban-дошка).
   Етапи: Підготовка документів → Подано до Urzędu → На розгляді → Затверджено/Відхилено */
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon, Spinner } from "@/components/admin/ui";

const STAGES = [
  {
    key:   "preparation",
    label: "Підготовка документів",
    color: "#6fa3d4",
    bg:    "#eef4fb",
    desc:  "Збір документів клієнта та роботодавця",
  },
  {
    key:   "submitted",
    label: "Подано до Urzędu",
    color: "#d99e54",
    bg:    "#fff8ed",
    desc:  "Заявку зареєстровано у воєводському управлінні / PUP",
  },
  {
    key:   "under_review",
    label: "На розгляді",
    color: "#a855f7",
    bg:    "#faf5ff",
    desc:  "Урядовий орган розглядає заявку",
  },
  {
    key:   "approved",
    label: "Затверджено",
    color: "#7cbf8e",
    bg:    "#f0f9f2",
    desc:  "Дозвіл видано",
  },
  {
    key:   "rejected",
    label: "Відхилено",
    color: "#d96c6c",
    bg:    "#fdf0f0",
    desc:  "Відмова у видачі дозволу",
  },
];

const PERMIT_TYPES = [
  { value: "zezwolenie_typ_a",     label: "Zezwolenie typ A (найманий працівник)" },
  { value: "zezwolenie_typ_b",     label: "Zezwolenie typ B (керівництво компанією)" },
  { value: "zezwolenie_typ_c",     label: "Zezwolenie typ C (делегування до філії)" },
  { value: "zezwolenie_typ_d",     label: "Zezwolenie typ D (експорт послуг)" },
  { value: "zezwolenie_typ_e",     label: "Zezwolenie typ E (інше делегування)" },
  { value: "zezwolenie_sezonowe",  label: "Zezwolenie sezonowe typ S (сезонна робота)" },
  { value: "zezwolenie_jednolite", label: "Jednolite zezwolenie (Single Permit)" },
  { value: "oswiadczenie",         label: "Oświadczenie o powierzeniu pracy" },
];
const permitTypeLabel = (v) => PERMIT_TYPES.find(t => t.value === v)?.label || v || "—";

const EMPTY_FORM = {
  full_name:"", contact:"", permit_type:"zezwolenie_typ_a",
  employer_name:"", employer_nip:"", voivodeship_office:"",
  application_number:"", submitted_date:"", decision_deadline:"", notes:"",
};

export default function WorkPermitsPage() {
  const [permits, setPermits] = useState(null);
  const [form, setForm]       = useState(null);     // null | EMPTY_FORM
  const [detail, setDetail]   = useState(null);     // { permit, logs } | null
  const [busy, setBusy]       = useState("");
  const [toast, setToast]     = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/work-permits?status=active");
      const d = await r.json();
      setPermits(d.permits || []);
    } catch { flash("Помилка завантаження"); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id) => {
    const r = await fetch(`/api/admin/work-permits/${id}`);
    const d = await r.json();
    setDetail(d);
  };

  const byStage = (stage) => (permits || []).filter(p => p.stage === stage);

  const moveStage = async (p, stage) => {
    setBusy(p.id);
    try {
      await fetch(`/api/admin/work-permits/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      flash(`${p.full_name} → ${STAGES.find(s=>s.key===stage)?.label}`);
      load();
      if (detail?.permit?.id === p.id) loadDetail(p.id);
    } catch { flash("Помилка"); }
    finally { setBusy(""); }
  };

  const closePermit = async (id) => {
    if (!confirm("Закрити заявку? Вона зникне з активної дошки.")) return;
    await fetch(`/api/admin/work-permits/${id}`, { method:"DELETE" });
    flash("Заявку закрито");
    setDetail(null);
    load();
  };

  const createPermit = async () => {
    if (!form.full_name) { flash("Введіть ПІБ клієнта"); return; }
    if (!form.permit_type) { flash("Оберіть тип дозволу"); return; }
    setBusy("create");
    try {
      const r = await fetch("/api/admin/work-permits", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (d.error) { flash(d.error); return; }
      flash("Заявку створено");
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

  if (!permits) return <Spinner />;

  return (
    <div>
      {toast && <div className="kc-note" style={{ marginBottom:12 }}>{toast}</div>}

      {/* Header */}
      <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:16, gap: "var(--space-sm)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:17 }}>Дозволи на працю (Zezwolenia i Oświadczenia)</div>
          <div style={{ color:"var(--dim)", fontSize:12, marginTop:2 }}>
            {permits.length} активних заявок
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <button className="kc-btn kc-btn-primary" onClick={() => setForm({ ...EMPTY_FORM })}>
            <Icon name="plus" size={14} /> Нова заявка
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kc-grid" style={{ gap: 14, alignItems: "start", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {STAGES.map((stage, si) => {
          const stagePermits = byStage(stage.key);
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
                  {stagePermits.length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {stagePermits.length === 0 && (
                  <div style={{ textAlign:"center", padding:"20px 0", color:"var(--faint)", fontSize:12 }}>
                    Немає заявок
                  </div>
                )}
                {stagePermits.map(p => (
                  <div key={p.id}
                    className="kc-card"
                    style={{ padding:"12px 14px", cursor:"pointer", transition:"box-shadow .15s" }}
                    onClick={() => { loadDetail(p.id); setDetail({ permit:p, logs:[] }); }}
                  >
                    <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>{p.full_name}</div>
                      {p.days_left !== null && (
                        <div style={{
                          fontSize:11, fontWeight:700, padding:"2px 7px",
                          borderRadius:10, background: daysColor(p.days_left) + "22",
                          color: daysColor(p.days_left),
                        }}>
                          {p.days_left < 0 ? `+${Math.abs(p.days_left)}д прострочено`
                           : p.days_left === 0 ? "Сьогодні!"
                           : `${p.days_left}д`}
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize:11, color:"var(--dim)" }}>{permitTypeLabel(p.permit_type)}</div>
                    {p.employer_name && (
                      <div style={{ fontSize:11, color:"var(--dim)", marginTop:2 }}>Роботодавець: {p.employer_name}</div>
                    )}
                    {p.application_number && (
                      <div style={{ fontSize:11, color:"var(--dim)", marginTop:2 }}>№ {p.application_number}</div>
                    )}

                    <div className="kc-row" style={{ gap:4, marginTop:8, justifyContent:"flex-end" }}>
                      {si > 0 && (
                        <button
                          className="kc-btn kc-btn-ghost"
                          style={{ fontSize:10, padding:"2px 8px" }}
                          disabled={busy===p.id}
                          onClick={e => { e.stopPropagation(); moveStage(p, STAGES[si-1].key); }}
                          title={STAGES[si-1].label}
                        >
                          ← Назад
                        </button>
                      )}
                      {si < STAGES.length - 1 && (
                        <button
                          className="kc-btn kc-btn-primary"
                          style={{ fontSize:10, padding:"2px 8px" }}
                          disabled={busy===p.id}
                          onClick={e => { e.stopPropagation(); moveStage(p, STAGES[si+1].key); }}
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

      {/* Detail Sidebar */}
      {mounted && detail && createPortal(
        <div style={{
          position:"fixed", top:0, right:0, bottom:0, width:"100%", maxWidth:400,
          background:"var(--panel)", borderLeft:"1px solid var(--border)",
          boxShadow:"var(--shadow-lg)", overflowY:"auto", zIndex:150, padding:24,
        }}>
          <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:16 }}>{detail.permit?.full_name}</div>
            <button className="kc-btn kc-btn-ghost" onClick={() => setDetail(null)}>✕</button>
          </div>

          {detail.permit && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  ["Контакт",          detail.permit.contact],
                  ["Тип дозволу",      permitTypeLabel(detail.permit.permit_type)],
                  ["Роботодавець",     detail.permit.employer_name],
                  ["NIP роботодавця",  detail.permit.employer_nip],
                  ["Урядовий орган",   detail.permit.voivodeship_office],
                  ["№ заявки",         detail.permit.application_number],
                  ["Подано",  detail.permit.submitted_date
                    ? new Date(detail.permit.submitted_date).toLocaleDateString("uk-UA")
                    : null],
                  ["Дедлайн рішення",  detail.permit.decision_deadline
                    ? new Date(detail.permit.decision_deadline).toLocaleDateString("uk-UA")
                    : null],
                  ["Залишилось дн.", detail.permit.days_left !== null
                    ? detail.permit.days_left + " днів"
                    : null],
                ].map(([label, val]) => val ? (
                  <div key={label} style={{ fontSize:12 }}>
                    <div style={{ color:"var(--dim)" }}>{label}</div>
                    <div style={{ fontWeight:500 }}>{val}</div>
                  </div>
                ) : null)}
              </div>

              {detail.permit.notes && (
                <div style={{ fontSize:13, color:"var(--faint)", marginBottom:16,
                  background:"var(--panel-2)", borderRadius:8, padding:10 }}>
                  {detail.permit.notes}
                </div>
              )}

              <div className="kc-row" style={{ gap:8, marginBottom:20 }}>
                <button className="kc-btn kc-btn-danger" style={{ fontSize:12 }}
                  onClick={() => closePermit(detail.permit.id)}>
                  Закрити заявку
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

      {/* New Permit Form Modal */}
      {mounted && form && createPortal(
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          overflowY:"auto", zIndex:200,
          padding:"32px 16px",
        }}
          onClick={e => { if (e.target===e.currentTarget) setForm(null); }}
        >
          <div className="kc-card" style={{ width:"100%", maxWidth:480, margin:"0 auto" }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Нова заявка на дозвіл</div>

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

            <div className="kc-field" style={{ marginBottom:10 }}>
              <label className="kc-label">Тип дозволу *</label>
              <select className="kc-input" value={form.permit_type}
                onChange={e => setForm(f=>({...f,permit_type:e.target.value}))}>
                {PERMIT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Роботодавець</label>
                <input className="kc-input" value={form.employer_name}
                  onChange={e => setForm(f=>({...f,employer_name:e.target.value}))}
                  placeholder="ABC Sp. z o.o." />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">NIP роботодавця</label>
                <input className="kc-input" value={form.employer_nip}
                  onChange={e => setForm(f=>({...f,employer_nip:e.target.value}))}
                  placeholder="123-456-32-18" />
              </div>
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Урядовий орган</label>
                <input className="kc-input" value={form.voivodeship_office}
                  onChange={e => setForm(f=>({...f,voivodeship_office:e.target.value}))}
                  placeholder="Mazowiecki UW" />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">№ заявки</label>
                <input className="kc-input" value={form.application_number}
                  onChange={e => setForm(f=>({...f,application_number:e.target.value}))}
                  placeholder="WUW.II/123/26" />
              </div>
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Дата подання</label>
                <input className="kc-input" type="date" value={form.submitted_date}
                  onChange={e => setForm(f=>({...f,submitted_date:e.target.value}))} />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Дедлайн рішення</label>
                <input className="kc-input" type="date" value={form.decision_deadline}
                  onChange={e => setForm(f=>({...f,decision_deadline:e.target.value}))} />
              </div>
            </div>

            <div className="kc-field" style={{ marginBottom:16 }}>
              <label className="kc-label">Примітки</label>
              <textarea className="kc-textarea" rows={3} value={form.notes}
                onChange={e => setForm(f=>({...f,notes:e.target.value}))}
                placeholder="Контекст заявки, особливості..." />
            </div>

            <div className="kc-row" style={{ justifyContent:"flex-end", gap:8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" disabled={busy==="create"} onClick={createPermit}>
                {busy==="create" ? "Створення..." : "Створити заявку"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
