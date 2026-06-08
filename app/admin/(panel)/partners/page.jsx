"use client";
/* iPhoenixCRM — Affiliates & Partnerships (PartnerStack style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function PartnersPage() {
  const [partners] = useState([
    { id: "PRT-101", name: "Global Recruits Agency", type: "B2B Partner", links: 3, clicks: 1450, leads: 82, revenue: "€24,500", commission: "€2,450", status: "active" },
    { id: "PRT-102", name: "VisaBloggers (YouTube)", type: "Affiliate", links: 1, clicks: 3200, leads: 15, revenue: "€1,500", commission: "€150", status: "active" },
    { id: "PRT-103", name: "TechUniversities Europe", type: "Institution", links: 2, clicks: 840, leads: 40, revenue: "€12,000", commission: "€1,200", status: "pending" }
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
    { header: "Type", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.type}</span> },
    { header: "Status", cell: (row) => <Badge status={row.status === "active" ? "success" : "warning"} text={row.status.toUpperCase()} /> },
    { header: "Link Clicks", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.clicks.toLocaleString()}</span> },
    { header: "Leads Gen", cell: (row) => <span style={{ fontWeight: 600 }}>{row.leads}</span> },
    { header: "Revenue Driven", cell: (row) => <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{row.revenue}</span> },
    { header: "Pending Commission", cell: (row) => <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>{row.commission}</span> },
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
            Manage referral programs, track partner performance, and pay commissions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="dollar-sign" size={16} /> Pay Payouts</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Invite Partner</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Partners</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Partner Revenue (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€38,000</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Pending Payouts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€3,800</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search partners, agencies, or referral codes..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="link" size={16} /> Generate Link</button>
        </div>
        <DataTable columns={columns} data={partners} />
      </div>
    </div>
  );
}
