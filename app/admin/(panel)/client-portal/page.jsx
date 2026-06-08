"use client";
/* iPhoenixCRM — Client Portal Access Management */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function ClientPortalPage() {
  const [portals] = useState([
    { id: "CP-901", client: "Ivan Petrov", type: "B2C", status: "active", lastLogin: "10 mins ago", unreadDocs: 2, caseStatus: "Awaiting Urząd" },
    { id: "CP-902", client: "TechCorp Sp. z.o.o.", type: "B2B", status: "active", lastLogin: "Yesterday", unreadDocs: 0, caseStatus: "Monthly Retainer" },
    { id: "CP-903", client: "Anna Schmidt", type: "B2C", status: "invited", lastLogin: "Never", unreadDocs: 0, caseStatus: "Documents Prep" },
    { id: "CP-904", client: "Rajesh Kumar", type: "B2C", status: "locked", lastLogin: "June 01, 2026", unreadDocs: 0, caseStatus: "Case Closed" }
  ]);

  const [logs] = useState([
    { id: 1, client: "Ivan Petrov", action: "Uploaded Document", detail: "passport_scan.pdf", time: "10:15 AM", icon: "upload-cloud", color: "var(--color-primary)" },
    { id: 2, client: "TechCorp Sp. z.o.o.", action: "Downloaded Invoice", detail: "INV-2026-05.pdf", time: "Yesterday, 14:30", icon: "download", color: "var(--color-success)" },
    { id: 3, client: "System", action: "Magic Link Sent", detail: "to anna.s@mail.com", time: "2 days ago", icon: "mail", color: "var(--dim)" }
  ]);

  const columns = [
    { header: "Client", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.client.substring(0,2).toUpperCase()} size={36} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.client}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type} Portal</div>
        </div>
      </div>
    )},
    { header: "Case Status", cell: (row) => <Badge status="default" text={row.caseStatus} /> },
    { header: "Last Login", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: row.lastLogin === "Never" ? "var(--color-danger)" : "var(--fg)" }}>{row.lastLogin}</span> },
    { header: "New Docs", cell: (row) => (
      row.unreadDocs > 0 ? (
        <Badge status="warning" text={`${row.unreadDocs} Unread`} />
      ) : (
        <span style={{ color: "var(--dim)" }}>None</span>
      )
    )},
    { header: "Portal Status", cell: (row) => {
      let color = "success";
      if (row.status === "invited") color = "warning";
      if (row.status === "locked") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>
          {row.status === "invited" ? "Resend Link" : "Login as Client"}
        </button>
        <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Client Portal Access</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage client access, send magic links, and monitor portal activity.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Portal Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="send" size={16} /> Invite Client</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Left: Stats */}
        <div style={{ flex: 2, display: "flex", gap: "var(--space-md)" }}>
          <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Portals</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>845</div>
            <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Clients with active access.</div>
          </div>
          <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)", background: "rgba(245, 158, 11, 0.05)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Unread Documents</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>12</div>
            <div style={{ fontSize: "10px", color: "var(--color-warning)", marginTop: 4, fontWeight: 600 }}>Require manager review.</div>
          </div>
        </div>

        {/* Right: Activity Feed */}
        <div className="kc-card" style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)" }}>
            <Icon name="activity" size={16} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: "13px" }}>Portal Activity Logs</h3>
          </div>
          <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: `color-mix(in srgb, ${log.color} 15%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={log.icon} size={14} color={log.color} />
                </div>
                <div>
                  <div style={{ fontSize: "13px" }}><strong>{log.client}</strong> {log.action}</div>
                  <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: 2 }}>{log.detail}</div>
                  <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by client name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Statuses</option>
            <option>Active</option>
            <option>Invited</option>
            <option>Locked</option>
          </select>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Types</option>
            <option>B2C Portal</option>
            <option>B2B Portal</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={portals} />
        </div>
      </div>
    </div>
  );
}
