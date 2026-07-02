"use client";
import React from "react";
import { Icon, Avatar } from "@/components/admin/ui";

const MOCK_SOURCES = [
  {
    id: 1,
    name: "Привлечение лидов O",
    currency: "PLN",
    managers: [{ name: "Alexander Besson...", id: 1 }],
    access: "Все пользователи",
    ordersCount: "312",
    status: true,
  },
  {
    id: 2,
    name: "test O",
    currency: "PLN",
    managers: [{ name: "Max Valteris", id: 2 }],
    access: "Все пользователи",
    ordersCount: "-",
    status: true,
  },
  {
    id: 3,
    name: "Telegram O",
    currency: "PLN",
    managers: [{ name: "Alexander Besson...", id: 1 }, { name: "Max Valteris", id: 2 }],
    access: "Выбранные пользователи (2)",
    ordersCount: "-",
    status: true,
  },
  {
    id: 4,
    icon: "facebook",
    name: "Facebook O",
    currency: "PLN",
    managers: [{ name: "Alexander Besson...", id: 1 }],
    access: "Все пользователи",
    ordersCount: "-",
    status: true,
  }
];

export default function SourcesSettingsPage() {
  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Источники</span>
      </div>

      {/* Main Panel */}
      <div style={{ background: "var(--panel)", borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Название</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Валюта</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Менеджер</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Доступ пользователей</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Кол-во заказов за текущий месяц</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Статус</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, width: 80 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SOURCES.map((source, i) => (
                <tr key={source.id} style={{ borderBottom: i === MOCK_SOURCES.length - 1 ? "none" : "1px solid var(--border)" }}>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {source.icon && <Icon name={source.icon} size={14} color="#3b82f6" />}
                      {source.name}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13 }}>{source.currency}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {source.managers.map((m, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text)" }}>
                          <Avatar name={m.name} size={20} />
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13 }}>
                    <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>{source.access}</a>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13 }}>{source.ordersCount}</td>
                  <td style={{ padding: "16px 20px" }}>
                    {/* Toggle Switch */}
                    <div style={{ width: 34, height: 20, background: source.status ? "#3b82f6" : "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer" }}>
                      <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: source.status ? 16 : 2, transition: "left 0.2s" }}></div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)" }}>
                        <Icon name="edit-2" size={14} />
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

        {/* Footer Add Button */}
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center" }}>
          <button style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <Icon name="plus" size={16} /> Добавить источник
          </button>
        </div>
      </div>
    </div>
  );
}
