"use client";
/* iPhoenixCRM — HR & Payroll (BambooHR / Gusto style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function HRPage() {
  const [employees] = useState([
    { id: "EMP-001", name: "Alex Jenkins", role: "Sales Manager", department: "Sales", status: "active", salary: "€4,500/mo", timeoff: "12 days left" },
    { id: "EMP-002", name: "Maria Garcia", role: "Support Specialist", department: "Customer Success", status: "on_leave", salary: "€3,200/mo", timeoff: "0 days left" },
    { id: "EMP-003", name: "David O.", role: "Developer", department: "Engineering", status: "active", salary: "€5,800/mo", timeoff: "24 days left" },
    { id: "EMP-004", name: "Sarah Smith", role: "Marketing Intern", department: "Marketing", status: "onboarding", salary: "€1,200/mo", timeoff: "5 days left" }
  ]);

  const columns = [
    { header: "Employee", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.role}</div>
        </div>
      </div>
    )},
    { header: "Department", cell: (row) => <Badge status="info" text={row.department} /> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "on_leave") color = "warning";
      if (row.status === "onboarding") color = "default";
      return <Badge status={color} text={row.status.toUpperCase().replace("_", " ")} />;
    }},
    { header: "Salary / Comp", cell: (row) => <span style={{ fontWeight: 600 }}>{row.salary}</span> },
    { header: "Time Off Balance", cell: (row) => (
      <span style={{ color: row.timeoff.startsWith("0") ? "var(--color-danger)" : "var(--fg)" }}>
        {row.timeoff}
      </span>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="file-text" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>HR & Payroll</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage your team, track time-off, and run payroll.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Time-Off Requests</button>
          <button className="kc-btn kc-btn-primary"><Icon name="dollar-sign" size={16} /> Run Payroll</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Employees</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>On Leave / Vacation</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>2</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Est. Monthly Payroll</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€64,200</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search employees by name, role, or ID..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Department</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export</button>
        </div>
        <DataTable columns={columns} data={employees} />
      </div>
    </div>
  );
}
