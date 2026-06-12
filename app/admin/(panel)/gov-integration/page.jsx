"use client";
/* KompasCRM — Gov Portals Integration (RPA Bots) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function GovIntegrationPage() {
  const [portals] = useState([]);

  const [logs] = useState([]);

  const columns = [
    { header: "Portal Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.name.includes("ZUS") ? "shield" : row.name.includes("Praca") ? "briefcase" : "home"} size={20} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type}</div>
        </div>
      </div>
    )},
    { header: "Connection Status", cell: (row) => {
      let color = "success";
      if (row.status === "error") color = "danger";
      if (row.status === "disconnected") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Last RPA Sync", cell: (row) => (
      <span style={{ fontSize: "var(--text-sm)", color: row.status === "error" ? "var(--color-danger)" : "var(--fg)" }}>{row.lastSync}</span>
    )},
    { header: "Docs Fetched", cell: (row) => (
      row.newDocs > 0 ? (
        <Badge status="primary" text={`+${row.newDocs} Today`} />
      ) : (
        <span style={{ color: "var(--dim)" }}>0</span>
      )
    )},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>
          <Icon name="refresh-cw" size={14} /> Sync Now
        </button>
        <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Gov Portals Integration</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            RPA Bots automatically fetch documents and statuses from Polish government sites.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="shield" size={16} /> ePUAP Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Portal</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Left: Portals List */}
        <div className="kc-card" style={{ flex: 3, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "14px" }}>Connected Government Portals</h3>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <DataTable columns={columns} data={portals} />
          </div>
        </div>

        {/* Right: RPA Logs */}
        <div className="kc-card" style={{ flex: 2, padding: 0, display: "flex", flexDirection: "column", borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)" }}>
            <Icon name="cpu" size={16} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: "13px" }}>RPA Bot Activity Stream</h3>
          </div>
          <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: log.status === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={log.status === "success" ? "check" : "alert-triangle"} size={16} color={log.status === "success" ? "var(--color-success)" : "var(--color-danger)"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ color: log.status === "failed" ? "var(--color-danger)" : "var(--fg)" }}>{log.action}</strong>
                    <span style={{ fontSize: "11px", color: "var(--dim)" }}>{log.time}</span>
                  </div>
                  <div style={{ fontSize: "12px", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="user" size={12} color="var(--dim)" /> {log.client}
                    <span style={{ color: "var(--dim)", margin: "0 4px" }}>|</span>
                    <Badge status="default" text={log.portal} />
                  </div>
                  {log.file && (
                    <div style={{ marginTop: 8, padding: "6px 10px", background: "var(--panel-2)", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12px", border: "1px solid var(--border)", cursor: "pointer" }}>
                      <Icon name="file-text" size={14} color="var(--color-primary)" />
                      {log.file}
                    </div>
                  )}
                  {log.error && (
                    <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(239, 68, 68, 0.05)", borderRadius: 6, display: "inline-block", fontSize: "12px", color: "var(--color-danger)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      {log.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
