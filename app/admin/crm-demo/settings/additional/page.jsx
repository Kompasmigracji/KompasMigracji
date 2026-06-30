"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_AUTOMATIONS = [
  { id: 1, name: "оплата", event: "Воронки - Смена статуса карточки", status: true },
  { id: 2, name: "оплата 1", event: "Воронки - Смена статуса карточки", status: false },
  { id: 3, name: "Влияние вайбер", event: "Воронки - Смена статуса карточки", status: false },
  { id: 4, name: "Влияние фейсбук", event: "Воронки - Смена статуса карточки", status: false },
  { id: 5, name: "Каста", event: "Воронки - Смена статуса карточки", status: false },
  { id: 6, name: "питання фейсбук", event: "Воронки - Смена статуса карточки", status: false },
];

export default function AdditionalSettingsPage() {
  const [activeTab, setActiveTab] = useState("automation");

  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Дополнительно</span>
      </div>

      <div style={{ background: "var(--panel)", borderRadius: 8, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          {[
            { id: "custom_fields", label: "Пользовательские поля" },
            { id: "automation", label: "Автоматизация" },
            { id: "doc_templates", label: "Шаблоны документов" },
            { id: "companies", label: "Компании" },
            { id: "notifications", label: "Уведомления" },
            { id: "loyalty", label: "Программы лояльности" },
            { id: "other_integrations", label: "Другие интеграции" }
          ].map(t => (
            <div 
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{ 
                padding: "0 0 12px 0", 
                cursor: "pointer", 
                fontSize: 13, 
                fontWeight: activeTab === t.id ? 600 : 500,
                color: activeTab === t.id ? "#3b82f6" : "var(--faint)",
                borderBottom: activeTab === t.id ? "2px solid #3b82f6" : "2px solid transparent",
                marginBottom: -1
              }}
            >
              {t.label}
            </div>
          ))}
        </div>

        {activeTab === "automation" && (
          <div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", textTransform: "uppercase" }}>
                    <th style={{ padding: "16px 20px", fontWeight: 600 }}>Название</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600 }}>Событие</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600, width: 80 }}>Статус</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600, width: 100 }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_AUTOMATIONS.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: i === MOCK_AUTOMATIONS.length - 1 ? "none" : "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text)" }}>{item.name}</td>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--faint)" }}>{item.event}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ width: 34, height: 20, background: item.status ? "#3b82f6" : "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer", opacity: item.status ? 1 : 0.6 }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: item.status ? 16 : 2, transition: "left 0.2s" }}></div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)" }}>
                            <Icon name="copy" size={14} />
                          </button>
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
                  <Icon name="plus" size={16} /> Добавить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
