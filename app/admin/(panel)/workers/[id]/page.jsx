"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon, Spinner, StatCard } from "@/components/admin/ui";

const STAGES = [
  { key: "analysis",   label: "Документи",    color: "#3B82F6", bg: "#EFF6FF" },
  { key: "ponaglenie", label: "В процесі",    color: "#F59E0B", bg: "#FFFBEB" },
  { key: "court",      label: "Завершення",   color: "#10B981", bg: "#ECFDF5" },
];

const ROLE_LABEL = { admin: "Адміністратор", moderator: "Модератор" };
const WORKER_COLORS = ["#3B82F6","#F59E0B","#10B981","#EF4444","#8B5CF6","#06B6D4","#F97316","#14B8A6"];

function workerColor(id) { return WORKER_COLORS[Number(id) % WORKER_COLORS.length]; }
function initials(name)  { return (name || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase(); }
function fmtDate(d) {
  if (!d) return "Ніколи";
  return new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function DeadlineBadge({ days }) {
  if (days === null || days === undefined) return null;
  const overdue = days < 0;
  const urgent  = days >= 0 && days < 7;
  const soon    = days >= 7 && days < 21;
  const color   = overdue ? "#EF4444" : urgent ? "#F59E0B" : soon ? "#3B82F6" : "#10B981";
  const bg      = overdue ? "#FEF2F2" : urgent ? "#FFFBEB" : soon ? "#EFF6FF" : "#ECFDF5";
  const label   = overdue
    ? `Прострочено ${Math.abs(days)} дн.`
    : days === 0 ? "Дедлайн сьогодні!"
    : `${days} дн. до дедлайну`;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:8,
      padding:"3px 8px", borderRadius:20, background:bg, color, fontSize:11, fontWeight:600 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }}/>
      {label}
    </span>
  );
}

function CaseCard({ c }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "12px 14px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.06)",
      transition: "box-shadow 0.18s, transform 0.18s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 2, lineHeight: 1.4 }}>
        {c.full_name}
      </div>
      {c.case_number && (
        <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace", marginBottom: 1 }}>
          № {c.case_number}
        </div>
      )}
      {c.urzad && (
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{c.urzad}</div>
      )}
      <DeadlineBadge days={c.days_left} />
    </div>
  );
}

function KanbanColumn({ stage, cases }) {
  const empty = cases.length === 0;
  return (
    <div style={{
      background: "#F9FAFB",
      borderRadius: 16,
      padding: "14px 12px",
      minHeight: 120,
      border: "1px solid #E5E7EB",
    }}>
      {/* Column header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:stage.color, flexShrink:0 }}/>
          <span style={{ fontWeight:600, fontSize:12, color:"#374151", letterSpacing:"0.01em" }}>
            {stage.label}
          </span>
        </div>
        <span style={{
          background: cases.length > 0 ? stage.color : "#E5E7EB",
          color: cases.length > 0 ? "#fff" : "#9CA3AF",
          borderRadius: 20, padding:"1px 8px",
          fontSize:11, fontWeight:700, minWidth:20, textAlign:"center",
        }}>
          {cases.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {empty ? (
          <div style={{ textAlign:"center", padding:"20px 0", color:"#D1D5DB", fontSize:12 }}>
            Немає справ
          </div>
        ) : (
          cases.map(c => <CaseCard key={c.id} c={c} />)
        )}
      </div>
    </div>
  );
}

export default function WorkerCabinet() {
  const { id } = useParams();
  const [data,  setData]  = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/workers/${id}`);
    const d = await r.json();
    if (d.error) { setError(d.error); return; }
    setData(d);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (error) return (
    <div>
      <Link href="/admin/workers" className="kc-btn kc-btn-ghost" style={{ fontSize:12, marginBottom:16, display:"inline-flex" }}>
        <Icon name="back" size={14}/> Команда
      </Link>
      <div className="kc-error" style={{ marginTop:12 }}>{error}</div>
    </div>
  );
  if (!data) return <Spinner />;

  const { worker, cases, stats } = data;
  const color   = workerColor(worker.id);
  const byStage = stage => cases.filter(c => c.stage === stage);
  const total   = cases.length;

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>

      {/* Back */}
      <div style={{ marginBottom:18 }}>
        <Link href="/admin/workers" className="kc-btn kc-btn-ghost" style={{ fontSize:12 }}>
          <Icon name="back" size={14}/> Команда
        </Link>
      </div>

      {/* Profile card */}
      <div className="kc-card" style={{ marginBottom:16, padding:"18px 20px" }}>
        <div className="kc-row" style={{ gap:18, flexWrap:"wrap" }}>
          <div style={{
            width:60, height:60, borderRadius:"50%", flexShrink:0,
            background:color+"22", border:`2.5px solid ${color}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, fontWeight:700, color,
          }}>
            {initials(worker.full_name)}
          </div>

          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontFamily:"var(--display)", fontSize:20, fontWeight:600, color:"var(--text)" }}>
              {worker.full_name}
            </div>
            <div style={{ color:"var(--dim)", fontSize:13, marginTop:3 }}>
              {ROLE_LABEL[worker.role] || worker.role}
              <span style={{ color:"var(--faint)", margin:"0 8px" }}>·</span>
              {worker.email}
            </div>
            <div style={{ fontSize:12, color:"var(--faint)", marginTop:4 }}>
              Останній вхід: {fmtDate(worker.last_login)}
            </div>
          </div>

          <div style={{
            padding:"5px 14px", borderRadius:20, alignSelf:"flex-start",
            background: worker.status === "active" ? "#ECFDF5" : "#FEF2F2",
            color:       worker.status === "active" ? "#10B981"  : "#EF4444",
            fontSize:12, fontWeight:600,
          }}>
            {worker.status === "active" ? "Активний" : "Заблокований"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom:22 }}>
        <StatCard icon="briefcase" value={Number(stats.active)  || 0} label="Активних справ"/>
        <StatCard icon="check"     value={Number(stats.closed)  || 0} label="Закрито справ"/>
        <StatCard icon="alert"     value={Number(stats.overdue) || 0} label="Прострочено"/>
        <StatCard icon="layers"    value={Number(stats.total)   || 0} label="Всього справ"/>
      </div>

      {/* Kanban header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:15, color:"var(--text)" }}>Управління справами</div>
        {total > 0 && (
          <span style={{ fontSize:12, color:"var(--dim)" }}>
            {total} {total === 1 ? "справа" : total < 5 ? "справи" : "справ"} в роботі
          </span>
        )}
      </div>

      {/* Kanban board */}
      {total === 0 ? (
        <div className="kc-card" style={{ textAlign:"center", padding:"40px 0", color:"var(--faint)" }}>
          <Icon name="briefcase" size={32} color="var(--border)"/>
          <div style={{ marginTop:12, fontSize:14 }}>Нема активних справ</div>
          <div style={{ marginTop:4, fontSize:12, color:"var(--faint)" }}>Справи з'являться після призначення</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, alignItems:"start" }}>
          {STAGES.map(stage => (
            <KanbanColumn key={stage.key} stage={stage} cases={byStage(stage.key)}/>
          ))}
        </div>
      )}

      <div style={{ marginTop:24, fontSize:12, color:"var(--faint)", textAlign:"center" }}>
        Акаунт створено: {fmtDate(worker.created_at)}
      </div>
    </div>
  );
}
