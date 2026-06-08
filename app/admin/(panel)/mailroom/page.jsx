"use client";
/* iPhoenixCRM — Virtual Office & Mailroom Coordinator (Poczta i Wirtualne Biuro) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function MailroomPage() {
  const [activeTab, setActiveTab] = useState("letters"); // letters, companies, alerts
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const [letters, setLetters] = useState([
    { id: "LTR-901", client: "TechCorp Sp. z o.o.", sender: "Mazowiecki Urząd Wojewódzki", type: "Zezwolenie Typ A (Decision)", received: "Today, 09:30", trackingNo: "EPO 8493021", status: "unread", file: "MUW_decision_BudMax.pdf" },
    { id: "LTR-902", client: "Dmytro Kovalenko", sender: "Urząd Skarbowy Warszawa-Śródmieście", type: "Tax Statement (Wezwanie)", received: "Yesterday", trackingNo: "R 2049182", status: "scanned", file: "US_Wezwanie_Kovalenko.pdf" },
    { id: "LTR-903", client: "Anna Schmidt", sender: "ZUS (Social Security)", type: "Annual Settlement", received: "June 02, 2026", trackingNo: "Standard", status: "forwarded", file: "ZUS_Declaration.pdf" },
    { id: "LTR-904", client: "Kamil Nowak", sender: "Sąd Rejonowy dla m.st. Warszawy", type: "KRS Registry letter", received: "May 28, 2026", trackingNo: "EPO 7204911", status: "unread", file: "Court_KRS_Nowak.pdf" }
  ]);

  const [companies] = useState([
    { id: "VOB-01", name: "TechCorp Sp. z o.o.", package: "Premium Office", mailForwarding: "Email Scan + Weekly Physical Post", status: "active" },
    { id: "VOB-02", name: "Global Delivery Group", package: "Standard Address", mailForwarding: "Monthly Physical Post", status: "active" },
    { id: "VOB-03", name: "Ivan Petrov Freelance", package: "Basic Scan Only", mailForwarding: "Immediate Email Scan", status: "active" }
  ]);

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
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Unread Mail Alerts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>
            {letters.filter(l => l.status === "unread").length}
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Connected Office Contracts</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>48</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Scans Dispatched (Month)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>241</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("letters")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "letters" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "letters" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "letters" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="mail" size={16} /> Mailbox Logs
        </button>
        <button 
          onClick={() => setActiveTab("companies")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "companies" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "companies" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "companies" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
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
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="kc-card" style={{ maxWidth: "450px", width: "90%" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0" }}>Dispatch Mail Alert</h3>
            <p style={{ fontSize: "var(--text-sm)", margin: "0 0 var(--space-md) 0" }}>
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
              <button className="kc-btn kc-btn-secondary" onClick={() => setShowNotifyModal(false)}>Cancel</button>
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
