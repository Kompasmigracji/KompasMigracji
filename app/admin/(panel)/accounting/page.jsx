"use client";
/* iPhoenixCRM — Accounting & Payroll (Księgowość) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function AccountingPage() {
  const [expenses] = useState([
    { id: "EXP-901", category: "Office Rent", vendor: "WeWork Warsaw", amount: "€3,500.00", date: "June 01, 2026", status: "paid" },
    { id: "EXP-902", category: "Payroll (May)", vendor: "Internal Staff (42)", amount: "€65,200.00", date: "June 10, 2026", status: "pending" },
    { id: "EXP-903", category: "Taxes (ZUS)", vendor: "ZUS", amount: "€14,800.00", date: "June 15, 2026", status: "upcoming" },
    { id: "EXP-904", category: "Software", vendor: "Google Workspace", amount: "€250.00", date: "Today", status: "paid" }
  ]);

  const columns = [
    { header: "Expense Category", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.category.includes("Taxes") ? "shield" : row.category.includes("Payroll") ? "users" : "credit-card"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.category}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Vendor / Payee", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.vendor}</span> },
    { header: "Amount", cell: (row) => (
      <span style={{ fontWeight: 700, fontSize: "14px", color: row.status === "paid" ? "var(--color-success)" : "var(--fg)" }}>
        {row.amount}
      </span>
    )},
    { header: "Due Date", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.date}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending") color = "warning";
      if (row.status === "upcoming") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status !== "paid" && (
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }}>Mark Paid</button>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="paperclip" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Accounting & Payroll (Księgowość)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track internal expenses, manage employee salaries, and monitor tax liabilities.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Run Payroll</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Expense</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Financial Health Stats */}
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Expenses (June)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>€83,750</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>-5% compared to May.</div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Net Profit (Estimated)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€61,250</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Revenue (€145,000) - Expenses</div>
        </div>

        {/* Tax Liability Box */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="shield" size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-primary)" }}>ZUS & VAT Due</div>
            <div style={{ fontSize: "12px", color: "var(--fg)", marginTop: 4 }}>Pay €28,400 to Urząd Skarbowy & ZUS by June 20th.</div>
            <div style={{ fontSize: "11px", color: "var(--color-primary)", marginTop: 8, cursor: "pointer", fontWeight: 600 }}>View Tax Report &rarr;</div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search expenses by vendor or category..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Upcoming</option>
          </select>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Categories</option>
            <option>Payroll</option>
            <option>Taxes</option>
            <option>Office</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={expenses} />
        </div>
      </div>
    </div>
  );
}
