"use client";
/* iPhoenixCRM — Relationships & Connections (Knowledge Graph) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function RelationshipsPage() {
  const [connections] = useState([
    { id: "REL-1", source: "Ivan Petrov", target: "Maria Petrova", type: "Spouse", direction: "Mutual", context: "Family TRC Application" },
    { id: "REL-2", source: "TechCorp Sp. z.o.o.", target: "Alex Jenkins", type: "Account Manager", direction: "One-Way", context: "B2B Sales" },
    { id: "REL-3", source: "Oleg Volkov", target: "Ivan Petrov", type: "Referred By", direction: "Target to Source", context: "Loyalty Program" },
    { id: "REL-4", source: "Global IT Group", target: "DevStudio LLC", type: "Parent Company", direction: "Source to Target", context: "Corporate Structure" }
  ]);

  const columns = [
    { header: "Entity A", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.source.substring(0,2).toUpperCase()} size={28} />
        <span style={{ fontWeight: 600 }}>{row.source}</span>
      </div>
    )},
    { header: "Connection Type", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--panel-2)", padding: "4px 12px", borderRadius: 16 }}>
        {row.direction.includes("Target to Source") ? <Icon name="arrow-left" size={14} color="var(--color-primary)" /> : <Icon name="minus" size={14} color="var(--dim)" />}
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase" }}>{row.type}</span>
        {row.direction.includes("Source to Target") || row.direction === "One-Way" ? <Icon name="arrow-right" size={14} color="var(--color-primary)" /> : <Icon name="minus" size={14} color="var(--dim)" />}
      </div>
    )},
    { header: "Entity B", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.target.substring(0,2).toUpperCase()} size={28} />
        <span style={{ fontWeight: 600 }}>{row.target}</span>
      </div>
    )},
    { header: "Context / Tag", cell: (row) => <Badge status="default" text={row.context} /> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-danger)" }}><Icon name="trash" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Relationships & Connections</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track families, corporate structures, and referrals. Who knows whom?
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="git-merge" size={16} /> Manage Types</button>
          <button className="kc-btn kc-btn-primary"><Icon name="link" size={16} /> Add Connection</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Family Links (B2C)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Corporate Links (B2B)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>38</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Referral Network</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>56</div>
        </div>
      </div>

      {/* Network Visualization Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "linear-gradient(to right, var(--panel), var(--bg))", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="share-2" size={16} color="var(--color-primary)" />
          Visual Graph Preview: "Petrov Family"
        </div>
        <div style={{ height: 120, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          <div style={{ position: "absolute", width: "100%", height: 2, background: "var(--border)", zIndex: 0 }}></div>
          
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "var(--space-xl)", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ border: "3px solid var(--color-success)", borderRadius: "50%", padding: 2, background: "var(--bg)" }}><Avatar name="OV" size={48} /></div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Oleg V.</div>
              <Badge status="default" text="Recommender" />
            </div>
            
            <div style={{ background: "var(--bg)", padding: "4px 8px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "10px", fontWeight: 700, color: "var(--dim)" }}>REFERRED</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ border: "3px solid var(--color-primary)", borderRadius: "50%", padding: 2, background: "var(--bg)" }}><Avatar name="IP" size={64} /></div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Ivan Petrov</div>
              <Badge status="primary" text="Primary Client" />
            </div>

            <div style={{ background: "var(--bg)", padding: "4px 8px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "10px", fontWeight: 700, color: "var(--dim)" }}>SPOUSE</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ border: "3px solid var(--dim)", borderRadius: "50%", padding: 2, background: "var(--bg)" }}><Avatar name="MP" size={48} /></div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Maria Petrova</div>
              <Badge status="default" text="Dependent" />
            </div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search connections..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Types</option>
            <option>Spouse</option>
            <option>Parent Company</option>
            <option>Referred By</option>
          </select>
        </div>
        <DataTable columns={columns} data={connections} />
      </div>
    </div>
  );
}
