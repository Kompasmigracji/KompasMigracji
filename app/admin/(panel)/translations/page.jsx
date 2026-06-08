"use client";
/* KompasCRM — Sworn Translations (Tłumacz Przysięgły) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function TranslationsPage() {
  const [translations] = useState([
    { id: "TR-1042", document: "Birth Certificate (Свідоцтво про народження)", client: "Ivan Petrov", language: "UKR → POL", translator: "Anna K. (Sworn)", status: "in_progress", deadline: "Tomorrow, 12:00", cost: "120 PLN" },
    { id: "TR-1043", document: "Marriage Certificate", client: "Maria Garcia", language: "ESP → POL", translator: "Piotr N. (Sworn)", status: "pending", deadline: "June 10, 2026", cost: "Pending Quote" },
    { id: "TR-1044", document: "University Diploma", client: "Oleg V.", language: "RUS → POL", translator: "Anna K. (Sworn)", status: "completed", deadline: "Yesterday", cost: "150 PLN" },
    { id: "TR-1045", document: "Police Clearance Certificate", client: "Rajesh Kumar", language: "ENG → POL", translator: "Michal S. (Sworn)", status: "awaiting_payment", deadline: "June 15, 2026", cost: "200 PLN" }
  ]);

  const columns = [
    { header: "Document", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="file-text" size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.document}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id} • {row.client}</div>
        </div>
      </div>
    )},
    { header: "Language Pair", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: "12px", background: "var(--panel-2)", padding: "4px 8px", borderRadius: 4, display: "inline-block" }}>
        {row.language}
      </div>
    )},
    { header: "Translator", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="pen-tool" size={14} color="var(--dim)" />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.translator}</span>
      </div>
    )},
    { header: "Deadline", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: row.status === "in_progress" ? "var(--color-warning)" : "var(--fg)" }}>{row.deadline}</span> },
    { header: "Status", cell: (row) => {
      let color = "primary";
      let text = row.status.replace("_", " ").toUpperCase();
      if (row.status === "in_progress") color = "warning";
      if (row.status === "completed") color = "success";
      if (row.status === "awaiting_payment") color = "danger";
      return <Badge status={color} text={text} />;
    }},
    { header: "Cost", cell: (row) => <span style={{ fontWeight: 600 }}>{row.cost}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "completed" && (
          <button className="kc-btn kc-btn-ghost" title="Download Translated PDF"><Icon name="download" size={16} color="var(--color-success)" /></button>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="message-square" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Sworn Translations (Tłumaczenia Przysięgłe)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage document translations for residence permit applications.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Translators Directory</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Request</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>In Progress</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>14</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Translators are working on it.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Awaiting Payment</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>5</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Need client payment to proceed.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Ready for Submission</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>42</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Translated & stamped this month.</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by document, client name, or language..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Pending Quote</option>
          </select>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Languages</option>
            <option>UKR → POL</option>
            <option>RUS → POL</option>
            <option>ENG → POL</option>
            <option>ESP → POL</option>
          </select>
        </div>
        <DataTable columns={columns} data={translations} />
      </div>
    </div>
  );
}
