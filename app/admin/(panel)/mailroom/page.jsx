"use client";
/* KompasCRM — Virtual Office & Mailroom Coordinator (Poczta i Wirtualne Biuro) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function MailroomPage() {
  const [activeTab, setActiveTab] = useState("letters"); // letters, companies, alerts
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const [letters, setLetters] = useState([]);

  const [companies] = useState([]);

  const columns = [
    { header: "Letter ID", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "Recipient (Client)", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontWeight: 550 }}>{row.client}</span>
      </div>
    )},
    { header: "Sender & Type", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.sender}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type}</div>
      </div>
    )},
    { header: "Received & Tracking", cell: (row) => (
      <div>
        <div>{row.received}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>N: {row.trackingNo}</div>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "info";
      if (row.status === "unread") color = "warning";
      if (row.status === "forwarded") color = "success";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Attachment", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)", cursor: "pointer", fontSize: "12px" }}>
        <Icon name="file-text" size={14} />
        <span style={{ textDecoration: "underline" }}>{row.file}</span>
      </div>
    )},
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "unread" && (
          <button 
            className="kc-btn kc-btn-ghost" 
            style={{ color: "var(--color-primary)" }}
            onClick={() => {
              setSelectedLetter(row);
              setShowNotifyModal(true);
            }}
            title="Notify Client of New Mail"
          >
            <Icon name="send" size={16} />
          </button>
        )}
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Virtual Office & Mailroom</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage incoming letters and registered mail. Scan legal documents, upload PDFs, and dispatch instant notifications to clients.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary">
          <Icon name="plus" size={16} /> Log Incoming Letter
        </button>
      </div>

      {/* KPI stats */}
      <div className="kc-grid kc-grid-3" style={{ marginBottom: "var(--space-lg)" }}>
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(229,168,75,0.1)" }}>
              <Icon name="mail" size={18} color="var(--color-warning)" />
            </div>
            <Badge status="brass" text="Action" />
          </div>
          <div className="kc-stat-val">{letters.filter(l => l.status === "unread").length}</div>
          <div className="kc-stat-lbl">Unread Mail Alerts</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="briefcase" size={18} color="var(--color-primary)" />
            </div>
            <Badge status="blue" text="Offices" />
          </div>
          <div className="kc-stat-val">48</div>
          <div className="kc-stat-lbl">Connected Office Contracts</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="check" size={18} color="var(--color-success)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success)" }}>Good</span>
          </div>
          <div className="kc-stat-val">241</div>
          <div className="kc-stat-lbl">Scans Dispatched (Month)</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        <button 
          onClick={() => setActiveTab("letters")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "letters" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "letters" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "letters" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
        >
          <Icon name="mail" size={16} /> Mailbox Logs
        </button>
        <button 
          onClick={() => setActiveTab("companies")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "companies" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "companies" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "companies" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
        >
          <Icon name="briefcase" size={16} /> Virtual Office Subscriptions
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "letters" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <DataTable columns={columns} data={letters} />
        </div>
      )}

      {activeTab === "companies" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Company / Client Name</th>
                <th style={{ padding: "12px" }}>Office Package</th>
                <th style={{ padding: "12px" }}>Mail Handling Rule</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "12px" }}>{c.package}</td>
                  <td style={{ padding: "12px" }}>{c.mailForwarding}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge status="success" text={c.status.toUpperCase()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notification Dispatch Modal */}
      {showNotifyModal && selectedLetter && (
        <div className="kc-modal-bg" onClick={() => setShowNotifyModal(false)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Dispatch Mail Alert</h3>
              <button onClick={() => setShowNotifyModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>
            <p style={{ fontSize: "var(--text-sm)", margin: "0 0 var(--space-md) 0", color: "var(--dim)" }}>
              Alert client <strong>{selectedLetter.client}</strong> about incoming letter from <strong>{selectedLetter.sender}</strong>:
            </p>

            <div style={{ padding: "12px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "var(--text-xs)", marginBottom: "var(--space-md)", lineHeight: "1.5" }}>
              <strong>Telegram Auto-message:</strong>
              <br/>
              Otrzymaliśmy dla Ciebie nową pocztę od: <strong>{selectedLetter.sender}</strong>.
              Typ przesyłki: {selectedLetter.type}. Scan został dodany do Twojego panelu klienta.
              Pobierz PDF: {selectedLetter.file}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn" onClick={() => setShowNotifyModal(false)}>Cancel</button>
              <button className="kc-btn kc-btn-primary" onClick={() => {
                alert("Notification successfully sent to client via Telegram and Email!");
                const updated = letters.map(l => l.id === selectedLetter.id ? { ...l, status: "forwarded" } : l);
                setLetters(updated);
                setShowNotifyModal(false);
              }}>
                Send Scan Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
