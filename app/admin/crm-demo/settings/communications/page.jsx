"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_COMMS = [
  { id: 1, name: "Viber основной", channel: "Viber Номерной", icon: "phone", iconColor: "#7360F2", account: "+48729417050", paidUntil: "Оплачен до 24.07", status: true },
  { id: 2, name: "Фейсбук", channel: "Facebook Messenger", icon: "facebook", iconColor: "#1877F2", account: "Kompas Migracji", status: true },
  { id: 3, name: "Телеграм", channel: "Telegram Номерной", icon: "send", iconColor: "#229ED9", account: "+48729417050", paidUntil: "Оплачен до 02.07", status: true },
  { id: 4, name: "Марьяна (співробітник)", channel: "Telegram Bot", icon: "bot", iconColor: "#229ED9", account: "—", status: false },
  { id: 5, name: "Пошта", channel: "Email", icon: "mail", iconColor: "#f59e0b", account: "info@kompasmigracji.app", status: true },
  { id: 6, name: "Телеграм", channel: "Telegram Bot", icon: "bot", iconColor: "#229ED9", account: "—", status: false },
  { id: 7, name: "Inst", channel: "Instagram", icon: "camera", iconColor: "#e1306c", account: "Kompas Migracji", status: true },
  { id: 8, name: "Chatbot", channel: "Telegram Bot", icon: "bot", iconColor: "#229ED9", account: "—", status: true },
  { id: 9, name: "Телеграм", channel: "Telegram Bot", icon: "bot", iconColor: "#229ED9", account: "—", status: true },
];

export default function CommunicationsSettingsPage() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Коммуникации</span>
      </div>

      {/* Main Panel */}
      <div style={{ background: "var(--panel)", borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 20px" }}>
          {[
            { id: "chats", label: "Чаты / SMS / Email", icon: "message-circle" },
            { id: "telephony", label: "Телефония", icon: "phone-call" },
            { id: "widgets", label: "Виджеты", icon: "layout" },
            { id: "templates", label: "Шаблоны сообщений", icon: "file-text" },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                color: activeTab === tab.id ? "#3b82f6" : "var(--faint)",
                padding: "16px 20px", cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500,
                transition: "all 0.2s"
              }}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Название</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Канал</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Аккаунт</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}></th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Статус</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, width: 80 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMMS.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i === MOCK_COMMS.length - 1 ? "none" : "1px solid var(--border)", opacity: item.status ? 1 : 0.6 }}>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name={item.icon === "bot" ? "cpu" : item.icon} size={16} color={item.iconColor} />
                      {item.channel}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13 }}>{item.account}</td>
                  <td style={{ padding: "16px 20px", fontSize: 11 }}>
                    {item.paidUntil && (
                      <span style={{ color: "#d97706", background: "#fef3c7", padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}>
                        {item.paidUntil}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {/* Toggle Switch */}
                    <div style={{ width: 34, height: 20, background: item.status ? "#3b82f6" : "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer" }}>
                      <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: item.status ? 16 : 2, transition: "left 0.2s" }}></div>
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
            <Icon name="plus" size={16} /> Добавить новый канал
          </button>
        </div>
      </div>
    </div>
  );
}
