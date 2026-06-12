"use client";
/* KompasCRM — Documents & E-Signatures (DocuSign style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function DocumentsPage() {
  const [documents] = useState([]);

  const columns = [
    { header: "Document", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="file-text" size={16} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.name}</span>
      </div>
    )},
    { header: "Recipient", cell: (row) => <span style={{ color: "var(--fg)" }}>{row.recipient}</span> },
    { header: "Type", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.type}</span> },
    { header: "Status", cell: (row) => {
      let color = "info";
      if (row.status === "signed") color = "success";
      if (row.status === "viewed") color = "warning";
      if (row.status === "draft") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "Owner", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.owner} size={20} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.owner}</span>
      </div>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="download" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Documents & E-Signatures</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create contracts, request e-signatures, and track document engagement.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="grid" size={16} /> Templates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Document</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Sent this month</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Awaiting Signature</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>12</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Signed</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>28</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <DataTable columns={columns} data={documents} />
      </div>
    </div>
  );
}
