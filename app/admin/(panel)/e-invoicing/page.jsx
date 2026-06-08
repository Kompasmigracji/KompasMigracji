"use client";
/* KompasCRM — KSeF E-Invoicing & Tax Compliance */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, SearchInput } from "@/components/admin/ui";

export default function EInvoicingPage() {
  const [invoices] = useState([
    { id: "INV-2026-06-12", client: "TechCorp Sp. z.o.o.", amount: "€1,200.00", tax: "23% VAT", ksefStatus: "Accepted by KSeF", ksefId: "73291882...A1B2", date: "Today, 10:15", paymentStatus: "Paid" },
    { id: "INV-2026-06-13", client: "Ivan Petrov", amount: "€300.00", tax: "Exempt (ZW)", ksefStatus: "Processing...", ksefId: "Pending", date: "Today, 11:30", paymentStatus: "Unpaid" },
    { id: "INV-2026-06-14", client: "Rent-PL Real Estate", amount: "€240.00", tax: "23% VAT", ksefStatus: "Error / Rejected", ksefId: "—", date: "Yesterday", paymentStatus: "Unpaid" },
    { id: "INV-2026-05-89", client: "Global IT Group", amount: "€1,200.00", tax: "23% VAT", ksefStatus: "Accepted by KSeF", ksefId: "89912003...C4D5", date: "May 31, 2026", paymentStatus: "Paid" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");

  // AI E-Invoicing logs
  const [invoiceLogs, setInvoiceLogs] = useState([
    { time: "14:30:15", type: "system", message: "President key verified on Ministry of Finance sandbox portal." },
    { time: "14:28:44", type: "coordinator", message: "Invoicing Coordinator [Agent-C04] batched 12 signed invoices to production gate." },
    { time: "14:25:12", type: "agent", message: "XML Validator Agent-039 generated FA-2 schema structure for INV-2026-06-13." },
    { time: "14:20:00", type: "system", message: "KompasCRM KSeF Dispatcher Network online (175 automated agents active)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-077 transmitted signed XML packet to KSeF server. Code: 200 OK." },
      { type: "agent", text: "Agent-102 verified NIP number database check for TechCorp Sp. z.o.o." },
      { type: "coordinator", text: "Coordinator [Agent-C12] auto-resolved validation discrepancy in TAX rate code for Rent-PL." },
      { type: "system", text: "President digital encryption layer checked. UPO certificate received." },
      { type: "agent", text: "Agent-154 calculated exchange rate for EUR invoices matching National Bank of Poland (NBP)." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setInvoiceLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

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
      let color = "brass";
      if (row.ksefStatus.includes("Accepted")) color = "green";
      if (row.ksefStatus.includes("Error")) color = "red";
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
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px", background: "var(--color-danger)", border: "none" }}>Виправити</button>
        ) : (
          <>
            <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>
              <Icon name="download" size={14} /> PDF
            </button>
          </>
        )}
      </div>
    )}
  ];

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.ksefStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Е-Інвойсинг (KSeF Integration)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Генерація та валідація структурованих податкових інвойсів для надсилання до державної системи KSeF.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="shield" size={16} /> Налаштування Токену KSeF</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Новий Інвойс</button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-sm)", flexShrink: 0, flexWrap: "wrap" }}>
        {/* Gov API Connection */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-lg)", background: "linear-gradient(135deg, var(--panel) 0%, rgba(59, 130, 246, 0.05) 100%)", border: "1px solid var(--color-primary)", minWidth: 250 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="activity" size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 700 }}>Державний Шлюз API</div>
            <div style={{ fontSize: "14px", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)" }}></div>
              KSeF Production API Online
            </div>
          </div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)", minWidth: 150 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Надіслано (Цей місяць)</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>214</div>
        </div>
        
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)", minWidth: 150 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Помилки валідації</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)" }}>
        <button onClick={() => setActiveTab("invoices")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "invoices" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "invoices" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="file-text" size={16} /> Реєстр Інвойсів
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="cpu" size={16} /> AI KSeF Gate Logs
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 300 }}>
        {activeTab === "invoices" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Пошук інвойсів за номером, клієнтом чи статусом..." />
            <DataTable columns={columns} data={filteredInvoices} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи трансляцій KSeF шлюзу</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {invoiceLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
                    <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
