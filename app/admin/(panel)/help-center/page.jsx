"use client";
/* KompasCRM — Help Center & Public Knowledge Base */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function HelpCenterPage() {
  const [articles] = useState([]);

  const columns = [
    { header: "Article Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="file-text" size={16} color={row.status === "published" ? "var(--color-primary)" : "var(--dim)"} />
        <div>
          <div style={{ fontWeight: 600, color: "var(--fg)" }}>{row.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.category}</div>
        </div>
      </div>
    )},
    { header: "Total Views", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="eye" size={14} color="var(--dim)" />
        {row.views.toLocaleString()}
      </div>
    )},
    { header: "Helpful Rating", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: row.helpful === "—" ? "var(--dim)" : parseInt(row.helpful) > 90 ? "var(--color-success)" : "var(--color-warning)" }}>
        <Icon name="thumbs-up" size={14} />
        {row.helpful}
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "draft") color = "warning";
      if (row.status === "archived") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-3" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="external-link" size={16} color="var(--dim)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Public Help Center</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create FAQ articles to help clients find answers before they contact support.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="layout" size={16} /> Edit Portal Theme</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Article</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Article Views (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>4,802</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Ticket Deflection Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>38.4%</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Clients who read an article and didn't open a chat.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Top Searched Phrase</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--fg)" }}>"PESEL UKR"</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Consider writing a new article about this.</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search articles..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 200 }}>
            <option>All Categories</option>
            <option>Visas & Residency</option>
            <option>Billing & Payments</option>
          </select>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
        </div>
        <DataTable columns={columns} data={articles} />
      </div>
    </div>
  );
}
