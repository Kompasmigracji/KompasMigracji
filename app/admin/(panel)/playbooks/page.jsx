"use client";
/* iPhoenixCRM — Sales Playbooks & Call Scripts (Salesloft style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function PlaybooksPage() {
  const [playbooks] = useState([
    { id: "PB-01", name: "Inbound B2B Lead (First Call)", target: "New B2B Deals", usage: 145, successRate: "42%", lastUpdated: "Yesterday" },
    { id: "PB-02", name: "Objection Handling: 'Too Expensive'", target: "All Deals", usage: 380, successRate: "68%", lastUpdated: "Last week" },
    { id: "PB-03", name: "TRC Renewal Upsell", target: "Existing Clients", usage: 92, successRate: "85%", lastUpdated: "May 10, 2026" },
    { id: "PB-04", name: "Cold Calling: IT Companies", target: "Cold Leads", usage: 45, successRate: "12%", lastUpdated: "2 weeks ago" }
  ]);

  const columns = [
    { header: "Playbook Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="book-open" size={16} color="var(--color-primary)" />
        <span style={{ fontWeight: 600 }}>{row.name}</span>
      </div>
    )},
    { header: "Target Audience", cell: (row) => <Badge status="default" text={row.target} /> },
    { header: "Usage Count", cell: (row) => <span style={{ fontWeight: 500 }}>{row.usage} calls</span> },
    { header: "Win Rate (Success)", cell: (row) => (
      <span style={{ 
        color: parseInt(row.successRate) >= 50 ? "var(--color-success)" : parseInt(row.successRate) > 20 ? "var(--color-warning)" : "var(--color-danger)",
        fontWeight: 600
      }}>
        {row.successRate}
      </span>
    )},
    { header: "Last Updated", cell: (row) => <span style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>{row.lastUpdated}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-3" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="play" size={16} color="var(--color-success)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Sales Playbooks & Scripts</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Give your sales team interactive scripts to handle objections and close more deals.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="cpu" size={16} /> AI Script Generator</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Playbook</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden", paddingBottom: "var(--space-lg)" }}>
        
        {/* Playbooks List */}
        <div className="kc-card" style={{ flex: 1, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
              <Icon name="search" size={16} color="var(--dim)" />
              <input type="text" placeholder="Search playbooks..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
            </div>
            <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Category</button>
          </div>
          <DataTable columns={columns} data={playbooks} />
        </div>

        {/* Live Script Preview (Simulation) */}
        <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column", border: "2px solid var(--color-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Badge status="primary" text="LIVE PREVIEW" />
              <span style={{ fontWeight: 600 }}>Inbound B2B Lead</span>
            </div>
            <div style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>00:04:12</div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            
            {/* Step 1 */}
            <div style={{ opacity: 0.5 }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}><Icon name="check-circle" size={12} /> Step 1: Introduction</div>
              <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: 8, fontSize: "var(--text-md)", fontStyle: "italic" }}>
                "Hi, this is [Your Name] from iPhoenix. I saw you requested a consultation about B2B relocation to Poland. Do you have 5 minutes to chat?"
              </div>
            </div>

            {/* Step 2 (Active) */}
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Step 2: Qualification (Current Step)</div>
              <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: 8, fontSize: "var(--text-md)", fontStyle: "italic", borderLeft: "4px solid var(--color-primary)" }}>
                "Great! To make sure we give you the right advice, how many employees are you planning to relocate in the next 6 months?"
              </div>
              
              <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Client's Response:</div>
                <button className="kc-btn kc-btn-secondary" style={{ justifyContent: "flex-start", padding: "12px" }}>1-5 employees (Small Team)</button>
                <button className="kc-btn kc-btn-primary" style={{ justifyContent: "flex-start", padding: "12px", background: "rgba(139, 92, 246, 0.1)", color: "var(--color-primary)", border: "1px solid var(--color-primary)" }}>
                  <Icon name="check" size={16} /> 6-20 employees (Mid-Size)
                </button>
                <button className="kc-btn kc-btn-secondary" style={{ justifyContent: "flex-start", padding: "12px" }}>20+ employees (Enterprise)</button>
              </div>
            </div>

            {/* Step 3 (Next) */}
            <div style={{ opacity: 0.3 }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Step 3: Solution Pitch</div>
              <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: 8, fontSize: "var(--text-md)", fontStyle: "italic" }}>
                "For a team of that size, our 'Business Harbour' package is perfect. It includes visa support, company registration, and..."
              </div>
            </div>

          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)", marginTop: "var(--space-md)", display: "flex", justifyContent: "space-between" }}>
            <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-danger)" }}><Icon name="phone-off" size={16} /> Call Failed</button>
            <button className="kc-btn kc-btn-primary" style={{ background: "var(--color-success)" }}><Icon name="flag" size={16} /> Mark as Qualified Lead</button>
          </div>
        </div>

      </div>
    </div>
  );
}
