"use client";
/* KompasCRM — Goals, Targets & OKRs */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function GoalsPage() {
  const [goals] = useState([
    { id: "G-01", title: "Q3 Corporate Revenue Target", owner: "Company Wide", type: "Revenue", target: "€100,000", current: "€42,500", progress: 42.5, status: "on-track", deadline: "Sep 30, 2026" },
    { id: "G-02", title: "June TRC Applications", owner: "Maria Garcia", type: "Deals Closed", target: "50 deals", current: "42 deals", progress: 84, status: "on-track", deadline: "Jun 30, 2026" },
    { id: "G-03", title: "New B2B Lead Generation", owner: "Marketing Team", type: "Leads Created", target: "200 leads", current: "45 leads", progress: 22.5, status: "at-risk", deadline: "Jun 30, 2026" },
    { id: "G-04", title: "Reduce Average Resolution Time", owner: "Legal Team", type: "Time Metric", target: "< 14 days", current: "18 days", progress: 0, status: "behind", deadline: "Dec 31, 2026" }
  ]);

  const columns = [
    { header: "Goal / Objective", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="target" size={16} color="var(--color-primary)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type}</div>
        </div>
      </div>
    )},
    { header: "Owner", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {row.owner.includes("Team") || row.owner.includes("Company") ? <Icon name="users" size={16} color="var(--dim)" /> : <Avatar name={row.owner.substring(0,2).toUpperCase()} size={24} />}
        <span style={{ fontSize: "var(--text-sm)" }}>{row.owner}</span>
      </div>
    )},
    { header: "Progress", cell: (row) => (
      <div style={{ width: 150 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 600, marginBottom: 4 }}>
          <span>{row.current}</span>
          <span style={{ color: "var(--dim)" }}>{row.target}</span>
        </div>
        <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ 
            width: `${row.progress > 0 ? row.progress : 10}%`, 
            height: "100%", 
            background: row.status === "on-track" ? "var(--color-success)" : row.status === "at-risk" ? "var(--color-warning)" : "var(--color-danger)" 
          }}></div>
        </div>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "at-risk") color = "warning";
      if (row.status === "behind") color = "danger";
      return <Badge status={color} text={row.status.replace("-", " ").toUpperCase()} />;
    }},
    { header: "Deadline", cell: (row) => <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.deadline}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Goals & OKRs</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Set targets for revenue, deals, or leads, and track progress automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="bar-chart-2" size={16} /> Leaderboard</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Goal</button>
        </div>
      </div>

      {/* Main KPIs */}
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Goals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>12</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>On Track</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>8</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Needs Attention</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>4</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search goals..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Owners</option>
            <option>Company Wide</option>
            <option>Maria Garcia</option>
          </select>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Statuses</option>
            <option>On Track</option>
            <option>At Risk</option>
          </select>
        </div>
        <DataTable columns={columns} data={goals} />
      </div>
    </div>
  );
}
