import React from "react";
import { Icon, Avatar } from "@/components/admin/ui";

const MOCK_HISTORY = [
  {
    id: 1,
    time: "Сегодня, 11:29",
    user: "keyCRM",
    actionText: "создал(-а) карточку",
    changes: [
      { label: "Название", from: "(пусто)", to: "Чат з 380673442306" },
      { label: "Источник", from: "(пусто)", to: "Приватний вайбер" },
      { label: "Статус", from: "(пусто)", to: "Новий", isPill: true, pillColor: "#ef4444" },
      { label: "Дата следующего контакта", from: "(пусто)", to: "Сегодня, 11:44" },
      { label: "Воронка", from: "(пусто)", to: "Клієнт" },
      { label: "Валюта", from: "(пусто)", to: "PLN" },
    ]
  },
  {
    id: 2,
    time: "Сегодня, 11:29",
    user: "keyCRM",
    actionText: "создал(-а) контактную информацию",
    changes: [
      { label: "ФИО", from: "(пусто)", to: "380673442306" },
      { label: "ID в соцсети", from: "(пусто)", to: "+380673442306" },
      { label: "Социальная сеть", from: "(пусто)", to: "viber" },
      { label: "Телефон", from: "(пусто)", to: "+380673442306" },
    ]
  },
  {
    id: 3,
    time: "Сегодня, 11:19",
    user: "keyCRM",
    actionText: "создал(-а) карточку",
    changes: [
      { label: "Название", from: "(пусто)", to: "Чат з Naeem Karakra" },
      { label: "Источник", from: "(пусто)", to: "Telegram" },
      { label: "Статус", from: "(пусто)", to: "Новий", isPill: true, pillColor: "#ef4444" },
      { label: "Дата следующего контакта", from: "(пусто)", to: "Сегодня, 11:34" },
      { label: "Воронка", from: "(пусто)", to: "Клієнт" },
      { label: "Валюта", from: "(пусто)", to: "PLN" },
    ]
  },
  {
    id: 4,
    time: "Сегодня, 11:19",
    user: "keyCRM",
    actionText: "создал(-а) контактную информацию",
    changes: [
      { label: "ФИО", from: "(пусто)", to: "Naeem Karakra" },
      { label: "ID в соцсети", from: "(пусто)", to: "8849719657" },
      { label: "Социальная сеть", from: "(пусто)", to: "telegram" },
    ]
  }
];

export function ActionHistory() {
  return (
    <div style={{ width: "100%", maxWidth: 500, background: "#f8fafc", padding: "20px", borderRadius: 8, fontFamily: "sans-serif" }}>
      {/* Filter Button */}
      <button style={{ 
        width: "100%", background: "#fff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 4, 
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, 
        color: "#475569", marginBottom: 24, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" 
      }}>
        <Icon name="filter" size={14} /> Фильтр
      </button>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 16 }}>
        {/* Vertical Line */}
        <div style={{ position: "absolute", top: 8, bottom: 0, left: 3, width: 2, background: "#86efac", zIndex: 1 }}></div>

        {MOCK_HISTORY.map((item) => (
          <div key={item.id} style={{ position: "relative", marginBottom: 24, zIndex: 2 }}>
            {/* Timeline Dot */}
            <div style={{ position: "absolute", top: 4, left: -18, width: 10, height: 10, background: "#22c55e", borderRadius: "50%", border: "2px solid #f8fafc" }}></div>

            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>{item.time}</div>

            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Avatar name={item.user} size={24} />
                <div style={{ fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{item.user}</span> <span style={{ color: "#64748b" }}>{item.actionText}</span>
                </div>
              </div>

              {/* Changes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {item.changes.map((change, i) => (
                  <div key={i} style={{ display: "flex", fontSize: 12 }}>
                    <div style={{ width: "40%", color: "#64748b" }}>{change.label}</div>
                    <div style={{ width: "60%", display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: "#64748b", flexShrink: 0 }}>{change.from}</span>
                      <Icon name="arrow-right" size={12} color="#cbd5e1" style={{ marginTop: 2, flexShrink: 0 }} />
                      
                      {change.isPill ? (
                        <span style={{ background: change.pillColor, color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
                          {change.to}
                        </span>
                      ) : (
                        <span style={{ color: "#0f172a" }}>{change.to}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
