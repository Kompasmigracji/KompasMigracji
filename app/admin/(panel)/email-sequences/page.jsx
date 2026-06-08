"use client";
/* iPhoenixCRM — Email Sequences & Drip Campaigns */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function EmailSequencesPage() {
  const [sequences] = useState([
    { id: "SEQ-01", name: "Welcome Flow - Karta Pobytu", target: "New Web Leads", activeEnrollees: 142, openRate: "68%", clickRate: "24%", status: "active" },
    { id: "SEQ-02", name: "B2B Relocation Nurture", target: "Cold B2B Contacts", activeEnrollees: 380, openRate: "42%", clickRate: "8%", status: "active" },
    { id: "SEQ-03", name: "TRC Renewal Reminder", target: "Past Clients (11mo)", activeEnrollees: 45, openRate: "85%", clickRate: "45%", status: "active" },
    { id: "SEQ-04", name: "Discount Offer (No Reply)", target: "Lost Deals", activeEnrollees: 0, openRate: "—", clickRate: "—", status: "paused" }
  ]);

  const columns = [
    { header: "Sequence Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="git-commit" size={16} color="var(--color-primary)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Target: {row.target}</div>
        </div>
      </div>
    )},
    { header: "Active Enrollees", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="users" size={14} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.activeEnrollees}</span>
      </div>
    )},
    { header: "Avg Open Rate", cell: (row) => (
      <span style={{ color: row.openRate === "—" ? "var(--dim)" : parseInt(row.openRate) > 50 ? "var(--color-success)" : "var(--color-warning)", fontWeight: 600 }}>
        {row.openRate}
      </span>
    )},
    { header: "Avg Click Rate", cell: (row) => (
      <span style={{ fontWeight: 600, color: "var(--fg)" }}>{row.clickRate}</span>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "paused") color = "warning";
      if (row.status === "archived") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-3" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="pie-chart" size={16} color="var(--dim)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Automated Email Sequences</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Build multi-step email workflows to nurture leads automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="mail" size={16} /> Templates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Sequence</button>
        </div>
      </div>

      {/* Visual Builder Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "var(--panel-2)", border: "1px dashed var(--color-primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge status="primary" text="WORKFLOW BUILDER" />
            <span style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>Welcome Flow - Karta Pobytu</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Badge status="success" text="ACTIVE" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>142 people currently in flow</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          
          {/* Trigger */}
          <div style={{ background: "var(--bg)", border: "2px solid var(--border)", borderRadius: 12, padding: "var(--space-md)", width: 400, textAlign: "center", zIndex: 2 }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}><Icon name="zap" size={12} color="#f59e0b" /> TRIGGER</div>
            <div style={{ fontWeight: 600 }}>Lead Created in CRM</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Condition: Source = 'Website Form'</div>
          </div>

          <div style={{ width: 2, height: 30, background: "var(--border)" }}></div>

          {/* Step 1 */}
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--color-success)", borderRadius: 12, padding: "var(--space-md)", width: 400, display: "flex", alignItems: "center", gap: "var(--space-md)", zIndex: 2 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="mail" size={16} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", fontWeight: 700, textTransform: "uppercase" }}>STEP 1: EMAIL (Immediate)</div>
              <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>"Welcome to Kompas! 🇵🇱"</div>
            </div>
            <div style={{ textAlign: "right", fontSize: "10px", color: "var(--dim)" }}>
              Open: 72%<br/>Click: 14%
            </div>
          </div>

          <div style={{ width: 2, height: 30, background: "var(--border)" }}></div>

          {/* Delay */}
          <div style={{ background: "var(--bg)", border: "1px dashed var(--dim)", borderRadius: 20, padding: "4px 16px", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--dim)", zIndex: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={12} /> Wait 2 days
          </div>

          <div style={{ width: 2, height: 30, background: "var(--border)" }}></div>

          {/* Condition Branch */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative", width: 600 }}>
            {/* Horizontal Line connecting branches */}
            <div style={{ position: "absolute", top: 15, width: 450, height: 2, background: "var(--border)", zIndex: 1 }}></div>

            <div style={{ display: "flex", gap: "100px", zIndex: 2 }}>
              {/* Branch A */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: "var(--space-sm)", marginBottom: 20, fontSize: "var(--text-xs)", fontWeight: 600, width: 150, textAlign: "center" }}>
                  <span style={{ color: "var(--color-success)" }}>IF REPLIED:</span><br/>Assign to Sales Rep
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--panel)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="user-check" size={16} color="var(--color-success)" />
                </div>
              </div>

              {/* Branch B */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: "var(--space-sm)", marginBottom: 20, fontSize: "var(--text-xs)", fontWeight: 600, width: 150, textAlign: "center" }}>
                  <span style={{ color: "var(--color-warning)" }}>IF NO REPLY:</span><br/>Send Email 2
                </div>
                <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--color-success)", borderRadius: 12, padding: "var(--space-md)", width: 250, display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="mail" size={12} color="white" /></div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--color-success)", fontWeight: 700 }}>STEP 2: EMAIL</div>
                    <div style={{ fontWeight: 600, fontSize: "12px" }}>"Free Consultation Offer"</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search sequences..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
        </div>
        <DataTable columns={columns} data={sequences} />
      </div>
    </div>
  );
}
