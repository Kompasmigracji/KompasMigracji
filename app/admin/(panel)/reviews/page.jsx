"use client";
/* KompasCRM — Feedback & Reviews (Trustpilot / Google Reviews style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function ReviewsPage() {
  const [reviews] = useState([]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Icon key={i} name="star" size={14} color={i < rating ? "var(--color-warning)" : "var(--border)"} style={{ fill: i < rating ? "var(--color-warning)" : "none" }} />
    ));
  };

  const columns = [
    { header: "Customer", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.customer} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.customer}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name={row.platform === "Google Maps" ? "map-pin" : row.platform === "Facebook" ? "facebook" : "star"} size={10} /> {row.platform}
          </div>
        </div>
      </div>
    )},
    { header: "Rating", cell: (row) => <div style={{ display: "flex", gap: 2 }}>{renderStars(row.rating)}</div> },
    { header: "Review", cell: (row) => <span style={{ color: "var(--dim)", maxWidth: 300, display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>"{row.text}"</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "needs_attention") color = "danger";
      if (row.status === "new") color = "primary";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="message-circle" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="external-link" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Feedback & Reviews</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor your online reputation and reply to customer reviews.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="refresh-cw" size={16} /> Sync Platforms</button>
          <button className="kc-btn kc-btn-primary"><Icon name="send" size={16} /> Request Review</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Rating (All Platforms)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 8 }}>
            4.8 <Icon name="star" size={24} color="var(--color-warning)" style={{ fill: "var(--color-warning)" }} />
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>New Reviews (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Needs Attention (1-2 Stars)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>3</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search reviews by keyword or customer name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Rating</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Platform</button>
        </div>
        <DataTable columns={columns} data={reviews} />
      </div>
    </div>
  );
}
