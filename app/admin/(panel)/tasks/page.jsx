"use client";
/* /admin/tasks — Дошка справ (Jira-like Kanban). */
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Icon, Spinner } from "@/components/admin/ui";

const COLUMNS = [
  { key: "todo",        label: "TO DO",        color: "#6fa3d4", bg: "#eef4fb" },
  { key: "in_progress", label: "IN PROGRESS",  color: "#d99e54", bg: "#fff8ed" },
  { key: "review",      label: "IN REVIEW",    color: "#9b7fd4", bg: "#f5f0ff" },
  { key: "done",        label: "DONE",         color: "#5fb87a", bg: "#edfaf1" },
];

const PRIORITY_CLR = { low: "#828c9b", normal: "#6fa3d4", high: "#d99e54", urgent: "#d96c6c" };
const PRIORITY_UA  = { low: "Низький", normal: "Звичайний", high: "Високий", urgent: "Терміново" };
const CATEGORY_UA  = { general: "Загальне", legal: "Юридичне", admin: "Адмін.", research: "Дослідження" };

const EMPTY_FORM = {
  title: "", description: "", category: "general",
  stage: "todo", priority: "normal", assigned_to: "", deadline: "",
};

function daysColor(n) {
  if (n === null || n === undefined) return null;
  if (n < 0)  return "#d96c6c";
  if (n < 7)  return "#d99e54";
  return "#7cbf8e";
}

function DaysBadge({ days }) {
  const clr = daysColor(days);
  if (!clr) return null;
  const label = days < 0
    ? `${new Date(Date.now() + days * 86400000).toLocaleDateString("uk-UA")}`
    : days === 0 ? "Сьогодні!" : `${new Date(Date.now() + days * 86400000).toLocaleDateString("uk-UA")}`;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 6px",
      borderRadius: 4, background: clr + "22", color: clr,
      border: `1px solid ${clr}55`,
    }}>
      {days < 0 && <span style={{ marginRight: 3 }}>⚠</span>}
      {label}
    </span>
  );
}

function Avatar({ name }) {
  if (!name) return null;
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div title={name} style={{
      width: 22, height: 22, borderRadius: "50%",
      background: "#6fa3d4", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 9, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function TasksBoard() {
  const [tasks, setTasks]       = useState(null);
  const [workers, setWorkers]   = useState([]);
  const [form, setForm]         = useState(null);
  const [busy, setBusy]         = useState("");
  const [toast, setToast]       = useState("");
  const [mounted, setMounted]   = useState(false);
  const [filter, setFilter]     = useState({ priority: "", assignee: "", search: "" });
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    try {
      const [tr, wr] = await Promise.all([
        fetch("/api/admin/tasks").then(r => r.json()),
        fetch("/api/admin/workers").then(r => r.json()),
      ]);
      setTasks(tr.tasks || []);
      setWorkers(wr.workers || []);
    } catch { flash("Помилка завантаження"); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const moveStage = async (task, stage) => {
    setBusy(task.id + stage);
    try {
      await fetch(`/api/admin/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, stage } : t));
    } catch { flash("Помилка"); }
    finally { setBusy(""); }
  };

  const createTask = async () => {
    if (!form.title.trim()) { flash("Введіть назву"); return; }
    setBusy("create");
    try {
      const r = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          assigned_to: form.assigned_to || null,
          deadline: form.deadline || null,
        }),
      });
      const d = await r.json();
      if (d.error) { flash(d.error); return; }
      flash("Завдання створено");
      setForm(null);
      load();
    } catch { flash("Помилка"); }
    finally { setBusy(""); }
  };

  const filteredTasks = (colKey) => {
    if (!tasks) return [];
    return tasks.filter(t => {
      if (t.stage !== colKey) return false;
      if (filter.priority && t.priority !== filter.priority) return false;
      if (filter.assignee && String(t.assigned_to) !== filter.assignee) return false;
      if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  };

  if (!tasks) return <Spinner />;

  const totalActive = tasks.filter(t => t.stage !== "done").length;

  return (
    <div style={{ height: "100%" }}>
      {toast && (
        <div className="kc-note" style={{ marginBottom: 12 }}>{toast}</div>
      )}

      {/* Шапка */}
      <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div className="kc-row" style={{ gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Дошка справ</div>
            <div style={{ color: "#8a96a3", fontSize: 12, marginTop: 2 }}>
              {totalActive} активних · {tasks.filter(t => t.stage === "done").length} завершено
            </div>
          </div>
        </div>
        <div className="kc-row" style={{ gap: 8 }}>
          <button
            className="kc-btn kc-btn-ghost"
            style={{ fontSize: 12, gap: 4 }}
            onClick={() => setShowFilter(f => !f)}
          >
            <Icon name="filter" size={13} /> Фільтр
            {(filter.priority || filter.assignee || filter.search) && (
              <span style={{
                background: "#6fa3d4", color: "#fff",
                borderRadius: "50%", width: 16, height: 16,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, marginLeft: 2,
              }}>●</span>
            )}
          </button>
          <button
            className="kc-btn kc-btn-primary"
            style={{ fontSize: 12 }}
            onClick={() => setForm({ ...EMPTY_FORM })}
          >
            <Icon name="plus" size={13} /> Нова справа
          </button>
        </div>
      </div>

      {/* Панель фільтру */}
      {showFilter && (
        <div className="kc-card" style={{ marginBottom: 14, padding: "12px 16px" }}>
          <div className="kc-row" style={{ gap: 12, flexWrap: "wrap" }}>
            <input
              className="kc-input"
              style={{ maxWidth: 200, fontSize: 12 }}
              placeholder="Пошук по назві..."
              value={filter.search}
              onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            />
            <select className="kc-input" style={{ maxWidth: 150, fontSize: 12 }}
              value={filter.priority}
              onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
              <option value="">Всі пріоритети</option>
              {Object.entries(PRIORITY_UA).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select className="kc-input" style={{ maxWidth: 180, fontSize: 12 }}
              value={filter.assignee}
              onChange={e => setFilter(f => ({ ...f, assignee: e.target.value }))}>
              <option value="">Всі виконавці</option>
              {workers.map(w => (
                <option key={w.id} value={String(w.id)}>{w.full_name}</option>
              ))}
            </select>
            <button className="kc-btn kc-btn-ghost" style={{ fontSize: 12 }}
              onClick={() => setFilter({ priority: "", assignee: "", search: "" })}>
              Скинути
            </button>
          </div>
        </div>
      )}

      {/* Канбан-колонки */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        alignItems: "start",
        overflowX: "auto",
        minWidth: 0,
      }}>
        {COLUMNS.map((col, ci) => {
          const colTasks = filteredTasks(col.key);
          return (
            <div key={col.key} style={{
              background: "#f8f9fa",
              borderRadius: 8,
              border: "1px solid #e2e6ea",
              minWidth: 200,
              overflow: "hidden",
            }}>
              {/* Заголовок колонки */}
              <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid #e2e6ea",
                background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div className="kc-row" style={{ gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: col.color, flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", color: "#3d4652" }}>
                    {col.label}
                  </span>
                </div>
                <span style={{
                  background: col.color + "22", color: col.color,
                  border: `1px solid ${col.color}55`,
                  borderRadius: 10, padding: "1px 8px",
                  fontSize: 11, fontWeight: 700, minWidth: 22, textAlign: "center",
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Картки */}
              <div style={{ padding: "8px 8px 4px", display: "flex", flexDirection: "column", gap: 6, minHeight: 80 }}>
                {colTasks.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#c0c8d0", fontSize: 12 }}>
                    Немає справ
                  </div>
                )}
                {colTasks.map(task => (
                  <Link key={task.id} href={`/admin/tasks/${task.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      background: "#fff",
                      borderRadius: 6,
                      border: "1px solid #e2e6ea",
                      padding: "10px 12px",
                      cursor: "pointer",
                      transition: "box-shadow .15s, border-color .15s",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
                        e.currentTarget.style.borderColor = col.color + "88";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                        e.currentTarget.style.borderColor = "#e2e6ea";
                      }}
                    >
                      {/* Категорія */}
                      <div style={{ marginBottom: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "1px 6px",
                          borderRadius: 4,
                          background: "#e8f0fa", color: "#2563b0",
                          letterSpacing: "0.03em",
                        }}>
                          {CATEGORY_UA[task.category] || task.category}
                        </span>
                      </div>

                      {/* Назва */}
                      <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.35, marginBottom: 8 }}>
                        {task.title}
                      </div>

                      {/* Дедлайн + пріоритет */}
                      <div className="kc-row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                        {task.deadline && <DaysBadge days={task.days_left} />}
                        {task.priority !== "normal" && (
                          <span style={{
                            fontSize: 10, padding: "2px 6px", borderRadius: 4,
                            background: PRIORITY_CLR[task.priority] + "18",
                            color: PRIORITY_CLR[task.priority],
                            fontWeight: 600,
                          }}>
                            {PRIORITY_UA[task.priority]}
                          </span>
                        )}
                      </div>

                      {/* Низ картки: ID + виконавець + переміщення */}
                      <div className="kc-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "#8a96a3", fontWeight: 600 }}>
                          TASK-{task.id}
                        </span>
                        <div className="kc-row" style={{ gap: 6 }}>
                          {task.doc_count > 0 && (
                            <span style={{ fontSize: 10, color: "#8a96a3" }}>
                              📎{task.doc_count}
                            </span>
                          )}
                          <Avatar name={task.assignee_name} />
                          {/* Стрілки */}
                          <div className="kc-row" style={{ gap: 2 }} onClick={e => e.preventDefault()}>
                            {ci > 0 && (
                              <button
                                title={`← ${COLUMNS[ci - 1].label}`}
                                style={{
                                  border: "none", background: "transparent",
                                  cursor: "pointer", padding: "2px 4px",
                                  color: "#8a96a3", fontSize: 13, lineHeight: 1,
                                  borderRadius: 4,
                                }}
                                disabled={busy === task.id + COLUMNS[ci - 1].key}
                                onClick={() => moveStage(task, COLUMNS[ci - 1].key)}
                              >‹</button>
                            )}
                            {ci < COLUMNS.length - 1 && (
                              <button
                                title={`→ ${COLUMNS[ci + 1].label}`}
                                style={{
                                  border: "none", background: "transparent",
                                  cursor: "pointer", padding: "2px 4px",
                                  color: col.color, fontSize: 13, lineHeight: 1,
                                  borderRadius: 4,
                                }}
                                disabled={busy === task.id + COLUMNS[ci + 1].key}
                                onClick={() => moveStage(task, COLUMNS[ci + 1].key)}
                              >›</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* + Створити */}
              <div style={{ padding: "4px 8px 10px" }}>
                <button
                  className="kc-btn kc-btn-ghost"
                  style={{ width: "100%", fontSize: 12, justifyContent: "center", color: "#8a96a3" }}
                  onClick={() => setForm({ ...EMPTY_FORM, stage: col.key })}
                >
                  <Icon name="plus" size={12} /> Створити
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Модал нової справи */}
      {mounted && form && createPortal(
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            overflowY: "auto", zIndex: 200, padding: "32px 16px",
          }}
          onClick={e => { if (e.target === e.currentTarget) setForm(null); }}
        >
          <div className="kc-card" style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
              Нова справа
              <span style={{
                marginLeft: 10, fontSize: 12, fontWeight: 500,
                color: COLUMNS.find(c => c.key === form.stage)?.color || "#6fa3d4",
              }}>
                → {COLUMNS.find(c => c.key === form.stage)?.label}
              </span>
            </div>

            {/* Назва */}
            <div className="kc-field" style={{ marginBottom: 12 }}>
              <label className="kc-label">Назва *</label>
              <input className="kc-input" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Що потрібно зробити..." autoFocus />
            </div>

            {/* Опис */}
            <div className="kc-field" style={{ marginBottom: 12 }}>
              <label className="kc-label">Опис</label>
              <textarea className="kc-textarea" rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Деталі, контекст..." />
            </div>

            <div className="kc-row" style={{ gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              {/* Категорія */}
              <div className="kc-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="kc-label">Категорія</label>
                <select className="kc-input" value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {Object.entries(CATEGORY_UA).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Пріоритет */}
              <div className="kc-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="kc-label">Пріоритет</label>
                <select className="kc-input" value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  {Object.entries(PRIORITY_UA).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Стадія */}
              <div className="kc-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="kc-label">Колонка</label>
                <select className="kc-input" value={form.stage}
                  onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                  {COLUMNS.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="kc-row" style={{ gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {/* Виконавець */}
              <div className="kc-field" style={{ flex: 1, minWidth: 160 }}>
                <label className="kc-label">Виконавець</label>
                <select className="kc-input" value={form.assigned_to}
                  onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}>
                  <option value="">— не призначено —</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Дедлайн */}
              <div className="kc-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="kc-label">Дедлайн</label>
                <input className="kc-input" type="date" value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              </div>
            </div>

            <div className="kc-row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setForm(null)}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" disabled={busy === "create"} onClick={createTask}>
                {busy === "create" ? "Створення..." : "Створити справу"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
