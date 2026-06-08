"use client";
/* KompasCRM — B2B Partner Portal */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function PartnerPortalPage() {
  const [partners] = useState([
    { id: "PTN-01", name: "Schengen Visa Broker LLC", contact: "Jan Kowalski", activeLeads: 12, balance: "2,400 PLN", status: "active" },
    { id: "PTN-02", name: "Warsaw Legal Advisors", contact: "Piotr Nowak", activeLeads: 4, balance: "800 PLN", status: "active" },
    { id: "PTN-03", name: "Kiev Relocation Agency", contact: "Olena Boyko", activeLeads: 45, balance: "9,000 PLN", status: "active" },
    { id: "PTN-04", name: "Lodz Housing Corp", contact: "Tomasz Adamski", activeLeads: 0, balance: "0 PLN", status: "suspended" }
  ]);

  // AI B2B logs
  const [b2bLogs, setB2bLogs] = useState([
    { time: "14:45:10", type: "system", message: "President authorized monthly B2B commission payout schedules." },
    { time: "14:42:05", type: "coordinator", message: "Partner Coordinator [Agent-C12] verified lead attribution cookies for Schengen Visa Broker." },
    { time: "14:38:00", type: "agent", message: "B2B Agent-074 synced 15 new lead profiles submitted by partner Kiev Relocation." },
    { time: "14:30:00", type: "system", message: "KompasCRM B2B Channel Manager active (175 background agents checking affiliate referrals)." }
  ]);

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
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Контактна Особа", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.contact}</span> },
    { header: "Активні Ліди", cell: (row) => <span style={{ fontWeight: 500 }}>{row.activeLeads} лідів</span> },
    { header: "Комісійний Баланс", cell: (row) => <strong style={{ color: "var(--color-success)" }}>{row.balance}</strong> },
    { header: "Статус", cell: (row) => <Badge status={row.status === "active" ? "green" : "red"} text={row.status.toUpperCase()} /> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 4 }}>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="eye" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="card" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr", gap: "var(--space-lg)" }}>
        {/* Table card */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <DataTable columns={columns} data={partners} />
        </div>

        {/* AI B2B logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kc-card">
            <h3 className="kc-card-cap" style={{ margin: 0 }}>AI B2B Dispatcher</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginTop: "var(--space-md)", fontSize: "var(--text-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Affiliate Trackers:</span>
                <strong>175 active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Commission Accrued:</span>
                <strong>12,200 PLN / mo</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Payout Verification:</span>
                <Badge status="green" text="Automated" />
              </div>
            </div>
          </div>

          <div className="kc-card" style={{ background: "#06090e", flex: 1 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логі партнерів (AI Partner logs)</h3>
            <div style={{ 
              marginTop: "var(--space-md)", maxHeight: 200, overflowY: "auto", 
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: 1.6,
              color: "#c9d1d9", display: "flex", flexDirection: "column", gap: 8
            }}>
              {b2bLogs.map((log, index) => {
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
