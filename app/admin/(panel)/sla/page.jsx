"use client";
/* KompasCRM — SLA Management & Deadlines */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function SLAManagementPage() {
  const [slas] = useState([]);

  const columns = [
    { header: "Client / Case", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.client}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.service}</div>
      </div>
    )},
    { header: "SLA Target (Milestone)", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="flag" size={14} color="var(--dim)" />
        <span style={{ fontWeight: 500 }}>{row.target}</span>
      </div>
    )},
    { header: "Deadline", cell: (row) => (
      <span style={{ color: row.status === "breached" ? "var(--color-danger)" : row.status === "at-risk" ? "var(--color-warning)" : "var(--dim)" }}>{row.deadline}</span>
    )},
    { header: "Time Remaining", cell: (row) => (
      <div style={{ 
        fontFamily: "monospace", fontSize: "var(--text-md)", fontWeight: 700,
        color: row.status === "breached" ? "white" : row.status === "at-risk" ? "var(--color-warning)" : "var(--color-success)",
        background: row.status === "breached" ? "var(--color-danger)" : "transparent",
        padding: row.status === "breached" ? "4px 8px" : 0, borderRadius: 4, display: "inline-block"
      }}>
        {row.status === "breached" ? `LATE ${row.timeRemaining}` : row.timeRemaining}
      </div>
    )},
    { header: "Owner", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.owner.substring(0,2).toUpperCase()} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.owner}</span>
      </div>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="external-link" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-success)" }}><Icon name="check-circle" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>SLA & Deadlines</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Ensure zero breached contracts. Track time-sensitive tasks and legal deadlines.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> SLA Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Custom Deadline</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>SLA Fulfillment Rate (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>98.2%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>At Risk (&lt; 24 hrs left)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="alert-triangle" size={24} color="var(--color-warning)" /> 1
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)", background: "rgba(239, 68, 68, 0.05)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", textTransform: "uppercase", fontWeight: 600 }}>Breached SLAs</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
        </div>
      </div>

      {/* Global Rule Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--panel-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="clock" size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>Automated SLA Policy: "Standard Karta Pobytu"</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>Rule: If Deal Stage = 'Documents Collected', then Milestone 'Submission' must be completed in <strong style={{ color: "var(--fg)" }}>14 days</strong>.</div>
          </div>
        </div>
        <Badge status="success" text="ACTIVE" />
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search client or case..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Statuses</option>
            <option>Breached</option>
            <option>At Risk</option>
            <option>On Track</option>
          </select>
        </div>
        <DataTable columns={columns} data={slas} />
      </div>
    </div>
  );
}
