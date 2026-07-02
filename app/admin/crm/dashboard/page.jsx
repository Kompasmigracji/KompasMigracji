"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_STATUSES = [
  { id: 1, name: "Новий", color: "#ef4444", bg: "#fef2f2", qty: 1, conv: "100%", sum: "0 zł" },
  { id: 2, name: "Перший контакт", color: "#f59e0b", bg: "#fffbeb", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 3, name: "Аналіз документів", color: "#84cc16", bg: "#f7fee7", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 4, name: "Аванс", color: "#0284c7", bg: "#f0f9ff", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 5, name: "Підписання умови", color: "#4f46e5", bg: "#eef2ff", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 6, name: "Виставлення рахунку", color: "#06b6d4", bg: "#ecfeff", qty: 0, conv: "0%", sum: "0 zł" },
  { id: 7, name: "Успішно", color: "#a855f7", bg: "#faf5ff", qty: 0, conv: "0%", sum: "0 zł" },
];

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 32px)", margin: "-16px", background: "var(--bg)", overflowY: "auto" }}>
      
      {/* Top Header */}
      <div style={{ background: "var(--panel)", padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>Аналитика</h2>
          <select style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }}>
            <option>Воронки</option>
            <option>Заказы</option>
          </select>
        </div>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 24, marginLeft: 12 }}>
          <button style={{ background: "none", border: "none", borderBottom: activeTab === "general" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "general" ? "var(--color-primary)" : "var(--dim)", padding: "6px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => setActiveTab("general")}>Общее</button>
          <button style={{ background: "none", border: "none", borderBottom: activeTab === "managers" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "managers" ? "var(--text)" : "var(--dim)", padding: "6px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => setActiveTab("managers")}>По менеджерам</button>
          <button style={{ background: "none", border: "none", borderBottom: activeTab === "pivot" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "pivot" ? "var(--text)" : "var(--dim)", padding: "6px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => setActiveTab("pivot")}>Сводная таблица</button>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* Filters */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 4 }}>Период</div>
            <div style={{ display: "flex", alignItems: "center", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, padding: "6px 12px", gap: 8 }}>
              <Icon name="calendar" size={14} color="var(--dim)" />
              <span style={{ fontSize: 13, color: "var(--text)" }}>30.05.2026 — 30.06.2026</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 4 }}>Дата для группировки</div>
            <select style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 4, color: "var(--text)", fontSize: 13 }}>
              <option>Дата добавления в указанном периоде</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 4 }}>Воронка</div>
            <select style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 4, color: "var(--text)", fontSize: 13 }}>
              <option>Одежа</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 4 }}>Менеджеры</div>
            <select style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 4, color: "var(--text)", fontSize: 13 }}>
              <option>Все</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--dim)", padding: "8px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="x" size={14} /> Очистить
            </button>
            <button style={{ background: "var(--color-primary)", border: "1px solid var(--color-primary)", color: "#fff", padding: "8px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="filter" size={14} /> Все фильтры
            </button>
          </div>
        </div>

        {/* Main Content: Conversion by Status */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
            Конверсия по статусам
          </div>
          <div style={{ display: "flex" }}>
            
            {/* Visual Funnel */}
            <div style={{ flex: 1, borderRight: "1px solid var(--border)", padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
              <div style={{ 
                width: "80%", 
                height: 80, 
                background: "linear-gradient(to bottom, #fca5a5, #f87171)", 
                clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                100% Новий
              </div>
              <div style={{ 
                width: "68%", 
                height: 60, 
                background: "linear-gradient(to bottom, #67e8f9, #22d3ee)", 
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                0% В роботі
              </div>
              <div style={{ 
                width: "68%", 
                height: 60, 
                background: "linear-gradient(to bottom, #a3e635, #84cc16)", 
                borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                0% Успішно
              </div>
            </div>

            {/* Data Table */}
            <div style={{ flex: 1.5, padding: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ color: "var(--dim)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 400 }}>Статус</th>
                    <th style={{ padding: "12px 8px", textAlign: "center", fontWeight: 400 }}>Количество</th>
                    <th style={{ padding: "12px 8px", textAlign: "center", fontWeight: 400 }}>Конверсия</th>
                    <th style={{ padding: "12px 8px", textAlign: "right", fontWeight: 400 }}>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STATUSES.map((status, index) => (
                    <tr key={status.id} style={{ borderBottom: index === MOCK_STATUSES.length - 1 ? "none" : "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ 
                          background: status.color, color: "#fff", 
                          padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, display: "inline-block" 
                        }}>
                          {status.name}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "var(--text)" }}>{status.qty}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "var(--dim)" }}>{status.conv}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "var(--dim)" }}>{status.sum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Cards Row */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", flexDirection: "column", minHeight: 250 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
              Отклонения по статусам
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
              <Icon name="bar-chart-2" size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
              <span style={{ fontSize: 13 }}>Нет доступных данных</span>
            </div>
          </div>
          
          <div style={{ flex: 1, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", flexDirection: "column", minHeight: 250 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
              Причины отклонения
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
              <Icon name="bar-chart-2" size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
              <span style={{ fontSize: 13 }}>Нет доступных данных</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
