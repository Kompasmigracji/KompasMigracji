"use client";
/* KompasCRM — HR Leave Management (Vacations, Sick Leaves) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function HRLeavePage() {
  const [requests] = useState([]);

  const columns = [
    { header: "Employee", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.employee.substring(0,2).toUpperCase()} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.employee}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Leave Type", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name={row.type === "Sick Leave" ? "thermometer" : row.type === "Business Trip" ? "briefcase" : "sun"} size={14} color="var(--color-primary)" />
        <span style={{ fontWeight: 500 }}>{row.type}</span>
      </div>
    )},
    { header: "Dates & Duration", cell: (row) => (
      <div>
        <div style={{ fontSize: "var(--text-sm)" }}>{row.dates}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>{row.days} working days</div>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending") color = "warning";
      if (row.status === "rejected") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Manager Decision", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.approvedBy}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "pending" && (
          <>
            <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-success)" }}><Icon name="check" size={16} /></button>
            <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-danger)" }}><Icon name="x" size={16} /></button>
          </>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>HR Leave & Time Off</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Approve vacations, track sick leaves, and monitor your team's availability.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Team Calendar</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Request Time Off</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Pending Approvals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>3</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Requires manager action.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Currently Away</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 12 }}>
            2 <Avatar name="OV" size={24} /> <Avatar name="MG" size={24} />
          </div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Out of office today.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>My PTO Balance (Alex)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>18</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Paid vacation days remaining this year.</div>
        </div>
      </div>

      {/* Auto-Routing Warning */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(245, 158, 11, 0.05)", border: "1px dashed var(--color-warning)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="refresh-cw" size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>Lead Routing Sync is Active</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>Employees marked as 'Away' are automatically temporarily removed from Round-Robin lead distribution.</div>
          </div>
        </div>
        <button className="kc-btn kc-btn-secondary">View Routing Rules</button>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search employees or requests..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Types</option>
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Unpaid Leave</option>
          </select>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
        </div>
        <DataTable columns={columns} data={requests} />
      </div>
    </div>
  );
}
