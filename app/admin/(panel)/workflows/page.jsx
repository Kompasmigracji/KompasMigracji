"use client";
/* iPhoenixCRM — Automated Workflows & Rules Engine (HubSpot style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function WorkflowsPage() {
  const [workflows] = useState([
    { id: "WF-101", name: "Welcome Email Sequence", trigger: "New Lead Created", actions: "Send 3 Emails", enrolled: 1205, status: "active", lastRun: "10 mins ago" },
    { id: "WF-102", name: "TRC Decision Alert (SMS)", trigger: "Case Status = 'Approved'", actions: "Send SMS + Notify Agent", enrolled: 45, status: "active", lastRun: "2 hours ago" },
    { id: "WF-103", name: "Dead Lead Re-engagement", trigger: "No Activity > 30 Days", actions: "Send Discount Email", enrolled: 412, status: "active", lastRun: "Yesterday" },
    { id: "WF-104", name: "Invoice Reminder", trigger: "Invoice Overdue", actions: "Send Email + Slack Alert", enrolled: 0, status: "draft", lastRun: "Never" }
  ]);

  const columns = [
    { header: "Workflow Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="git-merge" size={16} color={row.status === "active" ? "var(--color-primary)" : "var(--dim)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Trigger", cell: (row) => <Badge status="info" text={row.trigger} /> },
    { header: "Actions", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.actions}</span> },
    { header: "Enrolled", cell: (row) => <span style={{ fontWeight: 600 }}>{row.enrolled.toLocaleString()}</span> },
    { header: "Last Run", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.lastRun}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "draft") color = "warning";
      if (row.status === "paused") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="play" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Automated Workflows</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Build rule-based automations to save your team hundreds of hours per month.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="bar-chart-2" size={16} /> Automation Stats</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Workflow</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Workflows</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Tasks Automated (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>45,210</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Time Saved (Estimated)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>~120 Hours</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search workflows by name or trigger..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Trigger Type</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
        </div>
        <DataTable columns={columns} data={workflows} />
      </div>
    </div>
  );
}
