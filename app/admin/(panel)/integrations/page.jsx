"use client";
/* iPhoenixCRM — Integrations & API Hub (Zapier / HubSpot style) */
import React, { useState } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function IntegrationsPage() {
  const [apps] = useState([
    { id: "INT-1", name: "Google Calendar", category: "Productivity", description: "Sync meetings and court dates automatically.", connected: true, logo: "calendar" },
    { id: "INT-2", name: "Stripe", category: "Payments", description: "Accept credit card payments and track MRR.", connected: true, logo: "credit-card" },
    { id: "INT-3", name: "Facebook Lead Ads", category: "Marketing", description: "Automatically pull leads from Facebook campaigns.", connected: false, logo: "facebook" },
    { id: "INT-4", name: "Slack", category: "Communication", description: "Get notifications when a big deal is closed.", connected: true, logo: "message-square" },
    { id: "INT-5", name: "Mailchimp", category: "Marketing", description: "Sync CRM contacts for email newsletters.", connected: false, logo: "mail" },
    { id: "INT-6", name: "DocuSign", category: "Legal", description: "Send contracts for e-signature directly.", connected: false, logo: "file-text" },
    { id: "INT-7", name: "WhatsApp Business", category: "Communication", description: "Chat with clients via official API.", connected: true, logo: "message-circle" },
    { id: "INT-8", name: "Zapier", category: "Automation", description: "Connect iPhoenixCRM to 5000+ other apps.", connected: false, logo: "zap" }
  ]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>App Marketplace & Integrations</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Connect iPhoenixCRM with your favorite tools to automate workflows.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="code" size={16} /> API Keys</button>
          <button className="kc-btn kc-btn-primary"><Icon name="link" size={16} /> Webhooks</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Integrations</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>4 Apps</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>API Requests (24h)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14,520</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Sync Errors</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>0</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, width: 300 }}>
          <Icon name="search" size={16} color="var(--dim)" />
          <input type="text" placeholder="Search apps..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
        </div>
        <button className="kc-btn kc-btn-secondary">All Categories</button>
        <button className="kc-btn kc-btn-secondary">Marketing</button>
        <button className="kc-btn kc-btn-secondary">Productivity</button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "var(--space-md)",
        flex: 1,
        overflowY: "auto",
        paddingBottom: "var(--space-xl)"
      }}>
        {apps.map(app => (
          <div key={app.id} className="kc-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <div style={{ width: 48, height: 48, background: "var(--panel-2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={app.logo} size={24} color={app.connected ? "var(--color-primary)" : "var(--fg)"} />
              </div>
              {app.connected ? (
                <Badge status="success" text="CONNECTED" />
              ) : (
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{app.category}</span>
              )}
            </div>
            
            <h3 style={{ fontSize: "var(--text-md)", fontWeight: 600, margin: "0 0 4px 0" }}>{app.name}</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--dim)", margin: 0, flex: 1 }}>{app.description}</p>
            
            <div style={{ marginTop: "var(--space-lg)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className={`kc-btn ${app.connected ? 'kc-btn-secondary' : 'kc-btn-primary'}`} style={{ width: "100%", justifyContent: "center" }}>
                {app.connected ? "Configure Settings" : "Connect App"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
