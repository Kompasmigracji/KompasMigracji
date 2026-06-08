"use client";
/* KompasCRM — E-commerce & Inventory Management (Saleor style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function InventoryPage() {
  const [products] = useState([
    { id: "PRD-001", name: "Premium Consultation (1 Hour)", type: "Service", stock: "Unlimited", price: "€150.00", status: "active", sales: 124 },
    { id: "PRD-002", name: "Visa Application Package - Standard", type: "Digital", stock: "Unlimited", price: "€450.00", status: "active", sales: 89 },
    { id: "PRD-003", name: "Branded Merch T-Shirt", type: "Physical", stock: 12, price: "€25.00", status: "low_stock", sales: 45 },
    { id: "PRD-004", name: "Enterprise Retainer Plan (Monthly)", type: "Subscription", stock: "Unlimited", price: "€2,500.00", status: "draft", sales: 0 }
  ]);

  const columns = [
    { header: "Product Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.type === "Physical" ? "box" : row.type === "Subscription" ? "repeat" : "zap"} size={16} color="var(--dim)" />
        </div>
        <span style={{ fontWeight: 600 }}>{row.name}</span>
      </div>
    )},
    { header: "Type", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.type}</span> },
    { header: "Status", cell: (row) => {
      let color = "info";
      if (row.status === "active") color = "success";
      if (row.status === "low_stock") color = "warning";
      if (row.status === "draft") color = "default";
      return <Badge status={color} text={row.status.toUpperCase().replace("_", " ")} />;
    }},
    { header: "Inventory / Stock", cell: (row) => (
      <span style={{ color: typeof row.stock === "number" && row.stock < 15 ? "var(--color-danger)" : "var(--fg)", fontWeight: 600 }}>
        {row.stock}
      </span>
    )},
    { header: "Price", cell: (row) => <span style={{ fontWeight: 600 }}>{row.price}</span> },
    { header: "Sales", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.sales}</span> },
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
          <h2 className="kc-h2" style={{ margin: 0 }}>Products & Inventory</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage your catalog, physical stock, digital goods, and service packages.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Product</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Products</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>48</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Listings</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>32</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Low Stock / Out of Stock</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>3</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search products, SKUs..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Filter</button>
        </div>
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
