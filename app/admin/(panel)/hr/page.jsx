"use client";
/* iPhoenixCRM — Employee HR & Onboarding */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function HRPage() {
  const [employees] = useState([
    { id: "EMP-041", name: "Dmitry K.", role: "Junior Sales", status: "onboarding", progress: 65, joinDate: "June 05, 2026", nextTask: "Sign NDA" },
    { id: "EMP-042", name: "Olena M.", role: "Legal Assistant", status: "onboarding", progress: 20, joinDate: "Yesterday", nextTask: "Read KB: TRC Basics" },
    { id: "EMP-012", name: "Maria Garcia", role: "Senior Lawyer", status: "active", progress: 100, joinDate: "Jan 10, 2024", nextTask: "—" },
    { id: "EMP-015", name: "Alex Jenkins", role: "Manager", status: "on_leave", progress: 100, joinDate: "Mar 22, 2024", nextTask: "Returns June 15" }
  ]);

  const columns = [
    { header: "Employee", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.name.substring(0,2).toUpperCase()} size={36} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Role", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.role}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      let text = row.status.toUpperCase().replace("_", " ");
      if (row.status === "onboarding") color = "warning";
      if (row.status === "on_leave") color = "default";
      return <Badge status={color} text={text} />;
    }},
    { header: "Onboarding Progress", cell: (row) => (
      <div style={{ width: 120 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: 4 }}>
          <span>{row.progress}%</span>
          <span style={{ color: "var(--dim)" }}>{row.progress === 100 ? "Done" : "In Progress"}</span>
        </div>
        <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${row.progress}%`, background: row.progress === 100 ? "var(--color-success)" : "var(--color-warning)" }}></div>
        </div>
      </div>
    )},
    { header: "Action Required / Next", cell: (row) => (
      <span style={{ fontSize: "12px", color: row.status === "onboarding" ? "var(--color-warning)" : "var(--dim)", fontWeight: row.status === "onboarding" ? 600 : 400 }}>
        {row.nextTask}
      </span>
    )},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="user" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-vertical" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>HR & Onboarding</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage employee checklists, equipment, and access rights.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Leaves & Holidays</button>
          <button className="kc-btn kc-btn-primary"><Icon name="user-plus" size={16} /> Hire Employee</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Onboarding Overview */}
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Currently Onboarding</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>4</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>New hires in their first 30 days.</div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Team Size</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>42</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>+12% growth this year.</div>
        </div>

        {/* Action Required Box */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="alert-circle" size={24} color="var(--color-danger)" />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-danger)" }}>Equipment Needed</div>
            <div style={{ fontSize: "12px", color: "var(--fg)", marginTop: 4 }}>2 new laptops need to be ordered for next week's hires.</div>
            <div style={{ fontSize: "11px", color: "var(--color-primary)", marginTop: 8, cursor: "pointer", fontWeight: 600 }}>Order Now &rarr;</div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search employees by name or role..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Statuses</option>
            <option>Onboarding</option>
            <option>Active</option>
            <option>On Leave</option>
          </select>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Roles</option>
            <option>Lawyer</option>
            <option>Sales</option>
            <option>Manager</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={employees} />
        </div>
      </div>
    </div>
  );
}
