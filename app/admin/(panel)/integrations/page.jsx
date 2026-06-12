"use client";
/* KompasCRM — Integrations & Connected Apps */
import React, { useState, useEffect } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);

  // AI Integrations logs
  const [apiLogs, setApiLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-095 validated Twilio credit balance: Balance Ok." },
      { type: "agent", text: "Agent-128 received Stripe webhook event: charge.succeeded." },
      { type: "coordinator", text: "Coordinator [Agent-C11] re-routed failed webhook payload to retry queue." },
      { type: "system", text: "President digital certificate approved for custom database webhook dispatch." },
      { type: "agent", text: "Agent-110 updated Telegram bot status to Online." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setApiLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4800);

    return () => clearInterval(interval);
  }, []);

  const toggleConnection = (id) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === "connected" || item.status === "configured" ? "available" : "connected" };
      }
      return item;
    }));
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Інтеграції API & Сервіси (Connected Apps)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Підключення платіжних шлюзів, SMS-провайдерів та чат-ботів Telegram/Viber.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr", gap: "var(--space-lg)" }}>
        {/* Marketplace cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-md)", alignContent: "start" }}>
          {integrations.map(app => (
            <div key={app.id} className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", border: app.status === "connected" ? "1px solid var(--color-primary)" : "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                  <Icon name={app.logo} size={20} color="var(--dim)" />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{app.name}</h4>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>API Core</span>
                </div>
              </div>
              
              <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--dim)", lineHeight: 1.5, flex: 1 }}>
                {app.desc}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)" }}>
                {app.status === "connected" && <Badge status="green" text="Connected" />}
                {app.status === "configured" && <Badge status="blue" text="Configured" />}
                {app.status === "available" && <Badge status="dim" text="Available" />}
                
                <button 
                  className={`kc-btn ${app.status === "available" ? "kc-btn-primary" : "kc-btn-ghost"}`}
                  style={{ minHeight: "auto", padding: "4px 8px", fontSize: "var(--text-xs)", color: app.status !== "available" ? "var(--color-danger)" : "" }}
                  onClick={() => toggleConnection(app.id)}
                >
                  {app.status === "available" ? "Connect" : "Disconnect"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Integration logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kc-card">
            <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Webhook Dispatcher</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginTop: "var(--space-md)", fontSize: "var(--text-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>API Health Monitors:</span>
                <strong>175 active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Webhooks Handled:</span>
                <strong>1,420 / min</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Signature Validations:</span>
                <Badge status="green" text="Passing" />
              </div>
            </div>
          </div>

          <div className="kc-card" style={{ background: "#06090e", flex: 1 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи шлюзів (AI Webhook logs)</h3>
            <div style={{ 
              marginTop: "var(--space-md)", maxHeight: 200, overflowY: "auto", 
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: 1.6,
              color: "#c9d1d9", display: "flex", flexDirection: "column", gap: 8
            }}>
              {apiLogs.map((log, index) => {
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
