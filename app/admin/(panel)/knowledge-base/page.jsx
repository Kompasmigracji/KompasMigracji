"use client";
/* iPhoenixCRM — Knowledge Base & Legal Wiki */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function KnowledgeBasePage() {
  const [articles] = useState([
    { id: "KB-01", title: "Karta Pobytu: Requirements 2026 Update", category: "Legal Updates", author: "Anna S.", date: "Today", views: 24, status: "published", urgent: true },
    { id: "KB-02", title: "How to register a car for a foreigner", category: "Guides", author: "Oleg V.", date: "June 01, 2026", views: 142, status: "published", urgent: false },
    { id: "KB-03", title: "Appeals (Odwołanie) Template", category: "Templates", author: "Maria G.", date: "May 15, 2026", views: 89, status: "published", urgent: false },
    { id: "KB-04", title: "Blue Card Salary Minimums", category: "Legal Updates", author: "Anna S.", date: "Draft", views: 0, status: "draft", urgent: false }
  ]);

  const columns = [
    { header: "Article Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.category === "Legal Updates" ? "alert-circle" : row.category === "Guides" ? "book-open" : "file-text"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            {row.title}
            {row.urgent && <Badge status="danger" text="URGENT READ" />}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id} • {row.category}</div>
        </div>
      </div>
    )},
    { header: "Author", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Avatar name={row.author.substring(0,2).toUpperCase()} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.author}</span>
      </div>
    )},
    { header: "Last Updated", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.date}</span> },
    { header: "Views", cell: (row) => <span style={{ fontWeight: 600 }}>{row.views}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "published" ? "success" : "default"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="eye" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Knowledge Base (Baza Wiedzy)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Internal wiki for SOPs, legal updates, templates, and procedures.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="folder" size={16} /> Categories</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Write Article</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Articles</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>128</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Most Read Category</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>Legal Updates</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Missing Acknowledgment</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>2</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Sales reps haven't read new rules.</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search the Wiki (e.g., 'Blue Card requirements')..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Categories</option>
            <option>Legal Updates</option>
            <option>Guides & SOPs</option>
            <option>Document Templates</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={articles} />
        </div>
      </div>
    </div>
  );
}
