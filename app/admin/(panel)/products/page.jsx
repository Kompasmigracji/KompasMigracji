"use client";
/* KompasCRM — Product & Services Catalog (Shopify style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function ProductsPage() {
  const [products] = useState([]);

  const columns = [
    { header: "Service / Product", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, background: "var(--panel-2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="package" size={20} color="var(--primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="info" text={row.category} /> },
    { header: "Price", cell: (row) => <span style={{ fontWeight: 600 }}>{row.price}</span> },
    { header: "Total Sales", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.sales} sold</span> },
    { header: "Revenue (YTD)", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{row.revenue}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "draft") color = "warning";
      if (row.status === "archived") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
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
          <h2 className="kc-h2" style={{ margin: 0 }}>Service Catalog & Products</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage pricing, service bundles, and track your most profitable offerings.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="percent" size={16} /> Discounts</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Product</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Best Selling Service</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>Karta Pobytu</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Revenue (Catalog)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€125,400</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Services</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>18</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search services by name or SKU..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Category</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
        </div>
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
