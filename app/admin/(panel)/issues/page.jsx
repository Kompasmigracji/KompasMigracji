"use client";
/* KompasCRM — Issue & Bug Tracking (Taiga / Sentry style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function IssuesPage() {
  const [issues] = useState([
    { id: "ISS-4012", title: "API Endpoint returns 500 on large payload", env: "Production", priority: "critical", status: "open", assignee: "Alex", created: "2 hours ago" },
    { id: "ISS-4011", title: "Payment Gateway webhook delay", env: "Staging", priority: "high", status: "in-progress", assignee: "David O.", created: "4 hours ago" },
    { id: "ISS-4010", title: "Typo in the onboarding email template", env: "Production", priority: "low", status: "open", assignee: "Unassigned", created: "1 day ago" },
    { id: "ISS-4009", title: "Memory leak in background worker", env: "Production", priority: "high", status: "resolved", assignee: "Maria", created: "2 days ago" }
  ]);

  const columns = [
    { header: "Issue", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>{row.id}</span>
          {row.title}
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>
          Opened {row.created}
        </div>
      </div>
    )},
    { header: "Environment", cell: (row) => <Badge status={row.env === "Production" ? "danger" : "warning"} text={row.env} /> },
    { header: "Priority", cell: (row) => {
      let color = "info";
      if (row.priority === "critical") color = "danger";
      if (row.priority === "high") color = "warning";
      if (row.priority === "low") color = "default";
      return <Badge status={color} text={row.priority.toUpperCase()} />;
    }},
    { header: "Status", cell: (row) => {
      let color = "default";
      if (row.status === "open") color = "danger";
      if (row.status === "in-progress") color = "warning";
      if (row.status === "resolved") color = "success";
      return <span style={{ fontWeight: 600, color: `var(--color-${color})` }}>{row.status.toUpperCase()}</span>;
    }},
    { header: "Assignee", cell: (row) => (
      row.assignee === "Unassigned" ? (
        <span style={{ color: "var(--dim)", fontSize: "var(--text-sm)" }}>Unassigned</span>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={row.assignee} size={24} />
          <span style={{ fontSize: "var(--text-sm)" }}>{row.assignee}</span>
        </div>
      )
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="message-circle" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Issues & Bugs</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track software bugs, feature requests, and system crash reports.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="github" size={16} /> Sync GitHub</button>
          <button className="kc-btn kc-btn-danger"><Icon name="alert-triangle" size={16} /> Report Issue</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Unresolved Issues</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>High Priority</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>3</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Resolved (7 days)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search issues, error codes, tags..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary">Open <Badge status="danger" text="2" /></button>
          <button className="kc-btn kc-btn-ghost">Closed</button>
        </div>
        <DataTable columns={columns} data={issues} />
      </div>
    </div>
  );
}
