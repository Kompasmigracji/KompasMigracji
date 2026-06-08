"use client";
/* KompasCRM — Cloud Phone System (Aircall / RingCentral style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function CallsPage() {
  const [calls] = useState([
    { id: "CALL-711", client: "Elena Rostova", type: "inbound", duration: "12m 45s", agent: "Maria Garcia", date: "Today, 10:15", status: "completed" },
    { id: "CALL-712", client: "Ivan Ivanov", type: "outbound", duration: "0m 45s", agent: "Alex Jenkins", date: "Today, 09:30", status: "voicemail" },
    { id: "CALL-713", client: "+48 555 123 456", type: "inbound", duration: "0m 00s", agent: "Unanswered", date: "Yesterday, 16:45", status: "missed" },
    { id: "CALL-714", client: "TechCorp Ltd", type: "outbound", duration: "45m 12s", agent: "David O.", date: "May 25", status: "completed" }
  ]);

  const columns = [
    { header: "Client / Number", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name={row.type === "inbound" ? "phone-incoming" : "phone-outgoing"} size={16} color={row.status === "missed" ? "var(--color-danger)" : "var(--color-primary)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.client}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Agent", cell: (row) => (
      row.agent === "Unanswered" ? (
        <span style={{ color: "var(--color-danger)" }}>Unanswered</span>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={row.agent} size={24} />
          <span style={{ fontSize: "var(--text-sm)" }}>{row.agent}</span>
        </div>
      )
    )},
    { header: "Duration", cell: (row) => <span style={{ fontWeight: 500 }}>{row.duration}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "missed") color = "danger";
      if (row.status === "voicemail") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Date / Time", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="play-circle" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="phone" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Cloud Phone System</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Make calls directly from the CRM, record conversations, and track agent performance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> IVR & Routing</button>
          <button className="kc-btn kc-btn-primary"><Icon name="phone-call" size={16} /> Open Dialer</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Calls (Today)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Talk Time</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>4m 12s</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Missed Calls</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>12</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search call history by number or client..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Agent</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
        </div>
        <DataTable columns={columns} data={calls} />
      </div>
    </div>
  );
}
