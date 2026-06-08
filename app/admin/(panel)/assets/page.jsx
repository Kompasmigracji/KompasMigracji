"use client";
/* KompasCRM — IT Assets & Inventory (Snipe-IT style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function AssetsPage() {
  const [assets] = useState([
    { tag: "AST-4012", name: "MacBook Pro M3 14\"", category: "Laptops", assignee: "Alex Jenkins", status: "deployed", condition: "Excellent", purchaseDate: "May 10, 2026" },
    { tag: "AST-4011", name: "iPhone 15 Pro", category: "Phones", assignee: "Maria Garcia", status: "deployed", condition: "Good", purchaseDate: "Mar 15, 2026" },
    { tag: "AST-4010", name: "Dell UltraSharp 27\"", category: "Monitors", assignee: "Unassigned", status: "ready_to_deploy", condition: "New", purchaseDate: "Jun 01, 2026" },
    { tag: "AST-4009", name: "Lenovo ThinkPad T14", category: "Laptops", assignee: "Unassigned", status: "in_repair", condition: "Broken Screen", purchaseDate: "Jan 12, 2025" }
  ]);

  const columns = [
    { header: "Asset Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name={row.category === "Laptops" ? "laptop" : row.category === "Phones" ? "smartphone" : "monitor"} size={16} color="var(--dim)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.tag}</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="info" text={row.category} /> },
    { header: "Status", cell: (row) => {
      let color = "primary";
      if (row.status === "ready_to_deploy") color = "success";
      if (row.status === "in_repair") color = "danger";
      return <Badge status={color} text={row.status.replace(/_/g, " ").toUpperCase()} />;
    }},
    { header: "Assigned To", cell: (row) => (
      row.assignee === "Unassigned" ? (
        <span style={{ color: "var(--dim)" }}>—</span>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={row.assignee} size={24} />
          <span style={{ fontSize: "var(--text-sm)" }}>{row.assignee}</span>
        </div>
      )
    )},
    { header: "Condition", cell: (row) => (
      <span style={{ color: row.status === "in_repair" ? "var(--color-danger)" : "var(--fg)" }}>
        {row.condition}
      </span>
    )},
    { header: "Purchased", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.purchaseDate}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>IT Assets & Inventory</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track company laptops, phones, hardware, and software licenses.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="cpu" size={16} /> Software Licenses</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Asset</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Assets</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Ready to Deploy</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>18</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>In Repair / Broken</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>3</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by asset tag, name, or employee..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="printer" size={16} /> Print Labels</button>
        </div>
        <DataTable columns={columns} data={assets} />
      </div>
    </div>
  );
}
