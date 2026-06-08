"use client";
/* iPhoenixCRM — Loyalty & Rewards Program (Smile.io style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function LoyaltyPage() {
  const [members] = useState([
    { id: "LOY-881", customer: "Elena Rostova", points: 1250, tier: "Gold", referrals: 4, recentActivity: "Referred: Ivan Ivanov", status: "active" },
    { id: "LOY-882", customer: "Andriy Boyko", points: 450, tier: "Silver", referrals: 1, recentActivity: "Purchased: Karta Pobytu", status: "active" },
    { id: "LOY-883", customer: "Maria Garcia", points: 3000, tier: "Platinum", referrals: 12, recentActivity: "Redeemed: 15% Discount", status: "active" },
    { id: "LOY-884", customer: "Dmytro Tkachenko", points: 0, tier: "Bronze", referrals: 0, recentActivity: "Joined Program", status: "inactive" }
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
    { header: "Tier", cell: (row) => {
      let color = "default";
      if (row.tier === "Gold") color = "warning";
      if (row.tier === "Platinum") color = "primary";
      if (row.tier === "Silver") color = "info";
      return <Badge status={color} text={row.tier.toUpperCase()} />;
    }},
    { header: "Points Balance", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.points > 1000 ? "var(--color-success)" : "var(--fg)" }}>
        <Icon name="award" size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
        {row.points.toLocaleString()} pts
      </span>
    )},
    { header: "Referrals", cell: (row) => <span style={{ fontWeight: 500 }}>{row.referrals} friends</span> },
    { header: "Recent Activity", cell: (row) => <span style={{ color: "var(--dim)", fontSize: "var(--text-sm)" }}>{row.recentActivity}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "inactive") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="gift" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Loyalty & Rewards</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Turn customers into brand ambassadors with points and referral bonuses.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Reward Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="star" size={16} /> Award Points</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Points Issued</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>245,500</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Successful Referrals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>842</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Revenue from Referrals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€45,200</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search members by name or email..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Tier</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export</button>
        </div>
        <DataTable columns={columns} data={members} />
      </div>
    </div>
  );
}
