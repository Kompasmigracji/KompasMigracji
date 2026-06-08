"use client";
/* iPhoenixCRM — Expense Management & Receipts (Expensify style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function ExpensesPage() {
  const [expenses] = useState([
    { id: "EXP-9120", merchant: "Facebook Ads", amount: "€1,200.00", category: "Marketing", employee: "System", date: "Today", status: "cleared" },
    { id: "EXP-9119", merchant: "Orlen Station (Fuel)", amount: "€125.40", category: "Transport", employee: "Oleh Melnyk", date: "Yesterday", status: "pending_approval" },
    { id: "EXP-9118", merchant: "AWS Cloud", amount: "€450.00", category: "IT / Software", employee: "Alex Jenkins", date: "May 25", status: "cleared" },
    { id: "EXP-9117", merchant: "Hilton Warsaw (Client Meeting)", amount: "€210.00", category: "Travel & Meals", employee: "Maria Garcia", date: "May 22", status: "reimbursed" }
  ]);

  const columns = [
    { header: "Merchant / Vendor", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="shopping-bag" size={16} color="var(--dim)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.merchant}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="info" text={row.category} /> },
    { header: "Amount", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-danger)" }}>-{row.amount}</span> },
    { header: "Employee", cell: (row) => (
      row.employee === "System" ? (
        <span style={{ color: "var(--dim)" }}><Icon name="cpu" size={14} /> Auto-Billed</span>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={row.employee} size={24} />
          <span style={{ fontSize: "var(--text-sm)" }}>{row.employee}</span>
        </div>
      )
    )},
    { header: "Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending_approval") color = "warning";
      if (row.status === "cleared") color = "default";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="paperclip" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="check" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Expenses & Receipts</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track company spending, approve reimbursements, and manage corporate cards.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="credit-card" size={16} /> Corporate Cards</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Scan Receipt</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Spend (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€8,450</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Pending Approvals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€340</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Highest Category</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>Marketing</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search expenses by vendor, category, or employee..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Category</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export to Accounting</button>
        </div>
        <DataTable columns={columns} data={expenses} />
      </div>
    </div>
  );
}
