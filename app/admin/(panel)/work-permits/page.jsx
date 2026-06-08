"use client";
/* iPhoenixCRM — Work Permits & Legalizations Tracker (Oświadczenia i Zezwolenia) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function WorkPermitsPage() {
  const [activeTab, setActiveTab] = useState("permits"); // permits, submissions, alerts
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);

  const [permits, setPermits] = useState([
    { id: "WRK-001", foreigner: "Dmytro Kovalenko", employer: "BudMax Sp. z o.o.", type: "Oświadczenie", registered: "Jan 15, 2025", expires: "Jan 14, 2027", daysLeft: 220, status: "active", specialist: "Oleg V." },
    { id: "WRK-002", foreigner: "Ivan Petrov", employer: "LogisTrans Sp. z o.o.", type: "Zezwolenie Typ A", registered: "Mar 10, 2024", expires: "Mar 09, 2027", daysLeft: 274, status: "active", specialist: "Maria Garcia" },
    { id: "WRK-003", foreigner: "Anna Schmidt", employer: "KompIT Sp. z o.o.", type: "Zezwolenie Typ A", registered: "Jul 01, 2023", expires: "Jun 30, 2026", daysLeft: 22, status: "expiring", specialist: "Alex Jenkins" },
    { id: "WRK-004", foreigner: "Oleksandr Lysenko", employer: "BudMax Sp. z o.o.", type: "Oświadczenie", registered: "May 20, 2024", expires: "May 19, 2026", daysLeft: -20, status: "expired", specialist: "Oleg V." }
  ]);

  const [submissions] = useState([
    { id: "SUB-801", foreigner: "Vasyl Shvets", employer: "UberPartner Sp. z o.o.", type: "Oświadczenie", pup: "PUP Warszawa", submittedDate: "Yesterday", status: "submitted" },
    { id: "SUB-802", foreigner: "Olena Kravets", employer: "Horeca Group", type: "Zezwolenie Typ A", pup: "MUW Warszawa", submittedDate: "Jun 01, 2026", status: "processing" }
  ]);

  const columns = [
    { header: "ID", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "Foreigner", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.foreigner} size={24} />
        <span style={{ fontWeight: 550 }}>{row.foreigner}</span>
      </div>
    )},
    { header: "Employer & Type", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.employer}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type}</div>
      </div>
    )},
    { header: "Registered / Expires", cell: (row) => (
      <div>
        <div style={{ fontSize: "var(--text-sm)" }}>{row.expires}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Reg: {row.registered}</div>
      </div>
    )},
    { header: "Days Left", cell: (row) => {
      const isExpired = row.daysLeft < 0;
      const isExpiring = row.daysLeft >= 0 && row.daysLeft <= 30;
      return (
        <span style={{ 
          fontWeight: 700, 
          color: isExpired ? "var(--color-danger)" : isExpiring ? "var(--color-warning)" : "var(--color-success)" 
        }}>
          {isExpired ? `EXPIRED (${Math.abs(row.daysLeft)}d ago)` : `${row.daysLeft} days`}
        </span>
      );
    }},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "expiring") color = "warning";
      if (row.status === "expired") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Specialist", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.specialist}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status !== "active" && (
          <button 
            className="kc-btn kc-btn-ghost" 
            style={{ color: "var(--color-warning)" }}
            onClick={() => {
              setSelectedPermit(row);
              setShowNotifyModal(true);
            }}
            title="Send Expiry Alert to Employer"
          >
            <Icon name="alert-triangle" size={16} />
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
          <h2 className="kc-h2" style={{ margin: 0 }}>Work Permits & Legalizations</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor expiration dates for Oświadczenia, Zezwolenia typ A, and Single Permits. Manage Powiatowy Urząd Pracy filings.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary">
          <Icon name="plus" size={16} /> Register New Permit
        </button>
      </div>

      {/* KPI Stats */}
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Permits</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>85</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Expiring (&lt; 30 days)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>4</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Expired Permits</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>1</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("permits")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "permits" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "permits" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "permits" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="folder" size={16} /> Permit Registry
        </button>
        <button 
          onClick={() => setActiveTab("submissions")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "submissions" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "submissions" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "submissions" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="plus" size={16} /> Submissions Queue
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "permits" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <DataTable columns={columns} data={permits} />
        </div>
      )}

      {activeTab === "submissions" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Foreigner</th>
                <th style={{ padding: "12px" }}>Employer & Type</th>
                <th style={{ padding: "12px" }}>Urząd (PUP/Wojewoda)</th>
                <th style={{ padding: "12px" }}>Submitted Date</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{s.foreigner}</td>
                  <td style={{ padding: "12px" }}>{s.employer} ({s.type})</td>
                  <td style={{ padding: "12px" }}>{s.pup}</td>
                  <td style={{ padding: "12px" }}>{s.submittedDate}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge status={s.status === "submitted" ? "info" : "warning"} text={s.status.toUpperCase()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifyModal && selectedPermit && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="kc-card" style={{ maxWidth: "450px", width: "90%" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0" }}>Send Expiry Alert</h3>
            <p style={{ fontSize: "var(--text-sm)", margin: "0 0 var(--space-md) 0" }}>
              Draft warning email to the employer <strong>{selectedPermit.employer}</strong> regarding <strong>{selectedPermit.foreigner}</strong>'s work permit:
            </p>

            <div style={{ padding: "12px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "var(--text-xs)", marginBottom: "var(--space-md)", lineHeight: "1.5" }}>
              <strong>Subject:</strong> Ostrzeżenie: Wygaśnięcie zezwolenia na pracę - {selectedPermit.foreigner}
              <br/><br/>
              Szanowni Państwo,
              <br/><br/>
              Informujemy, że zezwolenie na pracę ({selectedPermit.type}) dla pracownika <strong>{selectedPermit.foreigner}</strong> wygasa w dniu <strong>{selectedPermit.expires}</strong> (za {selectedPermit.daysLeft} dni). 
              <br/><br/>
              W celu zapewnienia ciągłości legalnego zatrudnienia, zalecamy natychmiastowe złożenie nowego wniosku.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-secondary" onClick={() => setShowNotifyModal(false)}>Cancel</button>
              <button className="kc-btn kc-btn-primary" onClick={() => {
                alert("Expiry notification sent to employer via email & SMS!");
                setShowNotifyModal(false);
              }}>
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
