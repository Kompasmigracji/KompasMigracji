"use client";
/* iPhoenixCRM — Expense Tracking & P&L */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function ExpensesPage() {
  const [expenses] = useState([
    { id: "EXP-01", date: "June 05, 2026", category: "Marketing", description: "Facebook & Insta Ads", amount: "€3,500.00", status: "paid", branch: "HQ Warsaw" },
    { id: "EXP-02", date: "June 01, 2026", category: "Rent", description: "Warsaw Office Lease", amount: "€2,200.00", status: "paid", branch: "HQ Warsaw" },
    { id: "EXP-03", date: "June 10, 2026", category: "Software", description: "Google Workspace & CRM", amount: "€450.00", status: "pending", branch: "Global" },
    { id: "EXP-04", date: "May 28, 2026", category: "Travel", description: "Client Meetings in Berlin", amount: "€840.50", status: "reimbursed", branch: "Krakow Branch" }
  ]);

  const columns = [
    { header: "Date", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.date}</span> },
    { header: "Description", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.description}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="map-pin" size={10} /> {row.branch}
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="default" text={row.category} /> },
    { header: "Amount", cell: (row) => <span style={{ fontWeight: 700, color: "var(--color-danger)" }}>-{row.amount}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending") color = "warning";
      if (row.status === "reimbursed") color = "primary";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="paperclip" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Expense Tracking & P&L</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Log operational costs, track marketing spend, and calculate net profit automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export CSV</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Expense</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Revenue (MTD)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€84,500.00</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Money In</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Expenses (MTD)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>-€18,240.50</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Money Out (Rent, Ads, Payroll)</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)", background: "rgba(59, 130, 246, 0.05)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", textTransform: "uppercase", fontWeight: 600 }}>Net Profit (MTD)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--fg)" }}>€66,259.50</div>
          <div style={{ fontSize: "10px", color: "var(--color-primary)", marginTop: 4, fontWeight: 600 }}>78.4% Profit Margin</div>
        </div>
      </div>

      {/* Expense Breakdown Visualization */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="pie-chart" size={16} color="var(--dim)" />
          Expense Breakdown (June 2026)
        </div>
        
        {/* Progress Bar Chart */}
        <div style={{ width: "100%", height: 24, background: "var(--panel-2)", borderRadius: 12, overflow: "hidden", display: "flex" }}>
          <div style={{ width: "45%", background: "#f43f5e", height: "100%" }} title="Payroll (45%)"></div>
          <div style={{ width: "30%", background: "#8b5cf6", height: "100%" }} title="Marketing (30%)"></div>
          <div style={{ width: "15%", background: "#0ea5e9", height: "100%" }} title="Rent (15%)"></div>
          <div style={{ width: "10%", background: "#10b981", height: "100%" }} title="Software & Misc (10%)"></div>
        </div>
        
        <div style={{ display: "flex", gap: "var(--space-xl)", fontSize: "12px", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#f43f5e" }}></div> Payroll (45%)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#8b5cf6" }}></div> Marketing (30%)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#0ea5e9" }}></div> Rent (15%)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "#10b981" }}></div> Software (10%)</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search expenses by description..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Branches</option>
            <option>HQ Warsaw</option>
            <option>Krakow Branch</option>
            <option>Global</option>
          </select>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Categories</option>
            <option>Marketing</option>
            <option>Payroll</option>
            <option>Rent</option>
          </select>
        </div>
        <DataTable columns={columns} data={expenses} />
      </div>
    </div>
  );
}
