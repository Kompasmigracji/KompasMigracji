"use client";
/* KompasCRM — Social Media Management (Hootsuite / Buffer style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function SocialMediaPage() {
  const [posts] = useState([]);

  const columns = [
    { header: "Post Content", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name={row.platform === "Instagram" ? "instagram" : row.platform === "LinkedIn" ? "linkedin" : row.platform === "Facebook" ? "facebook" : "twitter"} size={16} color="var(--dim)" />
        <span style={{ fontWeight: 500, maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.content}</span>
      </div>
    )},
    { header: "Platform", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.platform}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "scheduled") color = "warning";
      if (row.status === "draft") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Likes", cell: (row) => <span style={{ fontWeight: 600 }}>{row.likes.toLocaleString()}</span> },
    { header: "Comments", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.comments}</span> },
    { header: "Date / Time", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="bar-chart-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Social Media & SMM</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Schedule posts, track engagement, and reply to comments across all platforms.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Content Calendar</button>
          <button className="kc-btn kc-btn-primary"><Icon name="edit" size={16} /> Compose Post</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Audience</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>45.2K</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Engagement Rate (7d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>4.8%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Scheduled Posts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>12</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1 }}>
        {/* Left: Main Table */}
        <div className="kc-card" style={{ flex: 2, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
              <Icon name="search" size={16} color="var(--dim)" />
              <input type="text" placeholder="Search posts by keyword..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
            </div>
            <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Platform</button>
          </div>
          <DataTable columns={columns} data={posts} />
        </div>

        {/* Right: AI Post Generator */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="kc-card" style={{ flex: 1 }}>
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="zap" size={18} color="var(--color-primary)" /> AI Caption Writer
            </h3>
            <div style={{ marginBottom: "var(--space-sm)" }}>
              <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Topic</label>
              <input className="kc-input" placeholder="e.g. New Student Visas" style={{ width: "100%", marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: "var(--space-sm)" }}>
              <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Tone</label>
              <select className="kc-input" style={{ width: "100%", marginTop: 4 }}>
                <option>Professional</option>
                <option>Engaging & Fun</option>
                <option>Urgent</option>
              </select>
            </div>
            <button className="kc-btn kc-btn-secondary" style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-sm)" }}>
              Generate Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
