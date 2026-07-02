"use client";
import React, { useState } from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_ORDER_FIELDS = [
  { id: 1, name: "№ заказа", desc: "Уникальный идентификатор заказа в системе", viewRole: "Все роли", editRole: "—", status: true },
  { id: 2, name: "№ заказа источника", desc: "Номер заказа во внешней системе (Etsy, Amazon, Shopify, OpenCart и т.д.)", viewRole: "Менеджер", editRole: "—", status: true },
  { id: 3, name: "Источник", desc: "Название источника, откуда был добавлен заказ (вручную, из API и т.д.)", viewRole: "Менеджер", editRole: "Менеджер", status: true },
  { id: 4, name: "Время создания", desc: "Время создания заказа по часовому поясу, указанному в настройках системы", viewRole: "Все роли", editRole: "—", status: true },
  { id: 5, name: "Менеджер", desc: "Пользователь, который назначен менеджером заказа", viewRole: "Все роли", editRole: "Менеджер", status: true },
  { id: 6, name: "Адрес доставки", desc: "Адрес покупателя (улица, дом) или номер склада почтового отделения", viewRole: "Менеджер, Склад", editRole: "Менеджер", status: true },
  { id: 7, name: "Товары", desc: "Отображает список заказанных товаров", viewRole: "Все роли", editRole: "—", status: true },
  { id: 8, name: "Сумма за товары", desc: "Общая стоимость товаров в заказе", viewRole: "Менеджер", editRole: "—", status: true },
  { id: 9, name: "UTM метки", desc: "UTM source, medium, campaign", viewRole: "Менеджер", editRole: "Administrator", status: true },
];

export default function OrdersSettingsPage() {
  const [activeTab, setActiveTab] = useState("fields");

  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Заказы</span>
      </div>

      <div style={{ background: "var(--panel)", borderRadius: 8, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        <div style={{ display: "flex", gap: 32, marginBottom: 40, borderBottom: "1px solid var(--border)", paddingBottom: 24 }}>
          <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 2 }}>
            Использовать Заказы
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
              В меню появится отдельный пункт «Заказы» и вы сможете настраивать статусы, поля и подключать источники
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
          {[
            { id: "fields", label: "Поля заказа" },
            { id: "statuses", label: "Статусы" },
            { id: "tags", label: "Теги" },
            { id: "export", label: "Экспорт заказов" },
            { id: "print", label: "Печать списков" }
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

        {activeTab === "fields" && (
          <>
            <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
              <div style={{ color: "#3b82f6", cursor: "pointer" }}>Доступ по ролям</div>
              <div style={{ color: "var(--faint)", cursor: "pointer" }}>Доступ ко всем</div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Список полей заказов</h3>
            
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", textTransform: "uppercase" }}>
                    <th style={{ padding: "16px 20px", fontWeight: 600 }}>Поле заказа</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600 }}>Описание</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600 }}>Какие роли могут просматривать</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600 }}>Какие роли могут редактировать</th>
                    <th style={{ padding: "16px 20px", fontWeight: 600, width: 60 }}>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDER_FIELDS.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: i === MOCK_ORDER_FIELDS.length - 1 ? "none" : "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{item.name}</td>
                      <td style={{ padding: "16px 20px", fontSize: 12, color: "var(--faint)", maxWidth: 300 }}>{item.desc}</td>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: "#3b82f6", cursor: "pointer" }}>{item.viewRole}</td>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: item.editRole === "—" ? "var(--faint)" : "#3b82f6", cursor: "pointer" }}>{item.editRole}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ width: 34, height: 20, background: item.status ? "#3b82f6" : "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: item.status ? 16 : 2, transition: "left 0.2s" }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
