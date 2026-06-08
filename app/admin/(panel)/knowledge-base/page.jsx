"use client";
/* iPhoenixCRM — Knowledge Base & AI Auto-Responder (Intercom style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function KnowledgeBasePage() {
  const [articles] = useState([
    { id: "kb_1", title: "How to reset your password", category: "Account Setup", views: 1240, helpful: "94%", status: "published", updated: "2 days ago" },
    { id: "kb_2", title: "Configuring the API Webhooks", category: "Developers", views: 85, helpful: "100%", status: "published", updated: "1 month ago" },
    { id: "kb_3", title: "Refund Policy 2026", category: "Billing", views: 0, helpful: "N/A", status: "draft", updated: "Just now" }
  ]);

  const columns = [
    { header: "Article Title", cell: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span> },
    { header: "Category", cell: (row) => <Badge status="info" text={row.category} /> },
    { header: "Views", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.views.toLocaleString()}</span> },
    { header: "Helpful Score", cell: (row) => <span style={{ color: row.helpful.includes("9") || row.helpful.includes("100") ? "var(--color-success)" : "var(--dim)" }}>{row.helpful}</span> },
    { header: "Last Updated", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.updated}</span> },
    { header: "Status", cell: (row) => <Badge status={row.status === "published" ? "success" : "warning"} text={row.status.toUpperCase()} /> },
    { header: "", cell: () => <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button> }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Knowledge Base & AI</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage FAQ articles and train your AI Auto-Responder.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Article</button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        {/* Left: Articles */}
        <div className="kc-card" style={{ flex: 2, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
            <Icon name="book-open" size={18} color="var(--dim)" />
            <h3 className="kc-h3" style={{ margin: 0, fontSize: "var(--text-sm)" }}>Published Articles</h3>
          </div>
          <DataTable columns={columns} data={articles} />
        </div>

        {/* Right: AI Auto-Responder Settings */}
        <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="cpu" size={18} color="var(--color-primary)" /> AI Auto-Responder
          </h3>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: "var(--space-md)" }}>
            When clients open a ticket or start a chat, the AI will instantly suggest relevant articles based on their message.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked /> Enable AI in Support Chat
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked /> Auto-Reply to Email Tickets
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", cursor: "pointer" }}>
              <input type="checkbox" /> Automatically Close resolved tickets (Beta)
            </label>
          </div>

          <div style={{ background: "var(--panel-2)", padding: "var(--space-sm)", borderRadius: 6, fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: "var(--space-md)" }}>
            <strong>AI Deflection Rate:</strong> 34% of tickets were resolved by AI this week.
          </div>
        </div>
      </div>
    </div>
  );
}
