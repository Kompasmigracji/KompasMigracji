"use client";
/* /admin/workers — Команда (CRUD) + Канбан завдань (universal tasks). */
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Icon, Spinner } from "@/components/admin/ui";

const STAGES = [
  { key: "todo",        label: "Нові завдання", color: "#6fa3d4", desc: "Очікують на початок" },
  { key: "in_progress", label: "В роботі",      color: "#d99e54", desc: "Активна робота" },
  { key: "review",      label: "На перевірці",  color: "#9b7fd4", desc: "Перевірка і затвердження" },
  { key: "done",        label: "Завершено",     color: "#5fb87a", desc: "Виконано" },
];

const PRIORITY_CLR = { low: "#828c9b", normal: "#6fa3d4", high: "#d99e54", urgent: "#d96c6c" };
const PRIORITY_UA  = { low: "Низький", normal: "Звич.", high: "Високий", urgent: "ТЕРМІНОВО" };

const WORKER_COLORS = ["#6fa3d4","#d99e54","#5fb87a","#d96c6c","#9b7fd4","#54c4d9","#d4a76f","#7fd4c4"];
function workerColor(id) { return WORKER_COLORS[Number(id) % WORKER_COLORS.length]; }
function getInitials(name) { return (name || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase(); }

function Avatar({ worker, size = 26 }) {
  const c = workerColor(worker.id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: c + "30", border: `1.5px solid ${c}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: c,
    }}>{getInitials(worker.full_name)}</div>
  );
}

export default function WorkersPage() {
  const [tab, setTab]         = useState("team");
  const [me, setMe]           = useState(null);
  const [workers, setWorkers] = useState(null);
  const [tasks, setTasks]     = useState(null);

  /* team crud */
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({});
  const [formErr, setFormErr]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [tempPwd, setTempPwd]   = useState("");

  /* kanban filter */
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [assigning, setAssigning]   = useState(null);
  const [busy, setBusy]             = useState("");
  const [toast, setToast]           = useState("");
  const dropRef = useRef(null);

  /* task crud */
  const [taskModal, setTaskModal]       = useState(null); // null | "create" | "edit" | "close"
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm]         = useState({});
  const [taskErr, setTaskErr]           = useState("");
  const [taskSaving, setTaskSaving]     = useState(false);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    const [wr, tr, mr] = await Promise.all([
      fetch("/api/admin/workers").then(r => r.json()),
      fetch("/api/admin/tasks").then(r => r.json()),
      fetch("/api/admin/auth/me").then(r => r.json()),
    ]);
    setWorkers(wr.workers || []);
    setTasks(tr.tasks    || []);
    setMe(mr.user        || null);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setAssigning(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── team crud ── */
  const openAdd    = () => { setForm({ role: "moderator", status: "active" }); setFormErr(""); setTempPwd(""); setSelected(null); setModal("add"); };
  const openEdit   = (w) => { setForm({ full_name: w.full_name, email: w.email, role: w.role, status: w.status }); setFormErr(""); setTempPwd(""); setSelected(w); setModal("edit"); };
  const openDelete = (w) => { setSelected(w); setFormErr(""); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setTempPwd(""); setFormErr(""); };

  const saveWorker = async () => {
    if (!form.full_name?.trim()) return setFormErr("Вкажіть ім'я");
    if (!form.email?.trim())     return setFormErr("Вкажіть email");
    setSaving(true); setFormErr("");
    const url    = modal === "add" ? "/api/admin/workers" : `/api/admin/workers/${selected.id}`;
    const method = modal === "add" ? "POST" : "PATCH";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await r.json();
    setSaving(false);
    if (d.error) return setFormErr(d.error);
    if (d.temp_password) { setTempPwd(d.temp_password); load(); return; }
    flash(modal === "add" ? "Спеціаліста додано" : "Зміни збережено");
    closeModal(); load();
  };

  const deleteWorker = async () => {
    setSaving(true); setFormErr("");
    const r = await fetch(`/api/admin/workers/${selected.id}`, { method: "DELETE" });
    const d = await r.json();
    setSaving(false);
    if (d.error) return setFormErr(d.error);
    flash("Спеціаліста видалено");
    closeModal(); load();
  };

  /* ── task assign ── */
  const assign = async (taskId, workerId) => {
    setBusy(String(taskId));
    await fetch(`/api/admin/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to: workerId ?? null }),
    });
    const w = workers?.find(w => w.id === workerId);
    flash(w ? `Призначено → ${w.full_name}` : "Призначення знято");
    setAssigning(null); setBusy(""); load();
  };

  /* ── task crud ── */
  const openCreateTask = (defaultStage = "todo") => {
    setTaskForm({ title: "", description: "", category: "general", priority: "normal", stage: defaultStage, assigned_to: "", deadline: "" });
    setTaskErr(""); setTaskModal("create");
  };

  const openEditTask = (t) => {
    setTaskForm({
      title:       t.title       || "",
      description: t.description || "",
      category:    t.category    || "general",
      priority:    t.priority    || "normal",
      stage:       t.stage       || "todo",
      assigned_to: t.assigned_to ? String(t.assigned_to) : "",
      deadline:    t.deadline    ? t.deadline.slice(0, 10) : "",
    });
    setTaskErr(""); setSelectedTask(t); setTaskModal("edit");
  };

  const openCloseTask = (t) => { setSelectedTask(t); setTaskErr(""); setTaskModal("close"); };
  const closeTaskModal = () => { setTaskModal(null); setSelectedTask(null); setTaskErr(""); };

  const saveTask = async () => {
    if (!taskForm.title?.trim()) return setTaskErr("Вкажіть назву завдання");
    setTaskSaving(true); setTaskErr("");
    const body = { ...taskForm, assigned_to: taskForm.assigned_to ? Number(taskForm.assigned_to) : null, deadline: taskForm.deadline || null };
    const url    = taskModal === "create" ? "/api/admin/tasks" : `/api/admin/tasks/${selectedTask.id}`;
    const method = taskModal === "create" ? "POST" : "PATCH";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json();
    setTaskSaving(false);
    if (d.error) return setTaskErr(d.error);
    flash(taskModal === "create" ? "Завдання створено" : "Завдання оновлено");
    closeTaskModal(); load();
  };

  const closeTask = async () => {
    setTaskSaving(true);
    await fetch(`/api/admin/tasks/${selectedTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    setTaskSaving(false);
    flash("Завдання закрито");
    closeTaskModal(); load();
  };

  const moveStage = async (t, dir) => {
    const idx = STAGES.findIndex(s => s.key === t.stage);
    const next = idx + dir;
    if (next < 0 || next >= STAGES.length) return;
    setBusy(String(t.id));
    await fetch(`/api/admin/tasks/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: STAGES[next].key }),
    });
    setBusy(""); load();
  };

  const byStage = (stage) => {
    if (!tasks) return [];
    let arr = tasks.filter(t => t.stage === stage);
    if (!showClosed) arr = arr.filter(t => t.status !== "closed");
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(t => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (filter === "all")        return arr;
    if (filter === "unassigned") return arr.filter(t => !t.assigned_to);
    return arr.filter(t => String(t.assigned_to) === filter);
  };

  if (!workers || !tasks) return <Spinner />;

  const isAdmin         = me?.role === "admin";
  const activeTasks     = tasks.filter(t => t.status !== "closed");
  const closedTasks     = tasks.filter(t => t.status === "closed");
  const unassignedCount = activeTasks.filter(t => !t.assigned_to).length;

  return (
    <div>
      {toast && <div className="kc-note" style={{ marginBottom: 12 }}>{toast}</div>}

      {/* Tab bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <TabBtn active={tab === "team"} color="var(--brass)" onClick={() => setTab("team")}>
            <Icon name="users" size={14} /> Команда <Cnt>{workers.length}</Cnt>
          </TabBtn>
          <TabBtn active={tab === "kanban"} color="var(--blue)" onClick={() => setTab("kanban")}>
            <Icon name="grid" size={14} /> Канбан завдань <Cnt>{activeTasks.length}</Cnt>
          </TabBtn>
        </div>

        {tab === "team" && isAdmin && (
          <button className="kc-btn kc-btn-primary" onClick={openAdd}>
            <Icon name="plus" size={14} /> Додати спеціаліста
          </button>
        )}
        {tab === "kanban" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="kc-btn kc-btn-primary" onClick={() => openCreateTask()}>
              <Icon name="plus" size={14} /> Нове завдання
            </button>
            <Link href="/admin/cases" className="kc-btn kc-btn-ghost" style={{ fontSize: 12 }}>
              <Icon name="alert" size={14} /> Понаглення
            </Link>
          </div>
        )}
      </div>

      {/* ── TEAM ── */}
      {tab === "team" && (
        <div className="kc-grid kc-grid-3" style={{ alignItems: "start" }}>
          {workers.map(w => (
            <WorkerCard key={w.id} worker={w} isAdmin={isAdmin}
              onEdit={() => openEdit(w)} onDelete={() => openDelete(w)} />
          ))}
          {workers.length === 0 && <div className="kc-empty" style={{ gridColumn: "1/-1" }}>Немає спеціалістів</div>}
        </div>
      )}

      {/* ── KANBAN ── */}
      {tab === "kanban" && (
        <KanbanBoard
          workers={workers} tasks={tasks}
          filter={filter} setFilter={setFilter}
          search={search} setSearch={setSearch}
          showClosed={showClosed} setShowClosed={setShowClosed}
          closedCount={closedTasks.length}
          activeTasks={activeTasks}
          assigning={assigning} setAssigning={setAssigning}
          busy={busy} assign={assign} dropRef={dropRef}
          byStage={byStage}
          unassignedCount={unassignedCount}
          isAdmin={isAdmin}
          onCreateTask={openCreateTask}
          onEditTask={openEditTask}
          onCloseTask={openCloseTask}
          onMoveStage={moveStage}
        />
      )}

      {/* ── Worker modals ── */}
      {(modal === "add" || modal === "edit") && (
        <WorkerModal
          title={modal === "add" ? "Новий спеціаліст" : "Редагувати спеціаліста"}
          form={form} setForm={setForm} isEdit={modal === "edit"}
          error={formErr} saving={saving} tempPwd={tempPwd}
          onSave={saveWorker} onClose={closeModal} />
      )}
      {modal === "delete" && (
        <DeleteModal worker={selected} saving={saving} error={formErr}
          onDelete={deleteWorker} onClose={closeModal} />
      )}

      {/* ── Task modals ── */}
      {(taskModal === "create" || taskModal === "edit") && (
        <TaskModal
          title={taskModal === "create" ? "Нове завдання" : "Редагувати завдання"}
          form={taskForm} setForm={setTaskForm}
          workers={workers} isEdit={taskModal === "edit"}
          error={taskErr} saving={taskSaving}
          onSave={saveTask} onClose={closeTaskModal} />
      )}
      {taskModal === "close" && (
        <CloseTaskModal task={selectedTask} saving={taskSaving}
          onClose={closeTaskModal} onConfirm={closeTask} />
      )}
    </div>
  );
}

/* ── Helpers ── */
function Cnt({ children }) {
  return <span style={{ opacity: .6, fontWeight: 400 }}>({children})</span>;
}

function TabBtn({ active, color = "var(--brass)", onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "8px 16px", borderRadius: 10, cursor: "pointer",
      fontWeight: 600, fontSize: 13.5, fontFamily: "var(--font)",
      border: active ? `2px solid ${color}` : "1.5px solid var(--border)",
      background: active ? color + "22" : "var(--panel)",
      color: active ? color : "var(--dim)", transition: "all .15s",
    }}>{children}</button>
  );
}

/* ── WorkerCard ── */
function WorkerCard({ worker, isAdmin, onEdit, onDelete }) {
  const color = workerColor(worker.id);
  const roleLabel = worker.role === "admin" ? "Адміністратор" : "Модератор";
  return (
    <div className="kc-card" style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", margin: "0 auto 12px",
          background: color + "25", border: `2.5px solid ${color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color,
        }}>{getInitials(worker.full_name)}</div>
        <div style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 600, marginBottom: 7 }}>{worker.full_name}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap" }}>
          <span className="kc-badge kc-badge-brass" style={{ fontSize: 11 }}>{roleLabel}</span>
          <span className={`kc-badge ${worker.status === "active" ? "kc-badge-green" : "kc-badge-red"}`} style={{ fontSize: 11 }}>
            {worker.status === "active" ? "Активний" : "Заблокований"}
          </span>
        </div>
        <div style={{ color: "var(--faint)", fontSize: 11.5, marginTop: 8 }}>{worker.email}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
        <MiniStat label="Активних" value={Number(worker.active_cases)  || 0} color="#d99e54" />
        <MiniStat label="Закрито"  value={Number(worker.closed_cases)  || 0} color="#5fb87a" />
        <MiniStat label="Просток." value={Number(worker.overdue_cases) || 0} color="#d96c6c" />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Link href={`/admin/workers/${worker.id}`} className="kc-btn" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
          <Icon name="user" size={13} /> Кабінет
        </Link>
        {isAdmin && (
          <>
            <button onClick={onEdit} className="kc-btn" title="Редагувати" style={{ padding: "9px 11px" }}>
              <Icon name="settings" size={14} />
            </button>
            <button onClick={onDelete} className="kc-btn kc-btn-danger" title="Видалити" style={{ padding: "9px 11px" }}>
              <Icon name="trash" size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ background: "var(--panel-2)", borderRadius: 8, padding: "8px 6px", textAlign: "center", border: `1px solid ${color}33` }}>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "var(--display)" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--faint)", marginTop: 1 }}>{label}</div>
    </div>
  );
}

/* ── WorkerModal ── */
function WorkerModal({ title, form, setForm, isEdit, error, saving, tempPwd, onSave, onClose }) {
  const f = (k) => (v) => setForm(prev => ({ ...prev, [k]: v }));
  return (
    <div className="kc-modal-bg">
      <div className="kc-modal" style={{ maxWidth: 420 }}>
        <div className="kc-modal-title">{title}</div>
        {tempPwd ? (
          <>
            <div className="kc-note" style={{ marginBottom: 14 }}>
              {"Спеціаліста додано! Збережіть тимчасовий пароль — він відображається лише один раз."}
            </div>
            <div className="kc-label">Тимчасовий пароль</div>
            <div className="kc-input kc-mono" style={{ marginBottom: 18, letterSpacing: 2, fontSize: 16, fontWeight: 700, background: "var(--panel-2)", userSelect: "all" }}>
              {tempPwd}
            </div>
            <button className="kc-btn kc-btn-primary" style={{ width: "100%" }} onClick={onClose}>Зрозуміло, закрити</button>
          </>
        ) : (
          <>
            <div className="kc-field">
              <label className="kc-label">{"Повне ім'я"}</label>
              <input className="kc-input" value={form.full_name || ""} onChange={e => f("full_name")(e.target.value)} placeholder="Іваненко Іван Іванович" />
            </div>
            <div className="kc-field">
              <label className="kc-label">Email</label>
              <input className="kc-input" type="email" value={form.email || ""} onChange={e => f("email")(e.target.value)} placeholder="ivan@example.com" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label className="kc-label">Роль</label>
                <select className="kc-select" value={form.role || "moderator"} onChange={e => f("role")(e.target.value)}>
                  <option value="moderator">Модератор</option>
                  <option value="admin">Адміністратор</option>
                </select>
              </div>
              <div>
                <label className="kc-label">Статус</label>
                <select className="kc-select" value={form.status || "active"} onChange={e => f("status")(e.target.value)}>
                  <option value="active">Активний</option>
                  <option value="blocked">Заблокований</option>
                </select>
              </div>
            </div>
            <div className="kc-field">
              <label className="kc-label">{isEdit ? "Новий пароль (порожньо = не змінювати)" : "Пароль (порожньо = авто-генерація)"}</label>
              <input className="kc-input" type="text" value={form.password || ""} onChange={e => f("password")(e.target.value)} placeholder={isEdit ? "Без змін" : "Залиште порожнім"} />
            </div>
            {error && <div className="kc-error" style={{ marginBottom: 12 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="kc-btn kc-btn-ghost" onClick={onClose} disabled={saving}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" onClick={onSave} disabled={saving}>
                {saving ? "Збереження…" : isEdit ? "Зберегти" : "Додати"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── DeleteModal ── */
function DeleteModal({ worker, saving, error, onDelete, onClose }) {
  return (
    <div className="kc-modal-bg">
      <div className="kc-modal" style={{ maxWidth: 380 }}>
        <div className="kc-modal-title" style={{ color: "var(--red)" }}>Видалити спеціаліста?</div>
        <p style={{ color: "var(--dim)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>{worker?.full_name}</strong>{" буде видалений з системи."}
        </p>
        {error && <div className="kc-error" style={{ marginBottom: 12 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="kc-btn kc-btn-ghost" onClick={onClose} disabled={saving}>Скасувати</button>
          <button className="kc-btn kc-btn-danger" onClick={onDelete} disabled={saving} style={{ borderColor: "var(--red)", background: "#2a1a1a" }}>
            {saving ? "Видалення…" : <><Icon name="trash" size={13} /> Видалити</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── TaskModal ── */
function TaskModal({ title, form, setForm, workers, isEdit, error, saving, onSave, onClose }) {
  const f = (k) => (v) => setForm(prev => ({ ...prev, [k]: v }));
  return (
    <div className="kc-modal-bg">
      <div className="kc-modal" style={{ maxWidth: 520 }}>
        <div className="kc-modal-title">{title}</div>
        <div className="kc-field">
          <label className="kc-label">{"Назва завдання *"}</label>
          <input className="kc-input" value={form.title || ""} onChange={e => f("title")(e.target.value)} placeholder="Наприклад: Підготувати позов проти роботодавця" autoFocus />
        </div>
        <div className="kc-field">
          <label className="kc-label">Опис</label>
          <textarea className="kc-textarea" style={{ minHeight: 80 }} value={form.description || ""} onChange={e => f("description")(e.target.value)} placeholder="Контекст, деталі, що потрібно зробити…" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label className="kc-label">Категорія</label>
            <select className="kc-select" value={form.category || "general"} onChange={e => f("category")(e.target.value)}>
              <option value="general">Загальне</option>
              <option value="legal">Юридичне</option>
              <option value="admin">Адміністративне</option>
              <option value="research">Дослідження</option>
            </select>
          </div>
          <div>
            <label className="kc-label">Пріоритет</label>
            <select className="kc-select" value={form.priority || "normal"} onChange={e => f("priority")(e.target.value)}>
              <option value="low">Низький</option>
              <option value="normal">Звичайний</option>
              <option value="high">Високий</option>
              <option value="urgent">Терміново</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label className="kc-label">Етап</label>
            <select className="kc-select" value={form.stage || "todo"} onChange={e => f("stage")(e.target.value)}>
              {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="kc-label">Виконавець</label>
            <select className="kc-select" value={form.assigned_to || ""} onChange={e => f("assigned_to")(e.target.value)}>
              <option value="">Без виконавця</option>
              {workers.map(w => <option key={w.id} value={w.id}>{w.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="kc-label">Дедлайн</label>
            <input className="kc-input" type="date" value={form.deadline || ""} onChange={e => f("deadline")(e.target.value)} />
          </div>
        </div>
        {error && <div className="kc-error" style={{ marginBottom: 12 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="kc-btn kc-btn-ghost" onClick={onClose} disabled={saving}>Скасувати</button>
          <button className="kc-btn kc-btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Збереження…" : isEdit ? "Зберегти" : "Створити"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── CloseTaskModal ── */
function CloseTaskModal({ task, saving, onClose, onConfirm }) {
  return (
    <div className="kc-modal-bg">
      <div className="kc-modal" style={{ maxWidth: 380 }}>
        <div className="kc-modal-title" style={{ color: "var(--red)" }}>Закрити завдання?</div>
        <p style={{ color: "var(--dim)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>{task?.title}</strong>
          {" буде позначено як закрите. Можна відновити зі сторінки деталей."}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="kc-btn kc-btn-ghost" onClick={onClose} disabled={saving}>Скасувати</button>
          <button className="kc-btn kc-btn-danger" onClick={onConfirm} disabled={saving} style={{ borderColor: "var(--red)", background: "#2a1a1a" }}>
            {saving ? "Закриття…" : "Закрити завдання"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── KanbanBoard ── */
function KanbanBoard({
  workers, tasks, filter, setFilter, search, setSearch,
  showClosed, setShowClosed, closedCount, activeTasks,
  assigning, setAssigning, busy, assign, dropRef,
  byStage, unassignedCount, isAdmin,
  onCreateTask, onEditTask, onCloseTask, onMoveStage,
}) {
  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 340 }}>
          <input className="kc-input" style={{ paddingLeft: 34 }}
            placeholder="Пошук по назві, опису…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--faint)", pointerEvents: "none" }}>
            <Icon name="search" size={14} />
          </div>
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "var(--faint)", cursor: "pointer", fontSize: 18 }}>×</button>
          )}
        </div>
        <button onClick={() => setShowClosed(v => !v)}
          className={`kc-btn ${showClosed ? "kc-btn-primary" : ""}`}
          style={{ fontSize: 12, whiteSpace: "nowrap" }}>
          <Icon name="check" size={13} />
          {showClosed ? "Закриті увімк." : "Показати закриті"}
          {closedCount > 0 && <span style={{ opacity: .7 }}> ({closedCount})</span>}
        </button>
      </div>

      {/* Worker filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        <FilterTab active={filter === "all"} color="#d99e54" onClick={() => setFilter("all")}
          icon={<Icon name="users" size={14} color="#d99e54" />}
          name="Всі" count={activeTasks.length} unit="завдань" />
        {workers.map(w => {
          const cnt = activeTasks.filter(t => String(t.assigned_to) === String(w.id)).length;
          return (
            <div key={w.id} style={{ display: "flex", gap: 2, alignItems: "stretch" }}>
              <FilterTab active={filter === String(w.id)} color={workerColor(w.id)}
                onClick={() => setFilter(String(w.id))}
                avatar={<Avatar worker={w} size={26} />}
                name={w.full_name.split(" ")[0]} count={cnt} unit="завдань" />
              <Link href={`/admin/workers/${w.id}`} title="Кабінет" style={{ display: "flex", alignItems: "center", paddingRight: 6, color: "var(--faint)", textDecoration: "none" }}>
                <Icon name="user" size={13} />
              </Link>
            </div>
          );
        })}
        {unassignedCount > 0 && (
          <FilterTab active={filter === "unassigned"} color="#d96c6c" onClick={() => setFilter("unassigned")}
            icon={<span style={{ fontSize: 14, color: "#d96c6c", fontWeight: 700 }}>?</span>}
            name="Без виконавця" count={unassignedCount} unit="завдань" />
        )}
      </div>

      {/* 4 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, alignItems: "start" }}>
        {STAGES.map(stage => {
          const stageTasks = byStage(stage.key);
          const activeCount = stageTasks.filter(t => t.status !== "closed").length;
          return (
            <div key={stage.key} style={{ background: "var(--panel-2)", borderRadius: 12, padding: 12, border: `1.5px solid ${stage.color}33` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, color: stage.color }}>{stage.label}</div>
                  <div style={{ fontSize: 10.5, color: "var(--dim)", marginTop: 1 }}>{stage.desc}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ background: stage.color, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                    {activeCount}
                  </div>
                  <button onClick={() => onCreateTask(stage.key)} title={`Нове завдання — ${stage.label}`}
                    style={{ width: 20, height: 20, borderRadius: "50%", border: `1px solid ${stage.color}66`, background: stage.color + "22", color: stage.color, cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stageTasks.length === 0 && (
                  <div style={{ textAlign: "center", padding: "18px 0", color: "var(--faint)", fontSize: 12 }}>Немає завдань</div>
                )}
                {stageTasks.map(t => (
                  <TaskCard key={t.id}
                    task={t} workers={workers}
                    assigning={assigning} setAssigning={setAssigning}
                    busy={busy} assign={assign} dropRef={dropRef}
                    onEdit={onEditTask} onClose={onCloseTask} onMoveStage={onMoveStage}
                    isAdmin={isAdmin} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── TaskCard ── */
function TaskCard({ task, workers, assigning, setAssigning, busy, assign, dropRef, onEdit, onClose, onMoveStage, isAdmin }) {
  const assignee    = workers.find(w => w.id === task.assigned_to);
  const isAssigning = assigning === task.id;
  const isBusy      = busy === String(task.id);
  const isClosed    = task.status === "closed";
  const stageIdx    = STAGES.findIndex(s => s.key === task.stage);
  const priColor    = PRIORITY_CLR[task.priority] || "var(--dim)";

  return (
    <div ref={isAssigning ? dropRef : null} className="kc-card"
      style={{ padding: "11px 13px", opacity: isClosed ? 0.6 : 1 }}>

      {/* Priority + title */}
      {task.priority !== "normal" && (
        <div style={{ fontSize: 10, fontWeight: 700, color: priColor, marginBottom: 4, letterSpacing: .5 }}>
          {PRIORITY_UA[task.priority]}
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, marginBottom: 5 }}>{task.title}</div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        {task.days_left !== null && !isClosed && <DeadlineBadge days={task.days_left} />}
        {task.doc_count > 0 && (
          <span style={{ fontSize: 10, color: "var(--dim)", background: "var(--panel-2)", padding: "1px 6px", borderRadius: 5, border: "1px solid var(--border)" }}>
            📎 {task.doc_count}
          </span>
        )}
        {isClosed && <span style={{ fontSize: 10, color: "var(--faint)", background: "var(--panel-2)", padding: "2px 7px", borderRadius: 6 }}>Закрите</span>}
      </div>

      {/* Assignee */}
      {!isClosed && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isAssigning ? 6 : 0 }}>
            {assignee ? (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Avatar worker={assignee} size={18} />
                <span style={{ fontSize: 11, color: "var(--dim)" }}>{assignee.full_name.split(" ")[0]}</span>
              </div>
            ) : (
              <span style={{ fontSize: 11, color: "var(--faint)" }}>Без виконавця</span>
            )}
            <button className="kc-btn kc-btn-ghost" style={{ fontSize: 10, padding: "2px 7px" }}
              onClick={() => setAssigning(isAssigning ? null : task.id)}>
              {isAssigning ? "✕" : "Призначити"}
            </button>
          </div>
          {isAssigning && (
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 6 }}>
              {task.assigned_to && <AssignOption label="Зняти призначення" labelColor="var(--red)" onClick={() => assign(task.id, null)} disabled={isBusy} />}
              {workers.map(w => (
                <AssignOption key={w.id} avatar={<Avatar worker={w} size={17} />}
                  label={w.full_name} active={task.assigned_to === w.id} activeColor={workerColor(w.id)}
                  onClick={() => assign(task.id, w.id)} disabled={isBusy} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 8 }}>
        <StageBtn disabled={stageIdx <= 0 || isBusy} title={stageIdx > 0 ? `← ${STAGES[stageIdx-1].label}` : ""} onClick={() => onMoveStage(task, -1)}>←</StageBtn>
        <StageBtn disabled={stageIdx >= STAGES.length - 1 || isBusy} title={stageIdx < STAGES.length - 1 ? `→ ${STAGES[stageIdx+1].label}` : ""} onClick={() => onMoveStage(task, 1)}>→</StageBtn>
        <div style={{ flex: 1 }} />
        <Link href={`/admin/tasks/${task.id}`} title="Деталі завдання"
          style={{ fontSize: 13, color: "var(--dim)", padding: "2px 6px", textDecoration: "none", borderRadius: 5 }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--brass)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>↗</Link>
        <button onClick={() => onEdit(task)} title="Редагувати"
          style={{ border: "none", background: "none", cursor: "pointer", color: "var(--dim)", fontSize: 14, padding: "2px 6px", borderRadius: 5 }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>✎</button>
        {isAdmin && !isClosed && (
          <button onClick={() => onClose(task)} title="Закрити"
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--faint)", fontSize: 15, padding: "2px 6px", borderRadius: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}>✕</button>
        )}
      </div>
    </div>
  );
}

function StageBtn({ disabled, title, onClick, children }) {
  return (
    <button disabled={disabled} title={title} onClick={onClick}
      style={{ border: "1px solid var(--border)", borderRadius: 6, background: "transparent", color: disabled ? "var(--faint)" : "var(--dim)", cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, padding: "2px 7px", opacity: disabled ? 0.3 : 1, transition: "all .15s" }}>
      {children}
    </button>
  );
}

function FilterTab({ active, color, onClick, icon, avatar, name, count, unit }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, cursor: "pointer",
      border: active ? `2px solid ${color}` : "1.5px solid var(--border)",
      background: active ? color + "22" : "var(--panel)", color: "var(--text)",
      transition: "border .15s, background .15s", fontFamily: "var(--font)",
    }}>
      {avatar || <div style={{ width: 26, height: 26, borderRadius: "50%", background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>}
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontSize: 11, color: "var(--dim)" }}>{count} {unit}</div>
      </div>
    </button>
  );
}

function AssignOption({ avatar, label, labelColor, active, activeColor, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "7px 10px", textAlign: "left",
      background: active ? activeColor + "22" : "transparent",
      border: "none", borderBottom: "1px solid var(--border)",
      color: labelColor || "var(--text)", fontSize: 12, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font)",
    }}>
      {avatar}<span style={{ flex: 1 }}>{label}</span>
      {active && <span style={{ color: activeColor, fontSize: 13 }}>✓</span>}
    </button>
  );
}

function DeadlineBadge({ days }) {
  const color = days < 0 ? "#d96c6c" : days < 14 ? "#d99e54" : "#5fb87a";
  const text  = days < 0 ? `+${Math.abs(days)}д` : days === 0 ? "Сьогодні!" : `${days}д`;
  return <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: color + "22", color }}>{text}</div>;
}
