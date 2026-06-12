"use client";
/* KompasCRM — Service Catalog & Price Books */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function ServiceCatalogPage() {
  const [services] = useState([]);

  const columns = [
    { header: "Service Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.category.includes("B2B") || row.category.includes("Corporate") ? "briefcase" : "user"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="default" text={row.category} /> },
    { header: "Client Price", cell: (row) => <span style={{ fontWeight: 700, color: "var(--fg)" }}>{row.price}</span> },
    { header: "Internal Cost", cell: (row) => <span style={{ color: "var(--color-danger)" }}>{row.cost}</span> },
    { header: "Profit Margin", cell: (row) => (
      <span style={{ 
        fontWeight: 600, 
        color: parseInt(row.margin) > 60 ? "var(--color-success)" : "var(--color-warning)" 
      }}>
        {row.margin}
      </span>
    )},
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "active" ? "success" : "default"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="copy" size={16} color="var(--dim)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Service Catalog & Pricing</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Standardize your offerings. Sales teams use these services to generate quotes.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="percent" size={16} /> Discount Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Service</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Services</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Average Profit Margin</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>62.4%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Best Selling Service (30d)</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--fg)" }}>TRC (Karta Pobytu)</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>142 units sold this month.</div>
        </div>
      </div>

      {/* Quote Generation Simulation (CPQ Demo) */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)", border: "1px dashed var(--color-primary)", background: "rgba(139, 92, 246, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="file-text" size={16} color="var(--color-primary)" />
              Quote Builder (CPQ Preview)
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>How sales reps build offers for clients.</div>
          </div>
          <button className="kc-btn kc-btn-secondary" style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}>Simulate New Quote</button>
        </div>
        
        <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "var(--space-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
            <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>Package: Corporate Relocation Setup</span>
            <Badge status="success" text="B2B Deal" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", marginBottom: 8 }}>
            <span>1x Company Registration (Sp. z.o.o.)</span>
            <span>€800</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", marginBottom: 8 }}>
            <span>3x TRC (Karta Pobytu) - Full Package @ €450</span>
            <span>€1,350</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-danger)" }}>
            <span>Volume Discount (10%)</span>
            <span>-€215</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-lg)", fontWeight: 700, borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: "var(--space-sm)" }}>
            <span>Total Quote to Client:</span>
            <span>€1,935</span>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search services..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Categories</option>
            <option>B2C Visas</option>
            <option>Corporate</option>
            <option>Consulting</option>
          </select>
        </div>
        <DataTable columns={columns} data={services} />
      </div>
    </div>
  );
}
