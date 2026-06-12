"use client";
/* KompasCRM — Accounting & Payroll (Księgowość) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, StatCard, SearchInput } from "@/components/admin/ui";

export default function AccountingPage() {
  const [expenses, setExpenses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const handleMarkPaid = (id) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: "paid" } : exp));
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All Statuses" || exp.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesCat = true;
    if (categoryFilter === "Payroll") matchesCat = exp.category.toLowerCase().includes("payroll");
    if (categoryFilter === "Taxes") matchesCat = exp.category.toLowerCase().includes("taxes") || exp.category.toLowerCase().includes("zus");
    if (categoryFilter === "Office") matchesCat = exp.category.toLowerCase().includes("office") || exp.category.toLowerCase().includes("rent") || exp.category.toLowerCase().includes("software");

    return matchesSearch && matchesStatus && matchesCat;
  });

  const columns = [
    { header: "Expense Category", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={row.category.includes("Taxes") ? "shield" : row.category.includes("Payroll") ? "users" : "card"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "var(--text)" }}>{row.category}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Vendor / Payee", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>{row.vendor}</span> },
    { header: "Amount", cell: (row) => (
      <span style={{ fontWeight: 700, fontSize: "14px", color: row.status === "paid" ? "var(--color-success)" : "var(--text)" }}>
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
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px", minHeight: "auto" }} onClick={() => handleMarkPaid(row.id)}>
            Mark Paid
          </button>
        )}
        <button className="kc-btn kc-btn-ghost" style={{ padding: 6, minHeight: "auto" }}><Icon name="compass" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)", flexShrink: 0, flexWrap: "wrap", gap: "var(--space-md)" }}>
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

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-sm)", flexShrink: 0, flexWrap: "wrap" }}>
        
        {/* Financial Health Stats */}
        <div style={{ flex: "1 1 200px" }}>
          <StatCard icon="card" value="€83,750" label="Total Expenses (June)" sub="-5% compared to May" trend={-5} />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <StatCard icon="activity" value="€61,250" label="Net Profit (Estimated)" sub="Revenue (€145,000) - Expenses" />
        </div>

        {/* Tax Liability Box */}
        <div className="kc-stat" style={{ flex: "1 1 280px", display: "flex", alignItems: "center", gap: 16, background: "var(--brass-bg)", border: "1px solid var(--color-primary)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(217, 158, 84, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="shield" size={22} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-primary)" }}>ZUS & VAT Due</div>
            <div style={{ fontSize: "12px", color: "var(--text)", marginTop: 4 }}>Pay €28,400 to Urząd Skarbowy & ZUS by June 20th.</div>
            <div style={{ fontSize: "11px", color: "var(--color-primary)", marginTop: 8, cursor: "pointer", fontWeight: 600 }} onClick={() => alert("Tax report opened")}>View Tax Report &rarr;</div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search expenses by vendor or category..." />
          </div>
          <select className="kc-select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Upcoming</option>
          </select>
          <select className="kc-select" style={{ width: 160 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option>All Categories</option>
            <option>Payroll</option>
            <option>Taxes</option>
            <option>Office</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={filteredExpenses} />
        </div>
      </div>
    </div>
  );
}
