"use client";
/* KompasCRM — Permissions Matrix & Role-Based Access Control */
import React, { useState } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function PermissionsPage() {
  const [roles] = useState([]);

  const [permissionsMatrix] = useState([]);

  const columns = [
    { header: "Role Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="shield" size={16} color={row.isSystem ? "var(--color-danger)" : "var(--color-primary)"} />
        <div>
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {row.name}
            {row.isSystem && <Badge status="danger" text="SYSTEM" />}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.level}</div>
        </div>
      </div>
    )},
    { header: "Users Assigned", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="users" size={14} color="var(--dim)" />
        <span style={{ fontWeight: 500 }}>{row.users} users</span>
      </div>
    )},
    { header: "Status", cell: (row) => <Badge status="success" text={row.status.toUpperCase()} /> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}>Edit Matrix</button>
        <button className="kc-btn kc-btn-ghost"><Icon name="trash-2" size={16} color="var(--color-danger)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Roles & Permissions</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Control exactly what your employees and partners can see and do in the CRM.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> User Directory</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Custom Role</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", flex: 1, overflow: "hidden", paddingBottom: "var(--space-lg)" }}>
        
        {/* Roles List */}
        <div className="kc-card" style={{ flex: 1, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", background: "var(--panel-2)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-md)", fontWeight: 600 }}>Role Definitions</h3>
          </div>
          <DataTable columns={columns} data={roles} />
        </div>

        {/* Permissions Matrix Simulator */}
        <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-md)", marginBottom: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "var(--text-md)", fontWeight: 600 }}>Permissions Matrix</h3>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>Editing permissions for: <strong>Junior Support</strong></div>
            </div>
            <button className="kc-btn kc-btn-primary" style={{ padding: "4px 12px" }}>Save Changes</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", color: "var(--dim)" }}>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Resource</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>View</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>Create</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>Edit</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 8px", fontWeight: 500 }}>{row.resource}</td>
                    <td style={{ textAlign: "center", padding: "12px 8px" }}>
                      <input type="checkbox" defaultChecked={row.view} style={{ accentColor: "var(--color-primary)", width: 16, height: 16, cursor: "pointer" }} />
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 8px" }}>
                      <input type="checkbox" defaultChecked={row.create} style={{ accentColor: "var(--color-primary)", width: 16, height: 16, cursor: "pointer" }} />
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 8px" }}>
                      <input type="checkbox" defaultChecked={row.edit} style={{ accentColor: "var(--color-primary)", width: 16, height: 16, cursor: "pointer" }} />
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 8px" }}>
                      <input type="checkbox" defaultChecked={row.delete} style={{ accentColor: "var(--color-danger)", width: 16, height: 16, cursor: "pointer" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: "var(--space-md)", padding: "var(--space-md)", background: "rgba(239, 68, 68, 0.05)", border: "1px solid var(--color-danger)", borderRadius: 8, display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
            <Icon name="alert-triangle" size={16} color="var(--color-danger)" style={{ marginTop: 2 }} />
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
              <strong style={{ color: "var(--color-danger)" }}>Security Warning:</strong> Enabling 'Delete' permissions allows users in this role to permanently remove records from the database. This action cannot be undone.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
