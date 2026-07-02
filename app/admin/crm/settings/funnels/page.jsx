"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_FUNNELS = [
  { id: 1, name: "Канада O", type: "Лиды", action: "Создать новую карточку", count: 3352 },
  { id: 2, name: "ЗВОНКИ O", type: "Лиды", action: "Ничего, игнор", count: 0 },
  { id: 3, name: "Новая O", type: "Лиды", action: "Только смена статуса", count: 0 },
  { id: 4, name: "Гражданство O", type: "Лиды", action: "Только смена статуса", count: 16 },
];

export default function FunnelsSettingsPage() {
  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Воронки</span>
      </div>

      {/* Main Panel */}
      <div style={{ background: "var(--panel)", borderRadius: 8, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {/* Toggle Воронки */}
        <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
          <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 2 }}>
            Использовать Воронки
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Нет</span>
              {/* Toggle Switch */}
              <div style={{ width: 34, height: 20, background: "#3b82f6", borderRadius: 20, position: "relative", cursor: "pointer" }}>
                <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 16, transition: "left 0.2s" }}></div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6" }}>Да</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
              В меню появится отдельный пункт «Воронки» и вы сможете настраивать создание карточек с сайтов, форм, телефонии и чатов.
            </div>
          </div>
        </div>

        {/* Общие настройки */}
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Общие настройки</h3>
        <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
          <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
            Сортировка карточек в воронках
          </div>
          <div style={{ flex: 1 }}>
            <select style={{ width: "300px", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 13, color: "#0f172a", appearance: "none" }}>
              <option>По дате следующего контакта, по убыванию</option>
            </select>
          </div>
        </div>

        {/* Список воронок */}
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Список воронок</h3>
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Название</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Тип воронки</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Действие с карточкой по умолчанию</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Кол-во карточек</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, width: 80 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FUNNELS.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i === MOCK_FUNNELS.length - 1 ? "none" : "1px solid var(--border)" }}>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Icon name="move" size={14} color="#94a3b8" style={{ cursor: "grab" }} />
                      {item.name}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text)" }}>{item.type}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text)" }}>{item.action}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text)" }}>{item.count}</td>
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
          <div style={{ padding: "20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center" }}>
            <button style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <Icon name="plus" size={16} /> Создать новую воронку
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
