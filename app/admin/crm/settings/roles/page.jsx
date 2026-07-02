"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_ROLES = [
  { id: 1, name: "Administrator", color: "#1e40af", bg: "#dbeafe", users: 15, rights: 40 },
  { id: 2, name: "Manager", color: "#6b21a8", bg: "#f3e8ff", users: 1, rights: 20 },
  { id: 3, name: "Content Manager", color: "#0369a1", bg: "#e0f2fe", users: 3, rights: 5 },
  { id: 4, name: "Courier", color: "#166534", bg: "#dcfce7", users: 3, rights: 5 },
  { id: 5, name: "Analyst", color: "#991b1b", bg: "#fee2e2", users: 3, rights: 15 },
  { id: 6, name: "Producer", color: "#86198f", bg: "#fae8ff", users: 3, rights: 5 },
  { id: 7, name: "Supplier", color: "#15803d", bg: "#dcfce7", users: 3, rights: 5 },
];

export default function RolesSettingsPage() {
  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Список ролей</h1>

        <button style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <Icon name="plus" size={16} /> Добавить роль
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "var(--panel)", borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", textTransform: "uppercase", background: "rgba(0,0,0,0.02)" }}>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Название роли</th>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Кол-во пользователей</th>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Кол-во прав доступа</th>
              <th style={{ padding: "16px 20px", fontWeight: 600, width: 120 }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ROLES.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i === MOCK_ROLES.length - 1 ? "none" : "1px solid var(--border)" }}>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    display: "inline-block",
                    background: item.bg, 
                    color: item.color, 
                    padding: "4px 8px", 
                    borderRadius: 4, 
                    fontSize: 12, 
                    fontWeight: 600 
                  }}>
                    {item.name}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text)" }}>
                  {item.users}
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text)" }}>
                  {item.rights}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)" }}>
                      <Icon name="edit-2" size={14} />
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)" }}>
                      <Icon name="copy" size={14} />
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)" }}>
                      <Icon name="trash-2" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
