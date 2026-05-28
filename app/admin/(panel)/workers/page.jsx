"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Icon, Spinner } from "@/components/admin/ui";

/* ── Constants ─────────────────────────────────────────────────────────────── */
const STAGES = [
  { key: "todo",        label: "Нові завдання", short: "Нові",      color: "#6fa3d4", wip: 10 },
  { key: "in_progress", label: "В роботі",      short: "Робота",    color: "#d99e54", wip: 6  },
  { key: "review",      label: "На перевірці",  short: "Перевірка", color: "#9b7fd4", wip: 6  },
  { key: "done",        label: "Завершено",     short: "Готово",    color: "#5fb87a", wip: 999 },
];

const PRIORITY_CLR = { low: "#828c9b", normal: "#6fa3d4", high: "#d99e54", urgent: "#d96c6c" };
const PRIORITY_UA  = { low: "Низький", normal: "Звичайний", high: "Високий", urgent: "ТЕРМІНОВО" };
const PRIORITY_ICN = { low: "↓", normal: "→", high: "↑", urgent: "⚡" };
const CAT_CLR = { general: "#6fa3d4", legal: "#9b7fd4", admin: "#d99e54", research: "#5fb87a" };
const CAT_UA  = { general: "Заг.", legal: "Юрид.", admin: "Адмін.", research: "Дослід." };
const WORKER_COLORS = ["#6fa3d4","#d99e54","#5fb87a","#d96c6c","#9b7fd4","#54c4d9","#d4a76f","#7fd4c4"];

const wColor   = (id) => WORKER_COLORS[Number(id) % WORKER_COLORS.length];
const initials = (name) => (name || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
const daysAgo  = (d) => d ? Math.floor((Date.now() - new Date(d)) / 86400000) : null;

/* ── Avatar ─────────────────────────────────────────────────────────────────── */
function Avatar({ worker, size = 26 }) {
  const c = wColor(worker.id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: c + "30", border: `1.5px solid ${c}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: c,
    }}>{initials(worker.full_name)}</div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────────── */
export default function WorkersPage() {
  const [tab, setTab]         = useState("team");
  const [me, setMe]           = useState(null);
  const [workers, setWorkers] = useState(null);
  const [tasks, setTasks]     = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  /* team crud */
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({});
  const [formErr, setFormErr]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [tempPwd, setTempPwd]   = useState("");

  /* kanban filters */
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [showClosed, setShowClosed]   = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [catFilter, setCatFilter]     = useState("all");
  const [viewMode, setViewMode]       = useState("board");
  const [myTasks, setMyTasks]         = useState(false);
  const [collapsed, setCollapsed]     = useState(new Set());

  /* kanban drag */
  const [dragTask, setDragTask] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  /* kanban quick-add */
  const [quickAdd, setQuickAdd]       = useState(null);
  const [quickTitle, setQuickTitle]   = useState("");
  const [quickSaving, setQuickSaving] = useState(false);

  /* assign dropdown */
  const [assigning, setAssigning] = useState(null);
  const [busy, setBusy]           = useState("");
  const dropRef = useRef(null);

  /* toast */
  const [toast, setToast]   = useState("");
  const [toastOk, setToastOk] = useState(true);

  /* task crud */
  const [taskModal, setTaskModal]       = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm]         = useState({});
  const [taskErr, setTaskErr]           = useState("");
  const [taskSaving, setTaskSaving]     = useState(false);

  const flash = (msg, ok = true) => {
    setToast(msg); setToastOk(ok);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(async () => {
    const [wr, tr, mr] = await Promise.all([
      fetch("/api/admin/workers").then(r => r.json()),
      fetch("/api/admin/tasks").then(r => r.json()),
      fetch("/api/admin/auth/me").then(r => r.json()),
    ]);
    setWorkers(wr.workers || []);
    setTasks(tr.tasks    || []);
    setMe(mr.user        || null);
    setLastRefresh(Date.now());
  }, []);

  useEffect(() => { load(); }, [load]);

  /* auto-refresh every 60s */
  useEffect(() => {
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  /* close assign dropdown on outside click */
  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setAssigning(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Team CRUD ── */
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

  /* ── Task assign ── */
  const assign = async (taskId, workerId) => {
    setBusy(String(taskId));
    await fetch(`/api/admin/tasks/${taskId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to: workerId ?? null }),
    });
    const w = workers?.find(w => w.id === workerId);
    flash(w ? `Призначено → ${w.full_name}` : "Призначення знято");
    setAssigning(null); setBusy(""); load();
  };

  /* ── Stage move (drag or arrow) ── */
  const moveToStage = async (task, stageKey) => {
    if (task.stage === stageKey) return;
    setBusy(String(task.id));
    await fetch(`/api/admin/tasks/${task.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: stageKey }),
    });
    setBusy("");
    if (stageKey === "done") flash("✅ Завдання завершено!");
    load();
  };

  const moveStage = async (t, dir) => {
    const idx = STAGES.findIndex(s => s.key === t.stage);
    const next = idx + dir;
    if (next < 0 || next >= STAGES.length) return;
    await moveToStage(t, STAGES[next].key);
  };

  /* ── Quick add ── */
  const doQuickAdd = async (stageKey) => {
    if (!quickTitle.trim()) { setQuickAdd(null); return; }
    setQuickSaving(true);
    await fetch("/api/admin/tasks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quickTitle.trim(), stage: stageKey, priority: "normal", category: "general" }),
    });
    setQuickSaving(false); setQuickAdd(null); setQuickTitle("");
    flash("Завдання створено"); load();
  };

  /* ── Task CRUD ── */
  const openCreateTask = (defaultStage = "todo") => {
    setTaskForm({ title: "", description: "", category: "general", priority: "normal", stage: defaultStage, assigned_to: "", deadline: "" });
    setTaskErr(""); setTaskModal("create");
  };
  const openEditTask = (t) => {
    setTaskForm({
      title: t.title || "", description: t.description || "", category: t.category || "general",
      priority: t.priority || "normal", stage: t.stage || "todo",
      assigned_to: t.assigned_to ? String(t.assigned_to) : "", deadline: t.deadline ? t.deadline.slice(0, 10) : "",
    });
    setTaskErr(""); setSelectedTask(t); setTaskModal("edit");
  };
  const openCloseTask  = (t) => { setSelectedTask(t); setTaskErr(""); setTaskModal("close"); };
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
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    setTaskSaving(false); flash("Завдання закрито"); closeTaskModal(); load();
  };

  /* ── Filtering ── */
  const applyFilters = (arr) => {
    if (!showClosed) arr = arr.filter(t => t.status !== "closed");
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(t => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (priorityFilter !== "all") arr = arr.filter(t => t.priority === priorityFilter);
    if (catFilter !== "all")      arr = arr.filter(t => t.category === catFilter);
    if (myTasks && me)            arr = arr.filter(t => String(t.assigned_to) === String(me.id));
    if (filter === "unassigned")  return arr.filter(t => !t.assigned_to);
    if (filter !== "all")         return arr.filter(t => String(t.assigned_to) === filter);
    return arr;
  };
  const byStage = (stage) => applyFilters((tasks || []).filter(t => t.stage === stage));

  if (!workers || !tasks) return <Spinner />;

  const isAdmin         = me?.role === "admin";
  const activeTasks     = tasks.filter(t => t.status !== "closed");
  const closedTasks     = tasks.filter(t => t.status === "closed");
  const urgentCount     = activeTasks.filter(t => t.priority === "urgent").length;
  const overdueCount    = activeTasks.filter(t => typeof t.days_left === "number" && t.days_left < 0).length;
  const unassignedCount = activeTasks.filter(t => !t.assigned_to).length;
  const doneToday       = tasks.filter(t => t.stage === "done" && daysAgo(t.updated_at) === 0).length;

  return (
    <div>
      {/* Toast portal */}
      {toast && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          background: "var(--panel)", border: `1px solid ${toastOk ? "var(--green)" : "var(--red)"}44`,
          borderRadius: 12, padding: "11px 22px",
          boxShadow: "0 8px 32px rgba(0,0,0,.3)",
          fontSize: 14, fontWeight: 600, color: "var(--text)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "kc-fade .2s ease",
        }}>
          {toast}
        </div>,
        document.body
      )}

      {/* Tab bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <TabBtn active={tab === "team"}   color="var(--brass)" onClick={() => setTab("team")}>
            <Icon name="users" size={14} /> Команда <Cnt>{workers.length}</Cnt>
          </TabBtn>
          <TabBtn active={tab === "kanban"} color="var(--blue)"  onClick={() => setTab("kanban")}>
            <Icon name="grid" size={14} /> Канбан <Cnt>{activeTasks.length}</Cnt>
          </TabBtn>
        </div>
        {tab === "team" && isAdmin && (
          <button className="kc-btn kc-btn-primary" onClick={openAdd}>
            <Icon name="plus" size={14} /> Додати спеціаліста
          </button>
        )}
        {tab === "kanban" && (
          <button className="kc-btn kc-btn-primary" onClick={() => openCreateTask()}>
            <Icon name="plus" size={14} /> Нове завдання
          </button>
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
          workers={workers} tasks={tasks} me={me}
          filter={filter} setFilter={setFilter}
          search={search} setSearch={setSearch}
          showClosed={showClosed} setShowClosed={setShowClosed}
          closedCount={closedTasks.length}
          activeTasks={activeTasks}
          urgentCount={urgentCount} overdueCount={overdueCount}
          unassignedCount={unassignedCount} doneToday={doneToday}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          catFilter={catFilter} setCatFilter={setCatFilter}
          viewMode={viewMode} setViewMode={setViewMode}
          myTasks={myTasks} setMyTasks={setMyTasks}
          collapsed={collapsed} setCollapsed={setCollapsed}
          assigning={assigning} setAssigning={setAssigning}
          busy={busy} assign={assign} dropRef={dropRef}
          byStage={byStage} isAdmin={isAdmin}
          onCreateTask={openCreateTask}
          onEditTask={openEditTask}
          onCloseTask={openCloseTask}
          onMoveStage={moveStage}
          onMoveToStage={moveToStage}
          dragTask={dragTask} setDragTask={setDragTask}
          dragOver={dragOver} setDragOver={setDragOver}
          quickAdd={quickAdd} setQuickAdd={setQuickAdd}
          quickTitle={quickTitle} setQuickTitle={setQuickTitle}
          quickSaving={quickSaving} doQuickAdd={doQuickAdd}
          lastRefresh={lastRefresh}
        />
      )}

      {/* Worker modals */}
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

      {/* Task modals */}
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

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
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

/* ── Stats Strip ─────────────────────────────────────────────────────────────── */
function StatsStrip({ activeTasks, urgentCount, overdueCount, unassignedCount, doneToday, lastRefresh }) {
  const t = new Date(lastRefresh).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
      <StatPill icon="layers" value={activeTasks.length} label="Активних"      color="var(--blue)" />
      <StatPill icon="alert"  value={urgentCount}        label="Термінових"    color="var(--red)"  pulse={urgentCount > 0} />
      <StatPill icon="trash"  value={overdueCount}       label="Прострочено"   color={overdueCount > 0 ? "#d96c6c" : "var(--faint)"} />
      <StatPill icon="user"   value={unassignedCount}    label="Без виконавця" color={unassignedCount > 0 ? "#d99e54" : "var(--faint)"} />
      <StatPill icon="check"  value={doneToday}          label={`Сьогодні ✓ · ${t}`} color="#5fb87a" />
    </div>
  );
}
function StatPill({ icon, value, label, color, pulse }) {
  return (
    <div style={{
      background: "var(--panel)", border: `1px solid ${pulse ? color + "55" : "var(--border)"}`,
      borderRadius: 10, padding: "10px 14px",
      display: "flex", alignItems: "center", gap: 10,
      animation: pulse ? "kc-urgent-pulse 2s ease-in-out infinite" : "none",
      transition: "border-color .3s",
    }}>
      <div style={{ color, flexShrink: 0 }}><Icon name={icon} size={16} /></div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "var(--display)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 10, color: "var(--faint)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      </div>
    </div>
  );
}

/* ── WorkerCard ──────────────────────────────────────────────────────────────── */
function WorkerCard({ worker, isAdmin, onEdit, onDelete }) {
  const color = wColor(worker.id);
  const roleLabel = worker.role === "admin" ? "Адміністратор" : "Модератор";
  return (
    <div className="kc-card" style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", margin: "0 auto 12px",
          background: color + "25", border: `2.5px solid ${color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color,
        }}>{initials(worker.full_name)}</div>
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
            <button onClick={onEdit}   className="kc-btn" title="Редагувати" style={{ padding: "9px 11px" }}><Icon name="settings" size={14} /></button>
            <button onClick={onDelete} className="kc-btn kc-btn-danger" title="Видалити" style={{ padding: "9px 11px" }}><Icon name="trash" size={14} /></button>
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

/* ── KanbanBoard ─────────────────────────────────────────────────────────────── */
function KanbanBoard({
  workers, tasks, me,
  filter, setFilter, search, setSearch,
  showClosed, setShowClosed, closedCount, activeTasks,
  urgentCount, overdueCount, unassignedCount, doneToday,
  priorityFilter, setPriorityFilter,
  catFilter, setCatFilter,
  viewMode, setViewMode,
  myTasks, setMyTasks,
  collapsed, setCollapsed,
  assigning, setAssigning, busy, assign, dropRef,
  byStage, isAdmin,
  onCreateTask, onEditTask, onCloseTask, onMoveStage, onMoveToStage,
  dragTask, setDragTask, dragOver, setDragOver,
  quickAdd, setQuickAdd, quickTitle, setQuickTitle, quickSaving, doQuickAdd,
  lastRefresh,
}) {
  const toggleCollapse = (key) => setCollapsed(prev => {
    const s = new Set(prev);
    if (s.has(key)) s.delete(key); else s.add(key);
    return s;
  });

  const onDragStart = (e, task) => {
    setDragTask(task);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver  = (e, key) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(key); };
  const onDragLeave = ()       => setDragOver(null);
  const onDrop      = (e, key) => { e.preventDefault(); if (dragTask) onMoveToStage(dragTask, key); setDragTask(null); setDragOver(null); };

  return (
    <div>
      <StatsStrip activeTasks={activeTasks} urgentCount={urgentCount} overdueCount={overdueCount}
        unassignedCount={unassignedCount} doneToday={doneToday} lastRefresh={lastRefresh} />

      {/* Main toolbar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180, maxWidth: 300 }}>
          <input className="kc-input" style={{ paddingLeft: 34 }}
            placeholder="Пошук завдань…" value={search} onChange={e => setSearch(e.target.value)} />
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--faint)", pointerEvents: "none" }}>
            <Icon name="search" size={14} />
          </div>
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "var(--faint)", cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          <ViewBtn active={viewMode === "board"} onClick={() => setViewMode("board")} title="Дошка"><Icon name="grid"   size={13} /></ViewBtn>
          <ViewBtn active={viewMode === "list"}  onClick={() => setViewMode("list")}  title="Список"><Icon name="layers" size={13} /></ViewBtn>
        </div>

        {/* My tasks */}
        {me && (
          <button onClick={() => setMyTasks(v => !v)} className={`kc-btn ${myTasks ? "kc-btn-primary" : ""}`}
            style={{ fontSize: 12, padding: "8px 12px", whiteSpace: "nowrap" }}>
            <Icon name="user" size={13} /> Мої завдання
          </button>
        )}

        {/* Show closed */}
        <button onClick={() => setShowClosed(v => !v)} className={`kc-btn ${showClosed ? "kc-btn-primary" : ""}`}
          style={{ fontSize: 12, padding: "8px 12px", whiteSpace: "nowrap" }}>
          <Icon name="check" size={13} />
          {showClosed ? "Закриті увімк." : "Закриті вимк."}
          {closedCount > 0 && <span style={{ opacity: .6 }}> ({closedCount})</span>}
        </button>
      </div>

      {/* Priority + category chip filters */}
      <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 10.5, color: "var(--faint)", fontWeight: 600, letterSpacing: .5 }}>ПРІОР:</span>
        <Chip active={priorityFilter === "all"} color="var(--text)" onClick={() => setPriorityFilter("all")}>Всі</Chip>
        {["urgent", "high", "normal", "low"].map(p => (
          <Chip key={p} active={priorityFilter === p} color={PRIORITY_CLR[p]} onClick={() => setPriorityFilter(p)}>
            {PRIORITY_ICN[p]} {PRIORITY_UA[p]}
          </Chip>
        ))}
        <div style={{ width: 1, height: 18, background: "var(--border)", margin: "0 3px" }} />
        <span style={{ fontSize: 10.5, color: "var(--faint)", fontWeight: 600, letterSpacing: .5 }}>КАТ:</span>
        <Chip active={catFilter === "all"} color="var(--text)" onClick={() => setCatFilter("all")}>Всі</Chip>
        {["general", "legal", "admin", "research"].map(c => (
          <Chip key={c} active={catFilter === c} color={CAT_CLR[c]} onClick={() => setCatFilter(c)}>{CAT_UA[c]}</Chip>
        ))}
      </div>

      {/* Worker filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        <FilterTab active={filter === "all"} color="#d99e54" onClick={() => setFilter("all")}
          icon={<Icon name="users" size={14} color="#d99e54" />}
          name="Всі" count={activeTasks.length} unit="завдань" />
        {workers.map(w => {
          const cnt = activeTasks.filter(t => String(t.assigned_to) === String(w.id)).length;
          return (
            <div key={w.id} style={{ display: "flex", gap: 2, alignItems: "stretch" }}>
              <FilterTab active={filter === String(w.id)} color={wColor(w.id)}
                onClick={() => setFilter(String(w.id))}
                avatar={<Avatar worker={w} size={26} />}
                name={w.full_name.split(" ")[0]} count={cnt} unit="завдань" />
              <Link href={`/admin/workers/${w.id}`} title="Кабінет"
                style={{ display: "flex", alignItems: "center", paddingRight: 6, color: "var(--faint)", textDecoration: "none" }}>
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

      {/* Board or List */}
      {viewMode === "board" ? (
        <div style={{ display: "flex", gap: 12, alignItems: "start", overflowX: "auto", paddingBottom: 8 }}>
          {STAGES.map(stage => {
            const isCollapsed = collapsed.has(stage.key);
            const stageTasks  = byStage(stage.key);
            const activeCount = stageTasks.filter(t => t.status !== "closed").length;
            const overdueInCol = stageTasks.filter(t => typeof t.days_left === "number" && t.days_left < 0).length;
            const isWip       = activeCount > stage.wip && stage.wip < 999;
            const isDropTarget = dragOver === stage.key;

            if (isCollapsed) {
              return (
                <div key={stage.key}
                  style={{
                    flexShrink: 0, width: 42, minHeight: 200,
                    background: "var(--panel-2)", borderRadius: 12,
                    border: `1.5px solid ${stage.color}44`,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "12px 0", gap: 10, cursor: "pointer",
                  }}
                  onClick={() => toggleCollapse(stage.key)}
                  onDragOver={e => onDragOver(e, stage.key)}
                  onDragLeave={onDragLeave}
                  onDrop={e => onDrop(e, stage.key)}>
                  <div style={{
                    background: stage.color, color: "#fff", borderRadius: "50%",
                    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                  }}>{activeCount}</div>
                  <div style={{
                    writingMode: "vertical-rl", fontSize: 10.5, fontWeight: 700,
                    color: stage.color, letterSpacing: 1, textTransform: "uppercase", opacity: .8,
                  }}>{stage.short}</div>
                </div>
              );
            }

            return (
              <div key={stage.key}
                style={{
                  flexShrink: 0, width: 262,
                  background: isDropTarget ? "color-mix(in srgb,var(--panel-2) 70%,var(--panel))" : "var(--panel-2)",
                  borderRadius: 12, padding: 12,
                  border: `1.5px solid ${isDropTarget ? stage.color : isWip ? stage.color + "88" : stage.color + "33"}`,
                  outline: isDropTarget ? `2px solid ${stage.color}44` : "none",
                  transition: "border-color .15s, background .15s, outline .15s",
                }}
                onDragOver={e => onDragOver(e, stage.key)}
                onDragLeave={onDragLeave}
                onDrop={e => onDrop(e, stage.key)}>

                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: stage.color, display: "flex", alignItems: "center", gap: 5 }}>
                      {stage.label}
                      {isWip && <span style={{ fontSize: 9, background: stage.color, color: "#fff", borderRadius: 4, padding: "1px 5px", letterSpacing: .3 }}>WIP ЛІМІТ</span>}
                    </div>
                    {overdueInCol > 0 && (
                      <div style={{ fontSize: 10, color: "#d96c6c", marginTop: 1 }}>⚠ {overdueInCol} прострочено</div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{
                      background: stage.color, color: "#fff", borderRadius: "50%",
                      width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                    }}>{activeCount}</div>
                    <button
                      onClick={() => { setQuickAdd(quickAdd === stage.key ? null : stage.key); setQuickTitle(""); }}
                      title="Швидке завдання"
                      style={{
                        width: 20, height: 20, borderRadius: "50%", cursor: "pointer", fontSize: 15, fontWeight: 700,
                        border: `1px solid ${stage.color}66`, background: stage.color + "22", color: stage.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      {quickAdd === stage.key ? "×" : "+"}
                    </button>
                    <button onClick={() => toggleCollapse(stage.key)} title="Згорнути колонку"
                      style={{
                        width: 20, height: 20, borderRadius: "50%", cursor: "pointer", fontSize: 10,
                        border: "1px solid var(--border)", background: "transparent", color: "var(--faint)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>◂</button>
                  </div>
                </div>

                {/* Inline quick-add */}
                {quickAdd === stage.key && (
                  <div style={{ marginBottom: 8 }}>
                    <input className="kc-input" style={{ fontSize: 12, padding: "7px 10px", marginBottom: 5 }}
                      autoFocus placeholder="Назва завдання (Enter = зберегти)"
                      value={quickTitle} onChange={e => setQuickTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter")  doQuickAdd(stage.key);
                        if (e.key === "Escape") { setQuickAdd(null); setQuickTitle(""); }
                      }} />
                    <div style={{ display: "flex", gap: 5 }}>
                      <button className="kc-btn kc-btn-primary" style={{ flex: 1, fontSize: 11, padding: "5px" }}
                        onClick={() => doQuickAdd(stage.key)} disabled={quickSaving}>
                        {quickSaving ? "…" : "Додати"}
                      </button>
                      <button className="kc-btn kc-btn-ghost" style={{ fontSize: 11, padding: "5px 9px" }}
                        onClick={() => { setQuickAdd(null); setQuickTitle(""); }}>✕</button>
                    </div>
                  </div>
                )}

                {/* Task cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {stageTasks.length === 0 && quickAdd !== stage.key && (
                    <div style={{
                      textAlign: "center", padding: "24px 8px",
                      color: "var(--faint)", fontSize: 12,
                      border: `2px dashed ${stage.color}22`, borderRadius: 8,
                    }}>
                      {isDropTarget ? `↓ Перетягни сюди` : "Немає завдань"}
                    </div>
                  )}
                  {stageTasks.map(t => (
                    <TaskCard key={t.id} task={t} workers={workers}
                      assigning={assigning} setAssigning={setAssigning}
                      busy={busy} assign={assign} dropRef={dropRef}
                      onEdit={onEditTask} onClose={onCloseTask} onMoveStage={onMoveStage}
                      isAdmin={isAdmin}
                      onDragStart={onDragStart}
                      isDragging={dragTask?.id === t.id} />
                  ))}
                </div>

                {/* Column footer add */}
                {stageTasks.length > 0 && (
                  <button onClick={() => onCreateTask(stage.key)}
                    style={{
                      width: "100%", marginTop: 8, padding: "7px", borderRadius: 8,
                      border: `1px dashed ${stage.color}33`, background: "transparent",
                      color: "var(--faint)", cursor: "pointer", fontSize: 12,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      transition: "color .15s, border-color .15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = stage.color; e.currentTarget.style.borderColor = stage.color + "66"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--faint)"; e.currentTarget.style.borderColor = stage.color + "33"; }}>
                    <Icon name="plus" size={12} /> Додати у {stage.short}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <ListBoard
          tasks={tasks.filter(t => showClosed || t.status !== "closed")}
          workers={workers}
          onEdit={onEditTask} onClose={onCloseTask} onMoveStage={onMoveStage}
          isAdmin={isAdmin} />
      )}
    </div>
  );
}

/* ── List View ───────────────────────────────────────────────────────────────── */
function ListBoard({ tasks, workers, onEdit, onClose, onMoveStage, isAdmin }) {
  const [sortBy,  setSortBy]  = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  const sort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const sorted = [...tasks].sort((a, b) => {
    let va = a[sortBy] || "", vb = b[sortBy] || "";
    if (sortBy === "days_left") { va = Number(a.days_left ?? 9999); vb = Number(b.days_left ?? 9999); }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ?  1 : -1;
    return 0;
  });

  const SortTh = ({ col, children }) => (
    <th onClick={() => sort(col)} style={{
      padding: "9px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--dim)",
      whiteSpace: "nowrap", cursor: "pointer", userSelect: "none",
      background: "var(--panel-2)", borderBottom: "1px solid var(--border)",
    }}>
      {children}{sortBy === col ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <SortTh col="priority">Пріор.</SortTh>
            <SortTh col="title">Назва завдання</SortTh>
            <SortTh col="stage">Етап</SortTh>
            <SortTh col="category">Категорія</SortTh>
            <SortTh col="assigned_to">Виконавець</SortTh>
            <SortTh col="days_left">Дедлайн</SortTh>
            <th style={{ padding: "9px 12px", fontSize: 11, fontWeight: 600, color: "var(--dim)", background: "var(--panel-2)", borderBottom: "1px solid var(--border)" }}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const assignee  = workers.find(w => w.id === t.assigned_to);
            const stage     = STAGES.find(s => s.key === t.stage);
            const stageIdx  = STAGES.findIndex(s => s.key === t.stage);
            const priColor  = PRIORITY_CLR[t.priority] || "var(--dim)";
            const isClosed  = t.status === "closed";
            return (
              <tr key={t.id} style={{
                background: i % 2 === 0 ? "transparent" : "var(--panel-2)" + "44",
                opacity: isClosed ? .55 : 1,
                borderLeft: `3px solid ${priColor}`,
              }}>
                <td style={{ padding: "9px 12px", fontSize: 11, color: priColor, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {PRIORITY_ICN[t.priority]} {PRIORITY_UA[t.priority]}
                </td>
                <td style={{ padding: "9px 12px", maxWidth: 320 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t.title}</div>
                  {t.description && (
                    <div style={{ fontSize: 11, color: "var(--faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 290, marginTop: 2 }}>
                      {t.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: stage?.color, background: stage?.color + "22", padding: "2px 8px", borderRadius: 6 }}>
                    {stage?.label}
                  </span>
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <span style={{ fontSize: 11, color: CAT_CLR[t.category] || "var(--dim)", fontWeight: 600 }}>
                    {CAT_UA[t.category] || t.category}
                  </span>
                </td>
                <td style={{ padding: "9px 12px" }}>
                  {assignee ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Avatar worker={assignee} size={20} />
                      <span style={{ fontSize: 12, color: "var(--dim)" }}>{assignee.full_name.split(" ")[0]}</span>
                    </div>
                  ) : <span style={{ fontSize: 11, color: "var(--faint)" }}>—</span>}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  {t.days_left != null && !isClosed ? <DeadlineBadge days={t.days_left} /> : <span style={{ color: "var(--faint)", fontSize: 11 }}>—</span>}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button disabled={stageIdx <= 0} onClick={() => onMoveStage(t, -1)}
                      style={{ border: "1px solid var(--border)", borderRadius: 5, background: "transparent", color: stageIdx <= 0 ? "var(--faint)" : "var(--dim)", cursor: stageIdx <= 0 ? "not-allowed" : "pointer", padding: "2px 7px", fontSize: 12, opacity: stageIdx <= 0 ? .3 : 1 }}>←</button>
                    <button disabled={stageIdx >= STAGES.length - 1} onClick={() => onMoveStage(t, 1)}
                      style={{ border: "1px solid var(--border)", borderRadius: 5, background: "transparent", color: stageIdx >= STAGES.length - 1 ? "var(--faint)" : "var(--dim)", cursor: stageIdx >= STAGES.length - 1 ? "not-allowed" : "pointer", padding: "2px 7px", fontSize: 12, opacity: stageIdx >= STAGES.length - 1 ? .3 : 1 }}>→</button>
                    <Link href={`/admin/tasks/${t.id}`} style={{ color: "var(--dim)", textDecoration: "none", padding: "2px 6px", fontSize: 13 }}>↗</Link>
                    <button onClick={() => onEdit(t)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--dim)", fontSize: 14, padding: "2px 6px" }}>✎</button>
                    {isAdmin && !isClosed && <button onClick={() => onClose(t)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--faint)", fontSize: 15, padding: "2px 6px" }}>✕</button>}
                  </div>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--faint)" }}>Немає завдань</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── TaskCard ────────────────────────────────────────────────────────────────── */
function TaskCard({ task, workers, assigning, setAssigning, busy, assign, dropRef, onEdit, onClose, onMoveStage, isAdmin, onDragStart, isDragging }) {
  const assignee    = workers.find(w => w.id === task.assigned_to);
  const isAssigning = assigning === task.id;
  const isBusy      = busy === String(task.id);
  const isClosed    = task.status === "closed";
  const stageIdx    = STAGES.findIndex(s => s.key === task.stage);
  const priColor    = PRIORITY_CLR[task.priority] || "var(--dim)";
  const catColor    = CAT_CLR[task.category]       || "var(--dim)";
  const isUrgent    = task.priority === "urgent" && !isClosed;
  const ageInStage  = daysAgo(task.updated_at);

  return (
    <div
      ref={isAssigning ? dropRef : null}
      draggable={!isClosed}
      onDragStart={e => onDragStart(e, task)}
      className="kc-card"
      style={{
        padding: "11px 13px",
        opacity: isDragging ? .45 : isClosed ? .58 : 1,
        cursor: isClosed ? "default" : isDragging ? "grabbing" : "grab",
        borderLeft: `3px solid ${priColor}`,
        outline: isUrgent ? `1px solid ${priColor}55` : "none",
        animation: isUrgent ? "kc-urgent-pulse 2.5s ease-in-out infinite" : "none",
        transform: isDragging ? "rotate(1.5deg) scale(.96)" : "none",
        transition: "opacity .15s, transform .15s",
      }}>

      {/* Category dot + priority label */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: catColor, flexShrink: 0 }} />
        <span style={{ fontSize: 9.5, color: catColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: .6 }}>
          {CAT_UA[task.category] || task.category}
        </span>
        {task.priority !== "normal" && (
          <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 700, color: priColor }}>
            {PRIORITY_ICN[task.priority]} {PRIORITY_UA[task.priority]}
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.35, marginBottom: 6, color: isClosed ? "var(--faint)" : "var(--text)" }}>
        {task.title}
      </div>

      {/* Meta badges row */}
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        {task.days_left != null && !isClosed && <DeadlineBadge days={task.days_left} />}
        {ageInStage != null && ageInStage > 1 && (
          <span style={{ fontSize: 10, color: ageInStage > 7 ? "#d99e54" : "var(--faint)", background: "var(--panel-2)", padding: "1px 6px", borderRadius: 5, border: "1px solid var(--border)" }}>
            {ageInStage}д у стані
          </span>
        )}
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
                  label={w.full_name} active={task.assigned_to === w.id} activeColor={wColor(w.id)}
                  onClick={() => assign(task.id, w.id)} disabled={isBusy} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, borderTop: "1px solid var(--border)", paddingTop: 7, marginTop: 7 }}>
        <StageBtn disabled={stageIdx <= 0 || isBusy || isClosed} title={stageIdx > 0 ? `← ${STAGES[stageIdx-1].label}` : ""} onClick={() => onMoveStage(task, -1)}>←</StageBtn>
        <StageBtn disabled={stageIdx >= STAGES.length - 1 || isBusy || isClosed} title={stageIdx < STAGES.length - 1 ? `→ ${STAGES[stageIdx+1].label}` : ""} onClick={() => onMoveStage(task, 1)}>→</StageBtn>
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
          <button onClick={() => onClose(task)} title="Закрити завдання"
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--faint)", fontSize: 15, padding: "2px 6px", borderRadius: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}>✕</button>
        )}
      </div>
    </div>
  );
}

/* ── Micro components ────────────────────────────────────────────────────────── */
function Chip({ active, color, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: 600,
      border: active ? `1.5px solid ${color}` : "1.5px solid var(--border)",
      background: active ? color + "22" : "transparent",
      color: active ? color : "var(--dim)",
      display: "flex", alignItems: "center", gap: 3,
      transition: "all .12s", fontFamily: "var(--font)",
    }}>{children}</button>
  );
}

function ViewBtn({ active, onClick, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{
      padding: "7px 10px", border: "none", cursor: "pointer",
      background: active ? "var(--brass)22" : "transparent",
      color: active ? "var(--brass)" : "var(--faint)", transition: "all .15s",
    }}>{children}</button>
  );
}

function StageBtn({ disabled, title, onClick, children }) {
  return (
    <button disabled={disabled} title={title} onClick={onClick}
      style={{
        border: "1px solid var(--border)", borderRadius: 6, background: "transparent",
        color: disabled ? "var(--faint)" : "var(--dim)", cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 13, padding: "2px 7px", opacity: disabled ? .3 : 1, transition: "all .15s",
      }}>
      {children}
    </button>
  );
}

function FilterTab({ active, color, onClick, icon, avatar, name, count, unit }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px", borderRadius: 10, cursor: "pointer",
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
  const color = days < 0 ? "#d96c6c" : days < 3 ? "#d96c6c" : days < 14 ? "#d99e54" : "#5fb87a";
  const text  = days < 0 ? `+${Math.abs(days)}д` : days === 0 ? "Сьогодні!" : days === 1 ? "Завтра" : `${days}д`;
  return <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: color + "22", color }}>{text}</div>;
}

/* ── Worker Modal ────────────────────────────────────────────────────────────── */
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

/* ── Delete Modal ────────────────────────────────────────────────────────────── */
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
          <button className="kc-btn kc-btn-danger" onClick={onDelete} disabled={saving}
            style={{ borderColor: "var(--red)", background: "color-mix(in srgb,var(--red) 12%,var(--panel))" }}>
            {saving ? "Видалення…" : <><Icon name="trash" size={13} /> Видалити</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Task Modal ──────────────────────────────────────────────────────────────── */
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
              <option value="low">↓ Низький</option>
              <option value="normal">→ Звичайний</option>
              <option value="high">↑ Високий</option>
              <option value="urgent">⚡ Терміново</option>
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

/* ── Close Task Modal ────────────────────────────────────────────────────────── */
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
          <button className="kc-btn kc-btn-danger" onClick={onConfirm} disabled={saving}
            style={{ borderColor: "var(--red)", background: "color-mix(in srgb,var(--red) 12%,var(--panel))" }}>
            {saving ? "Закриття…" : "Закрити завдання"}
          </button>
        </div>
      </div>
    </div>
  );
}
