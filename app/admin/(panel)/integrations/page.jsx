"use client";
/* KompasCRM — API Integrations & Webhooks */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function IntegrationsPage() {
  const [webhooks] = useState([
    { id: "WH-01", name: "Make.com (Integromat) - FB Leads", url: "https://hook.us1.make.com/abc123xyz...", event: "Lead Created", status: "active", lastTrigger: "2 mins ago" },
    { id: "WH-02", name: "Stripe Payment Success", url: "https://api.stripe.com/v1/webhook...", event: "Invoice Paid", status: "active", lastTrigger: "1 hour ago" },
    { id: "WH-03", name: "Zapier - Slack Notifications", url: "https://hooks.zapier.com/hooks/catch...", event: "Deal Won", status: "paused", lastTrigger: "2 days ago" }
  ]);

  const [apiKeys] = useState([
    { id: "KEY-01", name: "Website Lead Form", token: "pk_live_8f9a...3b2c", role: "Write Only", created: "Jan 15, 2026", lastUsed: "10 mins ago" },
    { id: "KEY-02", name: "Mobile App Beta", token: "sk_test_1a2b...9z8x", role: "Full Access", created: "May 20, 2026", lastUsed: "Yesterday" }
  ]);

  const columnsWebhooks = [
    { header: "Webhook Name & URL", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.name}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace", marginTop: 2 }}>{row.url}</div>
      </div>
    )},
    { header: "Trigger Event", cell: (row) => (
      <Badge status="default" text={row.event} />
    )},
    { header: "Last Trigger", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.lastTrigger}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "active" ? "success" : "warning"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="activity" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  const columnsApiKeys = [
    { header: "Key Name", cell: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { header: "Token (Masked)", cell: (row) => <span style={{ fontFamily: "monospace", color: "var(--dim)" }}>{row.token}</span> },
    { header: "Permissions", cell: (row) => <Badge status={row.role === "Full Access" ? "danger" : "primary"} text={row.role} /> },
    { header: "Created / Last Used", cell: (row) => (
      <div>
        <div style={{ fontSize: "var(--text-sm)" }}>{row.lastUsed}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Created {row.created}</div>
      </div>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="copy" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-danger)" }}><Icon name="trash" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto", paddingRight: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>API Integrations & Webhooks</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Connect KompasMigracji CRM to other apps. Manage API keys and Webhook events.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="book" size={16} /> API Docs</button>
        </div>
      </div>

      {/* Featured Apps Catalog */}
      <h3 style={{ margin: "0 0 var(--space-md) 0" }}>Featured Connections</h3>
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-xl)", flexShrink: 0 }}>
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-md)", cursor: "pointer", border: "1px solid var(--border)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="facebook" size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Facebook Lead Ads</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Sync leads automatically.</div>
          </div>
          <Badge status="success" text="CONNECTED" />
        </div>
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-md)", cursor: "pointer", border: "1px solid var(--border)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#FF4F00", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <span style={{ color: "white", fontWeight: 700, fontSize: "20px" }}>_z</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Zapier</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Connect 5000+ apps.</div>
          </div>
          <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>Connect</button>
        </div>
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-md)", cursor: "pointer", border: "1px solid var(--border)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "24px" }}>S</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Stripe</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Process online payments.</div>
          </div>
          <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>Connect</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flexShrink: 0, flexDirection: "column" }}>
        
        {/* Webhooks Table */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="zap" size={18} color="var(--color-primary)" /> Webhooks
            </h3>
            <button className="kc-btn kc-btn-primary" style={{ padding: "4px 12px", fontSize: "12px" }}><Icon name="plus" size={14} /> Add Webhook</button>
          </div>
          <DataTable columns={columnsWebhooks} data={webhooks} />
        </div>

        {/* API Keys Table */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="key" size={18} color="var(--color-warning)" /> API Keys
            </h3>
            <button className="kc-btn kc-btn-primary" style={{ padding: "4px 12px", fontSize: "12px" }}><Icon name="plus" size={14} /> Generate Token</button>
          </div>
          <DataTable columns={columnsApiKeys} data={apiKeys} />
        </div>
        
      </div>
    </div>
  );
}
