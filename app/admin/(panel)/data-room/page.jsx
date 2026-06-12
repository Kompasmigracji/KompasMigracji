"use client";
/* KompasCRM — Virtual Data Room & Secure Sharing (DocSend style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function DataRoomPage() {
  const [links] = useState([]);

  const columns = [
    { header: "Document / Folder Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name={row.status === "expired" ? "lock" : "folder"} size={16} color={row.status === "expired" ? "var(--color-danger)" : "var(--color-primary)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="shield" size={10} /> Password Protected
          </div>
        </div>
      </div>
    )},
    { header: "Client / Recipient", cell: (row) => <span style={{ fontWeight: 500 }}>{row.client}</span> },
    { header: "Total Views", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.views > 0 ? "var(--color-success)" : "var(--dim)" }}>
        {row.views} views
      </span>
    )},
    { header: "Last Accessed", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.lastView}</span> },
    { header: "Expiration Date", cell: (row) => (
      <span style={{ color: row.status === "expired" ? "var(--color-danger)" : "var(--dim)" }}>
        {row.expires}
      </span>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "expired") color = "danger";
      if (row.status === "draft") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="bar-chart-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="copy" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Virtual Data Room</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Share confidential files securely, set passwords, and track who viewed your documents.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="folder-plus" size={16} /> New Folder</button>
          <button className="kc-btn kc-btn-primary"><Icon name="link" size={16} /> Create Secure Link</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Shared Links</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Document Views (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>856</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Storage Used</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>14.2 GB</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search secure links by name or client..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="shield" size={16} /> Access Logs</button>
        </div>
        <DataTable columns={columns} data={links} />
      </div>
    </div>
  );
}
