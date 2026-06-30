"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";

export default function ProductsSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Товары</span>
      </div>

      <div style={{ background: "var(--panel)", borderRadius: 8, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          {[
            { id: "general", label: "Основные" },
            { id: "stock", label: "Склад" },
            { id: "statuses", label: "Статусы товаров" },
            { id: "production", label: "Производство" },
            { id: "suppliers", label: "Поставщики" }
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

        {activeTab === "general" && (
          <div style={{ maxWidth: 800 }}>
            {/* Toggles */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 32, marginBottom: 24 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Авто-создание товаров</div>
              <div style={{ flex: 1 }}>
                <div style={{ width: 34, height: 20, background: "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer", marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 2, transition: "left 0.2s" }}></div>
                </div>
                <div style={{ fontSize: 12, color: "var(--faint)" }}>Автоматически создавать товары из новых публикаций на источниках во время синхронизации заказов</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 32, marginBottom: 24 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Редактирование товара в заказе</div>
              <div style={{ flex: 1 }}>
                <div style={{ width: 34, height: 20, background: "#3b82f6", borderRadius: 20, position: "relative", cursor: "pointer", marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 16, transition: "left 0.2s" }}></div>
                </div>
                <div style={{ fontSize: 12, color: "var(--faint)" }}>Разрешить редактирование свойств товаров на источниках внутри заказа (актуально для handmade)</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 32, marginBottom: 32, borderBottom: "1px solid var(--border)", paddingBottom: 32 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Использовать штрихкоды</div>
              <div style={{ flex: 1 }}>
                <div style={{ width: 34, height: 20, background: "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer", marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 2, transition: "left 0.2s" }}></div>
                </div>
                <div style={{ fontSize: 12, color: "var(--faint)" }}>Добавить к товарам поле для штрихкода</div>
              </div>
            </div>

            {/* Additional Units */}
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Дополнительные единицы измерения количества товаров</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 32, borderBottom: "1px solid var(--border)", paddingBottom: 32 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Единица измерения</div>
              <div style={{ flex: 1 }}>
                <button style={{ background: "transparent", border: "1px solid #bae6fd", color: "#3b82f6", padding: "6px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  + Добавить
                </button>
              </div>
            </div>

            {/* Postal Units */}
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Единицы измерения для отправки заказов почтовыми службами</h4>
            
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 16 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Единица веса</div>
              <div style={{ flex: 1 }}>
                <select style={{ width: "200px", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 13 }}>
                  <option>Грамм</option>
                  <option>Килограмм</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 32 }}>
              <div style={{ width: 250, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>Единица размера</div>
              <div style={{ flex: 1 }}>
                <select style={{ width: "200px", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 13 }}>
                  <option>Сантиметр</option>
                  <option>Метр</option>
                </select>
              </div>
            </div>

            <div style={{ marginLeft: 282 }}>
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
