"use client";
/* iPhoenixCRM — Subscriptions & Billing (Stripe / Chargebee style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function SubscriptionsPage() {
  const [subscriptions] = useState([
    { id: "SUB-8091", customer: "TechCorp Ltd", plan: "B2B Legal Retainer", amount: "€1,200/mo", status: "active", nextBilling: "Jun 15, 2026" },
    { id: "SUB-8092", customer: "BuildBud Sp. z o.o.", plan: "HR & Payroll Pro", amount: "€850/mo", status: "active", nextBilling: "Jun 01, 2026" },
    { id: "SUB-8093", customer: "Ivan Ivanov", plan: "Personal VIP Support", amount: "€50/mo", status: "past_due", nextBilling: "May 25, 2026" },
    { id: "SUB-8094", customer: "Logex Warehouse", plan: "Basic Recruiting", amount: "€300/mo", status: "canceled", nextBilling: "—" }
  ]);

  const columns = [
    { header: "Customer", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.customer} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.customer}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Plan / Product", cell: (row) => <span style={{ fontWeight: 500 }}>{row.plan}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "past_due") color = "warning";
      if (row.status === "canceled") color = "danger";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "Amount", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{row.amount}</span> },
    { header: "Next Billing", cell: (row) => (
      <span style={{ color: row.status === "past_due" ? "var(--color-danger)" : "var(--dim)", fontWeight: row.status === "past_due" ? 600 : 400 }}>
        {row.nextBilling}
      </span>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="credit-card" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Subscriptions & Billing</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage recurring revenue, billing cycles, and subscriber churn.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Pricing Plans</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Subscription</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Monthly Recurring (MRR)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€24,500</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Subscribers</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Churn Rate (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>2.4%</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search subscriptions by customer or ID..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Plan</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
        </div>
        <DataTable columns={columns} data={subscriptions} />
      </div>
    </div>
  );
}
