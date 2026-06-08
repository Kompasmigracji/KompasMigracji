"use client";
/* iPhoenixCRM — Dynamic Forms & Surveys (Typeform style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function FormsPage() {
  const [forms] = useState([
    { id: "form_1", name: "Website Lead Capture", status: "active", views: 1250, submissions: 142, conversion: "11.3%", updated: "3 days ago" },
    { id: "form_2", name: "Customer Satisfaction Survey (NPS)", status: "active", views: 300, submissions: 120, conversion: "40.0%", updated: "1 week ago" },
    { id: "form_3", name: "Job Application - Sales Rep", status: "draft", views: 0, submissions: 0, conversion: "0%", updated: "Just now" }
  ]);

  const columns = [
    { header: "Form Name", cell: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { header: "Status", cell: (row) => <Badge status={row.status === "active" ? "success" : "warning"} text={row.status.toUpperCase()} /> },
    { header: "Views", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.views.toLocaleString()}</span> },
    { header: "Submissions", cell: (row) => <span style={{ fontWeight: 600, color: "var(--fg)" }}>{row.submissions}</span> },
    { header: "Conversion", cell: (row) => <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>{row.conversion}</span> },
    { header: "Last Edited", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.updated}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="share-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Forms & Surveys</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Build custom web forms, capture leads, and collect customer feedback.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Form</button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        {/* Left: Forms Table */}
        <div className="kc-card" style={{ flex: 2, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
            <Icon name="layout" size={18} color="var(--dim)" />
            <h3 className="kc-h3" style={{ margin: 0, fontSize: "var(--text-sm)" }}>Your Forms</h3>
          </div>
          <DataTable columns={columns} data={forms} />
        </div>

        {/* Right: Quick Builder CTA */}
        <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column", background: "color-mix(in srgb, var(--color-primary) 5%, var(--panel))" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: "var(--space-md)" }}>
            <Icon name="zap" size={24} />
          </div>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-md)", marginBottom: "var(--space-sm)" }}>Need a form fast?</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: "var(--space-md)", lineHeight: 1.5 }}>
            Use our AI Assistant to generate a complete form with validation rules and notification webhooks in just 5 seconds.
          </p>
          <button className="kc-btn kc-btn-secondary" style={{ marginTop: "auto", justifyContent: "center" }}>
            <Icon name="cpu" size={16} /> Generate with AI
          </button>
        </div>
      </div>
    </div>
  );
}
