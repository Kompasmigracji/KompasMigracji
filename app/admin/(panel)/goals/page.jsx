"use client";
/* iPhoenixCRM — Goals & OKRs (Lattice style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function GoalsPage() {
  const [goals] = useState([
    { id: "OKR-Q2-01", objective: "Expand to German Market", owner: "Alex Jenkins", type: "Company", progress: 65, status: "on_track", due: "Jun 30, 2026" },
    { id: "OKR-Q2-02", objective: "Hire 5 New Visa Specialists", owner: "Maria Garcia", type: "Department", progress: 80, status: "on_track", due: "Jun 15, 2026" },
    { id: "OKR-Q2-03", objective: "Launch Affiliate Program", owner: "David O.", type: "Company", progress: 100, status: "completed", due: "May 30, 2026" },
    { id: "OKR-Q2-04", objective: "Reduce Visa Processing Time by 20%", owner: "Alexey Volkov", type: "Individual", progress: 25, status: "at_risk", due: "Jul 31, 2026" }
  ]);

  const columns = [
    { header: "Objective", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="target" size={16} color={row.status === "completed" ? "var(--color-success)" : "var(--color-primary)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.objective}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Type", cell: (row) => <Badge status="info" text={row.type} /> },
    { header: "Owner", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.owner} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.owner}</span>
      </div>
    )},
    { header: "Progress", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: 150 }}>
        <div style={{ flex: 1, background: "var(--panel-2)", height: 6, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ 
            width: `${row.progress}%`, 
            height: "100%", 
            background: row.progress === 100 ? "var(--color-success)" : row.status === "at_risk" ? "var(--color-danger)" : "var(--color-primary)" 
          }}></div>
        </div>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, width: 35 }}>{row.progress}%</span>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "at_risk") color = "danger";
      if (row.status === "on_track") color = "primary";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "Due Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.due}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="eye" size={16} /></button>
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
            Align your team with company objectives and track key results.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="bar-chart-2" size={16} /> Analytics</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Objective</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Company Goals (Q2)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>8</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg. Completion Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>67%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Goals at Risk</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search objectives by title or owner..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Quarter</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="git-branch" size={16} /> Tree View</button>
        </div>
        <DataTable columns={columns} data={goals} />
      </div>
    </div>
  );
}
