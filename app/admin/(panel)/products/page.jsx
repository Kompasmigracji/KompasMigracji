"use client";
/* iPhoenixCRM — Products & Inventory Catalog (Saleor style) */
import React, { useState } from "react";
import { Icon, Badge, EmptyState, DataTable } from "@/components/admin/ui";

export default function ProductsPage() {
  const [products] = useState([
    { id: "p_1", name: "Premium Legal Consultation", sku: "SRV-LGL-01", type: "Service", stock: null, price: 150.00, currency: "USD", status: "active" },
    { id: "p_2", name: "Residency Application Package", sku: "PKG-RES-02", type: "Digital", stock: null, price: 499.00, currency: "USD", status: "active" },
    { id: "p_3", name: "Branded Welcome Kit", sku: "PHY-KIT-01", type: "Physical", stock: 45, price: 25.00, currency: "USD", status: "active" },
    { id: "p_4", name: "Tax Audit Review 2026", sku: "SRV-TAX-01", type: "Service", stock: null, price: 300.00, currency: "USD", status: "draft" }
  ]);

  const columns = [
    { 
      header: "Product Name", 
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "var(--panel-2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <Icon name={row.type === "Physical" ? "briefcase" : "file"} size={20} color="var(--dim)" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.sku}</div>
          </div>
        </div>
      ) 
    },
    { 
      header: "Type", 
      cell: (row) => <span style={{ color: "var(--dim)" }}>{row.type}</span>
    },
    { 
      header: "Status", 
      cell: (row) => <Badge status={row.status === "active" ? "success" : "dim"} text={row.status} />
    },
    { 
      header: "Inventory", 
      cell: (row) => row.stock !== null ? (
        <span style={{ color: row.stock < 10 ? "var(--color-warning)" : "inherit" }}>
          {row.stock} in stock
        </span>
      ) : <span style={{ color: "var(--dim)" }}>∞ (Not tracked)</span>
    },
    { 
      header: "Price", 
      cell: (row) => <span style={{ fontWeight: 500 }}>{row.price.toFixed(2)} {row.currency}</span>
    },
    {
      header: "",
      cell: () => <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Products & Inventory</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage your catalog, pricing, and stock levels.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="file" size={16} /> Import</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Product</button>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products found" description="Add your first product to start selling." icon="briefcase" />
      ) : (
        <DataTable columns={columns} data={products} />
      )}
    </div>
  );
}
