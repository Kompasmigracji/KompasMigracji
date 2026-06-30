"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";

export default function FinancesSettingsPage() {
  const [activeTab, setActiveTab] = useState("currencies");

  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Финансы</span>
      </div>

      <div style={{ background: "var(--panel)", borderRadius: 8, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          {[
            { id: "currencies", label: "Валюты" },
            { id: "taxes", label: "Налоги" },
            { id: "requisites", label: "Реквизиты" },
            { id: "payment_methods", label: "Способы оплаты" }
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

        {activeTab === "currencies" && (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Базовая валюта</h3>
            <p style={{ fontSize: 13, color: "var(--faint)", marginBottom: 24 }}>Выберите основную валюту для ведения учета в CRM.</p>
            
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 16 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Валюта</div>
              <div style={{ flex: 1 }}>
                <select style={{ width: "200px", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 13 }}>
                  <option>USD - Доллар США</option>
                  <option>EUR - Евро</option>
                  <option>PLN - Польский злотый</option>
                  <option>UAH - Украинская гривна</option>
                </select>
              </div>
            </div>

            <div style={{ marginLeft: 282, marginTop: 32 }}>
              <button style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Сохранить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
