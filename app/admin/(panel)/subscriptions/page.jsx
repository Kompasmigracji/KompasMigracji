"use client";
/* KompasCRM — Subscriptions & MRR */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function SubscriptionsPage() {
  const [subscriptions] = useState([]);

  const columns = [
    { header: "Client / Company", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.client.substring(0,2).toUpperCase()} size={36} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.client}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id} • Customer since {row.since}</div>
        </div>
      </div>
    )},
    { header: "Subscription Plan", cell: (row) => (
      <Badge status="primary" text={row.plan} />
    )},
    { header: "Recurring Amount", cell: (row) => <span style={{ fontWeight: 700, fontSize: "16px" }}>{row.amount}</span> },
    { header: "Next Billing", cell: (row) => (
      <span style={{ fontSize: "var(--text-sm)", color: row.status === "past_due" ? "var(--color-danger)" : "var(--fg)" }}>
        {row.nextBilling}
      </span>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      let text = row.status.toUpperCase().replace("_", " ");
      if (row.status === "past_due") color = "danger";
      if (row.status === "canceled") color = "default";
      return <Badge status={color} text={text} />;
    }},
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "past_due" && (
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px", background: "var(--color-warning)", border: "none" }}>Retry Card</button>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Subscriptions & MRR</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track monthly recurring revenue (MRR) from B2B retainers and ongoing legal support.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="credit-card" size={16} /> Stripe Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Subscription</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)", background: "rgba(16, 185, 129, 0.05)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total MRR</div>
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€14,500</div>
          <div style={{ fontSize: "11px", color: "var(--color-success)", marginTop: 4, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="trending-up" size={12} /> +12% from last month
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Subscribers</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>B2B and B2C clients on auto-pay.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Past Due (Failed Payments)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>3</div>
          <div style={{ fontSize: "10px", color: "var(--color-danger)", marginTop: 4, fontWeight: 600 }}>€450 at risk of churn.</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by client or company..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Statuses</option>
            <option>Active</option>
            <option>Past Due</option>
            <option>Canceled</option>
          </select>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Plans</option>
            <option>B2B Retainer</option>
            <option>Personal Concierge</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={subscriptions} />
        </div>
      </div>
    </div>
  );
}
