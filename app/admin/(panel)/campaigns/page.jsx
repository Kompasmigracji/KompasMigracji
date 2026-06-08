"use client";
/* KompasCRM — Email Campaigns & Newsletters (Mailchimp style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function CampaignsPage() {
  const [campaigns] = useState([
    { id: "CAMP-5501", name: "New TRC Rules 2026", audience: "All Active Clients (1,240)", sent: "Today, 09:00", openRate: "42.5%", clickRate: "12.1%", status: "sent" },
    { id: "CAMP-5502", name: "B2B Legal Services Discount", audience: "Company Owners (450)", sent: "May 25, 2026", openRate: "55.2%", clickRate: "8.4%", status: "sent" },
    { id: "CAMP-5503", name: "Referral Program Launch", audience: "Gold Tier Members (85)", sent: "—", openRate: "—", clickRate: "—", status: "draft" },
    { id: "CAMP-5504", name: "Summer Visa Promo", audience: "Lost Leads (3,400)", sent: "Scheduled for Jun 10", openRate: "—", clickRate: "—", status: "scheduled" }
  ]);

  const columns = [
    { header: "Campaign Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="mail" size={16} color={row.status === "sent" ? "var(--color-primary)" : "var(--dim)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Audience", cell: (row) => <Badge status="info" text={row.audience} /> },
    { header: "Open Rate", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.openRate !== "—" ? "var(--color-success)" : "var(--dim)" }}>
        {row.openRate}
      </span>
    )},
    { header: "Click Rate", cell: (row) => <span style={{ fontWeight: 500 }}>{row.clickRate}</span> },
    { header: "Sent / Scheduled", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.sent}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "draft") color = "default";
      if (row.status === "scheduled") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="bar-chart-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Email Campaigns</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Send mass emails, newsletters, and track engagement across your database.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="layout" size={16} /> Email Templates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Campaign</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Emails Sent (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14,500</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Open Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>48.2%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Bounced Emails</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>1.4%</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search campaigns by name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Audiences</button>
        </div>
        <DataTable columns={columns} data={campaigns} />
      </div>
    </div>
  );
}
