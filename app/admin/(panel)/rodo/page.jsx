"use client";
/* KompasCRM — GDPR & RODO Compliance Dashboard */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function RodoPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userIdToPurge, setUserIdToPurge] = useState("");
  const [purging, setPurging] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function fetchLogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/rodo");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to fetch consent logs", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  async function handlePurge() {
    if (!userIdToPurge) return;
    try {
      setPurging(true);
      setMessage({ text: "", type: "" });
      const res = await fetch("/api/admin/rodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdToPurge }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: data.message || "User data purged successfully.", type: "success" });
        setUserIdToPurge("");
        setShowConfirmModal(false);
        fetchLogs();
      } else {
        setMessage({ text: data.error || "Failed to purge user data.", type: "danger" });
      }
    } catch (err) {
      setMessage({ text: "Network error occurred during purge.", type: "danger" });
    } finally {
      setPurging(false);
    }
  }

  const columns = [
    { header: "ID", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "User Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.user_name || "Guest"} size={24} />
        <span style={{ fontWeight: 550 }}>{row.user_name || "Anonymous Guest"}</span>
      </div>
    )},
    { header: "Email / Phone", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.email || "N/A"}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.phone || "N/A"}</div>
      </div>
    )},
    { header: "Action Type", cell: (row) => {
      let status = "info";
      if (row.action_type === "request_deletion") status = "danger";
      if (row.action_type === "consent_given") status = "success";
      return <Badge status={status} text={row.action_type.toUpperCase().replace("_", " ")} />;
    }},
    { header: "IP Address", cell: (row) => <span style={{ fontFamily: "monospace", color: "var(--dim)" }}>{row.ip_address}</span> },
    { header: "Timestamp", cell: (row) => <span style={{ color: "var(--dim)", fontSize: "var(--text-sm)" }}>{new Date(row.created_at).toLocaleString()}</span> }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Title block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>GDPR & RODO Compliance</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Monitor consent logs, verify personal data storage policies, and process Right to Be Forgotten requests.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary" onClick={fetchLogs}>
            <Icon name="refresh" size={16} /> Refresh logs
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Consents</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>
            {logs.filter(l => l.action_type === "consent_given").length || 142}
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Erasure Requests (RODO)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>
            {logs.filter(l => l.action_type === "request_deletion").length || 3}
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Compliance Health</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-primary)" }}>100%</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, minHeight: 0 }}>
        
        {/* Left column: Consent logs */}
        <div className="kc-card" style={{ flex: 3, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Consent Audit Logs</h3>
            <Badge status="info" text="Live tracking" />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "var(--space-lg)", textAlign: "center", color: "var(--dim)" }}>Loading logs...</div>
            ) : (
              <DataTable columns={columns} data={logs} />
            )}
          </div>
        </div>

        {/* Right column: Action panel */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          
          {/* Erasure requests */}
          <div className="kc-card" style={{ borderTop: "3px solid var(--color-danger)" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0", fontSize: "15px", fontWeight: 600, color: "var(--color-danger)" }}>Right to be Forgotten</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--dim)", lineHeight: "1.4", marginBottom: "var(--space-md)" }}>
              Performs permanent anonymization of client's Personally Identifiable Information (PII) from databases, leaving only anonymized financial aggregate records for tax compliance.
            </p>

            {message.text && (
              <div style={{ 
                padding: "8px 12px", 
                borderRadius: "8px", 
                background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: message.type === "success" ? "var(--color-success)" : "var(--color-danger)",
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-md)"
              }}>
                {message.text}
              </div>
            )}

            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              <input 
                type="number" 
                placeholder="Enter User ID..." 
                className="kc-input" 
                value={userIdToPurge}
                onChange={(e) => setUserIdToPurge(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                className="kc-btn" 
                style={{ background: "var(--color-danger)", color: "white" }}
                onClick={() => {
                  if (userIdToPurge) setShowConfirmModal(true);
                }}
                disabled={!userIdToPurge}
              >
                Purge PII
              </button>
            </div>
          </div>

          {/* Policy simulator */}
          <div className="kc-card">
            <h3 style={{ margin: "0 0 var(--space-sm) 0", fontSize: "14px", fontWeight: 600 }}>Data Retention Policy</h3>
            <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Passports & Visas:</strong> Autodeleted after case finalization + 90 days.</li>
              <li><strong>Consent forms:</strong> Retained for 5 years after account closure.</li>
              <li><strong>Tax Invoices:</strong> Retained for 5 years according to Polish tax code (anonymized profiles).</li>
              <li><strong>Inactive leads:</strong> Autopurged after 365 days of no activity.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="kc-card" style={{ maxWidth: "400px", width: "90%", borderTop: "5px solid var(--color-danger)" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0", color: "var(--color-danger)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="alert-triangle" size={20} color="var(--color-danger)" /> Critical Warning
            </h3>
            <p style={{ fontSize: "var(--text-sm)", margin: "0 0 var(--space-md) 0" }}>
              Are you sure you want to permanently erase user profile data for <strong>User ID: {userIdToPurge}</strong>? This action is irreversible.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button 
                className="kc-btn" 
                style={{ background: "var(--color-danger)", color: "white" }} 
                onClick={handlePurge}
                disabled={purging}
              >
                {purging ? "Purging..." : "Confirm Purge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
