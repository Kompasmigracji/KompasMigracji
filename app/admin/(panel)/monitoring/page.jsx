"use client";
/* KompasCRM — System Monitoring & Alerts (Cabot / Datadog style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function MonitoringPage() {
  const [services] = useState([
    { id: "SRV-01", name: "Main API (Vercel)", uptime: "99.99%", latency: "42ms", status: "operational", lastChecked: "Just now" },
    { id: "SRV-02", name: "Database (PostgreSQL)", uptime: "100%", latency: "12ms", status: "operational", lastChecked: "Just now" },
    { id: "SRV-03", name: "Background Workers", uptime: "98.5%", latency: "N/A", status: "degraded", lastChecked: "2 mins ago" },
    { id: "SRV-04", name: "Payment Webhooks (Stripe)", uptime: "100%", latency: "145ms", status: "operational", lastChecked: "5 mins ago" }
  ]);

  const columns = [
    { header: "Service", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name={row.status === "operational" ? "check-circle" : "alert-circle"} size={16} color={row.status === "operational" ? "var(--color-success)" : "var(--color-warning)"} />
        <span style={{ fontWeight: 600 }}>{row.name}</span>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "degraded") color = "warning";
      if (row.status === "down") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Uptime (30d)", cell: (row) => <span style={{ fontWeight: 600 }}>{row.uptime}</span> },
    { header: "Avg Latency", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.latency}</span> },
    { header: "Last Checked", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.lastChecked}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="activity" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>System Health</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor infrastructure uptime, database performance, and configure alerts.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="bell" size={16} /> Alert Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="refresh-cw" size={16} /> Run Diagnostics</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>System Status</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>All Systems Normal</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Database Load</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Alerts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>1</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1 }}>
        {/* Left: Services Table */}
        <div className="kc-card" style={{ flex: 2, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", margin: 0 }}>Monitored Services</h3>
          </div>
          <DataTable columns={columns} data={services} />
        </div>

        {/* Right: API Traffic Chart */}
        <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>API Requests (Last 60m)</h3>
          
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4, paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--border)" }}>
            {/* Fake Activity Graph */}
            {[10, 20, 15, 30, 45, 25, 10, 5, 8, 12, 50, 80, 40, 20, 15, 10, 5, 15, 25, 30].map((val, i) => (
              <div key={i} style={{ flex: 1, background: val > 60 ? "var(--color-warning)" : "var(--color-primary)", height: `${val}%`, borderRadius: "2px 2px 0 0", opacity: 0.8 }}></div>
            ))}
          </div>

          <div style={{ marginTop: "var(--space-md)" }}>
             <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)" }}>Recent Logs</h3>
             <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "var(--text-xs)", fontFamily: "monospace" }}>
                <div style={{ color: "var(--color-success)" }}>[INFO] Worker process initialized successfully.</div>
                <div style={{ color: "var(--dim)" }}>[INFO] Processed 42 webhooks in 2.1s.</div>
                <div style={{ color: "var(--color-warning)" }}>[WARN] Database query took &gt; 500ms.</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
