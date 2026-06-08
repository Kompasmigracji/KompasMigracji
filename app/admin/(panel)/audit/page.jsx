"use client";
/* KompasCRM — Audit Log Viewer */
import React, { useEffect, useState } from "react";
import { Spinner, EmptyState, Icon, Badge, DataTable } from "@/components/admin/ui";

export default function AuditLogPage() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit")
      .then(res => res.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setLogs(d.logs || []);
      })
      .catch(() => setError("Failed to load audit logs"));
  }, []);

  const columns = [
    { header: "Date & Time", cell: (row) => new Date(row.created_at).toLocaleString() },
    { header: "User", cell: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.actor_name || "System"}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.actor_email || ""}</div>
        </div>
      ) 
    },
    { header: "Action", cell: (row) => {
        const actionColors = {
          CREATE: "success",
          UPDATE: "warning",
          DELETE: "danger",
          LOGIN: "info"
        };
        const color = actionColors[row.action?.toUpperCase()] || "default";
        return <Badge status={color} text={row.action} />;
      }
    },
    { header: "Entity", cell: (row) => (
        <span>
          <strong>{row.entity}</strong> <span style={{ color: "var(--dim)" }}>#{row.entity_id}</span>
        </span>
      )
    },
    { header: "Details", cell: (row) => (
        <button 
          className="kc-btn kc-btn-ghost" 
          onClick={() => alert(JSON.stringify(row.meta, null, 2))}
          style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}
          disabled={!row.meta}
        >
          View Data
        </button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>System Audit Log</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Track all critical changes, logins, and data modifications across the CRM. Required for compliance.
          </p>
        </div>
        <button className="kc-btn kc-btn-ghost"><Icon name="file" size={16} /> Export CSV</button>
      </div>

      {error ? (
        <div className="kc-error"><Icon name="alert" size={18} /> {error}</div>
      ) : !logs ? (
        <Spinner />
      ) : logs.length === 0 ? (
        <EmptyState title="No audit logs found" description="System activity will be recorded here." icon="file" />
      ) : (
        <DataTable columns={columns} data={logs} />
      )}
    </div>
  );
}
