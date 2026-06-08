"use client";
/* KompasCRM — Orders & Fulfillment Management */
import React, { useState } from "react";
import { Icon, Badge, EmptyState, DataTable, Avatar } from "@/components/admin/ui";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const [orders] = useState([
    { id: "ORD-2026-001", customer: "John Doe", email: "john@example.com", date: "May 14, 2026", total: 150.00, currency: "USD", paymentStatus: "paid", fulfillmentStatus: "fulfilled" },
    { id: "ORD-2026-002", customer: "Jane Smith", email: "jane@company.com", date: "May 13, 2026", total: 499.00, currency: "USD", paymentStatus: "unpaid", fulfillmentStatus: "unfulfilled" },
    { id: "ORD-2026-003", customer: "Global Corp", email: "billing@global.com", date: "May 10, 2026", total: 1200.00, currency: "USD", paymentStatus: "paid", fulfillmentStatus: "unfulfilled" }
  ]);

  const filteredOrders = activeTab === "all" ? orders : orders.filter(o => o.fulfillmentStatus === activeTab);

  const columns = [
    { 
      header: "Order", 
      cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{row.id}</span>
    },
    { 
      header: "Date", 
      cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span>
    },
    { 
      header: "Customer", 
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={row.customer} size={24} />
          <div>
            <div style={{ fontWeight: 500 }}>{row.customer}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      header: "Payment", 
      cell: (row) => <Badge status={row.paymentStatus === "paid" ? "success" : "warning"} text={row.paymentStatus} />
    },
    { 
      header: "Fulfillment", 
      cell: (row) => <Badge status={row.fulfillmentStatus === "fulfilled" ? "info" : "dim"} text={row.fulfillmentStatus} />
    },
    { 
      header: "Total", 
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.total.toFixed(2)} {row.currency}</span>
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
          <h2 className="kc-h2" style={{ margin: 0 }}>Orders</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage purchases, fulfill orders, and track invoices.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Draft Order</button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          className={`kc-tab ${activeTab === "all" ? "kc-tab-active" : ""}`} 
          onClick={() => setActiveTab("all")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "all" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "all" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "all" ? 600 : 400, cursor: "pointer" }}
        >
          All Orders
        </button>
        <button 
          className={`kc-tab ${activeTab === "unfulfilled" ? "kc-tab-active" : ""}`} 
          onClick={() => setActiveTab("unfulfilled")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "unfulfilled" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "unfulfilled" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "unfulfilled" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          Unfulfilled <Badge status="info" text="2" />
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState title="No orders found" description="You have no orders matching this view." icon="shopping-bag" />
      ) : (
        <DataTable columns={columns} data={filteredOrders} />
      )}
    </div>
  );
}
