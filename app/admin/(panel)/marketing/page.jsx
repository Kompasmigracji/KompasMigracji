"use client";
/* KompasCRM — Email Marketing & Campaigns */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function MarketingPage() {
  const [campaigns] = useState([
    { id: "CMP-901", name: "July Law Changes Update", audience: "All Active Clients (4,210)", status: "sent", date: "June 01, 2026", openRate: "68%", clickRate: "12%" },
    { id: "CMP-902", name: "Mortgage for Foreigners Promo", audience: "Clients with TRC > 1 year (850)", status: "sending", date: "Today", openRate: "—", clickRate: "—" },
    { id: "CMP-903", name: "Referral Program Announcement", audience: "B2B Partners (120)", status: "draft", date: "—", openRate: "—", clickRate: "—" },
    { id: "CMP-904", name: "Happy New Year 2026", audience: "All Database (12,000)", status: "sent", date: "Dec 25, 2025", openRate: "45%", clickRate: "5%" }
  ]);

  const columns = [
    { header: "Campaign Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.status === "sent" ? "mail" : row.status === "sending" ? "send" : "edit"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Target Audience", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.audience}</span> },
    { header: "Date", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.date}</span> },
    { header: "Status", cell: (row) => {
      let color = "primary";
      if (row.status === "sent") color = "success";
      if (row.status === "draft") color = "default";
      if (row.status === "sending") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Open Rate", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.openRate !== "—" ? "var(--color-success)" : "var(--dim)" }}>
        {row.openRate}
      </span>
    )},
    { header: "Click Rate", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.clickRate !== "—" ? "var(--color-primary)" : "var(--dim)" }}>
        {row.clickRate}
      </span>
    )},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="bar-chart-2" size={16} /></button>
        {row.status === "draft" && (
          <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        )}
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Email Marketing & Campaigns</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Send newsletters, legal updates, and promotional emails to client segments.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Segments</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Campaign</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Campaign Stats */}
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Emails Sent (This Month)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14,520</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Out of 50,000 monthly limit.</div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg. Open Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>56.4%</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Industry average is 21%. You are doing great!</div>
        </div>

        {/* Live Sending Tracker */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="send" size={24} color="var(--color-warning)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-warning)" }}>Sending in Progress...</div>
            <div style={{ fontSize: "12px", color: "var(--fg)", marginTop: 4 }}>"Mortgage Promo" is currently sending.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <div style={{ height: 4, flex: 1, background: "var(--panel-2)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "45%", background: "var(--color-warning)" }}></div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700 }}>45%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search campaigns..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Statuses</option>
            <option>Sent</option>
            <option>Draft</option>
            <option>Sending</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={campaigns} />
        </div>
      </div>
    </div>
  );
}
