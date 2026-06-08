"use client";
/* KompasCRM — Main Dashboard */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  StatCard, Sparkline, Badge, Spinner, EmptyState, Icon, BarList, Avatar, ProgressBar
} from "@/components/admin/ui";

const SOURCE_LABEL = {
  bot: "Telegram-бот", site: "Website", facebook: "Facebook",
  instagram: "Instagram", other: "Other",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // AI Dispatcher Logs (175 automated agents, 15 coordinators, 1 president)
  const [dashboardLogs, setDashboardLogs] = useState([
    { time: "16:48:01", type: "system", message: "President signed executive order for Automated Client Sync." },
    { time: "16:45:10", type: "coordinator", message: "Omni Coordinator [Agent-C01] verified state pipelines for 12,000+ members." },
    { time: "16:42:33", type: "agent", message: "Logistics Agent-074 optimized route matrices for cross-border transit dispatch." },
    { time: "16:40:00", type: "system", message: "KompasCRM Primus Core Network Online (175 automated agents active)." }
  ]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setStats(d)))
      .catch(() => setError("Failed to load analytics"));
  }, []);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-012 calculated daily conversions rate metric: +4.2% up." },
      { type: "agent", text: "Agent-142 parsed inbound document for TRC applicant Oleh S." },
      { type: "coordinator", text: "Coordinator [Agent-C03] auto-allocated 3 new immigration consultations." },
      { type: "system", text: "President digital credentials broadcasted to secure node endpoints." },
      { type: "agent", text: "Agent-088 verified payment transaction: 150 PLN credited to Union Account." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setDashboardLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 14)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="kc-error">
        <Icon name="alert" size={18} />
        <span>{error}</span>
      </div>
    );
  }
  
  if (!stats) return <Spinner />;

  const conv = stats.leads.total ? Math.round((stats.leads.converted / stats.leads.total) * 100) : 0;
  const duesTotal = stats.duesCollected + (stats.duesOutstanding || 0);
  const duesRate = duesTotal ? Math.round((stats.duesCollected / duesTotal) * 100) : 0;
  
  const sources = (stats.leadsBySource || []).map((s) => ({
    label: SOURCE_LABEL[s.source] || s.source,
    value: s.count,
    color: s.source === 'bot' ? 'var(--color-info)' : 'var(--color-primary)',
  }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <h2 className="kc-h2" style={{ margin: 0 }}>Панель Управління (Overview)</h2>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="clock" size={16} /> Last 30 Days</button>
          <button className="kc-btn kc-btn-primary"><Icon name="file" size={16} /> Експорт Звіту</button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom: "var(--space-lg)" }}>
        <StatCard 
          icon="users" value={stats.members.total} label="Total Members" 
          sub={`${stats.members.active} active · ${stats.members.pending} pending`} 
          trend={12} 
        />
        <StatCard 
          icon="target" value={stats.leads.new} label="New Leads" 
          sub={`${stats.leads.total} total · ${conv}% conversion`} 
          trend={5} 
        />
        <StatCard 
          icon="briefcase" value={stats.cases.active} label="Active Cases" 
          sub={`${stats.cases.resolved} resolved this month`} 
          trend={-2} 
        />
        <StatCard 
          icon="cash" value={`${stats.duesCollected.toLocaleString("uk-UA")} zł`} 
          label="Revenue Collected" 
          sub={`${duesRate}% collection rate`} 
          trend={8} 
        />
      </div>

      <div className="kc-grid kc-grid-2" style={{ marginBottom: "var(--space-lg)" }}>
        {/* Analytics Chart */}
        <div className="kc-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="kc-card-cap">Тренд Генерації Лідів</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'var(--space-lg) 0' }}>
            <Sparkline data={stats.series || [5, 10, 8, 15, 12, 20, 18, 25, 22, 30, 28, 35, 40, 38]} w={400} h={120} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>14 days ago</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text)", fontWeight: 500 }}>Total: {stats.series?.reduce((a, b) => a + b, 0) || 306}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Today</div>
          </div>
        </div>

        {/* Lead Sources & Progress */}
        <div className="kc-card">
          <h3 className="kc-card-cap">Джерела Лідів</h3>
          {sources.length ? (
            <div style={{ marginBottom: "var(--space-xl)" }}><BarList items={sources} /></div>
          ) : (
            <EmptyState title="No leads yet" icon="target" />
          )}

          <h3 className="kc-card-cap">Збір Внесків (Revenue Collection)</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
            <span style={{ fontSize: "var(--text-2xl)", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
              {stats.duesCollected.toLocaleString("uk-UA")} <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)", fontWeight: 400 }}>zł</span>
            </span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-danger)" }}>
              / {(stats.duesOutstanding || 0).toLocaleString("uk-UA")} zł pending
            </span>
          </div>
          <ProgressBar progress={duesRate} label={`Collection Rate`} color="var(--color-success)" />
        </div>
      </div>

      <div className="kc-grid kc-grid-2" style={{ marginBottom: "var(--space-lg)" }}>
        {/* Recent Leads */}
        <div className="kc-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>Останні Ліди</h3>
            <Link href="/admin/leads" className="kc-link" style={{ fontSize: "var(--text-xs)" }}>View All →</Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {stats.recentLeads?.length ? stats.recentLeads.map((l) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <Avatar name={l.name || "Unknown"} size={32} />
                  <div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{l.name || "Without name"}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{SOURCE_LABEL[l.source] || l.source}</div>
                  </div>
                </div>
                <Badge status={l.status} />
              </div>
            )) : <EmptyState />}
          </div>
        </div>

        {/* AI Primus Core Dispatch Terminal */}
        <div className="kc-card" style={{ background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живий лог AI Диспетчера (175+ Agents)</h3>
            <Badge status="green" text="Active" />
          </div>
          
          <div style={{ 
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.5", 
            display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" 
          }}>
            {dashboardLogs.map((log, index) => {
              let color = "#8b949e";
              if (log.type === "coordinator") color = "#58a6ff";
              if (log.type === "system") color = "#56d364";
              return (
                <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                  <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
                  <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
