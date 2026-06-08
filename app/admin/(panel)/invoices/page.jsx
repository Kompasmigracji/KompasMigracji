"use client";
/* KompasCRM — Billing & Invoicing (QuickBooks / Stripe style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function InvoicesPage() {
  const [invoices] = useState([
    { id: "INV-2026-142", client: "TechCorp Logistics", amount: "€4,500.00", date: "May 25, 2026", due: "Jun 01, 2026", status: "paid" },
    { id: "INV-2026-143", client: "Elena Rostova", amount: "€850.00", date: "Jun 02, 2026", due: "Jun 09, 2026", status: "pending" },
    { id: "INV-2026-144", client: "Global Solutions Inc", amount: "€12,000.00", date: "May 10, 2026", due: "May 24, 2026", status: "overdue" },
    { id: "INV-2026-145", client: "Alexey Volkov", amount: "€450.00", date: "Jun 05, 2026", due: "Jun 12, 2026", status: "draft" }
  ]);

  const columns = [
    { header: "Invoice Number", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="file-text" size={16} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.id}</span>
      </div>
    )},
    { header: "Client", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.client}</span>
      </div>
    )},
    { header: "Amount", cell: (row) => <span style={{ fontWeight: 600 }}>{row.amount}</span> },
    { header: "Date Issued", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "Due Date", cell: (row) => (
      <span style={{ color: row.status === "overdue" ? "var(--color-danger)" : "var(--dim)", fontWeight: row.status === "overdue" ? 600 : 400 }}>
        {row.due}
      </span>
    )},
    { header: "Status", cell: (row) => {
      let color = "warning";
      if (row.status === "paid") color = "success";
      if (row.status === "overdue") color = "danger";
      if (row.status === "draft") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="download" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="send" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Invoices & Billing</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create and send invoices, collect payments, and track overdue accounts.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Tax Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Invoice</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Paid (Last 30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€124,500</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Awaiting Payment</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€18,250</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Overdue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>€12,000</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by invoice number, client name, or amount..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Filter by Status</button>
        </div>
        <DataTable columns={columns} data={invoices} />
      </div>
    </div>
  );
}
