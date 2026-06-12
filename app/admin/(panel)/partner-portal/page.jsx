"use client";
/* KompasCRM — B2B Partner Portal */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function PartnerPortalPage() {
  const [partners] = useState([]);

  // AI B2B logs
  const [b2bLogs, setB2bLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-095 computed referral percentage for partner Piotr Nowak: +10%." },
      { type: "agent", text: "Agent-128 confirmed payout check: Cleared." },
      { type: "coordinator", text: "Coordinator [Agent-C03] approved temporary credit limit increase for partner agency Schengen Visa." },
      { type: "system", text: "President key authorized joint-venture B2B marketing budget allocation." },
      { type: "agent", text: "Agent-110 updated partner directory contact details for Tomasz Adamski." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setB2bLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: "Назва Партнера", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div>
          <div style={{ fontWeight: 600, color: "var(--text)" }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Контактна Особа", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>{row.contact}</span> },
    { header: "Активні Ліди", cell: (row) => <span style={{ fontWeight: 500, color: "var(--text)" }}>{row.activeLeads} лідів</span> },
    { header: "Комісійний Баланс", cell: (row) => <strong style={{ color: "var(--color-success)" }}>{row.balance}</strong> },
    { header: "Статус", cell: (row) => <Badge status={row.status === "active" ? "green" : "red"} text={row.status.toUpperCase()} /> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 4 }}>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 6, minHeight: "auto" }}><Icon name="compass" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 6, minHeight: "auto" }}><Icon name="card" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Портал B2B Партнерів (Partner Management)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Співпраця з субпідрядниками, контроль залучених клієнтів та нарахування партнерських винагород.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => alert("Бланк партнерського договору згенеровано")}>
          <Icon name="plus" size={16} /> Додати партнера
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
        {/* Table card */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: "320px" }}>
          <DataTable columns={columns} data={partners} />
        </div>

        {/* AI B2B logs & stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kc-card">
            <h3 className="kc-card-cap" style={{ margin: 0, color: "var(--color-primary)" }}>AI B2B Dispatcher</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", marginTop: "var(--space-md)", fontSize: "var(--text-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ color: "var(--dim)" }}>Affiliate Trackers:</span>
                <strong style={{ color: "var(--text)" }}>175 active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ color: "var(--dim)" }}>Commission Accrued:</span>
                <strong style={{ color: "var(--color-success)" }}>12,200 PLN / mo</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 4 }}>
                <span style={{ color: "var(--dim)" }}>Payout Verification:</span>
                <Badge status="green" text="Automated" />
              </div>
            </div>
          </div>

          <div className="kc-card" style={{ background: "#0d1117", border: "1px solid var(--border)", flex: 1 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логі партнерів</h3>
            <div style={{ 
              marginTop: "var(--space-md)", maxHeight: 220, overflowY: "auto", 
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: 1.6,
              color: "#c9d1d9", display: "flex", flexDirection: "column", gap: 8
            }}>
              {b2bLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "#8b949e" }}>[{log.time}]</span> <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
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
