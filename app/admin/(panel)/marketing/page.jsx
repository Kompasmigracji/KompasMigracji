"use client";
/* KompasCRM — Email Marketing & Telegram Bot Funnel Dashboard */
import React, { useState, useEffect } from "react";
import { Icon, Avatar, Badge, DataTable, ProgressBar } from "@/components/admin/ui";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("funnel");

  // Mock campaigns
  const [campaigns] = useState([
    { id: "CMP-901", name: "July Law Changes Update", audience: "All Active Clients (4,210)", status: "sent", date: "June 01, 2026", openRate: "68%", clickRate: "12%" },
    { id: "CMP-902", name: "Mortgage for Foreigners Promo", audience: "Clients with TRC > 1 year (850)", status: "sending", date: "Today", openRate: "—", clickRate: "—" },
    { id: "CMP-903", name: "Referral Program Announcement", audience: "B2B Partners (120)", status: "draft", date: "—", openRate: "—", clickRate: "—" }
  ]);

  // AI Marketing Dispatcher Logs
  const [marketingLogs, setMarketingLogs] = useState([
    { time: "17:15:10", type: "system", message: "President approved new Telegram funnel webhook security certificates." },
    { time: "17:12:44", type: "coordinator", message: "Marketing Coordinator [Agent-C03] synced conversion analytics for June campaign." },
    { time: "17:10:02", type: "agent", message: "Funnel Agent-028 tracked user step: 'step_3_urgency' on TgChat ID: 9928173." },
    { time: "17:05:00", type: "system", message: "KompasCRM Marketing Automation system online (175 automated agents monitoring Telegram funnel)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-042 processed lead qualification event: 'work' chosen by user @oleg_petrov." },
      { type: "agent", text: "Agent-111 broadcasted weekly newsletter update to 4,210 subscribers." },
      { type: "coordinator", text: "Coordinator [Agent-C09] resolved manual bypass request for Chat ID: 882910." },
      { type: "system", text: "President digital signature verified on automated email dispatch log." },
      { type: "agent", text: "Agent-159 registered funnel completion event: lead converted on basic package." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setMarketingLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: "Campaign Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.status === "sent" ? "send" : "edit"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Target Audience", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.audience}</span> },
    { header: "Date", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.date}</span> },
    { header: "Status", cell: (row) => {
      let color = "blue";
      if (row.status === "sent") color = "green";
      if (row.status === "draft") color = "dim";
      if (row.status === "sending") color = "brass";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Open Rate", cell: (row) => <span style={{ fontWeight: 600 }}>{row.openRate}</span> },
    { header: "Click Rate", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{row.clickRate}</span> }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Маркетинг & Воронка Telegram-бота</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Аналітика багатокрокових опитувань, email-кампанії та автоматизований підбір пакетів послуг.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Налаштування Воронки</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Створити Кампанію</button>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)" }}>
        <button onClick={() => setActiveTab("funnel")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "funnel" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "funnel" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="target" size={16} /> Воронка Telegram
        </button>
        <button onClick={() => setActiveTab("campaigns")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "campaigns" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "campaigns" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="file-text" size={16} /> Email Кампанії
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="cpu" size={16} /> AI Marketing Logs
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === "funnel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            
            {/* KPI Stats */}
            <div className="kc-grid kc-grid-4">
              <div className="kc-stat">
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase" }}>Всього лідів з бота</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>1,489</div>
              </div>
              <div className="kc-stat">
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase" }}>Конверсія воронки</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4, color: "var(--color-success)" }}>56.4%</div>
              </div>
              <div className="kc-stat">
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase" }}>Передано асистентам</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>342</div>
              </div>
              <div className="kc-stat">
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase" }}>Середній час проходження</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4, color: "var(--color-primary)" }}>1.4 хв</div>
              </div>
            </div>

            {/* Funnel Drop-off Chart */}
            <div className="kc-card">
              <h3 className="kc-card-cap" style={{ marginBottom: "var(--space-md)" }}>Конверсія кроків воронки лідів бота</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", marginTop: "var(--space-sm)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
                    <span>Крок 1: Старт та вибір мети (/start)</span>
                    <span>1,489 лідів (100%)</span>
                  </div>
                  <ProgressBar progress={100} color="var(--color-info)" />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
                    <span>Крок 2: Вибір країни призначення (Польща, Іспанія, ...)</span>
                    <span>1,250 лідів (84%)</span>
                  </div>
                  <ProgressBar progress={84} color="var(--color-info)" />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
                    <span>Крок 3: Вказання терміновості</span>
                    <span>1,057 лідів (71%)</span>
                  </div>
                  <ProgressBar progress={71} color="var(--color-info)" />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
                    <span>Крок 4: Вибір пакета послуг (Basic, Standard, Premium)</span>
                    <span>840 лідів (56.4%)</span>
                  </div>
                  <ProgressBar progress={56.4} color="var(--color-success)" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <DataTable columns={columns} data={campaigns} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи маркетингового диспетчера</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 350, overflowY: "auto" }}>
              {marketingLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
                    <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
