"use client";
/* KompasCRM — Document OCR & AI Parsing */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function OCRPage() {
  const [documents] = useState([
    { id: "DOC-901", type: "Passport (UA)", client: "Ivan Ivanov", date: "10 mins ago", confidence: "98%", status: "processed" },
    { id: "DOC-902", type: "KRS Extract (PL)", client: "TechCorp Ltd", date: "1 hour ago", confidence: "92%", status: "processed" },
    { id: "DOC-903", type: "ZUS Certificate", client: "Elena Rostova", date: "3 hours ago", confidence: "64%", status: "needs_review" },
    { id: "DOC-904", type: "ID Card (BY)", client: "Oleg V.", date: "Yesterday", confidence: "—", status: "processing" },
    { id: "DOC-905", type: "Bank Statement", client: "Anna Smirnova", date: "Yesterday", confidence: "12%", status: "failed" }
  ]);

  const columns = [
    { header: "Document Type", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="file-text" size={18} color={row.status === "processed" ? "var(--color-primary)" : "var(--dim)"} />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.type}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Linked Client / Entity", cell: (row) => <span style={{ fontWeight: 500 }}>{row.client}</span> },
    { header: "AI Confidence", cell: (row) => (
      <span style={{ 
        fontWeight: 600, 
        color: parseInt(row.confidence) > 90 ? "var(--color-success)" : parseInt(row.confidence) > 50 ? "var(--color-warning)" : "var(--color-danger)" 
      }}>
        {row.confidence}
      </span>
    )},
    { header: "Uploaded", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "needs_review") color = "warning";
      if (row.status === "processing") color = "info";
      if (row.status === "failed") color = "danger";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="maximize-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="check-square" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>AI Document Parsing (OCR)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Automatically extract data from passports, visas, and company records.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Parser Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="upload-cloud" size={16} /> Upload Document</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Documents Scanned (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>1,204</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Awaiting Manual Review</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>12</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg. Parsing Time</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>2.4s</div>
        </div>
      </div>

      {/* Manual Review Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", gap: "var(--space-lg)", border: "1px solid var(--color-warning)", background: "rgba(245, 158, 11, 0.05)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-md)", color: "var(--color-warning)", fontWeight: 600 }}>
            <Icon name="alert-circle" size={20} /> Action Required: Review Extraction
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "block", marginBottom: 4 }}>Extracted Name</label>
              <input type="text" className="kc-input" defaultValue="Elena ROSTQVA" style={{ border: "1px solid var(--color-warning)" }} />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "block", marginBottom: 4 }}>Passport Number</label>
              <input type="text" className="kc-input" defaultValue="FB 120442" />
            </div>
          </div>
          <div style={{ marginTop: "var(--space-md)", display: "flex", gap: 8 }}>
            <button className="kc-btn kc-btn-primary" style={{ background: "var(--color-warning)", color: "#000" }}>Confirm Data</button>
            <button className="kc-btn kc-btn-ghost">Reject</button>
          </div>
        </div>
        <div style={{ width: 300, height: 160, background: "var(--panel-2)", borderRadius: 8, border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
          [ Passport Scan Preview ]
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by document ID or client name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Document Type</button>
        </div>
        <DataTable columns={columns} data={documents} />
      </div>
    </div>
  );
}
