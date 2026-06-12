"use client";
/* KompasCRM — Client Feedback & NPS */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function FeedbackPage() {
  const [reviews] = useState([]);

  const columns = [
    { header: "Client", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.client.substring(0,2).toUpperCase()} size={36} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.client}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.date}</div>
        </div>
      </div>
    )},
    { header: "NPS Score", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ 
          width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
          background: row.score >= 9 ? "rgba(16, 185, 129, 0.1)" : row.score >= 7 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: row.score >= 9 ? "var(--color-success)" : row.score >= 7 ? "var(--color-warning)" : "var(--color-danger)"
        }}>
          {row.score}
        </div>
      </div>
    )},
    { header: "Type", cell: (row) => {
      let color = "warning";
      if (row.type === "Promoter") color = "success";
      if (row.type === "Detractor") color = "danger";
      return <Badge status={color} text={row.type} />;
    }},
    { header: "Client Comment", cell: (row) => (
      <div style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "13px" }}>
        "{row.comment}"
      </div>
    )},
    { header: "Automated Action", cell: (row) => <span style={{ fontSize: "12px", color: "var(--dim)" }}>{row.action}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.type === "Detractor" && (
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px", background: "var(--color-danger)", border: "none" }}>Resolve Issue</button>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="message-square" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Client Feedback & NPS</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Measure customer satisfaction and automatically collect Google Reviews.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Automation Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="send" size={16} /> Send Survey Manually</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* NPS Score Card */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-lg)", background: "linear-gradient(135deg, var(--panel) 0%, rgba(16, 185, 129, 0.05) 100%)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, border: "6px solid var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--color-success)" }}>78</span>
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Current NPS Score</div>
            <div style={{ fontSize: "16px", fontWeight: 600, marginTop: 4 }}>Excellent (Top 10% of Agencies)</div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: 4 }}>Based on 450 reviews this year.</div>
          </div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Promoters (Score 9-10)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>82%</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Loyal clients who recommend you.</div>
        </div>
        
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Detractors (Score 0-6)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>4%</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Unhappy clients. Require immediate action!</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by client name or feedback content..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Feedback</option>
            <option>Promoters (9-10)</option>
            <option>Passives (7-8)</option>
            <option>Detractors (0-6)</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={reviews} />
        </div>
      </div>
    </div>
  );
}
