"use client";
/* KompasCRM — API Keys & Webhooks Management */
import React, { useState } from "react";
import { Icon, Badge, EmptyState, DataTable } from "@/components/admin/ui";

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState("keys"); // keys, webhooks

  const [keys] = useState([
    { id: "key_1", name: "Zapier Integration", prefix: "pk_live_...", created: "May 10, 2026", lastUsed: "2 mins ago", status: "active" },
    { id: "key_2", name: "Website Lead Form", prefix: "pk_test_...", created: "May 12, 2026", lastUsed: "1 day ago", status: "active" },
    { id: "key_3", name: "Old Mobile App", prefix: "pk_live_...", created: "Jan 15, 2025", lastUsed: "Never", status: "revoked" }
  ]);

  const [webhooks] = useState([
    { id: "wh_1", url: "https://hooks.slack.com/services/T0000/B000", events: ["lead.created", "payment.succeeded"], status: "active", lastDelivery: "Success" },
    { id: "wh_2", url: "https://api.custom-erp.com/webhook", events: ["order.fulfilled"], status: "failing", lastDelivery: "Error 500" }
  ]);

  const keyColumns = [
    { header: "Name", cell: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { header: "Token Prefix", cell: (row) => <span style={{ fontFamily: "monospace", color: "var(--dim)" }}>{row.prefix}</span> },
    { header: "Created", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.created}</span> },
    { header: "Last Used", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.lastUsed}</span> },
    { header: "Status", cell: (row) => <Badge status={row.status === "active" ? "green" : "red"} text={row.status} /> },
    { header: "", cell: () => <button className="kc-btn kc-btn-ghost"><Icon name="trash" size={16} /></button> }
  ];

  const webhookColumns = [
    { header: "Endpoint URL", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-sm)" }}>{row.url}</span> },
    { header: "Subscribed Events", cell: (row) => (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {row.events.map(e => <Badge key={e} status="blue" text={e} />)}
      </div>
    )},
    { header: "Status", cell: (row) => <Badge status={row.status === "active" ? "green" : "red"} text={row.status} /> },
    { header: "Last Delivery", cell: (row) => <span style={{ color: row.lastDelivery === "Success" ? "var(--color-success)" : "var(--color-danger)" }}>{row.lastDelivery}</span> },
    { header: "", cell: () => <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button> }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>API & Integrations</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage REST API keys and subscribe to real-time Webhook events.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary">
          <Icon name="plus" size={16} /> 
          {activeTab === "keys" ? "Generate API Key" : "Add Webhook Endpoint"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("keys")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "keys" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "keys" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "keys" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="key" size={16} /> API Keys
        </button>
        <button 
          onClick={() => setActiveTab("webhooks")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "webhooks" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "webhooks" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "webhooks" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="zap" size={16} /> Webhooks
        </button>
      </div>

      {activeTab === "keys" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", background: "color-mix(in srgb, var(--color-warning) 10%, transparent)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)" }}>
            <Icon name="alert" size={20} color="var(--color-warning)" />
            <div style={{ fontSize: "var(--text-sm)" }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Security Warning</strong>
              API keys grant full access to your CRM data. Do not share them publicly or commit them to source control.
            </div>
          </div>
          <DataTable columns={keyColumns} data={keys} />
        </div>
      )}

      {activeTab === "webhooks" && (
        <DataTable columns={webhookColumns} data={webhooks} />
      )}
    </div>
  );
}
