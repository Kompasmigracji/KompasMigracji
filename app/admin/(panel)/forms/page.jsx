"use client";
/* iPhoenixCRM — Forms & Surveys (Typeform / Google Forms style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function FormsPage() {
  const [forms] = useState([
    { id: "FRM-501", name: "Visa Application Questionnaire", type: "Client Intake", responses: 1240, conversion: "68%", status: "active", created: "Jan 10, 2026" },
    { id: "FRM-502", name: "Customer Satisfaction Survey (NPS)", type: "Survey", responses: 312, conversion: "45%", status: "active", created: "Mar 05, 2026" },
    { id: "FRM-503", name: "Partner Registration Form", type: "B2B Lead Gen", responses: 45, conversion: "12%", status: "active", created: "May 20, 2026" },
    { id: "FRM-504", name: "Old Job Application Form", type: "Recruitment", responses: 890, conversion: "85%", status: "archived", created: "Aug 15, 2025" }
  ]);

  const columns = [
    { header: "Form Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="check-square" size={16} color={row.status === "active" ? "var(--color-primary)" : "var(--dim)"} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Type", cell: (row) => <Badge status="info" text={row.type} /> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "archived") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Total Responses", cell: (row) => <span style={{ fontWeight: 600 }}>{row.responses.toLocaleString()}</span> },
    { header: "Conversion Rate", cell: (row) => (
      <span style={{ color: parseInt(row.conversion) > 50 ? "var(--color-success)" : "var(--color-warning)" }}>
        {row.conversion}
      </span>
    )},
    { header: "Created On", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.created}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="pie-chart" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="copy" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Forms & Surveys</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Build custom forms to collect client data, documents, and feedback.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="layout" size={16} /> Templates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Form</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Forms</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Responses (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>842</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Conversion Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>48%</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search forms by name or type..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Status</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="download" size={16} /> Export CSV</button>
        </div>
        <DataTable columns={columns} data={forms} />
      </div>
    </div>
  );
}
