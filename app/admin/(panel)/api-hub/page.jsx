"use client";
/* KompasCRM — API Hub & Webhooks (Developer Portal) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function ApiHubPage() {
  const [keys] = useState([
    { id: "key_prod_9x8...2v1", name: "Zapier Integration (Leads)", environment: "Production", created: "Jan 10, 2026", lastUsed: "2 mins ago", status: "active" },
    { id: "key_prod_4m5...7b8", name: "Main Website Landing Page", environment: "Production", created: "Mar 15, 2026", lastUsed: "1 hour ago", status: "active" },
    { id: "key_test_1a2...3c4", name: "Make.com Testing", environment: "Sandbox", created: "Yesterday", lastUsed: "Never", status: "active" },
    { id: "key_prod_old...9z0", name: "Old Facebook Ads Script", environment: "Production", created: "Nov 20, 2025", lastUsed: "May 01, 2026", status: "revoked" }
  ]);

  const [logs] = useState([
    { id: 1, method: "POST", endpoint: "/v1/leads", status: 201, time: "10:15:32 AM", source: "Website Landing", latency: "124ms" },
    { id: 2, method: "GET", endpoint: "/v1/clients/search?q=Ivan", status: 200, time: "10:12:05 AM", source: "Zapier Integration", latency: "85ms" },
    { id: 3, method: "POST", endpoint: "/v1/documents/upload", status: 401, time: "09:45:11 AM", source: "Make.com Testing", latency: "12ms", error: "Invalid API Key" },
    { id: 4, method: "GET", endpoint: "/v1/cases/status", status: 200, time: "Yesterday", source: "Zapier Integration", latency: "110ms" }
  ]);

  const columns = [
    { header: "API Key Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.environment === "Sandbox" ? "box" : "key"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Environment", cell: (row) => (
      <Badge status={row.environment === "Production" ? "primary" : "warning"} text={row.environment} />
    )},
    { header: "Created", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.created}</span> },
    { header: "Last Used", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.lastUsed}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "active" ? "success" : "danger"} text={row.status.toUpperCase()} />
    )},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "active" && (
          <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px", color: "var(--color-danger)", borderColor: "var(--color-danger)" }}>Revoke</button>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="copy" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>API Hub & Webhooks</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage API keys, configure webhooks, and monitor API traffic.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="book" size={16} /> API Docs</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Generate Key</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Left: Keys & Webhooks */}
        <div className="kc-card" style={{ flex: 3, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "14px" }}>API Keys</h3>
            <button className="kc-btn kc-btn-ghost" style={{ fontSize: "12px", padding: "4px 8px" }}>Manage Webhooks &rarr;</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <DataTable columns={columns} data={keys} />
          </div>
        </div>

        {/* Right: API Traffic Logs */}
        <div className="kc-card" style={{ flex: 2, padding: 0, display: "flex", flexDirection: "column", borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="activity" size={16} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: "13px" }}>Live Traffic Logs</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "var(--dim)" }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(--color-success)", animation: "pulse 2s infinite" }}></div>
              Listening...
            </div>
          </div>
          <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", background: "#0f172a", color: "#e2e8f0" }}>
            {logs.map(log => (
              <div key={log.id} style={{ fontSize: "12px", fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 4, padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: 6, borderLeft: `3px solid ${log.status === 200 || log.status === 201 ? "#10b981" : "#ef4444"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: log.method === "GET" ? "#60a5fa" : "#f472b6", fontWeight: 700 }}>{log.method}</span>
                    <span style={{ marginLeft: 8 }}>{log.endpoint}</span>
                  </div>
                  <span style={{ color: "#94a3b8" }}>{log.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Source: {log.source}</span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span>{log.latency}</span>
                    <span style={{ color: log.status === 200 || log.status === 201 ? "#10b981" : "#ef4444", fontWeight: 700 }}>{log.status}</span>
                  </div>
                </div>
                {log.error && (
                  <div style={{ color: "#f87171", marginTop: 4 }}>Error: {log.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
