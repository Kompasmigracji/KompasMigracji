"use client";
/* iPhoenixCRM — Affiliate & Partner Portal (PartnerStack style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function PartnersPage() {
  const [partners] = useState([
    { id: "PRT-001", name: "WorkForce Ukraine", type: "Agency", leads: 450, conversions: 120, revShare: "20%", payout: "€4,500", status: "active" },
    { id: "PRT-002", name: "Ivan Bloger", type: "Influencer", leads: 1200, conversions: 85, revShare: "10%", payout: "€1,250", status: "active" },
    { id: "PRT-003", name: "Global HR Solutions", type: "B2B Partner", leads: 15, conversions: 10, revShare: "30%", payout: "€3,000", status: "pending_payout" },
    { id: "PRT-004", name: "Legal Help PL", type: "Affiliate", leads: 0, conversions: 0, revShare: "15%", payout: "€0", status: "onboarding" }
  ]);

  const columns = [
    { header: "Partner", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Type", cell: (row) => <Badge status="info" text={row.type} /> },
    { header: "Leads Driven", cell: (row) => <span style={{ fontWeight: 500 }}>{row.leads}</span> },
    { header: "Conversions", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.conversions} closed</span> },
    { header: "RevShare", cell: (row) => <span style={{ fontWeight: 600 }}>{row.revShare}</span> },
    { header: "Owed Payout", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{row.payout}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "onboarding") color = "warning";
      if (row.status === "pending_payout") color = "primary";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="link" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Partners & Affiliates</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage B2B referrals, generate affiliate links, and automate payouts.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Commission Tiers</button>
          <button className="kc-btn kc-btn-primary"><Icon name="user-plus" size={16} /> Invite Partner</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Partner Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€85,400</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Payouts (YTD)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€12,250</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Pending Payouts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>€3,000</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search partners by name or ID..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Partner Type</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="dollar-sign" size={16} /> Process Payouts</button>
        </div>
        <DataTable columns={columns} data={partners} />
      </div>
    </div>
  );
}
