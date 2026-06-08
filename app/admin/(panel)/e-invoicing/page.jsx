"use client";
/* iPhoenixCRM — KSeF E-Invoicing & Tax Compliance */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function EInvoicingPage() {
  const [invoices] = useState([
    { id: "INV-2026-06-12", client: "TechCorp Sp. z.o.o.", amount: "€1,200.00", tax: "23% VAT", ksefStatus: "Accepted by KSeF", ksefId: "73291882...A1B2", date: "Today, 10:15", paymentStatus: "Paid" },
    { id: "INV-2026-06-13", client: "Ivan Petrov", amount: "€300.00", tax: "Exempt (ZW)", ksefStatus: "Processing...", ksefId: "Pending", date: "Today, 11:30", paymentStatus: "Unpaid" },
    { id: "INV-2026-06-14", client: "Rent-PL Real Estate", amount: "€240.00", tax: "23% VAT", ksefStatus: "Error / Rejected", ksefId: "—", date: "Yesterday", paymentStatus: "Unpaid" },
    { id: "INV-2026-05-89", client: "Global IT Group", amount: "€1,200.00", tax: "23% VAT", ksefStatus: "Accepted by KSeF", ksefId: "89912003...C4D5", date: "May 31, 2026", paymentStatus: "Paid" }
  ]);

  const columns = [
    { header: "Invoice Number", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="file-text" size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.id}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.date}</div>
        </div>
      </div>
    )},
    { header: "Client (NIP)", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "var(--text-sm)" }}>{row.client}</span>
      </div>
    )},
    { header: "Amount & Tax", cell: (row) => (
      <div>
        <div style={{ fontWeight: 700, fontSize: "14px" }}>{row.amount}</div>
        <div style={{ fontSize: "11px", color: "var(--dim)" }}>{row.tax}</div>
      </div>
    )},
    { header: "KSeF Status", cell: (row) => {
      let color = "warning";
      if (row.ksefStatus.includes("Accepted")) color = "success";
      if (row.ksefStatus.includes("Error")) color = "danger";
      return (
        <div>
          <Badge status={color} text={row.ksefStatus} />
          {row.ksefId !== "—" && row.ksefId !== "Pending" && (
            <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4, fontFamily: "monospace" }}>ID: {row.ksefId}</div>
          )}
        </div>
      );
    }},
    { header: "Payment Status", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.paymentStatus === "Paid" ? "var(--color-success)" : "var(--color-warning)" }}>
        {row.paymentStatus}
      </span>
    )},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.ksefStatus.includes("Error") ? (
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px", background: "var(--color-danger)", border: "none" }}>Fix Errors</button>
        ) : (
          <>
            <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>
              <Icon name="download" size={14} /> PDF
            </button>
            <button className="kc-btn kc-btn-ghost"><Icon name="send" size={16} /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>E-Invoicing & KSeF Integration</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Generate fully compliant electronic invoices for the Polish Ministry of Finance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="shield" size={16} /> KSeF Token Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Invoice</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* API Status Card */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-lg)", background: "linear-gradient(135deg, var(--panel) 0%, rgba(59, 130, 246, 0.05) 100%)", border: "1px solid var(--color-primary)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="activity" size={32} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Gov API Connection</div>
            <div style={{ fontSize: "16px", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: "var(--color-success)" }}></div>
              KSeF Production API Online
            </div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: 4 }}>Last ping: 2 seconds ago</div>
          </div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Successfully Sent (This Month)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>214</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Invoices accepted by the Ministry.</div>
        </div>
        
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Rejected by KSeF</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Validation errors require your attention!</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by Invoice Number, KSeF ID, or Client NIP..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All KSeF Statuses</option>
            <option>Accepted</option>
            <option>Processing</option>
            <option>Rejected</option>
          </select>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Payments</option>
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={invoices} />
        </div>
      </div>
    </div>
  );
}
