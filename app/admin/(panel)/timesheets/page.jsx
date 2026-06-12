"use client";
/* KompasCRM — Time Tracking & Timesheets (Toggl style) */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function TimesheetsPage() {
  const [timer, setTimer] = useState("00:45:12");
  const [isActive, setIsActive] = useState(true);

  const [entries] = useState([]);

  const columns = [
    { header: "Description", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="clock" size={16} color={row.billable ? "var(--color-primary)" : "var(--dim)"} />
        <div style={{ fontWeight: 600 }}>{row.description}</div>
      </div>
    )},
    { header: "Client / Project", cell: (row) => (
      <span style={{ fontWeight: row.client !== "—" ? 500 : 400, color: row.client !== "—" ? "var(--fg)" : "var(--dim)" }}>
        {row.client}
      </span>
    )},
    { header: "Team Member", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.user} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.user}</span>
      </div>
    )},
    { header: "Duration", cell: (row) => <span style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{row.duration}</span> },
    { header: "Billable", cell: (row) => (
      <Icon name={row.billable ? "check-circle" : "x-circle"} size={16} color={row.billable ? "var(--color-success)" : "var(--dim)"} />
    )},
    { header: "Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="trash-2" size={16} color="var(--color-danger)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Time Tracking & Timesheets</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track billable hours, generate timesheets, and invoice clients accurately.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="file-text" size={16} /> Export CSV</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="dollar-sign" size={16} /> Generate Invoice</button>
        </div>
      </div>

      {/* Active Timer Bar */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)", background: "var(--panel-2)", border: "1px solid var(--border)" }}>
        <input className="kc-input" placeholder="What are you working on?" style={{ flex: 1, background: "transparent", border: "none" }} defaultValue="Preparing documents for TRC appeal..." />
        <div style={{ width: 1, height: 24, background: "var(--border)" }}></div>
        <Icon name="folder" size={16} color="var(--dim)" />
        <span style={{ color: "var(--dim)", fontSize: "var(--text-sm)", width: 120 }}>TechCorp Ltd</span>
        <div style={{ width: 1, height: 24, background: "var(--border)" }}></div>
        <Icon name="tag" size={16} color="var(--primary)" />
        <div style={{ width: 1, height: 24, background: "var(--border)" }}></div>
        <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", width: 120, textAlign: "center" }}>{timer}</span>
        <button className="kc-btn kc-btn-primary" style={{ background: "var(--color-danger)", color: "white" }} onClick={() => setIsActive(!isActive)}>
          <Icon name="square" size={16} /> Stop Timer
        </button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Hours (This Week)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42h 15m</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Billable Amount</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€3,450</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Most Active Project</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>TechCorp Legal Retainer</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search time entries..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> This Week</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Team Member</button>
        </div>
        <DataTable columns={columns} data={entries} />
      </div>
    </div>
  );
}
