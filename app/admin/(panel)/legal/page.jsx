"use client";
/* iPhoenixCRM — Legal Case Management (Immigration / Visas) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function LegalCasesPage() {
  const [cases] = useState([
    { id: "CASE-2026-401", client: "Ivan Ivanov", type: "Karta Pobytu (Work)", urzad: "Warsaw", stage: "Documents Submitted", deadline: "Jul 15, 2026", status: "in-progress" },
    { id: "CASE-2026-402", client: "Elena Rostova", type: "National Visa D", urzad: "Consulate", stage: "Approved", deadline: "Completed", status: "success" },
    { id: "CASE-2026-403", client: "TechCorp Ltd", type: "B2B Work Permits (x10)", urzad: "Krakow", stage: "Awaiting Employer Signatures", deadline: "Jun 10, 2026", status: "blocked" },
    { id: "CASE-2026-404", client: "Dmytro Boyko", type: "Karta Polaka", urzad: "Lublin", stage: "Interview Scheduled", deadline: "Jun 18, 2026", status: "in-progress" }
  ]);

  const columns = [
    { header: "Case ID", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="briefcase" size={16} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.id}</span>
      </div>
    )},
    { header: "Client / Applicant", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.client}</span>
      </div>
    )},
    { header: "Case Type", cell: (row) => <span style={{ fontWeight: 500 }}>{row.type}</span> },
    { header: "Urząd (Authority)", cell: (row) => <span style={{ color: "var(--dim)" }}><Icon name="map-pin" size={12} /> {row.urzad}</span> },
    { header: "Pipeline Stage", cell: (row) => {
      let color = "info";
      if (row.stage === "Approved") color = "success";
      if (row.stage.includes("Awaiting")) color = "warning";
      return <Badge status={color} text={row.stage} />;
    }},
    { header: "Status", cell: (row) => {
      let color = "primary";
      if (row.status === "success") color = "success";
      if (row.status === "blocked") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Deadline", cell: (row) => (
      <span style={{ color: row.status === "blocked" ? "var(--color-danger)" : "var(--dim)", fontWeight: row.status === "blocked" ? 600 : 400 }}>
        {row.deadline}
      </span>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="folder" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Legal & Visas (Cases)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage immigration cases, residence permits, and track Urząd deadlines.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Deadlines</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Open New Case</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Cases</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Action Required / Blocked</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>18</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Successfully Closed (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>45</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search cases by client, case ID, or Urząd location..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Case Type</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="trello" size={16} /> Board</button>
        </div>
        <DataTable columns={columns} data={cases} />
      </div>
    </div>
  );
}
