"use client";
/* iPhoenixCRM — Legal Appeals & Litigation Tracker */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function LitigationPage() {
  const [activeTab, setActiveTab] = useState("appeals"); // appeals, hearings, templates
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [appeals, setAppeals] = useState([
    { id: "APP-001", client: "Dmytro Kovalenko", type: "Appeal to Szef Urzędu", authority: "Mazowiecki Urząd Wojewódzki", deadline: "Today, 17:00", status: "draft", lawyer: "Oleg V." },
    { id: "APP-002", client: "Kamil Nowak", type: "WSA Court Complaint", authority: "WSA w Warszawie", deadline: "June 15, 2026", status: "filed", lawyer: "Maria Garcia" },
    { id: "APP-003", client: "Elena Rostova", type: "Urząd Reconsideration", authority: "Małopolski Urząd Wojewódzki", deadline: "June 20, 2026", status: "waiting", lawyer: "Alex Jenkins" },
    { id: "APP-004", client: "Ivan Petrov", type: "Appeal to Szef Urzędu", authority: "Dolnośląski Urząd Wojewódzki", deadline: "Completed", status: "won", lawyer: "Oleg V." }
  ]);

  const [hearings] = useState([
    { id: "HRG-102", client: "Kamil Nowak", court: "WSA w Warszawie, Room 12", date: "June 18, 2026", time: "11:30 AM", status: "scheduled", lawyer: "Maria Garcia" },
    { id: "HRG-101", client: "Anna Schmidt", court: "NSA w Warszawie, Room 4", date: "July 02, 2026", time: "09:00 AM", status: "scheduled", lawyer: "Alex Jenkins" }
  ]);

  const columns = [
    { header: "Case ID", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "Client", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontWeight: 550 }}>{row.client}</span>
      </div>
    )},
    { header: "Appeal Type & Authority", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.type}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.authority}</div>
      </div>
    )},
    { header: "Deadline", cell: (row) => (
      <span style={{ color: row.status === "draft" ? "var(--color-danger)" : "var(--fg)" }}>{row.deadline}</span>
    )},
    { header: "Status", cell: (row) => {
      let color = "info";
      if (row.status === "draft") color = "warning";
      if (row.status === "filed") color = "primary";
      if (row.status === "won") color = "success";
      if (row.status === "lost") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Assigned Lawyer", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.lawyer}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button 
          className="kc-btn kc-btn-ghost" 
          onClick={() => {
            setSelectedTemplate(row.type);
            setShowTemplateModal(true);
          }}
        >
          <Icon name="file-text" size={16} />
        </button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Legal Appeals & Litigation Tracker</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track legal appeals, Urząd reconsiderations, and administrative court cases (WSA/NSA) with deadlines and hearing dates.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => {
          setSelectedTemplate("Appeal to Szef Urzędu");
          setShowTemplateModal(true);
        }}>
          <Icon name="plus" size={16} /> New Appeal Case
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Appeals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>12</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Win Rate (Appeals)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>84.5%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Upcoming Hearings</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>2</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("appeals")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "appeals" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "appeals" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "appeals" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="folder" size={16} /> Active Appeals
        </button>
        <button 
          onClick={() => setActiveTab("hearings")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "hearings" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "hearings" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "hearings" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="calendar" size={16} /> Court Hearings
        </button>
      </div>

      {/* Tab contents */}
      {activeTab === "appeals" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <DataTable columns={columns} data={appeals} />
        </div>
      )}

      {activeTab === "hearings" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Client</th>
                <th style={{ padding: "12px" }}>Court / Room</th>
                <th style={{ padding: "12px" }}>Date & Time</th>
                <th style={{ padding: "12px" }}>Lawyer</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {hearings.map((h) => (
                <tr key={h.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{h.client}</td>
                  <td style={{ padding: "12px" }}>{h.court}</td>
                  <td style={{ padding: "12px" }}>{h.date} at {h.time}</td>
                  <td style={{ padding: "12px" }}>{h.lawyer}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge status="success" text={h.status.toUpperCase()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="kc-card" style={{ maxWidth: "600px", width: "90%", background: "var(--bg)" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0" }}>Generate Draft Document</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: "var(--space-md)" }}>
              Official Polish appeal draft template for: <strong>{selectedTemplate}</strong>.
            </p>

            <div style={{ background: "var(--panel-2)", padding: "16px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px", color: "var(--fg)", maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border)", marginBottom: "var(--space-md)", lineHeight: "1.6" }}>
              <div><strong>DO: Szefa Urzędu do Spraw Cudzoziemców</strong></div>
              <div>Za pośrednictwem: Wojewody Mazowieckiego</div>
              <br/>
              <div><strong>ODWOŁANIE</strong></div>
              <div>od decyzji Wojewody Mazowieckiego z dnia 15 maja 2026 r. (znak ref: WSC-II-X.1234.2026)</div>
              <div>w sprawie odmowy udzielenia zezwolenia na pobyt czasowy.</div>
              <br/>
              <div>Działając w imieniu skarżącego, na podstawie art. 127 § 1 KPA wnoszę odwołanie od wyżej wymienionej decyzji i zaskarżam ją w całości. Zaskarżonej decyzji zarzucam naruszenie przepisów prawa materialnego oraz procesowego...</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-secondary" onClick={() => setShowTemplateModal(false)}>Close</button>
              <button className="kc-btn kc-btn-primary" onClick={() => {
                alert("Appeal PDF generated successfully!");
                setShowTemplateModal(false);
              }}>
                <Icon name="download" size={16} /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
