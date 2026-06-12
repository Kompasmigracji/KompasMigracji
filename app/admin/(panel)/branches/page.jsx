"use client";
/* KompasCRM — Branch & Franchise Management */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function BranchesPage() {
  const [branches] = useState([]);

  const columns = [
    { header: "Branch Details", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.type === "Franchise" ? "briefcase" : row.type === "Headquarters" ? "star" : "map-pin"} size={20} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {row.name}
            {row.type === "Headquarters" && <Badge status="primary" text="HQ" />}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.location}</div>
        </div>
      </div>
    )},
    { header: "Manager", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.manager === "Pending" ? "?" : row.manager.substring(0,2).toUpperCase()} size={24} />
        <span style={{ fontSize: "var(--text-sm)", color: row.manager === "Pending" ? "var(--dim)" : "var(--fg)" }}>{row.manager}</span>
      </div>
    )},
    { header: "Staff", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="users" size={14} color="var(--dim)" /> {row.staff}
      </div>
    )},
    { header: "YTD Revenue", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{row.revenue}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "setup") color = "warning";
      if (row.status === "closed") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="bar-chart-2" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Branch & Franchise Management</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage multiple offices, isolate client data by region, and compare performance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="map" size={16} /> View Map</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Open New Branch</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Active Branches</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>3</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>+1 currently in setup</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Top Performing Branch</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>HQ Warsaw</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Generated 65% of total revenue.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Global Staff Headcount</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>20</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Across all active locations.</div>
        </div>
      </div>

      {/* Workspace Isolation Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(139, 92, 246, 0.05)", border: "1px dashed var(--color-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="eye-off" size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>Data Isolation is ON</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>Staff in 'Krakow Branch' cannot see leads, clients, or deals belonging to 'HQ Warsaw' or 'Barcelona'.</div>
          </div>
        </div>
        <button className="kc-btn kc-btn-secondary">Global Permissions</button>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search branches by name or city..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Types</option>
            <option>Headquarters</option>
            <option>Owned Branch</option>
            <option>Franchise</option>
          </select>
        </div>
        <DataTable columns={columns} data={branches} />
      </div>
    </div>
  );
}
