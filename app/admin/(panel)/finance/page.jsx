"use client";
/* KompasCRM — Phase 4: Financial Analytics Admin Panel */
import React, { useState } from "react";
import { Icon, StatCard, DataTable, EmptyState, Badge } from "@/components/admin/ui";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Revenue metrics
  const revenueMetrics = {
    cashFlow: 142500,
    mrr: 45000,
    arr: 540000,
    expenses: 28400
  };

  // Mock `kompas_commissions_earned`
  const [commissions, setCommissions] = useState([]);

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({ category: "Software", description: "", amount: "" });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount) return;

    const newExpense = {
      id: `EXP-00${expenses.length + 1}`,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      date: new Date().toISOString().split("T")[0],
      createdBy: "Admin" // Mock user
    };

    // Mock API call to save to `kompas_expenses`
    // fetch('/api/finance/expenses', { method: 'POST', body: JSON.stringify(newExpense) })

    setExpenses([newExpense, ...expenses]);
    setExpenseForm({ category: "Software", description: "", amount: "" });
  };

  const commissionColumns = [
    { header: "ID", accessor: "id", cell: (row) => <span className="kc-mono" style={{ fontWeight: 600 }}>{row.id}</span> },
    { header: "Agent", accessor: "agentName" },
    { header: "Deal ID", accessor: "dealId", cell: (row) => <span className="kc-mono">{row.dealId}</span> },
    { header: "Amount", accessor: "amount", cell: (row) => <strong style={{ color: "var(--color-success)" }}>${row.amount.toLocaleString()}</strong> },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status", cell: (row) => (
      row.status === "paid" ? <Badge status="green" text="Paid" /> : <Badge status="brass" text="Pending" />
    )}
  ];

  const expenseColumns = [
    { header: "ID", accessor: "id", cell: (row) => <span className="kc-mono" style={{ fontWeight: 600 }}>{row.id}</span> },
    { header: "Category", accessor: "category" },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: "amount", cell: (row) => <strong style={{ color: "var(--color-danger)" }}>${row.amount.toLocaleString()}</strong> },
    { header: "Date", accessor: "date" },
    { header: "Created By", accessor: "createdBy" }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Financial Analytics & Expenses</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor Cash Flow, ARR, MRR, Team Commissions (`kompas_commissions_earned`), and manage `kompas_expenses`.
          </p>
        </div>
      </div>

      {/* Revenue Metrics Grid */}
      <div className="kc-grid kc-grid-4">
        <StatCard icon="activity" value={`$${revenueMetrics.cashFlow.toLocaleString()}`} label="Cash Flow (YTD)" trend={12.5} />
        <StatCard icon="layers" value={`$${revenueMetrics.arr.toLocaleString()}`} label="Annual Recurring Revenue (ARR)" trend={8.2} />
        <StatCard icon="activity" value={`$${revenueMetrics.mrr.toLocaleString()}`} label="Monthly Recurring Revenue (MRR)" trend={4.1} />
        <StatCard icon="cash" value={`$${revenueMetrics.expenses.toLocaleString()}`} label="Total Expenses (YTD)" trend={-2.4} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)" }}>
        <button 
          onClick={() => setActiveTab("overview")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "overview" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "overview" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}
        >
          <Icon name="users" size={16} /> Team Commissions
        </button>
        <button 
          onClick={() => setActiveTab("expenses")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "expenses" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "expenses" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}
        >
          <Icon name="cash" size={16} /> Expense Entry
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === "overview" && (
          <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>Team Commission Tally</h3>
            <DataTable columns={commissionColumns} data={commissions} />
          </div>
        )}

        {activeTab === "expenses" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-lg)" }}>
            {/* Expense Entry Form */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>Add New Expense</h3>
              <form onSubmit={handleExpenseSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)", fontWeight: 500 }}>Category</label>
                  <select 
                    className="kc-input" 
                    value={expenseForm.category} 
                    onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                    style={{ width: "100%" }}
                  >
                    <option value="Software">Software & IT</option>
                    <option value="Office">Office & Rent</option>
                    <option value="Travel">Travel & Fleet</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)", fontWeight: 500 }}>Description</label>
                  <input 
                    type="text" 
                    className="kc-input" 
                    value={expenseForm.description} 
                    onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                    placeholder="e.g. AWS Hosting July"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)", fontWeight: 500 }}>Amount ($)</label>
                  <input 
                    type="number" 
                    className="kc-input" 
                    value={expenseForm.amount} 
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <button type="submit" className="kc-btn kc-btn-primary" style={{ marginTop: "var(--space-sm)" }}>
                  <Icon name="plus" size={16} /> Save Expense
                </button>
              </form>
            </div>

            {/* Expense History Table */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>Recent Expenses</h3>
              {expenses.length > 0 ? (
                <DataTable columns={expenseColumns} data={expenses} />
              ) : (
                <EmptyState title="No Expenses Yet" description="Submit your first expense using the form." icon="cash" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
