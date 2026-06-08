"use client";
/* KompasCRM — Health Insurance & ZUS Coordinator (Ubezpieczenia i ZUS) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState("policies"); // policies, zusChecklist, quotes
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({ clientName: "", package: "Standard", premium: "120 PLN/mo" });

  const [policies, setPolicies] = useState([
    { id: "POL-701", client: "Dmytro Kovalenko", type: "ZUS (State)", policyNo: "PESEL 920102...", premium: "450 PLN/mo", expires: "Indefinite (ZUS ZUA)", status: "active", verifiedDocs: "ZUS ZUA + RCA (May)" },
    { id: "POL-702", client: "Kamil Nowak", type: "Private (PZU Wojażer)", policyNo: "PZU-8930219", premium: "150 PLN/mo", expires: "June 25, 2026", status: "expiring", verifiedDocs: "Policy PDF" },
    { id: "POL-703", client: "Anna Schmidt", type: "Private (LuxMed)", policyNo: "LUX-1029481", premium: "180 PLN/mo", expires: "Dec 31, 2026", status: "active", verifiedDocs: "Cert of Coverage" },
    { id: "POL-704", client: "Oleksandr Lysenko", type: "Private (PZU Wojażer)", policyNo: "PZU-7204910", premium: "120 PLN/mo", expires: "May 15, 2026", status: "expired", verifiedDocs: "Expired Policy" }
  ]);

  const [checklist, setChecklist] = useState([
    { id: "CHK-01", client: "Ivan Petrov", registered: "ZUS ZUA present", monthlyReport: "ZUS RCA missing", actionRequired: "Request May payment slip" },
    { id: "CHK-02", client: "Elena Rostova", registered: "ZUS ZUA present", monthlyReport: "ZUS RCA present", actionRequired: "None (Compliant)" }
  ]);

  const columns = [
    { header: "ID", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "Client", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontWeight: 550 }}>{row.client}</span>
      </div>
    )},
    { header: "Type & Policy No", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.type}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>{row.policyNo}</div>
      </div>
    )},
    { header: "Premium / Cost", cell: (row) => <span style={{ fontWeight: 500 }}>{row.premium}</span> },
    { header: "Expiration Date", cell: (row) => (
      <span style={{ color: row.status === "expired" ? "var(--color-danger)" : row.status === "expiring" ? "var(--color-warning)" : "var(--fg)" }}>
        {row.expires}
      </span>
    )},
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "expiring") color = "warning";
      if (row.status === "expired") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Verified Documents", cell: (row) => (
      <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.verifiedDocs}</span>
    )}
  ];

  function handleGenerateQuote() {
    if (!quoteData.clientName) return;
    alert(`Private insurance quote of ${quoteData.premium} generated for ${quoteData.clientName}!`);
    setShowQuoteModal(false);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Health Insurance & ZUS</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track client health insurance policies required for residence cards. Monitor ZUS social security payments and private policy expirations.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setShowQuoteModal(true)}>
          <Icon name="plus" size={16} /> Sell Private Policy
        </button>
      </div>

      {/* KPI Stats */}
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Coverage</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>112</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Expiring Coverage</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>3</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Insurance Partners</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>PZU, LuxMed</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("policies")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "policies" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "policies" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "policies" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="shield" size={16} /> Policies Registry
        </button>
        <button 
          onClick={() => setActiveTab("zusChecklist")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "zusChecklist" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "zusChecklist" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "zusChecklist" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="check" size={16} /> ZUS Compliance Checklist
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "policies" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <DataTable columns={columns} data={policies} />
        </div>
      )}

      {activeTab === "zusChecklist" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Client</th>
                <th style={{ padding: "12px" }}>ZUS ZUA (Registration)</th>
                <th style={{ padding: "12px" }}>ZUS RCA (Latest Report)</th>
                <th style={{ padding: "12px" }}>Compliance Action Required</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{c.client}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge status="success" text={c.registered.toUpperCase()} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Badge 
                      status={c.monthlyReport.includes("missing") ? "danger" : "success"} 
                      text={c.monthlyReport.toUpperCase()} 
                    />
                  </td>
                  <td style={{ padding: "12px", color: c.monthlyReport.includes("missing") ? "var(--color-danger)" : "var(--dim)", fontWeight: 500 }}>
                    {c.actionRequired}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Policy Quote Modal */}
      {showQuoteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="kc-card" style={{ maxWidth: "450px", width: "90%" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0" }}>Private Medical Policy Quote</h3>
            <p style={{ fontSize: "var(--text-sm)", margin: "0 0 var(--space-md) 0", color: "var(--dim)" }}>
              Generate PZU Wojażer or LuxMed health insurance policy quotes for migrants.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "var(--space-md)" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Client Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Elena Rostova" 
                  className="kc-input" 
                  value={quoteData.clientName}
                  onChange={(e) => setQuoteData({ ...quoteData, clientName: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Coverage Package</label>
                <select 
                  className="kc-input" 
                  style={{ width: "100%" }}
                  value={quoteData.package}
                  onChange={(e) => {
                    const val = e.target.value;
                    let premium = "120 PLN/mo";
                    if (val === "Premium") premium = "250 PLN/mo";
                    if (val === "Family") premium = "450 PLN/mo";
                    setQuoteData({ ...quoteData, package: val, premium });
                  }}
                >
                  <option value="Standard">Standard (Basic Wojewoda requirements)</option>
                  <option value="Premium">Premium (LuxMed clinics access)</option>
                  <option value="Family">Family Package (PZU Family coverage)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Calculated Premium</label>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-success)" }}>
                  {quoteData.premium}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-secondary" onClick={() => setShowQuoteModal(false)}>Cancel</button>
              <button className="kc-btn kc-btn-primary" onClick={handleGenerateQuote} disabled={!quoteData.clientName}>
                Generate Quote & Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
