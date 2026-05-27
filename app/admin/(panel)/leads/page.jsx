"use client";
/* /admin/leads — лиды воронки + корзина (soft-delete).
   Нормальный вид: фильтр по статусу, поиск, кнопка удаления в корзину.
   Корзина: восстановление и окончательное удаление (только admin).
   MessageComposer: "/" quick-insert шаблонів із відправкою в Telegram. */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Spinner, Empty, Icon } from "@/components/admin/ui";

const FILTERS = [
  ["", "Всi"],
  ["new", "Новi"],
  ["contacted", "Контакт"],
  ["closed", "Закрито"],
  ["dropped", "Вiдмова"],
];

const SOURCE_LABEL = {
  bot:       "Telegram",
  site:      "Сайт",
  main:      "Сайт",
  pricing:   "Прайс",
  facebook:  "Facebook",
  instagram: "Instagram",
  other:     "Iнше",
};

const SOURCE_COLOR = {
  bot:       "#5f9bd5",
  site:      "#7cbf8e",
  main:      "#7cbf8e",
  pricing:   "#d99e54",
  facebook:  "#7b8fd4",
  instagram: "#d47bb0",
};

const SENT_TO = {
  bot:       null,
  site:      "+48 729 271 848",
  main:      "+48 729 271 848",
  pricing:   "+48 729 271 848",
  facebook:  "+48 729 271 848",
  instagram: "+48 729 271 848",
  other:     "+48 729 271 848",
};

function fmtDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function IconBtn({ icon, title, color = "#828c9b", hoverColor, onClick, size = 15 }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        padding: "4px 5px", borderRadius: 6,
        color: hover && hoverColor ? hoverColor : color,
        transition: "color 0.15s, background 0.15s",
        display: "inline-flex", alignItems: "center",
      }}
    >
      <Icon name={icon} size={size} color={hover && hoverColor ? hoverColor : color} />
    </button>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#1c2433", borderRadius: 14, padding: "28px 32px",
        maxWidth: 360, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        border: "1px solid #2d3748",
      }}>
        <div style={{ fontSize: 15, color: "#e2e8f0", marginBottom: 20, lineHeight: 1.5 }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel}
            style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #3d4f63", background: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
            Скасувати
          </button>
          <button onClick={onConfirm}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Видалити назавжди
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MessageComposer — модальний редактор повiдомлення з / quick-insert
   ══════════════════════════════════════════════════════════════════ */
function MessageComposer({ lead, onClose }) {
  const [text, setText]           = useState("");
  const [templates, setTemplates] = useState(null);
  const [query, setQuery]         = useState("");       // текст пiсля /
  const [showMenu, setShowMenu]   = useState(false);
  const [menuIdx, setMenuIdx]     = useState(0);
  const [sending, setSending]     = useState(false);
  const [toast, setToast]         = useState("");
  const [sent, setSent]           = useState(false);
  const taRef = useRef(null);

  /* Завантажити шаблони */
  useEffect(() => {
    fetch("/api/admin/templates")
      .then(r => r.json())
      .then(d => setTemplates(d.templates || []));
  }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* Фiльтрованi шаблони для дроп-дауну */
  const filtered = (templates || []).filter(t =>
    query === "" ||
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.slug.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  /* Рендер шаблону з пiдставленими змiнними */
  function applyTemplate(tpl) {
    const vars = {
      name:    lead.name    || "клієнте",
      service: lead.service || "",
      contact: lead.contact || "+48 729 271 848",
    };
    let body = tpl.body;
    body = body.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] !== undefined ? vars[k] : `{{${k}}}`);

    // Замiнити все пiсля останнього "/" на шаблон
    const slashIdx = text.lastIndexOf("/");
    const before   = slashIdx >= 0 ? text.slice(0, slashIdx) : text;
    setText(before + body);
    setShowMenu(false);
    setQuery("");
    setTimeout(() => taRef.current?.focus(), 0);
  }

  /* Обробка клавiатури у textarea */
  function handleKeyDown(e) {
    if (showMenu) {
      if (e.key === "ArrowDown") { e.preventDefault(); setMenuIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setMenuIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); if (filtered[menuIdx]) applyTemplate(filtered[menuIdx]); }
      if (e.key === "Escape")    { setShowMenu(false); setQuery(""); }
    }
  }

  function handleChange(e) {
    const val = e.target.value;
    setText(val);

    // Перевiрити, чи є активний "/"
    const cursor = e.target.selectionStart;
    const before = val.slice(0, cursor);
    const match  = before.match(/\/(\w*)$/);
    if (match) {
      setQuery(match[1]);
      setShowMenu(true);
      setMenuIdx(0);
    } else {
      setShowMenu(false);
      setQuery("");
    }
  }

  async function doSend() {
    if (!text.trim()) { flash("Введiть текст повiдомлення"); return; }
    if (!lead.chat_id) { flash("Цей лiд не пiдключений до Telegram"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/admin/telegram-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, text }),
      });
      const d = await res.json();
      if (d.error) { flash("Помилка: " + d.error); return; }
      setSent(true);
      flash("Повiдомлення вiдправлено!");
      setTimeout(() => onClose(), 1500);
    } catch { flash("Мережа недоступна"); }
    finally { setSending(false); }
  }

  function doCopy() {
    navigator.clipboard?.writeText(text).then(() => flash("Скопiйовано!"));
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="kc-card" style={{
        width: "100%", maxWidth: 520, margin: 16,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {/* Заголовок */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              ✈️ Telegram: {lead.name || "Без iменi"}
            </div>
            {lead.username && (
              <div style={{ fontSize: 12, color: "#5f9bd5" }}>@{lead.username}</div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8a96a3" }}>✕</button>
        </div>

        {toast && (
          <div className="kc-note" style={{
            background: sent ? "rgba(34,197,94,0.12)" : undefined,
            color: sent ? "#22c55e" : undefined,
          }}>{toast}</div>
        )}

        {/* Textarea з / quick-insert */}
        <div style={{ position: "relative" }}>
          <textarea
            ref={taRef}
            className="kc-textarea"
            rows={6}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={"Введiть текст або напишiть / для вибору шаблону…"}
            style={{ width: "100%", boxSizing: "border-box" }}
          />

          {/* Дроп-даун шаблонiв */}
          {showMenu && filtered.length > 0 && (
            <div style={{
              position: "absolute", bottom: "calc(100% + 4px)", left: 0, right: 0,
              background: "#1c2433", border: "1px solid #2d3748",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)", zIndex: 10,
            }}>
              {templates === null && (
                <div style={{ padding: "10px 14px", color: "#8a96a3", fontSize: 13 }}>Завантаження…</div>
              )}
              {filtered.map((t, i) => (
                <div
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  style={{
                    padding: "9px 14px", cursor: "pointer", fontSize: 13,
                    background: i === menuIdx ? "rgba(217,158,84,0.15)" : "transparent",
                    borderBottom: "1px solid #2d3748",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                  onMouseEnter={() => setMenuIdx(i)}
                >
                  <span>
                    <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{t.title}</span>
                    <code style={{ marginLeft: 8, fontSize: 11, color: "#5a6470" }}>/{t.slug}</code>
                  </span>
                  <span style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 10,
                    background: "#2d3748", color: "#8a96a3",
                  }}>{t.category}</span>
                </div>
              ))}
              <div style={{ padding: "6px 14px", fontSize: 11, color: "#5a6470" }}>
                ↑↓ навiгацiя · Enter вставити · Esc закрити
              </div>
            </div>
          )}
        </div>

        {/* Пiдказка */}
        <div style={{ fontSize: 11, color: "#5a6470" }}>
          Введiть <code>/</code> для вибору шаблону.
          Плейсхолдери <code>{"{{name}}"}</code> <code>{"{{service}}"}</code> замiняються автоматично.
        </div>

        {/* Дiї */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="kc-btn kc-btn-ghost" onClick={doCopy} disabled={!text.trim()}>
            Копiювати
          </button>
          {lead.chat_id ? (
            <button className="kc-btn kc-btn-primary" onClick={doSend} disabled={sending || !text.trim()}>
              {sending ? "Вiдправка…" : "✈️ Надiслати в Telegram"}
            </button>
          ) : (
            <button className="kc-btn kc-btn-ghost" disabled title="Немає Telegram chat_id">
              Telegram недоступний
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LeadsPage
   ══════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════
   PaymentLinkModal — генерацiя посилання на оплату Przelewy24
   ══════════════════════════════════════════════════════════════════ */
function PaymentLinkModal({ lead, onClose }) {
  const [amountPln,  setAmountPln]  = useState("");
  const [description, setDescription] = useState(lead.service || "");
  const [email,      setEmail]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error,      setError]      = useState("");
  const [copied,     setCopied]     = useState(false);

  async function generate() {
    const amt = parseFloat(amountPln);
    if (!amountPln || isNaN(amt) || amt <= 0) {
      setError("Введiть суму бiльше 0");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_pln:  amt,
          description: description.trim() || undefined,
          email:       email.trim()       || undefined,
        }),
      });
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setPaymentUrl(d.paymentUrl);
    } catch {
      setError("Мережа недоступна");
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    navigator.clipboard?.writeText(paymentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="kc-card" style={{
        width: "100%", maxWidth: 500, margin: 16,
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {/* Заголовок */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              💳 Оплата: {lead.name || "Без iменi"}
            </div>
            {lead.service && (
              <div style={{ fontSize: 12, color: "#a78bfa", marginTop: 2 }}>{lead.service}</div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8a96a3" }}>✕</button>
        </div>

        {!paymentUrl ? (
          <>
            {/* Форма */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: "#8a96a3", display: "block", marginBottom: 4 }}>
                  Сума (PLN) *
                </label>
                <input
                  className="kc-input"
                  type="number" min="1" step="0.01"
                  value={amountPln}
                  onChange={e => setAmountPln(e.target.value)}
                  placeholder="100.00"
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8a96a3", display: "block", marginBottom: 4 }}>
                  Опис послуги
                </label>
                <input
                  className="kc-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Консультацiя з мiграцiйного права"
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8a96a3", display: "block", marginBottom: 4 }}>
                  Email клiєнта <span style={{ color: "#5a6470" }}>(необов'язково)</span>
                </label>
                <input
                  className="kc-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>

            {error && (
              <div className="kc-note" style={{ color: "#f87171", background: "rgba(248,113,113,0.1)" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="kc-btn kc-btn-ghost" onClick={onClose}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" onClick={generate} disabled={loading || !amountPln}>
                {loading ? "Генерацiя…" : "💳 Генерувати посилання"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Результат */}
            <div className="kc-note" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.25)" }}>
              ✅ Посилання готове! Надiшлiть клiєнту — воно дiйсне 24 год.
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#8a96a3", display: "block", marginBottom: 6 }}>
                Посилання Przelewy24:
              </label>
              <div style={{
                background: "#0f1623", border: "1px solid #2d3748",
                borderRadius: 8, padding: "10px 12px",
                fontFamily: "monospace", fontSize: 12,
                wordBreak: "break-all", color: "#a78bfa", lineHeight: 1.5,
              }}>
                {paymentUrl}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button className="kc-btn kc-btn-ghost" onClick={copyUrl}>
                {copied ? "✅ Скопiйовано!" : "Копiювати"}
              </button>
              <a
                href={paymentUrl} target="_blank" rel="noreferrer"
                className="kc-btn kc-btn-primary"
                style={{ textDecoration: "none" }}
              >
                Вiдкрити ↗
              </a>
              <button className="kc-btn kc-btn-ghost" onClick={onClose}>Закрити</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LeadsPage
   ══════════════════════════════════════════════════════════════════ */
export default function LeadsPage() {
  const [leads, setLeads]       = useState(null);
  const [filter, setFilter]     = useState("");
  const [search, setSearch]     = useState("");
  const [isTrash, setIsTrash]   = useState(false);
  const [trashCount, setTrashCount] = useState(0);
  const [confirm, setConfirm]   = useState(null);
  const [composer, setComposer] = useState(null); // лiд для MessageComposer
  const [paymentModal, setPaymentModal] = useState(null); // лiд для PaymentLinkModal

  const loadLeads = useCallback(async (st) => {
    setLeads(null);
    const res = await fetch("/api/admin/leads?status=" + encodeURIComponent(st));
    const d = await res.json();
    setLeads(d.leads || []);
  }, []);

  const loadTrash = useCallback(async () => {
    setLeads(null);
    const res = await fetch("/api/admin/leads/trash");
    const d = await res.json();
    setLeads(d.leads || []);
    setTrashCount((d.leads || []).length);
  }, []);

  const refreshTrashCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads/trash");
      const d = await res.json();
      setTrashCount((d.leads || []).length);
    } catch {}
  }, []);

  useEffect(() => {
    if (isTrash) {
      loadTrash();
    } else {
      loadLeads(filter);
      refreshTrashCount();
    }
  }, [isTrash, filter, loadLeads, loadTrash, refreshTrashCount]);

  const setStatus = async (id, status) => {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const moveToTrash = async (id) => {
    await fetch("/api/admin/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setTrashCount((c) => c + 1);
  };

  const restore = async (id) => {
    await fetch("/api/admin/leads/trash", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setTrashCount((c) => Math.max(0, c - 1));
  };

  const deletePermanently = async (id) => {
    await fetch("/api/admin/leads/trash", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setTrashCount((c) => Math.max(0, c - 1));
    setConfirm(null);
  };

  const visible = leads
    ? (!isTrash && search.trim())
      ? leads.filter((l) => {
          const q2 = search.toLowerCase();
          return (
            (l.name    || "").toLowerCase().includes(q2) ||
            (l.contact || "").toLowerCase().includes(q2) ||
            (l.country || "").toLowerCase().includes(q2) ||
            (l.service || "").toLowerCase().includes(q2) ||
            (l.message || "").toLowerCase().includes(q2)
          );
        })
      : leads
    : null;

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message="Видалити лiд назавжди? Цю дiю неможливо скасувати."
          onConfirm={() => deletePermanently(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {composer && (
        <MessageComposer lead={composer} onClose={() => setComposer(null)} />
      )}

      {paymentModal && (
        <PaymentLinkModal lead={paymentModal} onClose={() => setPaymentModal(null)} />
      )}

      {/* ── Панель фильтров ── */}
      <div className="kc-row" style={{ gap: 7, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {!isTrash && FILTERS.map(([v, l]) => (
          <button key={v}
            className={"kc-btn " + (filter === v ? "kc-btn-primary" : "kc-btn-ghost")}
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => setFilter(v)}>{l}</button>
        ))}

        {isTrash && (
          <button
            className="kc-btn kc-btn-ghost"
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => setIsTrash(false)}>
            ← Назад до лiдiв
          </button>
        )}

        {!isTrash && (
          <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: 10, color: "#5a6470" }}>
              <Icon name="search" size={16} />
            </span>
            <input className="kc-input" style={{ paddingLeft: 34 }}
              placeholder="Пошук по iменi, телефону, меседжу…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        )}

        <button
          onClick={() => { setIsTrash((v) => !v); setSearch(""); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: isTrash ? "#dc2626" : "rgba(220,38,38,0.12)",
            color: isTrash ? "#fff" : "#dc2626",
            fontSize: 13, fontWeight: 600, transition: "background 0.15s",
          }}>
          <Icon name="trash" size={14} color={isTrash ? "#fff" : "#dc2626"} />
          Кошик
          {trashCount > 0 && (
            <span style={{
              background: isTrash ? "rgba(255,255,255,0.25)" : "#dc2626",
              color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: 11, fontWeight: 700,
            }}>{trashCount}</span>
          )}
        </button>
      </div>

      {isTrash && (
        <div style={{
          background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: 10, padding: "10px 16px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10, color: "#dc2626", fontSize: 13,
        }}>
          <Icon name="trash" size={15} color="#dc2626" />
          <span>Кошик — видаленi лiди. <strong>Вiдновити</strong> або <strong>видалити назавжди</strong> (тiльки адмiн).</span>
        </div>
      )}

      {/* ── Таблица ── */}
      {visible === null ? <Spinner /> : visible.length === 0 ? (
        <Empty text={isTrash ? "Кошик порожнiй" : "Лiдiв немає"} />
      ) : (
        <div className="kc-table-wrap">
          <table className="kc-table">
            <thead>
              <tr>
                <th>Джерело</th>
                <th>{"Iм'я"} / username</th>
                <th>Контакт</th>
                <th>Повiдомлення</th>
                <th>{isTrash ? "Видалено" : "Дата"}</th>
                <th>{isTrash ? "Дiї" : "Статус"}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} style={{ opacity: isTrash ? 0.85 : 1 }}>
                  {/* Джерело */}
                  <td>
                    <span style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 99,
                      fontSize: 11, fontWeight: 600,
                      background: (SOURCE_COLOR[l.source] || "#5a6470") + "22",
                      color: SOURCE_COLOR[l.source] || "#5a6470",
                    }}>
                      {SOURCE_LABEL[l.source] || l.source}
                    </span>
                    {SENT_TO[l.source] && (
                      <div style={{ fontSize: 10, color: "#25d366", marginTop: 3, whiteSpace: "nowrap" }}>
                        → WA {SENT_TO[l.source]}
                      </div>
                    )}
                    {l.country && (
                      <div style={{ color: "#5a6470", fontSize: 11, marginTop: 2 }}>{l.country}</div>
                    )}
                  </td>

                  {/* Имя */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 500 }}>{l.name || "—"}</span>
                      {/* Кнопка Telegram для bot-лiдiв */}
                      {l.chat_id && !isTrash && (
                        <button
                          onClick={() => setComposer(l)}
                          title="Надiслати повiдомлення в Telegram"
                          style={{
                            background: "rgba(95,155,213,0.15)", border: "none",
                            borderRadius: 6, padding: "2px 6px", cursor: "pointer",
                            fontSize: 12, color: "#5f9bd5", fontWeight: 600,
                            lineHeight: 1.4,
                          }}>
                          ✈️
                        </button>
                      )}
                      {/* Кнопка оплати P24 */}
                      {!isTrash && (
                        <button
                          onClick={() => setPaymentModal(l)}
                          title="Генерувати посилання на оплату Przelewy24"
                          style={{
                            background: "rgba(167,139,250,0.15)", border: "none",
                            borderRadius: 6, padding: "2px 6px", cursor: "pointer",
                            fontSize: 12, color: "#a78bfa", fontWeight: 600,
                            lineHeight: 1.4,
                          }}>
                          💳
                        </button>
                      )}
                    </div>
                    {l.username && (
                      <a href={"https://t.me/" + l.username} target="_blank" rel="noreferrer"
                        style={{ color: "#5f9bd5", fontSize: 11, textDecoration: "none" }}>
                        @{l.username}
                      </a>
                    )}
                  </td>

                  {/* Контакт */}
                  <td className="kc-mono" style={{ fontSize: 12 }}>
                    {l.contact ? (
                      l.source !== "bot" ? (
                        <a
                          href={"https://wa.me/" + l.contact.replace(/\D/g, "")}
                          target="_blank" rel="noreferrer"
                          title="Написати в WhatsApp"
                          style={{ color: "#25d366", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          {l.contact}
                        </a>
                      ) : (
                        <span style={{ color: "#828c9b" }}>{l.contact}</span>
                      )
                    ) : "—"}
                  </td>

                  {/* Сообщение */}
                  <td style={{ color: "#828c9b", maxWidth: 240 }}>
                    {l.service && (
                      <div style={{ color: "#a78bfa", fontSize: 11, marginBottom: 2 }}>{l.service}</div>
                    )}
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                      {l.message || "—"}
                    </div>
                  </td>

                  {/* Дата */}
                  <td style={{ color: "#5a6470", fontSize: 12, whiteSpace: "nowrap" }}>
                    {isTrash ? fmtDate(l.deleted_at) : fmtDate(l.created_at)}
                  </td>

                  {/* Статус / Действия */}
                  <td>
                    {isTrash ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <button
                          onClick={() => restore(l.id)}
                          title="Вiдновити"
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "5px 10px", borderRadius: 7, border: "none",
                            background: "rgba(34,197,94,0.15)", color: "#22c55e",
                            cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}>
                          <Icon name="restore" size={13} color="#22c55e" />
                          Вiдновити
                        </button>
                        <button
                          onClick={() => setConfirm({ id: l.id })}
                          title="Видалити назавжди"
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "5px 10px", borderRadius: 7, border: "none",
                            background: "rgba(220,38,38,0.13)", color: "#dc2626",
                            cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}>
                          <Icon name="trash" size={13} color="#dc2626" />
                          Назавжди
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select className="kc-select"
                          style={{ padding: "5px 8px", fontSize: 12, minWidth: 110 }}
                          value={l.status || "new"}
                          onChange={(e) => setStatus(l.id, e.target.value)}>
                          <option value="new">Новий</option>
                          <option value="contacted">Контакт</option>
                          <option value="closed">Закрито</option>
                          <option value="dropped">Вiдмова</option>
                        </select>
                        <IconBtn
                          icon="trash"
                          title="Перемiстити в кошик"
                          color="#5a6470"
                          hoverColor="#dc2626"
                          onClick={() => moveToTrash(l.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="kc-stat-sub" style={{ marginTop: 12 }}>
        <Icon name={isTrash ? "trash" : "inbox"} size={12} />
        {" "}
        {isTrash
          ? "Кошик — " + (visible?.length ?? "…") + " лiдiв"
          : "Показано " + (visible?.length ?? "…") + " лiдiв · таблиця leads"}
      </div>
    </div>
  );
}
