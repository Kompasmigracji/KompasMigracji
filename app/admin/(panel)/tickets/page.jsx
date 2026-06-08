"use client";
/* iPhoenixCRM — Helpdesk & Support Tickets (Zendesk style) */
import React, { useState } from "react";
import { Icon, Badge, Avatar, DataTable } from "@/components/admin/ui";

export default function TicketsPage() {
  const [tickets] = useState([
    { id: "T-1042", subject: "Payment gateway timeout on checkout", requester: "Sarah Jenkins", channel: "Email", priority: "High", status: "open", sla: "2h 15m left", agent: "Alex" },
    { id: "T-1041", subject: "How to upgrade my subscription?", requester: "TechCorp Inc.", channel: "Live Chat", priority: "Normal", status: "pending", sla: "Paused", agent: "Maria" },
    { id: "T-1040", subject: "Feature request: Custom reports", requester: "David O.", channel: "Portal", priority: "Low", status: "resolved", sla: "Met", agent: "Alex" },
    { id: "T-1039", subject: "Critical: Database connection refused", requester: "Acme Logistics", channel: "Phone", priority: "Urgent", status: "open", sla: "OVERDUE by 10m", agent: "Unassigned" }
  ]);

  const columns = [
    { header: "ID", cell: (row) => <span style={{ fontWeight: 600, color: "var(--dim)" }}>{row.id}</span> },
    { header: "Subject & Requester", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{row.subject}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name={row.channel === "Email" ? "mail" : row.channel === "Live Chat" ? "message-square" : "globe"} size={12} />
          {row.requester} via {row.channel}
        </div>
      </div>
    )},
    { header: "Priority", cell: (row) => (
      <Badge 
        status={row.priority === "Urgent" ? "danger" : row.priority === "High" ? "warning" : "info"} 
        text={row.priority} 
      />
    )},
    { header: "SLA Status", cell: (row) => (
      <span style={{ 
        fontSize: "var(--text-sm)", 
        fontWeight: 600, 
        color: row.sla.includes("OVERDUE") ? "var(--color-danger)" : row.sla.includes("Met") ? "var(--color-success)" : "var(--dim)" 
      }}>
        {row.sla}
      </span>
    )},
    { header: "Agent", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.agent === "Unassigned" ? "?" : row.agent} size={24} />
        <span style={{ fontSize: "var(--text-sm)", color: row.agent === "Unassigned" ? "var(--dim)" : "var(--fg)" }}>{row.agent}</span>
      </div>
    )},
    { header: "Status", cell: (row) => (
      <Badge 
        status={row.status === "open" ? "warning" : row.status === "resolved" ? "success" : "info"} 
        text={row.status.toUpperCase()} 
      />
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Helpdesk Tickets</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Omnichannel support inbox with SLA tracking.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="filter" size={16} /> Filter</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Ticket</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Open Tickets</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>SLA Breached</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>3</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Response Time</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14m</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <DataTable columns={columns} data={tickets} />
      </div>
    </div>
  );
}
