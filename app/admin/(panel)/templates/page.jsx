"use client";
/* /admin/templates — база шаблонiв повiдомлень KompasCRM.
   Пiдтримує перегляд, редагування, створення та видалення шаблонiв.
   Категорiї: payment | qualification | checklist | objection | reminder | other */
import React, { useEffect, useState, useCallback } from "react";
import { Icon, Spinner } from "@/components/admin/ui";

const CATEGORIES = [
  { value: "",              label: "Всi" },
  { value: "payment",      label: "Оплата" },
  { value: "qualification",label: "Квалiфiкацiя" },
  { value: "checklist",    label: "Чеклiсти" },
  { value: "objection",    label: "Заперечення" },
  { value: "reminder",     label: "Нагадування" },
  { value: "other",        label: "Iнше" },
];

const CAT_COLOR = {
  payment:      "#7cbf8e",
  qualification:"#6fa3d4",
  checklist:    "#d99e54",
  objection:    "#d96c6c",
  reminder:     "#9b8ecf",
  other:        "#8a96a3",
};

const EMPTY = { slug:"", category:"payment", title:"", body:"", auto_send:false, sort_order:0 };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(null);
  const [cat, setCat]             = useState("");
  const [editing, setEditing]     = useState(null);   // null | EMPTY | template object
  const [busy, setBusy]           = useState(false);
  const [toast, setToast]         = useState("");
  const [copy, setCopy]           = useState("");      // slug що щойно скопiйовано
  const [search, setSearch]       = useState("");
  const [confirm, setConfirm]     = useState(null);   // id для пiдтвердження видалення

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(() => {
    fetch("/api/admin/templates")
      .then(r => r.json())
      .then(d => setTemplates(d.templates || []))
      .catch(() => flash("Помилка завантаження"));
  }, []);

  useEffect(load, [load]);

  const filtered = (templates || []).filter(t =>
    (cat === "" || t.category === cat) &&
    (search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.body.toLowerCase().includes(search.toLowerCase()))
  );

  const copyText = (t) => {
    navigator.clipboard?.writeText(t.body).then(() => {
      setCopy(t.slug);
      setTimeout(() => setCopy(""), 1800);
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title || !editing.body) {
      flash("Заповнiть slug, назву та текст");
      return;
    }
    setBusy(true);
    try {
      const method = editing.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/templates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const d = await res.json();
      if (d.error) { flash("Помилка: " + d.error); return; }
      flash(editing.id ? "Збережено" : "Шаблон створено");
      setEditing(null);
      load();
    } catch { flash("Мережа недоступна"); }
    finally { setBusy(false); }
  };

  const del = async (id) => {
    setBusy(true);
    try {
      await fetch("/api/admin/templates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      flash("Видалено");
      setConfirm(null);
      load();
    } catch { flash("Помилка видалення"); }
    finally { setBusy(false); }
  };

  const patchEdit = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  if (!templates) return <Spinner />;

  return (
    <div>
      {/* Toast */}
      {toast && <div className="kc-note" style={{ marginBottom:12 }}>{toast}</div>}

      {/* Заголовок + кнопка */}
      <div className="kc-row" style={{ justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:17 }}>Шаблони повiдомлень</div>
          <div style={{ color:"#8a96a3", fontSize:12, marginTop:2 }}>
            {templates.length} шаблонiв · натиснiть <b>/</b> у картцi лiда для швидкої вставки
          </div>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          <Icon name="plus" size={14} /> Новий шаблон
        </button>
      </div>

      {/* Пошук + фiльтр категорiй */}
      <div className="kc-row" style={{ gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <input
          className="kc-input"
          style={{ maxWidth:240 }}
          placeholder="Пошук..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="kc-row" style={{ gap:4, flexWrap:"wrap" }}>
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              style={{
                padding:"4px 12px", borderRadius:20, fontSize:12, cursor:"pointer",
                border: cat===c.value ? "1.5px solid #d99e54" : "1.5px solid #e2e6ea",
                background: cat===c.value ? "#fff8ed" : "transparent",
                fontWeight: cat===c.value ? 600 : 400,
                color: cat===c.value ? "#d99e54" : "#5a6470",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Список шаблонiв */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#8a96a3" }}>
          Шаблони не знайдено
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(t => (
            <div key={t.id} className="kc-card" style={{ padding:"14px 18px" }}>
              <div className="kc-row" style={{ justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                <div className="kc-row" style={{ gap:10, flex:1, minWidth:0 }}>
                  {/* Кольорова смужка категорiї */}
                  <div style={{
                    width:4, borderRadius:4, flexShrink:0, alignSelf:"stretch",
                    background: CAT_COLOR[t.category] || "#ccc",
                  }} />
                  <div style={{ minWidth:0 }}>
                    <div className="kc-row" style={{ gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:600, fontSize:14 }}>{t.title}</span>
                      {t.auto_send && (
                        <span style={{
                          fontSize:10, padding:"2px 8px", borderRadius:10,
                          background:"#e8f5e9", color:"#388e3c", fontWeight:600,
                        }}>
                          AUTO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:"#8a96a3", marginTop:2 }}>
                      <code style={{ fontSize:11, color:"#5a6470" }}>/{t.slug}</code>
                      {" · "}
                      {CATEGORIES.find(c => c.value===t.category)?.label || t.category}
                    </div>
                    <div style={{
                      marginTop:6, fontSize:13, color:"#3d4550",
                      whiteSpace:"pre-line", lineHeight:1.5,
                      maxHeight:60, overflow:"hidden",
                      WebkitLineClamp:3, display:"-webkit-box",
                      WebkitBoxOrient:"vertical",
                    }}>
                      {t.body}
                    </div>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="kc-row" style={{ gap:6, flexShrink:0 }}>
                  <button
                    className="kc-btn kc-btn-ghost"
                    style={{ fontSize:12 }}
                    onClick={() => copyText(t)}
                    title="Скопiювати текст"
                  >
                    {copy===t.slug ? "✓ Скопiйовано" : "Копiювати"}
                  </button>
                  <button
                    className="kc-btn kc-btn-ghost"
                    style={{ fontSize:12 }}
                    onClick={() => setEditing({ ...t })}
                  >
                    Редагувати
                  </button>
                  <button
                    className="kc-btn kc-btn-danger"
                    style={{ fontSize:12 }}
                    onClick={() => setConfirm(t.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модаль редагування / створення */}
      {editing && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:200,
        }}
          onClick={e => { if (e.target===e.currentTarget) setEditing(null); }}
        >
          <div className="kc-card" style={{
            width:"100%", maxWidth:560, maxHeight:"90vh",
            overflow:"auto", margin:16,
          }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>
              {editing.id ? "Редагувати шаблон" : "Новий шаблон"}
            </div>

            <div className="kc-row" style={{ gap:10, marginBottom:10 }}>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Slug (команда /)</label>
                <input className="kc-input" value={editing.slug}
                  onChange={e => patchEdit("slug", e.target.value.toLowerCase().replace(/\s+/g,"_"))}
                  placeholder="payment_received" />
              </div>
              <div className="kc-field" style={{ flex:1 }}>
                <label className="kc-label">Категорiя</label>
                <select className="kc-input" value={editing.category}
                  onChange={e => patchEdit("category", e.target.value)}>
                  {CATEGORIES.filter(c=>c.value).map(c=>(
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="kc-field" style={{ marginBottom:10 }}>
              <label className="kc-label">Назва (у меню /)</label>
              <input className="kc-input" value={editing.title}
                onChange={e => patchEdit("title", e.target.value)}
                placeholder="Оплату отримано" />
            </div>

            <div className="kc-field" style={{ marginBottom:10 }}>
              <label className="kc-label">
                Текст шаблону
                <span style={{ fontWeight:400, color:"#8a96a3", marginLeft:8, fontSize:11 }}>
                  Плейсхолдери: {"{{name}}"} {"{{service}}"} {"{{contact}}"}
                </span>
              </label>
              <textarea className="kc-textarea" rows={7} value={editing.body}
                onChange={e => patchEdit("body", e.target.value)}
                placeholder="Вiтаємо, {{name}}! ..." />
            </div>

            <div className="kc-row" style={{ gap:16, marginBottom:16 }}>
              <label className="kc-row" style={{ gap:8, cursor:"pointer" }}>
                <input type="checkbox" checked={editing.auto_send}
                  onChange={e => patchEdit("auto_send", e.target.checked)} />
                <span style={{ fontSize:13 }}>Автовiдправлення (тригер)</span>
              </label>
              <div className="kc-field" style={{ margin:0 }}>
                <label className="kc-label" style={{ fontSize:11 }}>Порядок</label>
                <input className="kc-input" type="number" value={editing.sort_order} style={{ width:70 }}
                  onChange={e => patchEdit("sort_order", Number(e.target.value))} />
              </div>
            </div>

            <div className="kc-row" style={{ justifyContent:"flex-end", gap:8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setEditing(null)}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" disabled={busy} onClick={save}>
                {busy ? "Збереження..." : editing.id ? "Зберегти" : "Створити"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Пiдтвердження видалення */}
      {confirm && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:200,
        }}>
          <div className="kc-card" style={{ maxWidth:360, margin:16, textAlign:"center" }}>
            <div style={{ fontWeight:600, marginBottom:10 }}>Видалити шаблон?</div>
            <div style={{ color:"#8a96a3", fontSize:13, marginBottom:16 }}>Це незворотна дiя.</div>
            <div className="kc-row" style={{ justifyContent:"center", gap:10 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setConfirm(null)}>Скасувати</button>
              <button className="kc-btn kc-btn-danger" disabled={busy} onClick={() => del(confirm)}>
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
