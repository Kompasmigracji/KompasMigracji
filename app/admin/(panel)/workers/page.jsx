"use client";
/* /admin/workers — командний канбан: всi справи з призначенням по спiвробiтниках */
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Icon, Spinner } from "@/components/admin/ui";

const STAGES = [
  { key: "analysis",   label: "Аналiз документiв",  color: "#6fa3d4", desc: "Збiр доказової бази" },
  { key: "ponaglenie", label: "Понаглення подано",   color: "#d99e54", desc: "Офiцiйна скарга до Уженду" },
  { key: "court",      label: "Пiдготовка до суду",  color: "#d96c6c", desc: "Збiр архiву логiв, позов" },
];

const WORKER_COLORS = ["#6fa3d4","#d99e54","#5fb87a","#d96c6c","#9b7fd4","#54c4d9","#d4a76f","#7fd4c4"];

function workerColor(id) {
  return WORKER_COLORS[Number(id) % WORKER_COLORS.length];
}

function initials(name) {
  return (name || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function Avatar({ worker, size = 26 }) {
  const c = workerColor(worker.id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: c + "30", border: `1.5px solid ${c}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: c,
    }}>
      {initials(worker.full_name)}
    </div>
  );
}

export default function WorkersKanban() {
  const [workers, setWorkers]     = useState(null);
  const [cases, setCases]         = useState(null);
  const [filter, setFilter]       = useState("all");
  const [assigning, setAssigning] = useState(null);
  const [busy, setBusy]           = useState("");
  const [toast, setToast]         = useState("");
  const [mounted, setMounted]     = useState(false);
  const dropRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const load = useCallback(async () => {
    const [wr, cr] = await Promise.all([
      fetch("/api/admin/workers").then(r => r.json()),
      fetch("/api/admin/cases?status=active").then(r => r.json()),
    ]);
    setWorkers(wr.workers || []);
    setCases(cr.cases || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Закриваємо dropdown при клiцi поза ним
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setAssigning(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const assign = async (caseId, workerId) => {
    setBusy(caseId);
    await fetch(`/api/admin/cases/${caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to: workerId ?? null }),
    });
    const w = workers?.find(w => w.id === workerId);
    flash(w ? `Призначено → ${w.full_name}` : "Призначення знято");
    setAssigning(null);
    setBusy("");
    load();
  };

  const byStage = (stage) => {
    if (!cases) return [];
    const arr = cases.filter(c => c.stage === stage);
    if (filter === "all")        return arr;
    if (filter === "unassigned") return arr.filter(c => !c.assigned_to);
    return arr.filter(c => String(c.assigned_to) === filter);
  };

  if (!workers || !cases) return <Spinner />;

  const unassignedCount = cases.filter(c => !c.assigned_to).length;
  const totalActive     = cases.length;

  return (
    <div>
      {toast && (
        <div className="kc-note" style={{ marginBottom: 12 }}>{toast}</div>
      )}

      {/* Заголовок */}
      <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Команда & Канбан</div>
          <div style={{ color: "var(--dim)", fontSize: 12, marginTop: 2 }}>
            {totalActive} активних · {workers.length} спiвробiтникiв
            {unassignedCount > 0 && ` · ${unassignedCount} не призначено`}
          </div>
        </div>
        <Link href="/admin/cases" className="kc-btn kc-btn-ghost" style={{ fontSize: 12 }}>
          <Icon name="alert" size={14} /> Всi справи
        </Link>
      </div>

      {/* Фiльтр по працiвниках */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        {/* Всi */}
        <FilterTab
          active={filter === "all"}
          color="#d99e54"
          onClick={() => setFilter("all")}
          icon={<Icon name="users" size={14} color="#d99e54" />}
          name="Усi"
          count={totalActive}
        />

        {/* Кожен працiвник */}
        {workers.map(w => (
          <div key={w.id} style={{ position: "relative", display: "flex", gap: 2, alignItems: "stretch" }}>
            <FilterTab
              active={filter === String(w.id)}
              color={workerColor(w.id)}
              onClick={() => setFilter(String(w.id))}
              avatar={<Avatar worker={w} size={26} />}
              name={w.full_name.split(" ")[0]}
              count={Number(w.active_cases) || 0}
            />
            <Link
              href={`/admin/workers/${w.id}`}
              title="Особистий кабiнет"
              style={{
                display: "flex", alignItems: "center", paddingRight: 6,
                color: "var(--faint)", textDecoration: "none",
                fontSize: 12, background: "none",
              }}
            >
              <Icon name="user" size={13} />
            </Link>
          </div>
        ))}

        {/* Непризначенi */}
        {unassignedCount > 0 && (
          <FilterTab
            active={filter === "unassigned"}
            color="#d96c6c"
            onClick={() => setFilter("unassigned")}
            icon={<span style={{ fontSize: 14, color: "#d96c6c", fontWeight: 700 }}>?</span>}
            name="Без виконавця"
            count={unassignedCount}
          />
        )}
      </div>

      {/* Канбан */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, alignItems: "start" }}>
        {STAGES.map(stage => {
          const stageCases = byStage(stage.key);
          return (
            <div key={stage.key} style={{
              background: "var(--panel-2)", borderRadius: 12, padding: 14,
              border: `1.5px solid ${stage.color}33`,
            }}>
              <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: stage.color }}>{stage.label}</div>
                  <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>{stage.desc}</div>
                </div>
                <div style={{
                  background: stage.color, color: "#fff",
                  borderRadius: "50%", width: 22, height: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {stageCases.length}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stageCases.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--faint)", fontSize: 12 }}>
                    Немає справ
                  </div>
                )}
                {stageCases.map(c => {
                  const assignee = workers.find(w => w.id === c.assigned_to);
                  const isAssigning = assigning === c.id;
                  return (
                    <div key={c.id} ref={isAssigning ? dropRef : null}
                      className="kc-card" style={{ padding: "12px 14px" }}>

                      {/* Iм'я + дедлайн */}
                      <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.full_name}</div>
                        {c.days_left !== null && <DeadlineBadge days={c.days_left} />}
                      </div>

                      {c.case_number && (
                        <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 6 }}>
                          № {c.case_number}
                        </div>
                      )}

                      {/* Виконавець + кнопка призначення */}
                      <div className="kc-row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                        {assignee ? (
                          <div className="kc-row" style={{ gap: 6 }}>
                            <Avatar worker={assignee} size={20} />
                            <span style={{ fontSize: 11, color: "var(--dim)" }}>
                              {assignee.full_name.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--faint)" }}>Без виконавця</span>
                        )}
                        <button
                          className="kc-btn kc-btn-ghost"
                          style={{ fontSize: 10, padding: "2px 8px" }}
                          onClick={() => setAssigning(isAssigning ? null : c.id)}
                        >
                          {isAssigning ? "✕" : "Призначити"}
                        </button>
                      </div>

                      {/* Dropdown призначення */}
                      {isAssigning && (
                        <div style={{
                          marginTop: 8,
                          border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden",
                        }}>
                          {c.assigned_to && (
                            <AssignOption
                              label="Зняти призначення" labelColor="var(--red)"
                              onClick={() => assign(c.id, null)}
                              disabled={busy === c.id}
                            />
                          )}
                          {workers.map(w => (
                            <AssignOption
                              key={w.id}
                              avatar={<Avatar worker={w} size={18} />}
                              label={w.full_name}
                              active={c.assigned_to === w.id}
                              activeColor={workerColor(w.id)}
                              onClick={() => assign(c.id, w.id)}
                              disabled={busy === c.id}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- допомiжнi компоненти ---- */

function FilterTab({ active, color, onClick, icon, avatar, name, count }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px", borderRadius: 10, cursor: "pointer",
      border: active ? `2px solid ${color}` : "1.5px solid var(--border)",
      background: active ? color + "22" : "var(--panel)",
      color: "var(--text)", transition: "border .15s, background .15s",
    }}>
      {avatar || (
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: color + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div style={{ textAlign: "left", minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontSize: 11, color: "var(--dim)" }}>{count} справ</div>
      </div>
    </button>
  );
}

function AssignOption({ avatar, label, labelColor, active, activeColor, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "8px 10px", textAlign: "left",
      background: active ? activeColor + "22" : "transparent",
      border: "none", borderBottom: "1px solid var(--border)",
      color: labelColor || "var(--text)", fontSize: 12, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {avatar}
      <span style={{ flex: 1 }}>{label}</span>
      {active && <span style={{ color: activeColor, fontSize: 13 }}>✓</span>}
    </button>
  );
}

function DeadlineBadge({ days }) {
  const color = days < 0 ? "#d96c6c" : days < 14 ? "#d99e54" : "#5fb87a";
  const text  = days < 0
    ? `+${Math.abs(days)}д прострочено`
    : days === 0 ? "Сьогоднi!"
    : `${days}д`;
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, padding: "2px 7px",
      borderRadius: 10, background: color + "22", color,
    }}>
      {text}
    </div>
  );
}
