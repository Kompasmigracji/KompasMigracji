"use client";
/* /admin/cases — Воронка Понаглення (3 щаблi).
   Аналiз документiв → Понаглення подано → Пiдготовка до суду */
import React, { useEffect, useState, useCallback } from "react";
import { Icon, Spinner } from "@/components/admin/ui";

const STAGES = [
  {
    key:   "analysis",
    label: "Аналiз документiв",
    color: "#6fa3d4",
    bg:    "#eef4fb",
    desc:  "Збiр доказової бази, перевiрка Dodatek №1 та ZUS",
  },
  {
    key:   "ponaglenie",
    label: "Понаглення подано",
    color: "#d99e54",
    bg:    "#fff8ed",
    desc:  "Офiцiйна скарга до керiвника вiддiлу Уженду",
  },
  {
    key:   "court",
    label: "Пiдготовка до суду",
    color: "#d96c6c",
    bg:    "#fdf0f0",
    desc:  "Збiр архiву логiв, позовна заява до суду",
  },
];

const EMPTY_FORM = {
  full_name:"", contact:"", case_number:"",
  submission_date:"", urzad:"", deadline_date:"", notes:"",
};

export default function CasesPage() {
  const [cases, setCases]     = useState(null);
  const [form, setForm]       = useState(null);     // null | EMPTY_FORM
  const [detail, setDetail]   = useState(null);     // { case, logs } | null
  const [busy, setBusy]       = useState("");
  const [toast, setToast]     = useState("");

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/cases?status=active");
      const d = await r.json();
      setCases(d.cases || []);
    } catch { flash("Помилка завантаження"); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id) => {
    const r = await fetch(`/api/admin/cases/${id}`);
    const d = await r.json();
    setDetail(d);
  };

  const byStage = (stage) => (cases || []).filter(c => c.stage === stage);

  const moveStage = async (c, stage) => {
    setBusy(c.id);
    try {
      await fetch(`/api/admin/cases/${c.id}`, {
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

  const toggleDoc = async (c, field) => {
    setBusy(c.id + field);
    await fetch(`/api/admin/cases/${c.id}`, {
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ [field]: !c[field] }),
    });
    load();
    setBusy("");
  };

  const closeCase = async (id) => {
    if (!confirm("Закрити справу?")) return;
    await fetch(`/api/admin/cases/${id}`, { method:"DELETE" });
    flash("Справу закрито");
    setDetail(null);
    load();
  };

  const createCase = async () => {
    if (!form.full_name) { flash("Введiть ПIБ клiєнта"); return; }
    setBusy("create");
    try {
      const r = await fetch("/api/admin/cases", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (d.error) { flash(d.error); return; }
      flash("Справу створено");
      setForm(null);
      load();
    } catch { flash("Помилка"); }
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

      {/* Заголовок */}
      <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:17 }}>Воронка Понаглення</div>
          <div style={{ color:"#8a96a3", fontSize:12, marginTop:2 }}>
            {cases.length} активних справ
          </div>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setForm({ ...EMPTY_FORM })}>
          <Icon name="plus" size={14} /> Нова справа
        </button>
      </div>

      {/* Канбан */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, alignItems:"start" }}>
        {STAGES.map((stage, si) => {
          const stageCases = byStage(stage.key);
          return (
            <div key={stage.key} style={{
              background: stage.bg,
              borderRadius:12, padding:14,
              border:`1.5px solid ${stage.color}33`,
            }}>
              {/* Заголовок колонки */}
              <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color: stage.color }}>{stage.label}</div>
                  <div style={{ fontSize:11, color:"#8a96a3", marginTop:2 }}>{stage.desc}</div>
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

              {/* Картки */}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {stageCases.length === 0 && (
                  <div style={{ textAlign:"center", padding:"20px 0", color:"#c0c8d0", fontSize:12 }}>
                    Немає справ
                  </div>
                )}
                {stageCases.map(c => (
                  <div key={c.id}
                    className="kc-card"
                    style={{ padding:"12px 14px", cursor:"pointer", transition:"box-shadow .15s" }}
                    onClick={() => { loadDetail(c.id); setDetail({ case:c, logs:[] }); }}
                  >
                    {/* Iм'я + днi */}
                    <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>{c.full_name}</div>
                      {c.days_left !== null && (
                        <div style={{
                          fontSize:11, fontWeight:700, padding:"2px 7px",
                          borderRadius:10, background: daysColor(c.days_left) + "22",
                          color: daysColor(c.days_left),
                        }}>
                          {c.days_left < 0 ? `+${Math.abs(c.days_left)}д прострочено`
                           : c.days_left === 0 ? "Сьогоднi!"
                           : `${c.days_left}д`}
                        </div>
                      )}
                    </div>

                    {/* Деталi */}
                    {c.case_number && (
                      <div style={{ fontSize:11, color:"#8a96a3" }}>№ {c.case_number}</div>
                    )}
                    {c.contact && (
                      <div style={{ fontSize:11, color:"#5a6470" }}>{c.contact}</div>
                    )}

                    {/* Документи (тiльки для analysis) */}
                    {stage.key === "analysis" && (
                      <div className="kc-row" style={{ gap:8, marginTop:8 }}>
                        <button
                          style={{
                            fontSize:10, padding:"2px 8px", borderRadius:8, cursor:"pointer",
                            border:"1.5px solid " + (c.has_dodatek_1 ? "#7cbf8e" : "#e2e6ea"),
                            background: c.has_dodatek_1 ? "#e8f5e9" : "transparent",
                            color: c.has_dodatek_1 ? "#388e3c" : "#8a96a3",
                          }}
                          onClick={e => { e.stopPropagation(); toggleDoc(c,"has_dodatek_1"); }}
                        >
                          {c.has_dodatek_1 ? "✓" : "✗"} Dodatek №1
                        </button>
                        <button
                          style={{
                            fontSize:10, padding:"2px 8px", borderRadius:8, cursor:"pointer",
                            border:"1.5px solid " + (c.has_zus_cert ? "#7cbf8e" : "#e2e6ea"),
                            background: c.has_zus_cert ? "#e8f5e9" : "transparent",
                            color: c.has_zus_cert ? "#388e3c" : "#8a96a3",
                          }}
                          onClick={e => { e.stopPropagation(); toggleDoc(c,"has_zus_cert"); }}
                        >
                          {c.has_zus_cert ? "✓" : "✗"} ZUS
                        </button>
                      </div>
                    )}

                    {/* Стрiлки переходу */}
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
                          Далi →
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

      {/* Бiчна панель деталей справи */}
      {detail && (
        <div style={{
          position:"fixed", top:0, right:0, bottom:0, width:400,
          background:"#fff", boxShadow:"-4px 0 24px rgba(0,0,0,0.12)",
          overflowY:"auto", zIndex:150, padding:24,
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
                  ["№ справи",  detail.case.case_number],
                  ["Urząd",     detail.case.urzad],
                  ["Подача",    detail.case.submission_date
                    ? new Date(detail.case.submission_date).toLocaleDateString("uk-UA")
                    : null],
                  ["Дедлайн",  detail.case.deadline_date
                    ? new Date(detail.case.deadline_date).toLocaleDateString("uk-UA")
                    : null],
                  ["Лишилось", detail.case.days_left !== null
                    ? detail.case.days_left + " днiв"
                    : null],
                ].map(([label, val]) => val ? (
                  <div key={label} style={{ fontSize:12 }}>
                    <div style={{ color:"#8a96a3" }}>{label}</div>
                    <div style={{ fontWeight:500 }}>{val}</div>
                  </div>
                ) : null)}
              </div>

              {detail.case.notes && (
                <div style={{ fontSize:13, color:"#5a6470", marginBottom:16,
                  background:"#f8f9fa", borderRadius:8, padding:10 }}>
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

          {/* Лог подiй */}
          <div style={{ fontWeight:600, fontSize:13, marginBottom:10 }}>Iсторiя подiй</div>
          {(detail.logs || []).length === 0 ? (
            <div style={{ color:"#c0c8d0", fontSize:12 }}>Поки немає подiй</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {detail.logs.map(l => (
                <div key={l.id} style={{
                  fontSize:12, padding:"8px 12px",
                  background:"#f8f9fa", borderRadius:8,
                  borderLeft:"3px solid #d99e54",
                }}>
                  <div style={{ fontWeight:500 }}>{l.event}</div>
                  <div style={{ color:"#8a96a3", marginTop:2 }}>
                    {new Date(l.created_at).toLocaleString("uk-UA")} · {l.actor}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Форма нової справи */}
      {form && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:200,
          overflowY:"auto", padding:"32px 16px",
        }}
          onClick={e => { if (e.target===e.currentTarget) setForm(null); }}
        >
          <div className="kc-card" style={{ width:"100%", maxWidth:480, flexShrink:0 }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Нова справа Понаглення</div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">ПIБ клiєнта *</label>
                <input className="kc-input" value={form.full_name}
                  onChange={e => setForm(f=>({...f,full_name:e.target.value}))}
                  placeholder="Iван Петренко" />
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
                <label className="kc-label">№ справи в Уженду</label>
                <input className="kc-input" value={form.case_number}
                  onChange={e => setForm(f=>({...f,case_number:e.target.value}))}
                  placeholder="WU-2024-XXXXXX" />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Вiддiл Уженду</label>
                <input className="kc-input" value={form.urzad}
                  onChange={e => setForm(f=>({...f,urzad:e.target.value}))}
                  placeholder="Mazowiecki UW" />
              </div>
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Дата подачi заяви</label>
                <input className="kc-input" type="date" value={form.submission_date}
                  onChange={e => setForm(f=>({...f,submission_date:e.target.value}))} />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Кiнцевий дедлайн</label>
                <input className="kc-input" type="date" value={form.deadline_date}
                  onChange={e => setForm(f=>({...f,deadline_date:e.target.value}))} />
              </div>
            </div>

            <div className="kc-field" style={{ marginBottom:16 }}>
              <label className="kc-label">Примiтки</label>
              <textarea className="kc-textarea" rows={3} value={form.notes}
                onChange={e => setForm(f=>({...f,notes:e.target.value}))}
                placeholder="Контекст справи, особливостi..." />
            </div>

            <div className="kc-row" style={{ justifyContent:"flex-end", gap:8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" disabled={busy==="create"} onClick={createCase}>
                {busy==="create" ? "Створення..." : "Створити справу"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
