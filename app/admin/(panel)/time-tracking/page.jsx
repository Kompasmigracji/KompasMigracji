"use client";
/* iPhoenixCRM — Time Tracking & Timesheets */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function TimeTrackingPage() {
  const [entries] = useState([
    { id: "TE-01", task: "Drafting Appeal Letter", client: "TechCorp Sp. z.o.o.", project: "B2B Legal Support", time: "02:15:00", billable: true, amount: "€337.50", date: "Today" },
    { id: "TE-02", task: "Client Consultation (Zoom)", client: "Ivan Petrov", project: "Karta Pobytu", time: "00:45:00", billable: true, amount: "€75.00", date: "Today" },
    { id: "TE-03", task: "Internal Team Meeting", client: "—", project: "Internal", time: "01:00:00", billable: false, amount: "€0.00", date: "Today" },
    { id: "TE-04", task: "Document Review", client: "Anna Schmidt", project: "Blue Card", time: "01:30:00", billable: true, amount: "€225.00", date: "Yesterday" }
  ]);

  const columns = [
    { header: "Task Description", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="clock" size={16} color="var(--dim)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.task}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.date}</div>
        </div>
      </div>
    )},
    { header: "Client / Project", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.client}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.project}</div>
      </div>
    )},
    { header: "Time Logged", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-md)", fontWeight: 600 }}>{row.time}</span> },
    { header: "Billable", cell: (row) => (
      row.billable ? <Badge status="success" text="YES" /> : <Badge status="default" text="NO" />
    )},
    { header: "Amount", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.billable ? "var(--color-primary)" : "var(--dim)" }}>{row.amount}</span>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="play" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Time Tracking & Timesheets</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Log billable hours for legal services and generate client invoices.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="file-text" size={16} /> Generate Invoice</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Manual Entry</button>
        </div>
      </div>

      {/* Active Timer Bar */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", padding: "var(--space-sm) var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", border: "2px solid var(--color-primary)", background: "var(--panel-2)" }}>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center", flex: 1 }}>
          <input type="text" placeholder="What are you working on?" defaultValue="Reviewing application documents" style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "8px 16px", borderRadius: 8, width: 300, color: "var(--fg)" }} />
          <select className="kc-input" style={{ width: 200 }}>
            <option>TechCorp Sp. z.o.o.</option>
            <option>Internal</option>
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)" }}>
            <Icon name="dollar-sign" size={16} color="var(--color-success)" />
            <span style={{ color: "var(--color-success)", fontWeight: 600 }}>Billable (€150/hr)</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
          <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "var(--fg)" }}>
            00:14:22
          </div>
          <button className="kc-btn kc-btn-primary" style={{ background: "var(--color-danger)", borderColor: "var(--color-danger)" }}>
            <Icon name="square" size={16} fill="white" /> Stop Timer
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Hours (This Week)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>32h 15m</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Billable Hours</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>28h 00m</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Unbilled Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>€4,200.00</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>Timesheet (Today)</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="kc-btn kc-btn-ghost"><Icon name="chevron-left" size={16} /></button>
            <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", padding: "4px 8px" }}>June 8, 2026</span>
            <button className="kc-btn kc-btn-ghost"><Icon name="chevron-right" size={16} /></button>
          </div>
        </div>
        <DataTable columns={columns} data={entries} />
      </div>
    </div>
  );
}
