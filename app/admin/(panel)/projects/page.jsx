"use client";
/* KompasCRM — Project Management & Tasks (Asana / Trello style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function ProjectsPage() {
  const [projects] = useState([]);

  const columns = [
    { header: "Project Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="layout" size={16} color={row.status === "completed" ? "var(--color-success)" : "var(--color-primary)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="info" text={row.category} /> },
    { header: "Project Lead", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.lead} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.lead}</span>
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
      let color = "primary";
      if (row.status === "at_risk") color = "danger";
      if (row.status === "completed") color = "success";
      if (row.status === "planning") color = "default";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "Due Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.due}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="trello" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="users" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Projects & Tasks</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage internal operations, marketing campaigns, and IT developments.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Timeline (Gantt)</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Project</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Projects</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>12</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Tasks Overdue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>5</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Projects Completed (YTD)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search projects by name, lead, or category..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="trello" size={16} /> My Tasks</button>
        </div>
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
}
