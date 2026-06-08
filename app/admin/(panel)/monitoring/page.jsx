"use client";
/* iPhoenixCRM — System Monitoring (Cabot style) */
import React, { useState, useEffect } from "react";
import { Icon, Badge, StatCard } from "@/components/admin/ui";

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    ram: 68,
    disk: 32,
    latency: 124
  });

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() * 10 - 5))),
        ram: Math.max(20, Math.min(100, prev.ram + (Math.random() * 4 - 2))),
        disk: prev.disk,
        latency: Math.max(50, Math.min(300, prev.latency + (Math.random() * 20 - 10)))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const alerts = [
    { id: 1, title: "High CPU Usage", status: "resolved", time: "2 hours ago", desc: "CPU usage exceeded 90% for 5 minutes." },
    { id: 2, title: "Database Backup Failed", status: "critical", time: "1 day ago", desc: "S3 upload timeout. Retrying..." }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>System Monitoring</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Real-time infrastructure health and alerting.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <Badge status="success" text="All Systems Operational" />
        </div>
      </div>

      <div className="kc-grid kc-grid-4">
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600, marginBottom: "var(--space-sm)" }}>CPU Load</div>
          <div style={{ fontSize: "3rem", fontWeight: 700, color: metrics.cpu > 80 ? "var(--color-danger)" : "var(--color-primary)" }}>
            {Math.round(metrics.cpu)}%
          </div>
        </div>
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600, marginBottom: "var(--space-sm)" }}>Memory Usage</div>
          <div style={{ fontSize: "3rem", fontWeight: 700, color: metrics.ram > 85 ? "var(--color-danger)" : "var(--color-info)" }}>
            {Math.round(metrics.ram)}%
          </div>
        </div>
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600, marginBottom: "var(--space-sm)" }}>Disk Space</div>
          <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--text)" }}>
            {metrics.disk}%
          </div>
        </div>
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600, marginBottom: "var(--space-sm)" }}>API Latency</div>
          <div style={{ fontSize: "3rem", fontWeight: 700, color: metrics.latency > 250 ? "var(--color-warning)" : "var(--color-success)" }}>
            {Math.round(metrics.latency)}<span style={{ fontSize: "1rem", color: "var(--dim)", marginLeft: 4 }}>ms</span>
          </div>
        </div>
      </div>

      <h3 className="kc-h3" style={{ marginTop: "var(--space-2xl)", marginBottom: "var(--space-md)" }}>Recent Alerts</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {alerts.map(a => (
          <div key={a.id} className="kc-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${a.status === "critical" ? "var(--color-danger)" : "var(--color-success)"}` }}>
            <div>
              <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {a.status === "critical" ? <Icon name="alert" size={16} color="var(--color-danger)" /> : <Icon name="check" size={16} color="var(--color-success)" />}
                {a.title}
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{a.desc}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Badge status={a.status === "critical" ? "danger" : "success"} text={a.status} />
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
