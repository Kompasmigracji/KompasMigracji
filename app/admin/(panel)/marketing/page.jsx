"use client";
/* iPhoenixCRM — Marketing Automation (HubSpot / ActiveCampaign style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function MarketingPage() {
  const [campaigns] = useState([
    { id: "CMP-001", name: "Black Friday Visa Discount", type: "Email", status: "active", sent: 4500, opens: "42%", clicks: "12%", conversions: "2.4%" },
    { id: "CMP-002", name: "Webinar Registration Reminder", type: "SMS", status: "completed", sent: 1200, opens: "98%", clicks: "34%", conversions: "18.1%" },
    { id: "CMP-003", name: "New Client Welcome Series", type: "Automation", status: "active", sent: 840, opens: "65%", clicks: "22%", conversions: "N/A" },
    { id: "CMP-004", name: "Q3 Newsletter", type: "Email", status: "draft", sent: 0, opens: "0%", clicks: "0%", conversions: "0%" }
  ]);

  const columns = [
    { header: "Campaign Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name={row.type === "Email" ? "mail" : row.type === "SMS" ? "message-square" : "git-merge"} size={16} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.name}</span>
      </div>
    )},
    { header: "Type", cell: (row) => <Badge status="info" text={row.type} /> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "completed") color = "default";
      if (row.status === "draft") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Sent", cell: (row) => <span style={{ fontWeight: 600 }}>{row.sent.toLocaleString()}</span> },
    { header: "Open Rate", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.opens}</span> },
    { header: "Click Rate", cell: (row) => <span style={{ color: "var(--color-primary)" }}>{row.clicks}</span> },
    { header: "Conversions", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{row.conversions}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="bar-chart-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Marketing Automation</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Build email sequences, send SMS blasts, and automate your lead nurturing.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="git-merge" size={16} /> New Automation</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Campaign</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Audience</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>12,450</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg. Email Open Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>38.2%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Conversions (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€14,200</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search campaigns, workflows, sequences..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="mail" size={16} /> Emails</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="message-square" size={16} /> SMS</button>
        </div>
        <DataTable columns={columns} data={campaigns} />
      </div>
    </div>
  );
}
