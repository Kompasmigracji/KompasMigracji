"use client";
/* /admin/tasks/[id] — детальна сторінка завдання з документами і AI-асистентом. */
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Icon, Spinner } from "@/components/admin/ui";

const STAGES = [
  { key: "todo",        label: "Нові завдання", color: "#6fa3d4" },
  { key: "in_progress", label: "В роботі",      color: "#d99e54" },
  { key: "review",      label: "На перевірці",  color: "#9b7fd4" },
  { key: "done",        label: "Завершено",     color: "#5fb87a" },
];
const STAGE_MAP    = Object.fromEntries(STAGES.map(s => [s.key, s]));
const PRIORITY_UA  = { low: "Низький", normal: "Звичайний", high: "Високий", urgent: "Терміново" };
const PRIORITY_CLR = { low: "#828c9b", normal: "#6fa3d4", high: "#d99e54", urgent: "#d96c6c" };
const CATEGORY_UA  = { general: "Загальне", legal: "Юридичне", admin: "Адміністративне", research: "Дослідження" };

export default function TaskPage({ params }) {
  const [task, setTask]     = useState(null);
  const [docs, setDocs]     = useState([]);
  const [logs, setLogs]     = useState([]);
  const [workers, setWorkers] = useState([]);
  const [me, setMe]         = useState(null);
  const [loading, setLoading] = useState(true);

  /* edit */
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editErr, setEditErr]   = useState("");
  const [editBusy, setEditBusy] = useState(false);

  /* doc form */
  const [docOpen, setDocOpen]   = useState(false);
  const [docForm, setDocForm]   = useState({ name: "", url: "", notes: "" });
  const [docErr, setDocErr]     = useState("");
  const [docBusy, setDocBusy]   = useState(false);

  /* ai chat */
  const [chat, setChat]         = useState([]);
  const [aiInput, setAiInput]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr]       = useState("");
  const chatRef = useRef(null);

  const [toast, setToast] = useState("");
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    const [tr, wr, mr] = await Promise.all([
      fetch(`/api/admin/tasks/${params.id}`).then(r => r.json()),
      fetch("/api/admin/workers").then(r => r.json()),
      fetch("/api/admin/auth/me").then(r => r.json()),
    ]);
    if (tr.task) {
      setTask(tr.task);
      setDocs(tr.documents || []);
      setLogs(tr.logs      || []);
      setChat(tr.aiChat    || []);
    }
    setWorkers(wr.workers || []);
    setMe(mr.user || null);
    setLoading(false);
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, aiLoading]);

  /* ── edit ── */
  const openEdit = () => {
    setEditForm({
      title:       task.title,
      description: task.description || "",
      category:    task.category    || "general",
      priority:    task.priority    || "normal",
      stage:       task.stage       || "todo",
      assigned_to: task.assigned_to ? String(task.assigned_to) : "",
      deadline:    task.deadline    ? task.deadline.slice(0, 10) : "",
    });
    setEditErr("");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editForm.title?.trim()) return setEditErr("Вкажіть назву");
    setEditBusy(true); setEditErr("");
    const r = await fetch(`/api/admin/tasks/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        assigned_to: editForm.assigned_to ? Number(editForm.assigned_to) : null,
        deadline:    editForm.deadline || null,
      }),
    });
    const d = await r.json();
    setEditBusy(false);
    if (d.error) return setEditErr(d.error);
    flash("Збережено");
    setEditOpen(false);
    load();
  };

  const quickStage = async (stage) => {
    await fetch(`/api/admin/tasks/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    load();
  };

  const toggleStatus = async () => {
    const next = task.status === "active" ? "closed" : "active";
    await fetch(`/api/admin/tasks/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    flash(next === "closed" ? "Завдання закрито" : "Завдання відновлено");
    load();
  };

  /* ── documents ── */
  const addDoc = async () => {
    if (!docForm.name.trim()) return setDocErr("Вкажіть назву");
    if (!docForm.url.trim())  return setDocErr("Вкажіть посилання");
    setDocBusy(true); setDocErr("");
    const r = await fetch(`/api/admin/tasks/${params.id}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(docForm),
    });
    const d = await r.json();
    setDocBusy(false);
    if (d.error) return setDocErr(d.error);
    setDocForm({ name: "", url: "", notes: "" });
    setDocOpen(false);
    load();
  };

  const deleteDoc = async (docId) => {
    await fetch(`/api/admin/tasks/${params.id}/documents?doc_id=${docId}`, { method: "DELETE" });
    load();
  };

  /* ── AI chat ── */
  const sendAi = async () => {
    const msg = aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput("");
    setAiLoading(true);
    setAiErr("");
    setChat(prev => [...prev, { role: "user", content: msg }]);
    const r = await fetch(`/api/admin/tasks/${params.id}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const d = await r.json();
    setAiLoading(false);
    if (d.error) { setAiErr(d.error); return; }
    setChat(prev => [...prev, { role: "assistant", content: d.message }]);
  };

  const clearChat = async () => {
    await fetch(`/api/admin/tasks/${params.id}/ai`, { method: "DELETE" });
    setChat([]);
    flash("Чат очищено");
  };

  /* ── render ── */
  if (loading) return <Spinner />;
  if (!task)   return <div className="kc-empty">Завдання не знайдено</div>;

  const isAdmin   = me?.role === "admin";
  const isClosed  = task.status === "closed";
  const stage     = STAGE_MAP[task.stage] || STAGES[0];
  const priColor  = PRIORITY_CLR[task.priority] || "var(--dim)";

  return (
    <div>
      {toast && <div className="kc-note" style={{ marginBottom: 14 }}>{toast}</div>}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <Link href="/admin/workers" className="kc-btn kc-btn-ghost" style={{ padding: "7px 12px", flexShrink: 0, marginTop: 2 }}>
          <Icon name="back" size={14} /> Канбан
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 21, fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }}>
            {task.title}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 8, fontWeight: 600,
              background: stage.color + "22", color: stage.color,
            }}>{stage.label}</span>
            <span style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 8, fontWeight: 600,
              background: priColor + "22", color: priColor,
            }}>{PRIORITY_UA[task.priority]}</span>
            <span className="kc-badge kc-badge-dim" style={{ fontSize: 11 }}>
              {CATEGORY_UA[task.category] || task.category}
            </span>
            {isClosed && <span className="kc-badge kc-badge-red">Закрито</span>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="kc-btn" onClick={openEdit}>
            <Icon name="settings" size={14} /> Редагувати
          </button>
          {isAdmin && (
            <button
              className={`kc-btn ${isClosed ? "" : "kc-btn-danger"}`}
              onClick={toggleStatus}
              style={isClosed ? {} : { background: "transparent" }}
            >
              {isClosed ? <><Icon name="restore" size={14} /> Відновити</> : "Закрити"}
            </button>
          )}
        </div>
      </div>

      {/* ── 2-col layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18, alignItems: "start" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Details */}
          <div className="kc-card">
            <div className="kc-card-cap">Деталі завдання</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: task.description ? 18 : 0 }}>
              <InfoField label="Виконавець" value={task.assignee_name || "—"} />
              <InfoField label="Дедлайн" value={
                task.deadline
                  ? <span>
                      {new Date(task.deadline).toLocaleDateString("uk-UA")}
                      {task.days_left !== null && (
                        <span style={{
                          marginLeft: 6, fontSize: 11, fontWeight: 700,
                          color: task.days_left < 0 ? "var(--red)" : task.days_left < 14 ? "#d99e54" : "var(--green)",
                        }}>
                          {task.days_left < 0 ? `+${Math.abs(task.days_left)}д прострочено` : task.days_left === 0 ? "Сьогодні!" : `${task.days_left}д`}
                        </span>
                      )}
                    </span>
                  : "—"
              } />
              <InfoField label="Документів" value={`${docs.length}`} />
            </div>

            {task.description && (
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                <div className="kc-label" style={{ marginBottom: 6 }}>Опис</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>
                  {task.description}
                </div>
              </div>
            )}

            {/* Stage switcher */}
            <div style={{ marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div className="kc-label" style={{ marginBottom: 10 }}>Переміщення між етапами</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {STAGES.map(s => (
                  <button key={s.key}
                    onClick={() => !isClosed && s.key !== task.stage && quickStage(s.key)}
                    disabled={isClosed || s.key === task.stage}
                    style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                      cursor: isClosed || s.key === task.stage ? "default" : "pointer",
                      border: `1.5px solid ${s.key === task.stage ? s.color : "var(--border)"}`,
                      background: s.key === task.stage ? s.color + "22" : "transparent",
                      color: s.key === task.stage ? s.color : "var(--dim)",
                      fontFamily: "var(--font)",
                      transition: "all .15s",
                    }}>
                    {s.key === task.stage ? "● " : ""}{s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="kc-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="kc-card-cap" style={{ marginBottom: 0 }}>
                Документи ({docs.length})
              </div>
              <button className="kc-btn" style={{ fontSize: 12, padding: "5px 11px" }}
                onClick={() => { setDocOpen(v => !v); setDocErr(""); }}>
                <Icon name="plus" size={12} /> Додати
              </button>
            </div>

            {docOpen && (
              <div style={{ marginBottom: 14, padding: 14, background: "var(--panel-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label className="kc-label">{"Назва документу *"}</label>
                    <input className="kc-input" value={docForm.name}
                      onChange={e => setDocForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Рішення суду 2024.pdf" autoFocus />
                  </div>
                  <div>
                    <label className="kc-label">{"Посилання *"}</label>
                    <input className="kc-input" value={docForm.url}
                      onChange={e => setDocForm(p => ({ ...p, url: e.target.value }))}
                      placeholder="https://drive.google.com/..." />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label className="kc-label">Нотатки</label>
                  <input className="kc-input" value={docForm.notes}
                    onChange={e => setDocForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Короткий опис" />
                </div>
                {docErr && <div className="kc-error" style={{ marginBottom: 10 }}>{docErr}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="kc-btn kc-btn-ghost" onClick={() => setDocOpen(false)}>Скасувати</button>
                  <button className="kc-btn kc-btn-primary" onClick={addDoc} disabled={docBusy}>
                    {docBusy ? "Збереження…" : "Зберегти"}
                  </button>
                </div>
              </div>
            )}

            {docs.length === 0 && !docOpen && (
              <div className="kc-empty" style={{ padding: "18px 0" }}>Немає документів. Додайте посилання на Google Drive, Dropbox або інший сервіс.</div>
            )}

            {docs.map(doc => (
              <div key={doc.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 0", borderBottom: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: "var(--panel-2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>📎</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13.5, fontWeight: 500, color: "var(--brass)", textDecoration: "none", display: "block", marginBottom: 2 }}>
                    {doc.name}
                  </a>
                  {doc.notes && <div style={{ fontSize: 11.5, color: "var(--dim)" }}>{doc.notes}</div>}
                  <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 3 }}>
                    {new Date(doc.created_at).toLocaleString("uk-UA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <button onClick={() => deleteDoc(doc.id)} title="Видалити"
                  style={{ border: "none", background: "none", color: "var(--faint)", cursor: "pointer", fontSize: 20, padding: "0 6px", lineHeight: 1 }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}>×</button>
              </div>
            ))}
          </div>

          {/* Activity log */}
          <div className="kc-card">
            <div className="kc-card-cap">Активність</div>
            {logs.length === 0 && <div className="kc-empty" style={{ padding: "14px 0" }}>Немає записів</div>}
            <div>
              {logs.map((log, i) => (
                <div key={log.id} style={{ display: "flex", gap: 12, paddingBottom: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brass)", marginTop: 5 }} />
                    {i < logs.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ fontSize: 13.5 }}>{log.event}</div>
                    <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 2 }}>
                      {log.actor_name && <span>{log.actor_name} · </span>}
                      {new Date(log.created_at).toLocaleString("uk-UA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — AI Chat */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", position: "sticky", top: 80 }}>

          {/* Chat header */}
          <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "var(--brass-bg)", border: "1px solid #d99e5444",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>AI Асистент</div>
                <div style={{ fontSize: 11, color: "var(--faint)" }}>Claude · аналіз і стратегія</div>
              </div>
            </div>
            {chat.length > 0 && (
              <button onClick={clearChat} title="Очистити чат"
                style={{ border: "none", background: "none", color: "var(--faint)", cursor: "pointer", fontSize: 18 }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}>×</button>
            )}
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{
            height: 440, overflowY: "auto", padding: "14px 14px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {chat.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", color: "var(--faint)", fontSize: 13, lineHeight: 1.6 }}>
                Запитайте AI про цю справу:<br />
                аналіз документів, наступні кроки,<br />
                юридичні аргументи, стратегія.
              </div>
            )}
            {chat.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
                <div style={{
                  padding: "9px 13px", fontSize: 13.5, lineHeight: 1.55,
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user" ? "var(--brass)" : "var(--panel-2)",
                  color: msg.role === "user" ? "var(--bg)" : "var(--text)",
                  border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ alignSelf: "flex-start" }}>
                <div style={{
                  padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
                  background: "var(--panel-2)", border: "1px solid var(--border)",
                  display: "flex", gap: 5, alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: "var(--brass)",
                      animation: `kc-rot .9s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {aiErr && (
            <div className="kc-error" style={{ margin: "0 14px 10px", fontSize: 12 }}>{aiErr}</div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <textarea
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAi(); } }}
                placeholder="Запитайте AI… (Enter — відправити, Shift+Enter — новий рядок)"
                rows={2}
                style={{
                  flex: 1, background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: 9, padding: "8px 10px", color: "var(--text)",
                  fontFamily: "var(--font)", fontSize: 13, resize: "none", outline: "none",
                  transition: "border-color .15s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--brass)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
                disabled={aiLoading}
              />
              <button onClick={sendAi} disabled={!aiInput.trim() || aiLoading}
                className="kc-btn kc-btn-primary"
                style={{ padding: "0 14px", alignSelf: "stretch", fontSize: 18 }}>
                ↑
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Edit Modal ── */}
      {editOpen && (
        <div className="kc-modal-bg">
          <div className="kc-modal" style={{ maxWidth: 540 }}>
            <div className="kc-modal-title">Редагувати завдання</div>

            <div className="kc-field">
              <label className="kc-label">{"Назва *"}</label>
              <input className="kc-input" value={editForm.title || ""}
                onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                autoFocus />
            </div>

            <div className="kc-field">
              <label className="kc-label">Опис</label>
              <textarea className="kc-textarea" value={editForm.description || ""}
                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Детальний опис завдання, контекст, важлива інформація" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label className="kc-label">Категорія</label>
                <select className="kc-select" value={editForm.category || "general"}
                  onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}>
                  <option value="general">Загальне</option>
                  <option value="legal">Юридичне</option>
                  <option value="admin">Адміністративне</option>
                  <option value="research">Дослідження</option>
                </select>
              </div>
              <div>
                <label className="kc-label">Пріоритет</label>
                <select className="kc-select" value={editForm.priority || "normal"}
                  onChange={e => setEditForm(p => ({ ...p, priority: e.target.value }))}>
                  <option value="low">Низький</option>
                  <option value="normal">Звичайний</option>
                  <option value="high">Високий</option>
                  <option value="urgent">Терміново</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label className="kc-label">Виконавець</label>
                <select className="kc-select" value={editForm.assigned_to || ""}
                  onChange={e => setEditForm(p => ({ ...p, assigned_to: e.target.value }))}>
                  <option value="">Без виконавця</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="kc-label">Дедлайн</label>
                <input className="kc-input" type="date" value={editForm.deadline || ""}
                  onChange={e => setEditForm(p => ({ ...p, deadline: e.target.value }))} />
              </div>
            </div>

            {editErr && <div className="kc-error" style={{ marginBottom: 12 }}>{editErr}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setEditOpen(false)} disabled={editBusy}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" onClick={saveEdit} disabled={editBusy}>
                {editBusy ? "Збереження…" : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <div className="kc-label" style={{ marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 14, color: "var(--text)" }}>{value}</div>
    </div>
  );
}
