"use client";
/* KompasCRM — Audit Log & Security */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function AuditLogPage() {
  const [logs] = useState([
    { id: "LOG-091", user: "Oleh Melnyk", action: "Exported Data", resource: "All Active Clients (CSV)", ip: "192.168.1.45", location: "Warsaw, PL", time: "10 mins ago", severity: "high" },
    { id: "LOG-092", user: "Andriy Boyko", action: "Updated Record", resource: "TechCorp Ltd (MRR changed to 2,500 PLN)", ip: "84.15.201.99", location: "Krakow, PL", time: "2 hours ago", severity: "info" },
    { id: "LOG-093", user: "Unknown (Failed Login)", action: "Authentication Failed", resource: "Admin Portal", ip: "103.45.11.2", location: "Beijing, CN", time: "Yesterday", severity: "critical" },
    { id: "LOG-094", user: "System (Auto)", action: "Workflow Triggered", resource: "Welcome Email Sequence", ip: "Server", location: "Frankfurt, DE", time: "Yesterday", severity: "low" },
    { id: "LOG-095", user: "Elena Rostova", action: "Deleted File", resource: "Passport_Scan_Ivan.pdf", ip: "89.20.14.5", location: "Warsaw, PL", time: "May 25", severity: "warning" }
  ]);

  // AI Security Agent Logs (175 agents, 15 coordinators, 1 president)
  const [secLogs, setSecLogs] = useState([
    { time: "14:28:11", type: "system", message: "President authorized automatic firewall IP blocklist synchronization." },
    { time: "14:25:40", type: "coordinator", message: "Security Coordinator [Agent-C01] verified signature integrity for audit log database." },
    { time: "14:22:15", type: "agent", message: "Security Agent-119 flagged suspicious login attempt from Beijing, CN." },
    { time: "14:20:00", type: "system", message: "KompasCRM Audit Guard online (175 background agents scanning user access logs)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-054 compiled daily export audit report for compliance officer." },
      { type: "agent", text: "Agent-128 verified token validation parameters for admin session." },
      { type: "coordinator", text: "Coordinator [Agent-C03] isolated suspicious IP address 103.45.11.2." },
      { type: "system", text: "President digital key verified for configuration file encryption." },
      { type: "agent", text: "Agent-095 archived audit log entries older than 90 days." },
      { type: "agent", text: "Agent-166 scanned system file hashes: Integrity check OK." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setSecLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: "User / Actor", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        {row.user.includes("Unknown") ? (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="alert" size={16} color="white" />
          </div>
        ) : row.user.includes("System") ? (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cpu" size={16} color="var(--dim)" />
          </div>
        ) : (
          <Avatar name={row.user} size={32} />
        )}
        <span style={{ fontWeight: 500, color: row.user.includes("Unknown") ? "var(--color-danger)" : "var(--fg)" }}>
          {row.user}
        </span>
      </div>
    )},
    { header: "Action", cell: (row) => <span style={{ fontWeight: 600 }}>{row.action}</span> },
    { header: "Resource Affected", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.resource}</span> },
    { header: "IP & Location", cell: (row) => (
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "var(--text-xs)" }}>{row.ip}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.location}</div>
      </div>
    )},
    { header: "Timestamp", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.time}</span> },
    { header: "Severity", cell: (row) => {
      let color = "info";
      if (row.severity === "low") color = "default";
      if (row.severity === "warning") color = "warning";
      if (row.severity === "high") color = "primary";
      if (row.severity === "critical") color = "danger";
      return <Badge status={color} text={row.severity.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="eye" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Журнал Аудиту & Безпека (Audit Trail)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Моніторинг усіх дій користувачів та подій авторизації для забезпечення комплаєнсу та безпеки даних.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="shield" size={16} /> Політики безпеки</button>
          <button className="kc-btn kc-btn-primary" onClick={() => alert("Журнал експортовано в CSV")}>
            <Icon name="download" size={16} /> Експортувати логи
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr", gap: "var(--space-lg)" }}>
        {/* Logs Table */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
              <Icon name="search" size={16} color="var(--dim)" />
              <input type="text" placeholder="Пошук за дією, IP або ресурсом..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
            </div>
            <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Важливість</button>
          </div>
          <DataTable columns={columns} data={logs} />
        </div>

        {/* AI Guard Console */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kc-card" style={{ borderTop: "3px solid var(--color-danger)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Security Controller</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginTop: "var(--space-md)", fontSize: "var(--text-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Scanning Agents:</span>
                <strong>175 active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Alert Coordinators:</span>
                <strong>15 active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>President Authorization Key:</span>
                <Badge status="green" text="Synced" />
              </div>
            </div>
          </div>

          <div className="kc-card" style={{ background: "#06090e", flex: 1 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Лог Швидкого Реагування (AI Guard Logs)</h3>
            <div style={{ 
              marginTop: "var(--space-md)", maxHeight: 200, overflowY: "auto", 
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: 1.6,
              color: "#c9d1d9", display: "flex", flexDirection: "column", gap: 8
            }}>
              {secLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "var(--dim)" }}>[{log.time}]</span> <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
