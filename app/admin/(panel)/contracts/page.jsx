"use client";
/* KompasCRM — E-Signatures & Contracts (DocuSign / PandaDoc style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function ContractsPage() {
  const [contracts] = useState([
    { id: "DOC-26-001", title: "Power of Attorney (Pełnomocnictwo)", client: "Elena Rostova", value: "—", status: "signed", sent: "May 25, 2026", expires: "Never" },
    { id: "DOC-26-002", title: "B2B Service Agreement", client: "TechCorp Ltd", value: "€14,400/yr", status: "viewed", sent: "Yesterday", expires: "Jun 15, 2026" },
    { id: "DOC-26-003", title: "Visa Processing Contract", client: "Ivan Ivanov", value: "€350", status: "sent", sent: "Today", expires: "Jun 10, 2026" },
    { id: "DOC-26-004", title: "Employment Contract (Umowa o Pracę)", client: "Oksana Koval", value: "—", status: "declined", sent: "May 20, 2026", expires: "Expired" }
  ]);

  const columns = [
    { header: "Document Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="file-text" size={16} color={row.status === "signed" ? "var(--color-success)" : "var(--dim)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Client / Signer", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.client}</span>
      </div>
    )},
    { header: "Contract Value", cell: (row) => <span style={{ fontWeight: 500 }}>{row.value}</span> },
    { header: "Signature Status", cell: (row) => {
      let color = "info";
      if (row.status === "signed") color = "success";
      if (row.status === "declined") color = "danger";
      if (row.status === "viewed") color = "warning";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Sent Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.sent}</span> },
    { header: "Expires", cell: (row) => (
      <span style={{ color: row.status === "declined" ? "var(--color-danger)" : "var(--dim)" }}>
        {row.expires}
      </span>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="eye" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="download" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>E-Signatures & Contracts</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Send documents for electronic signature, track views, and store secure PDFs.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="layout" size={16} /> Document Templates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="edit" size={16} /> Request Signature</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Successfully Signed (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>412</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Awaiting Signature</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>45</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Time to Sign</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>1.2 hrs</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search contracts by title, signer, or ID..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="archive" size={16} /> Vault</button>
        </div>
        <DataTable columns={columns} data={contracts} />
      </div>
    </div>
  );
}
