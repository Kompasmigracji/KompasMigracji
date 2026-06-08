"use client";
/* KompasCRM — Audit Log & Security (Okta style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function AuditLogPage() {
  const [logs] = useState([
    { id: "LOG-091", user: "Alex Jenkins", action: "Exported Data", resource: "All Active Clients (CSV)", ip: "192.168.1.45", location: "Warsaw, PL", time: "10 mins ago", severity: "high" },
    { id: "LOG-092", user: "Maria Garcia", action: "Updated Record", resource: "TechCorp Ltd (MRR changed to €2,500)", ip: "84.15.201.99", location: "Kraków, PL", time: "2 hours ago", severity: "info" },
    { id: "LOG-093", user: "Unknown (Failed Login)", action: "Authentication Failed", resource: "Admin Portal", ip: "103.45.11.2", location: "Beijing, CN", time: "Yesterday", severity: "critical" },
    { id: "LOG-094", user: "System (Auto)", action: "Workflow Triggered", resource: "Welcome Email Sequence", ip: "Server", location: "Frankfurt, DE", time: "Yesterday", severity: "low" },
    { id: "LOG-095", user: "Elena Rostova", action: "Deleted File", resource: "Passport_Scan_Ivan.pdf", ip: "89.20.14.5", location: "Warsaw, PL", time: "May 25", severity: "warning" }
  ]);

  const columns = [
    { header: "User / Actor", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        {row.user.includes("Unknown") ? (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="alert-triangle" size={16} color="white" />
          </div>
        ) : row.user.includes("System") ? (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cpu" size={16} color="var(--dim)" />
          </div>
        ) : (
          <Avatar name={row.user} size={32} />
        )}
        <span style={{ fontWeight: 500, color: row.user.includes("Unknown") ? "var(--color-danger)" : "var(--fg)" }}>
          {row.user}
        </span>
      </div>
    )},
    { header: "Action", cell: (row) => <span style={{ fontWeight: 600 }}>{row.action}</span> },
    { header: "Resource Affected", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.resource}</span> },
    { header: "IP & Location", cell: (row) => (
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "var(--text-xs)" }}>{row.ip}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.location}</div>
      </div>
    )},
    { header: "Timestamp", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.time}</span> },
    { header: "Severity", cell: (row) => {
      let color = "info";
      if (row.severity === "low") color = "default";
      if (row.severity === "warning") color = "warning";
      if (row.severity === "high") color = "primary";
      if (row.severity === "critical") color = "danger";
      return <Badge status={color} text={row.severity.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="eye" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Audit Log & Security</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor every action taken in the CRM to ensure data security and compliance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="shield" size={16} /> Security Policies</button>
          <button className="kc-btn kc-btn-primary"><Icon name="download" size={16} /> Export Logs</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Critical Alerts (24h)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Failed Logins</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>4</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Events Logged</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14,502</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by user, action, IP, or resource..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Last 7 Days</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Severity</button>
        </div>
        <DataTable columns={columns} data={logs} />
      </div>
    </div>
  );
}
