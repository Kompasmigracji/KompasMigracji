"use client";
/* KompasCRM — Headless CMS (WordPress / Joomla style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function CMSPage() {
  const [content] = useState([]);

  const columns = [
    { header: "Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name={row.type === "Landing Page" ? "layout" : row.type === "Case Study" ? "award" : "file-text"} size={16} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.title}</span>
      </div>
    )},
    { header: "Type", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.type}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "draft") color = "default";
      if (row.status === "scheduled") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Author", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.author} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.author}</span>
      </div>
    )},
    { header: "Views", cell: (row) => <span style={{ fontWeight: 600 }}>{row.views.toLocaleString()}</span> },
    { header: "Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="eye" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Content Management</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create and publish blog posts, landing pages, and optimize for SEO.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="image" size={16} /> Media Library</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Post</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        {/* Left: Main Table */}
        <div className="kc-card" style={{ flex: 2, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
              <Icon name="search" size={16} color="var(--dim)" />
              <input type="text" placeholder="Search content by title or keywords..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
            </div>
            <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Type</button>
          </div>
          <DataTable columns={columns} data={content} />
        </div>

        {/* Right: SEO & Health */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="kc-card">
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="search" size={18} color="var(--color-success)" /> SEO Health Score
            </h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 42, fontWeight: 700, color: "var(--color-success)" }}>85/100</span>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: "var(--space-xs)" }}>
              2 articles are missing meta descriptions. 1 article has no cover image.
            </p>
            <button className="kc-btn kc-btn-secondary" style={{ width: "100%", marginTop: "var(--space-md)", justifyContent: "center" }}>
              <Icon name="zap" size={16} /> Fix with AI
            </button>
          </div>

          <div className="kc-card" style={{ flex: 1 }}>
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>Quick Draft</h3>
            <input className="kc-input" placeholder="Title" style={{ width: "100%", marginBottom: "var(--space-sm)" }} />
            <textarea className="kc-input" placeholder="What's on your mind?" style={{ width: "100%", minHeight: 80, resize: "vertical", marginBottom: "var(--space-sm)" }} />
            <button className="kc-btn kc-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}
