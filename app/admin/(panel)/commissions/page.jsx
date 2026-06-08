"use client";
/* KompasCRM — Commissions & Payouts (Spiff / CaptivateIQ style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function CommissionsPage() {
  const [commissions] = useState([
    { id: "COM-05-26", rep: "Alex Jenkins", dealsClosed: 14, revenue: "€14,500", commissionRate: "10%", payout: "€1,450", status: "pending" },
    { id: "COM-05-26", rep: "Maria Garcia", dealsClosed: 22, revenue: "€28,000", commissionRate: "12% (Tier 2)", payout: "€3,360", status: "approved" },
    { id: "COM-05-26", rep: "David O.", dealsClosed: 8, revenue: "€6,200", commissionRate: "8%", payout: "€496", status: "paid" },
    { id: "COM-05-26", rep: "Elena Rostova", dealsClosed: 35, revenue: "€42,000", commissionRate: "15% (Tier 3)", payout: "€6,300", status: "approved" }
  ]);

  const columns = [
    { header: "Sales Representative", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.rep} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.rep}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Period: May 2026</div>
        </div>
      </div>
    )},
    { header: "Deals Closed", cell: (row) => <span style={{ fontWeight: 500 }}>{row.dealsClosed} deals</span> },
    { header: "Revenue Generated", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.revenue}</span> },
    { header: "Commission Rate", cell: (row) => <Badge status="info" text={row.commissionRate} /> },
    { header: "Total Payout", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-success)", fontSize: "var(--text-md)" }}>{row.payout}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending") color = "warning";
      if (row.status === "approved") color = "primary";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="dollar-sign" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="file-text" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Commissions & Payouts</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Automatically calculate sales commissions, bonuses, and generate payout reports.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Commission Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="check-circle" size={16} /> Approve All</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Payouts (This Month)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€11,606</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Top Earner</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>Elena Rostova</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Pending Approvals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>1</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by sales rep name or ID..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> May 2026</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export Payroll</button>
        </div>
        <DataTable columns={columns} data={commissions} />
      </div>
    </div>
  );
}
