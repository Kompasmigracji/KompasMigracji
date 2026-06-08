"use client";
/* KompasCRM — Data Import & Migration */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function DataImportPage() {
  const [history] = useState([
    { id: "IMP-01", file: "hubspot_contacts_export.csv", entity: "Contacts", rows: 1450, success: 1448, failed: 2, date: "10 mins ago", type: "Import" },
    { id: "EXP-02", file: "full_crm_backup_2026.zip", entity: "All Data", rows: 8402, success: 8402, failed: 0, date: "Yesterday", type: "Export" },
    { id: "IMP-03", file: "pipedrive_deals.xlsx", entity: "Deals", rows: 320, success: 320, failed: 0, date: "May 15, 2026", type: "Import" }
  ]);

  const columns = [
    { header: "Operation / File", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: row.type === "Import" ? "rgba(16, 185, 129, 0.1)" : "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.type === "Import" ? "download-cloud" : "upload-cloud"} size={18} color={row.type === "Import" ? "var(--color-success)" : "var(--color-primary)"} />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.file}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type} • {row.id}</div>
        </div>
      </div>
    )},
    { header: "Target Entity", cell: (row) => <Badge status="default" text={row.entity} /> },
    { header: "Rows Processed", cell: (row) => <span style={{ fontWeight: 600 }}>{row.rows.toLocaleString()}</span> },
    { header: "Result", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "var(--color-success)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="check-circle" size={14} /> {row.success}</span>
        {row.failed > 0 && <span style={{ color: "var(--color-danger)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="alert-triangle" size={14} /> {row.failed}</span>}
      </div>
    )},
    { header: "Date", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.failed > 0 && <button className="kc-btn kc-btn-ghost" style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)" }}>Download Errors</button>}
        <button className="kc-btn kc-btn-ghost"><Icon name="eye" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Data Import & Export</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Migrate from Excel, HubSpot, or Pipedrive. Download weekly database backups.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="upload" size={16} /> Export Backup</button>
        </div>
      </div>

      {/* Import Wizard Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", padding: 0, overflow: "hidden", border: "2px dashed var(--color-primary)" }}>
        <div style={{ padding: "var(--space-xl)", textAlign: "center", background: "rgba(139, 92, 246, 0.05)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-md)" }}>
            <Icon name="file-plus" size={32} color="white" />
          </div>
          <h3 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--text-lg)" }}>Upload CSV or Excel File</h3>
          <p style={{ color: "var(--dim)", marginBottom: "var(--space-md)" }}>Max file size: 50MB. Auto-mapping available for HubSpot and Pipedrive exports.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)" }}>
            <button className="kc-btn kc-btn-primary"><Icon name="folder" size={16} /> Browse Files</button>
            <button className="kc-btn kc-btn-secondary">Download Template CSV</button>
          </div>
        </div>

        {/* Active Mapping Simulation */}
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--panel)", padding: "var(--space-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-success)", fontWeight: 600 }}>
              <Icon name="check-circle" size={20} /> File Uploaded: "new_leads_june.csv" (420 rows)
            </div>
            <Badge status="info" text="Step 2: Column Mapping" />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: "var(--space-md)", alignItems: "center", background: "var(--bg)", padding: "var(--space-md)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4, fontWeight: 600 }}>CSV Column (Your File)</div>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <Badge status="default" text="First Name" />
                <Badge status="default" text="Last Name" />
                <Badge status="default" text="Email Address" />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Icon name="arrow-right" size={20} color="var(--dim)" />
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4, fontWeight: 600 }}>CRM Field (Kompas)</div>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <Badge status="success" text="Contact -> First Name" />
                <Badge status="success" text="Contact -> Last Name" />
                <Badge status="success" text="Contact -> Email" />
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--color-primary)", cursor: "pointer" }} /> Skip duplicates based on Email
            </div>
            <button className="kc-btn kc-btn-primary">Start Import (420 Rows)</button>
          </div>
        </div>
      </div>

      {/* History */}
      <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)" }}>Import & Export History</h3>
      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <DataTable columns={columns} data={history} />
      </div>
    </div>
  );
}
