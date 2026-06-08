"use client";
/* KompasCRM — Customer Success & Health Scores (Gainsight style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function CustomerSuccessPage() {
  const [accounts] = useState([
    { id: "ACC-01", name: "TechCorp Ltd", mrr: "€2,500", healthScore: 92, lastTouch: "Today", risk: "low", csm: "Alex Jenkins" },
    { id: "ACC-02", name: "BudMax Sp. z o.o.", mrr: "€850", healthScore: 75, lastTouch: "12 days ago", risk: "medium", csm: "Maria Garcia" },
    { id: "ACC-03", name: "Global Logistics", mrr: "€4,200", healthScore: 41, lastTouch: "21 days ago", risk: "high", csm: "Elena Rostova" },
    { id: "ACC-04", name: "EcoFoods B2B", mrr: "€1,100", healthScore: 88, lastTouch: "Yesterday", risk: "low", csm: "Alex Jenkins" }
  ]);

  const columns = [
    { header: "Account / Company", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Monthly Rev (MRR)", cell: (row) => <span style={{ fontWeight: 500 }}>{row.mrr}</span> },
    { header: "Health Score", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "var(--text-sm)",
          background: row.healthScore >= 80 ? "rgba(16, 185, 129, 0.1)" : row.healthScore >= 60 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: row.healthScore >= 80 ? "var(--color-success)" : row.healthScore >= 60 ? "var(--color-warning)" : "var(--color-danger)"
        }}>
          {row.healthScore}
        </div>
        <Icon name={row.healthScore >= 80 ? "trending-up" : "trending-down"} size={16} color={row.healthScore >= 80 ? "var(--color-success)" : "var(--color-danger)"} />
      </div>
    )},
    { header: "Churn Risk", cell: (row) => {
      let color = "success";
      if (row.risk === "medium") color = "warning";
      if (row.risk === "high") color = "danger";
      return <Badge status={color} text={row.risk.toUpperCase()} />;
    }},
    { header: "Last Touch", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.lastTouch}</span> },
    { header: "CSM (Manager)", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="user" size={14} color="var(--dim)" />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.csm}</span>
      </div>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="phone" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Customer Success & Health</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor client health scores, prevent churn, and identify upsell opportunities.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Scoring Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="book-open" size={16} /> Playbooks</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Accounts at Risk</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Average Health Score</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>74 / 100</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Net Retention Rate (NRR)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>104.2%</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search accounts by name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Health Score</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> CSM Owner</button>
        </div>
        <DataTable columns={columns} data={accounts} />
      </div>
    </div>
  );
}
