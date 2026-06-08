"use client";
/* KompasCRM — Translation & Localization (Lokalise style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function LocalizationPage() {
  const [keys] = useState([
    { id: "msg_welcome", category: "Email Templates", en: "Welcome to iPhoenix!", ua: "Ласкаво просимо до iPhoenix!", pl: "Witamy w iPhoenix!", status: "translated", progress: 100 },
    { id: "btn_submit_docs", category: "Client Portal", en: "Submit Documents", ua: "Відправити Документи", pl: "Wyślij Dokumenty", status: "translated", progress: 100 },
    { id: "err_payment_failed", category: "Checkout", en: "Payment failed. Try again.", ua: "—", pl: "—", status: "missing", progress: 33 },
    { id: "trc_policy_update", category: "Legal Docs", en: "TRC policy has been updated.", ua: "Правила TRC оновлено.", pl: "Polityka TRC zaktualizowana.", status: "review_needed", progress: 100 }
  ]);

  const columns = [
    { header: "Translation Key", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Icon name="globe" size={16} color={row.progress === 100 ? "var(--color-primary)" : "var(--dim)"} />
        <div>
          <div style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "var(--text-sm)" }}>{row.id}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.category}</div>
        </div>
      </div>
    )},
    { header: "English (Base)", cell: (row) => <span style={{ color: "var(--fg)" }}>{row.en}</span> },
    { header: "Ukrainian (UA)", cell: (row) => (
      <span style={{ color: row.ua !== "—" ? "var(--fg)" : "var(--color-danger)" }}>{row.ua !== "—" ? row.ua : "Missing"}</span>
    )},
    { header: "Polish (PL)", cell: (row) => (
      <span style={{ color: row.pl !== "—" ? "var(--fg)" : "var(--color-danger)" }}>{row.pl !== "—" ? row.pl : "Missing"}</span>
    )},
    { header: "Completion", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: 100 }}>
        <div style={{ flex: 1, background: "var(--panel-2)", height: 6, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${row.progress}%`, height: "100%", background: row.progress === 100 ? "var(--color-success)" : "var(--color-warning)" }}></div>
        </div>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{row.progress}%</span>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "missing") color = "danger";
      if (row.status === "review_needed") color = "warning";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="cpu" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Localization & Translation</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Translate CRM, Client Portal, and Email Templates into multiple languages.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="cpu" size={16} /> Auto-Translate All</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Language</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Languages</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", display: "flex", gap: 8, alignItems: "center" }}>
            3 <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>(EN, UA, PL)</span>
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Global Translation Progress</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>84.5%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Missing Keys</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>142</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search translation keys or text..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Category</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="alert-circle" size={16} color="var(--color-danger)" /> Missing Only</button>
        </div>
        <DataTable columns={columns} data={keys} />
      </div>
    </div>
  );
}
