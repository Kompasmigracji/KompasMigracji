"use client";
/* iPhoenixCRM — Custom Fields & Object Builder (Salesforce style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function CustomFieldsPage() {
  const [fields] = useState([
    { id: "FLD-11", name: "Visa Expiry Date", entity: "Contact", type: "Date", required: true, displayInList: true },
    { id: "FLD-12", name: "TRC Application Status", entity: "Deal", type: "Dropdown", required: true, displayInList: true },
    { id: "FLD-13", name: "Passport Number", entity: "Contact", type: "Text (Encrypted)", required: false, displayInList: false },
    { id: "FLD-14", name: "B2B Contract Link", entity: "Account", type: "URL", required: false, displayInList: true },
    { id: "FLD-15", name: "Estimated Monthly Salary", entity: "Lead", type: "Currency", required: false, displayInList: false }
  ]);

  const columns = [
    { header: "Field Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="tag" size={16} color="var(--dim)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Entity", cell: (row) => <Badge status="info" text={row.entity} /> },
    { header: "Data Type", cell: (row) => (
      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--dim)" }}>
        <Icon name={row.type === "Date" ? "calendar" : row.type === "Currency" ? "dollar-sign" : row.type === "URL" ? "link" : "type"} size={14} />
        {row.type}
      </span>
    )},
    { header: "Required", cell: (row) => (
      <Icon name={row.required ? "check-circle" : "minus"} size={16} color={row.required ? "var(--color-danger)" : "var(--dim)"} />
    )},
    { header: "Visible in Lists", cell: (row) => (
      <Icon name={row.displayInList ? "eye" : "eye-off"} size={16} color={row.displayInList ? "var(--color-primary)" : "var(--dim)"} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="trash-2" size={16} color="var(--color-danger)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Custom Fields & Objects</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Extend your CRM by adding custom data fields to Leads, Contacts, Accounts, and Deals.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="layout" size={16} /> Layout Builder</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Field</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Contact Entity</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>24 Fields</div>
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="briefcase" size={20} color="var(--color-success)" />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Account Entity</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>18 Fields</div>
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="target" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Deal Entity</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>12 Fields</div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search custom fields..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Entity Filter</button>
        </div>
        <DataTable columns={columns} data={fields} />
      </div>
    </div>
  );
}
