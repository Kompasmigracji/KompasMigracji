"use client";
/* KompasCRM — Phase 2: RODO & GDPR Admin Panel */
import React, { useState } from "react";
import { Icon, Badge, SearchInput, DataTable, ConfirmDialog } from "@/components/admin/ui";

export default function GDPRPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Mock `kompas_rodo_consent_logs` table
  const [logs, setLogs] = useState([
    { id: "LOG-1001", userId: "U-8392", name: "Ivan Petrenko", email: "ivan.p@example.com", phone: "+380501234567", consentType: "marketing", status: "active", date: "2026-06-01", isSanitized: false },
    { id: "LOG-1002", userId: "U-8393", name: "Maria Koval", email: "m.koval@example.com", phone: "+380671234567", consentType: "data_processing", status: "active", date: "2026-06-02", isSanitized: false },
    { id: "LOG-1003", userId: "U-8394", name: "Oleh Symonenko", email: "oleh.s@example.com", phone: "+380931234567", consentType: "marketing", status: "revoked", date: "2026-06-03", isSanitized: false },
    { id: "LOG-1004", userId: "U-8395", name: "[REDACTED]", email: "[REDACTED]", phone: "[REDACTED]", consentType: "data_processing", status: "forgotten", date: "2026-06-05", isSanitized: true },
  ]);

  const filteredLogs = logs.filter(l => 
    l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleForget = (log) => {
    setSelectedLog(log);
    setIsConfirmOpen(true);
  };

  const confirmForget = async () => {
    if (!selectedLog) return;
    
    // Mock API call to sanitize personal identifiers
    // fetch(`/api/gdpr/forget/${selectedLog.userId}`, { method: 'POST' })
    
    setLogs(prev => prev.map(l => {
      if (l.userId === selectedLog.userId) {
        return {
          ...l,
          name: "[REDACTED]",
          email: "[REDACTED]",
          phone: "[REDACTED]",
          status: "forgotten",
          isSanitized: true
        };
      }
      return l;
    }));
    
    setSelectedLog(null);
  };

  const columns = [
    { header: "Log ID", accessor: "id", cell: (row) => <span className="kc-mono" style={{ fontWeight: 600 }}>{row.id}</span> },
    { header: "User ID", accessor: "userId", cell: (row) => <span className="kc-mono">{row.userId}</span> },
    { header: "Name", accessor: "name", cell: (row) => <span style={{ color: row.isSanitized ? "var(--dim)" : "var(--fg)", fontStyle: row.isSanitized ? "italic" : "normal" }}>{row.name}</span> },
    { header: "Email & Phone", accessor: "contact", cell: (row) => (
      <div style={{ display: "flex", flexDirection: "column", color: row.isSanitized ? "var(--dim)" : "var(--fg)", fontStyle: row.isSanitized ? "italic" : "normal" }}>
        <span style={{ fontSize: "var(--text-sm)" }}>{row.email}</span>
        <span style={{ fontSize: "var(--text-xs)" }}>{row.phone}</span>
      </div>
    )},
    { header: "Consent Type", accessor: "consentType", cell: (row) => (
      row.consentType === "marketing" ? "Marketing" : "Data Processing"
    )},
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status", cell: (row) => {
      if (row.status === "active") return <Badge status="green" text="Active" />;
      if (row.status === "revoked") return <Badge status="brass" text="Revoked" />;
      if (row.status === "forgotten") return <Badge status="dim" text="Forgotten" />;
      return <Badge status="dim" text={row.status} />;
    }},
    { header: "Action", accessor: "action", style: { textAlign: "right" }, cell: (row) => (
      <button 
        className="kc-btn kc-btn-ghost" 
        style={{ padding: "4px 8px", minHeight: "auto", fontSize: "var(--text-xs)", color: row.isSanitized ? "var(--dim)" : "var(--color-danger)" }}
        onClick={(e) => { e.stopPropagation(); handleForget(row); }}
        disabled={row.isSanitized}
      >
        <Icon name="trash" size={14} /> Right to be Forgotten
      </button>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>RODO & GDPR Control Panel</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage `kompas_rodo_consent_logs`, user data privacy, and the Right to be Forgotten.
          </p>
        </div>
      </div>

      <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ flex: 1, maxWidth: 400 }}>
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search logs by ID, Name, Email..." 
            />
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
            Showing {filteredLogs.length} logs
          </div>
        </div>

        <DataTable columns={columns} data={filteredLogs} />
      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmForget}
        title="Execute Right to be Forgotten?"
        message={selectedLog ? `Are you sure you want to sanitize personal identifiers for User ${selectedLog.userId}? This will redact Name, Email, and Phone across the system while retaining financial records. This action cannot be undone.` : ""}
        confirmText="Sanitize User Data"
        isDanger={true}
      />
    </div>
  );
}
