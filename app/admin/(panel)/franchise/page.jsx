"use client";
/* KompasCRM — Franchise Management (HQ) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function FranchisePage() {
  const [branches] = useState([]);

  const columns = [
    { header: "Branch City", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="map-pin" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.city}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Branch Manager", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.manager.substring(0,2).toUpperCase()} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.manager}</span>
      </div>
    )},
    { header: "Monthly Revenue", cell: (row) => <span style={{ fontWeight: 700, fontSize: "15px" }}>{row.revenue}</span> },
    { header: "Lead Conversion", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600, color: parseInt(row.conversion) > 15 ? "var(--color-success)" : "var(--color-danger)" }}>{row.conversion}</div>
        <div style={{ fontSize: "11px", color: "var(--dim)" }}>from {row.leads} leads</div>
      </div>
    )},
    { header: "Royalty (10%)", cell: (row) => (
      <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{row.royalty}</span>
    )},
    { header: "Health Score", cell: (row) => {
      let color = "success";
      let text = "EXCELLENT";
      if (row.status === "good") { color = "primary"; text = "GOOD"; }
      if (row.status === "needs_attention") { color = "warning"; text = "WARNING"; }
      if (row.status === "critical") { color = "danger"; text = "CRITICAL"; }
      return <Badge status={color} text={text} />;
    }},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="pie-chart" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Franchise Management (HQ)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor regional branches, franchisee performance, and royalty collections.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="file-text" size={16} /> Royalty Reports</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Branch</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Network Stats */}
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)", background: "linear-gradient(135deg, var(--panel) 0%, rgba(59, 130, 246, 0.05) 100%)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Network Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-primary)" }}>€213,500</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Across all 4 branches.</div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Royalties Expected</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€6,850</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>To be paid to HQ this month.</div>
        </div>

        {/* Action Required Box */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="trending-down" size={24} color="var(--color-danger)" />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-danger)" }}>Poznan Branch Alert</div>
            <div style={{ fontSize: "12px", color: "var(--fg)", marginTop: 4 }}>Conversion dropped below 10%. Requires immediate HQ audit.</div>
            <div style={{ fontSize: "11px", color: "var(--color-primary)", marginTop: 8, cursor: "pointer", fontWeight: 600 }}>Schedule Audit &rarr;</div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search branches or managers..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Regions</option>
            <option>Mazowieckie</option>
            <option>Małopolskie</option>
            <option>Dolnośląskie</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={branches} />
        </div>
      </div>
    </div>
  );
}
