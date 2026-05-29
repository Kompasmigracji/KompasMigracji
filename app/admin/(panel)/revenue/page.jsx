"use client";
/* Innovation 1: Revenue Dashboard — MRR/ARR analytics + F1-F3 display */
import React, { useEffect, useState } from "react";
import { StatCard, Spinner, Icon } from "@/components/admin/ui";

const ACCENT = "#10B981";
const WARN   = "#EF4444";
const BLUE   = "#3B82F6";
const GOLD   = "#F59E0B";

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:6, borderRadius:3, background:"var(--border)" }}>
        <div style={{ width:`${pct}%`, height:"100%", borderRadius:3, background:color, transition:"width 0.4s" }}/>
      </div>
      <span style={{ fontSize:11, color:"var(--dim)", minWidth:30, textAlign:"right" }}>{pct}%</span>
    </div>
  );
}

function SnapshotChart({ snapshots }) {
  if (!snapshots || snapshots.length === 0) {
    return <div style={{ textAlign:"center", color:"var(--faint)", fontSize:12, padding:"20px 0" }}>Дані з'являться після першого cron-запуску</div>;
  }
  const sorted = [...snapshots].sort((a, b) => a.date > b.date ? 1 : -1);
  const maxMrr = Math.max(...sorted.map(s => s.mrr), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:80 }}>
      {sorted.map((s, i) => {
        const h = Math.max(4, Math.round((s.mrr / maxMrr) * 80));
        return (
          <div key={i} title={`${s.date}: ${s.mrr} zł MRR`}
            style={{ flex:1, height:h, borderRadius:"2px 2px 0 0", background:ACCENT+"99",
              cursor:"default", transition:"height 0.3s" }}/>
        );
      })}
    </div>
  );
}

export default function RevenuePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [cronLoading, setCronLoading] = useState(false);
  const [cronMsg, setCronMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then(r => r.json())
      .then(d => d.error ? setError(d.error) : setData(d))
      .catch(() => setError("Помилка завантаження"));
  }, []);

  const runSnapshot = async () => {
    setCronLoading(true);
    setCronMsg("");
    try {
      const r = await fetch("/api/cron/daily-snapshot");
      const d = await r.json();
      setCronMsg(d.ok ? `Знімок збережено: MRR ${d.mrr} zł` : d.error || "Помилка");
      const r2 = await fetch("/api/admin/revenue");
      const d2 = await r2.json();
      if (!d2.error) setData(d2);
    } catch { setCronMsg("Мережева помилка"); }
    setCronLoading(false);
  };

  if (error) return <div className="kc-error">{error}</div>;
  if (!data) return <Spinner />;

  const {
    mrr, arr, activeMembers, avgDue, duesCollected, duesOutstanding,
    leadsTotal, leadsConverted, convRate, churnRisk, snapshots, topMonths,
  } = data;

  const totalDues = duesCollected + duesOutstanding;

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>

      {/* Innovation badge */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:"var(--text)" }}>Доходи & MRR</div>
          <div style={{ fontSize:12, color:"var(--dim)", marginTop:2 }}>Innovation 1 · F1-F3 автоматизація</div>
        </div>
        <button onClick={runSnapshot} disabled={cronLoading}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8,
            background:ACCENT, color:"#fff", fontWeight:600, fontSize:12, border:"none", cursor:"pointer",
            opacity: cronLoading ? 0.6 : 1 }}>
          <Icon name="refresh" size={13}/>
          {cronLoading ? "Зберігаємо..." : "F1: Зберегти знімок"}
        </button>
      </div>
      {cronMsg && <div style={{ padding:"8px 12px", borderRadius:7, background:"#ECFDF5", color:ACCENT, fontSize:12, marginBottom:14 }}>{cronMsg}</div>}

      {/* F2: MRR/ARR cards */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom:16 }}>
        <StatCard icon="cash" value={`${mrr.toFixed(0)} zł`} label="MRR (щомісяця)" sub="F2: авто-розрахунок"/>
        <StatCard icon="layers" value={`${arr.toFixed(0)} zł`} label="ARR (рік)" sub={`MRR × 12`}/>
        <StatCard icon="users" value={activeMembers} label="Активних учасників" sub={`ср. внесок ${avgDue.toFixed(0)} zł`}/>
        <div className="kc-card" style={{ padding:"12px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <Icon name="alert" size={16} color={churnRisk > 0 ? WARN : ACCENT}/>
            <span style={{ fontSize:12, color:"var(--dim)" }}>F3: Ризик відтоку</span>
          </div>
          <div style={{ fontSize:22, fontWeight:700, color: churnRisk > 0 ? WARN : ACCENT }}>{churnRisk}</div>
          <div style={{ fontSize:11, color:"var(--dim)", marginTop:2 }}>неактивних > 45 днів</div>
        </div>
      </div>

      <div className="kc-grid kc-grid-2" style={{ marginBottom:16 }}>
        {/* MRR Chart */}
        <div className="kc-card" style={{ padding:"14px 16px" }}>
          <div className="kc-card-cap" style={{ marginBottom:12 }}>MRR за 30 днів</div>
          <SnapshotChart snapshots={snapshots}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontSize:10, color:"var(--faint)" }}>30 днів тому</span>
            <span style={{ fontSize:10, color:"var(--faint)" }}>сьогодні</span>
          </div>
        </div>

        {/* Dues breakdown */}
        <div className="kc-card" style={{ padding:"14px 16px" }}>
          <div className="kc-card-cap" style={{ marginBottom:12 }}>Внески</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"var(--text)" }}>Зібрано</span>
                <span style={{ fontWeight:700, fontSize:13, color:ACCENT }}>{duesCollected.toFixed(0)} zł</span>
              </div>
              <MiniBar value={duesCollected} max={totalDues} color={ACCENT}/>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"var(--text)" }}>Заборгованість</span>
                <span style={{ fontWeight:700, fontSize:13, color:WARN }}>{duesOutstanding.toFixed(0)} zł</span>
              </div>
              <MiniBar value={duesOutstanding} max={totalDues} color={WARN}/>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"var(--text)" }}>Конверсія лідів</span>
                <span style={{ fontWeight:700, fontSize:13, color:BLUE }}>{convRate}%</span>
              </div>
              <MiniBar value={convRate} max={100} color={BLUE}/>
            </div>
          </div>
        </div>
      </div>

      {/* Top months */}
      {topMonths && topMonths.length > 0 && (
        <div className="kc-card" style={{ padding:"14px 16px", marginBottom:16 }}>
          <div className="kc-card-cap" style={{ marginBottom:12 }}>Топ місяців по доходу</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {topMonths.map((m, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:12, color:"var(--dim)", minWidth:70 }}>{m.month}</span>
                <div style={{ flex:1 }}>
                  <MiniBar value={m.revenue} max={Math.max(...topMonths.map(x => x.revenue), 1)} color={GOLD}/>
                </div>
                <span style={{ fontWeight:600, fontSize:12, color:"var(--text)", minWidth:70, textAlign:"right" }}>
                  {Number(m.revenue).toFixed(0)} zł
                </span>
                <span style={{ fontSize:11, color:"var(--dim)", minWidth:50, textAlign:"right" }}>
                  {m.paidCount} оплат
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize:11, color:"var(--faint)", textAlign:"center" }}>
        F1: щоденний cron /api/cron/daily-snapshot · F2: MRR = активні × середній внесок · F3: відтік = неоплачено &gt; 45 днів
      </div>
    </div>
  );
}
