"use client";
/* KompasCRM — Multi-Currency & FX Rates */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function CurrenciesPage() {
  const [currencies] = useState([]);

  const columns = [
    { header: "Currency", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--color-primary)" }}>
          {row.symbol}
        </div>
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {row.code}
            {row.isBase && <Badge status="primary" text="BASE" />}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.name}</div>
        </div>
      </div>
    )},
    { header: "Exchange Rate (vs Base)", cell: (row) => (
      <div style={{ fontFamily: "monospace", fontSize: "var(--text-sm)", color: "var(--fg)" }}>
        {row.isBase ? "1.0000" : row.rate}
      </div>
    )},
    { header: "Last Synced", cell: (row) => (
      <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.lastSync}</span>
    )},
    { header: "Status", cell: (row) => <Badge status={row.status === "active" ? "success" : "default"} text={row.status.toUpperCase()} /> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {!row.isBase && <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>}
        <button className="kc-btn kc-btn-ghost"><Icon name={row.status === "active" ? "toggle-right" : "toggle-left"} size={16} color={row.status === "active" ? "var(--color-success)" : "var(--dim)"} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Currencies & FX Rates</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage the currencies you accept and automatically sync exchange rates.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="refresh-cw" size={16} /> Sync Rates Now</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Currency</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Base Accounting Currency</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--color-primary)" }}>€</span> EUR
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 8 }}>All reports are converted to EUR.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Currencies</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>4</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 8 }}>EUR, PLN, USD, UAH</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Rate Provider</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--fg)" }}>European Central Bank</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 8 }}>Auto-syncs every 12 hours.</div>
        </div>
      </div>

      {/* Manual Rate Override Simulation */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--panel-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="alert-triangle" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>Custom Exchange Rate Active</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>UAH is currently locked to a manual rate of <strong style={{ color: "var(--fg)" }}>43.2050</strong>. It will not auto-update.</div>
          </div>
        </div>
        <button className="kc-btn kc-btn-secondary">Unlock & Auto-Sync</button>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search currency code or name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Active Only</button>
        </div>
        <DataTable columns={columns} data={currencies} />
      </div>
    </div>
  );
}
