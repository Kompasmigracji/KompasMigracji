"use client";
/* iPhoenixCRM — Partner Portal & B2B Resellers */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function PartnerPortalPage() {
  const [partners] = useState([
    { id: "PRT-01", name: "Global HR Solutions", type: "Recruiting Agency", leads: 42, won: 18, commission: "€3,600", status: "active", tier: "Gold" },
    { id: "PRT-02", name: "Warsaw IT Academy", type: "University", leads: 15, won: 4, commission: "€400", status: "active", tier: "Silver" },
    { id: "PRT-03", name: "ReloTech Partners", type: "B2B Consultants", leads: 8, won: 6, commission: "€1,200", status: "active", tier: "Gold" },
    { id: "PRT-04", name: "Freelance Agent (Oleg)", type: "Independent", leads: 3, won: 0, commission: "€0", status: "pending", tier: "Bronze" }
  ]);

  const columns = [
    { header: "Partner Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.type === "Independent" ? "user" : "briefcase"} size={20} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {row.name}
            {row.tier === "Gold" && <Icon name="star" size={14} color="#eab308" fill="#eab308" />}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type}</div>
        </div>
      </div>
    )},
    { header: "Leads Submitted", cell: (row) => <span style={{ fontWeight: 600 }}>{row.leads}</span> },
    { header: "Conversion (WON)", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{row.won}</span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>({row.leads > 0 ? Math.round((row.won/row.leads)*100) : 0}%)</span>
      </div>
    )},
    { header: "Unpaid Commission", cell: (row) => (
      <span style={{ fontWeight: 700, color: row.commission !== "€0" ? "var(--color-warning)" : "var(--dim)" }}>
        {row.commission}
      </span>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending") color = "warning";
      if (row.status === "suspended") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="dollar-sign" size={16} color="var(--color-success)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Partner & Reseller Portal</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage agencies and affiliates who send you clients. Track their leads and commissions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="link" size={16} /> Affiliate Links</button>
          <button className="kc-btn kc-btn-primary"><Icon name="user-plus" size={16} /> Invite Partner</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Partners</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Partner-Generated Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>€42,500</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>This month.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Pending Payouts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>€5,200</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Commissions ready for withdrawal.</div>
        </div>
      </div>

      {/* Partner View Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", background: "rgba(16, 185, 129, 0.05)", border: "1px dashed var(--color-success)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="eye" size={20} color="var(--color-success)" />
            <span style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>What Partners See (White-Label Portal)</span>
          </div>
          <button className="kc-btn kc-btn-secondary" style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}>Customize Portal</button>
        </div>

        <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: "var(--space-lg)", display: "flex", gap: "var(--space-xl)" }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 16px 0", color: "var(--dim)" }}>Submit New Lead</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <input type="text" className="kc-input" placeholder="Client Name" disabled />
              <input type="text" className="kc-input" placeholder="Service Required (e.g. TRC)" disabled />
              <button className="kc-btn kc-btn-primary" disabled>Send to KompasMigracji</button>
            </div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }}></div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 16px 0", color: "var(--dim)" }}>My Submitted Leads (Status)</h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "var(--text-sm)" }}>John Doe - Business Harbor</span>
              <Badge status="success" text="WON (Paid)" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: "var(--text-sm)" }}>Alice Smith - Karta Pobytu</span>
              <Badge status="warning" text="IN PROGRESS" />
            </div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search partners..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Tiers</option>
            <option>Gold (20% Comm.)</option>
            <option>Silver (10% Comm.)</option>
          </select>
        </div>
        <DataTable columns={columns} data={partners} />
      </div>
    </div>
  );
}
