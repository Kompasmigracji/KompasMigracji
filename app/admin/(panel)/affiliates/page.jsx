"use client";
/* iPhoenixCRM — Affiliate Program & Promo Codes */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function AffiliatesPage() {
  const [affiliates] = useState([
    { id: "AFF-01", name: "LifeInPoland Blog", code: "POLAND2026", type: "Promo Code", clicks: 1250, conversions: 42, revenue: "€18,500", payout: "€1,850", status: "active" },
    { id: "AFF-02", name: "RelocateUA Telegram", code: "RELOCATE_UA", type: "Ref Link", clicks: 840, conversions: 12, revenue: "€5,400", payout: "€540", status: "active" },
    { id: "AFF-03", name: "VisaHelp YouTube", code: "VISAHELP10", type: "Promo Code", clicks: 320, conversions: 2, revenue: "€900", payout: "€90", status: "active" },
    { id: "AFF-04", name: "Sp.z.o.o Guide", code: "BIZ_SETUP", type: "Ref Link", clicks: 45, conversions: 0, revenue: "€0", payout: "€0", status: "inactive" }
  ]);

  const columns = [
    { header: "Affiliate / Influencer", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.name.substring(0,2).toUpperCase()} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Tracking Asset", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name={row.type === "Promo Code" ? "tag" : "link"} size={14} color="var(--dim)" />
        <span style={{ fontFamily: "monospace", background: "var(--panel-2)", padding: "2px 6px", borderRadius: 4, fontSize: "12px" }}>{row.code}</span>
      </div>
    )},
    { header: "Traffic", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.clicks} clicks</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)" }}>{row.conversions} sales</div>
      </div>
    )},
    { header: "Generated Revenue", cell: (row) => <span style={{ fontWeight: 600, color: "var(--fg)" }}>{row.revenue}</span> },
    { header: "Affiliate Payout (10%)", cell: (row) => (
      <span style={{ fontWeight: 700, color: row.payout !== "€0" ? "var(--color-warning)" : "var(--dim)" }}>
        {row.payout}
      </span>
    )},
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "active" ? "success" : "default"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-primary)" }}><Icon name="share-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Affiliate & Influencer Program</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Generate promo codes and track which marketing channels drive the most revenue.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="percent" size={16} /> Commission Rates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Generate Promo Code</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Affiliate Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-primary)" }}>€24,800</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>This month.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Conversion Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>2.28%</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Clicks to closed deals.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Top Affiliate</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>LifeInPoland Blog</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Drove 42 sales via code POLAND2026.</div>
        </div>
      </div>

      {/* Campaign URL Builder */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent)", border: "1px solid var(--color-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="link" size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>URL Builder (UTM Tracking)</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", fontFamily: "monospace", marginTop: 4 }}>https://kompasmigracji.pl/trc?ref=LifeInPoland&utm_source=telegram</div>
          </div>
        </div>
        <button className="kc-btn kc-btn-secondary">Copy Link</button>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by name, code, or link..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Assets</option>
            <option>Promo Codes</option>
            <option>Referral Links</option>
          </select>
        </div>
        <DataTable columns={columns} data={affiliates} />
      </div>
    </div>
  );
}
