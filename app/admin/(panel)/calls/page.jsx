"use client";
/* iPhoenixCRM — Call Center & Telephony (Twilio/Aircall style) */
import React, { useState } from "react";
import { Icon, Badge, Avatar, DataTable } from "@/components/admin/ui";

export default function CallsPage() {
  const [calls] = useState([
    { id: "call_1", type: "inbound", caller: "+48 111 222 333", client: "TechCorp Inc.", time: "10:42 AM", duration: "04:12", status: "completed", agent: "Alex Jenkins", recording: true },
    { id: "call_2", type: "outbound", caller: "+48 444 555 666", client: "Sarah Jenkins", time: "09:15 AM", duration: "12:30", status: "completed", agent: "Maria Garcia", recording: true },
    { id: "call_3", type: "missed", caller: "+44 7700 900077", client: "Unknown", time: "08:01 AM", duration: "00:00", status: "missed", agent: "Unassigned", recording: false }
  ]);

  const [agents] = useState([
    { name: "Alex Jenkins", status: "available" },
    { name: "Maria Garcia", status: "in-call" },
    { name: "David O.", status: "offline" }
  ]);

  const columns = [
    { header: "Type", cell: (row) => (
      <Icon 
        name={row.type === "inbound" ? "arrow-down-left" : row.type === "outbound" ? "arrow-up-right" : "phone-missed"} 
        size={16} 
        color={row.type === "missed" ? "var(--color-danger)" : row.type === "inbound" ? "var(--color-success)" : "var(--color-primary)"} 
      />
    )},
    { header: "Caller", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.caller}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.client}</div>
      </div>
    )},
    { header: "Time", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.time}</span> },
    { header: "Duration", cell: (row) => <span>{row.duration}</span> },
    { header: "Agent", cell: (row) => (
      <span style={{ color: row.agent === "Unassigned" ? "var(--dim)" : "var(--fg)" }}>{row.agent}</span>
    )},
    { header: "Status", cell: (row) => (
      <Badge 
        status={row.status === "completed" ? "success" : "danger"} 
        text={row.status.toUpperCase()} 
      />
    )},
    { header: "Recording", cell: (row) => (
      row.recording ? (
        <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px" }}>
          <Icon name="play-circle" size={16} /> Listen
        </button>
      ) : <span style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>N/A</span>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Call Center</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Cloud telephony, dialer, and call logs.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="headphones" size={16} /> Open Web Dialer</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        {/* Left: Quick Stats */}
        <div style={{ flex: 2, display: "flex", gap: "var(--space-md)" }}>
          <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Calls (Today)</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
          </div>
          <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Missed Calls</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14</div>
          </div>
          <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Talk Time</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>3m 45s</div>
          </div>
        </div>

        {/* Right: Agents Status */}
        <div className="kc-card" style={{ flex: 1, padding: "var(--space-md)" }}>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)" }}>Agent Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {agents.map(a => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ 
                    width: 8, height: 8, borderRadius: "50%", 
                    background: a.status === "available" ? "var(--color-success)" : a.status === "in-call" ? "var(--color-warning)" : "var(--dim)" 
                  }}></div>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{a.name}</span>
                </div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase" }}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <DataTable columns={columns} data={calls} />
      </div>
    </div>
  );
}
