"use client";
import React, { useState } from "react";
import { Icon, Avatar, Badge } from "@/components/admin/ui";

// Mock Data matching the screenshot structure
const MOCK_ORDERS = [
  {
    id: "3",
    source: "Приватний вайбер",
    sourceIcon: "phone",
    sourceColor: "#a855f7",
    createdAt: "28.06.2023 18:07",
    deliveryDate: null, // show "+ Добавить"
    status: "новый",
    manager: "Анна Новікова",
    buyer: "Антон Павлюченко",
    deliveryService: null,
    trackingCode: "-",
    deliveryStatus: "-",
    products: "Автомобіль",
  },
  {
    id: "2",
    source: "Приватний вайбер",
    sourceIcon: "phone",
    sourceColor: "#a855f7",
    createdAt: "27.06.2023 09:55",
    deliveryDate: null,
    status: "новый",
    manager: "Олександр Воронцов",
    buyer: "Андрій Яблонський",
    deliveryService: null,
    trackingCode: "-",
    deliveryStatus: "-",
    products: "-",
  },
  {
    id: "1",
    source: "Приватний вайбер",
    sourceIcon: "phone",
    sourceColor: "#a855f7",
    createdAt: "27.06.2023 09:50",
    deliveryDate: null,
    status: "новый",
    manager: "Олександр Воронцов",
    buyer: "Олександр Шпак",
    deliveryService: null,
    trackingCode: "-",
    deliveryStatus: "-",
    products: "Автомобіль",
  }
];

export default function OrdersDemoPage() {
  const [activeFilter, setActiveFilter] = useState("новый");

  const filters = [
    { id: "all", label: "ФИЛЬТР СТАТУСОВ", color: "var(--dim)", outline: true },
    { id: "новый", label: "НОВЫЙ - 3", color: "#10b981", bg: "#d1fae5" }, // Green
    { id: "согласование", label: "СОГЛАСОВАНИЕ - 0", color: "#d97706", bg: "#fef3c7" }, // Yellow
    { id: "производство", label: "ПРОИЗВОДСТВО - 0", color: "#ea580c", bg: "#ffedd5" }, // Orange
    { id: "доставка", label: "ДОСТАВКА - 0", color: "#7c3aed", bg: "#ede9fe" }, // Purple
    { id: "выполнено", label: "ВЫПОЛНЕНО", color: "#10b981", outline: true },
    { id: "отменено", label: "ОТМЕНЕНО", color: "#ef4444", outline: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)" }}>Заказы</h2>
        
        {/* Search Bar */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          background: "var(--panel-2)", 
          border: "1px solid var(--border)", 
          borderRadius: 6,
          padding: "6px 12px",
          gap: 8,
          maxWidth: 400
        }}>
          <Icon name="search" size={16} color="var(--dim)" />
          <input 
            type="text" 
            placeholder="Быстрый поиск" 
            style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", width: "100%", fontSize: 13 }}
          />
        </div>

        <button style={{ 
          background: "var(--color-primary)", color: "#fff", border: "none", 
          padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginLeft: "auto"
        }}>
          <Icon name="plus" size={14} />
          Добавить заказ
        </button>
      </div>

      {/* Filter Pills */}
      <div style={{ 
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, 
        borderBottom: "1px solid var(--border)" 
      }}>
        {filters.map(f => (
          <button 
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: "pointer",
              border: f.outline ? \`1px solid \${f.color}\` : "1px solid transparent",
              background: f.outline ? "transparent" : f.bg,
              color: f.color,
              opacity: activeFilter === f.id ? 1 : 0.7,
              transition: "opacity 0.2s"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div style={{ 
        background: "var(--panel)", 
        border: "1px solid var(--border)", 
        borderRadius: 8,
        overflowX: "auto" 
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", color: "var(--dim)", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", width: 40 }}>
                <input type="checkbox" />
              </th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>№ заказа</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Источник</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Время создания</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Дата доставки/отправки</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Статус</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Менеджер</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Покупатель</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Служба доставки</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Трекинг код</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Статус доставки</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Товары</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map(order => (
              <tr key={order.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {order.id}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)" }}>
                    <Icon name={order.sourceIcon} size={14} color={order.sourceColor} />
                    {order.source}
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {order.createdAt}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <button style={{ background: "none", border: "none", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12 }}>
                    <Icon name="plus" size={12} /> Добавить
                  </button>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ background: "#d1fae5", color: "#10b981", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={order.manager} size={24} />
                    <span style={{ color: "var(--text)" }}>{order.manager}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--color-primary)" }}>
                  {order.buyer}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <button style={{ background: "none", border: "none", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12 }}>
                    <Icon name="plus" size={12} /> Добавить
                  </button>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="plus" size={12} />
                    <Icon name="file-text" size={12} />
                    <Icon name="edit-2" size={12} />
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  {order.deliveryStatus}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {order.products !== "-" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)" }}>
                      <Icon name="folder" size={14} />
                      {order.products}
                    </div>
                  ) : (
                    <span style={{ color: "var(--dim)" }}>-</span>
                  )}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--dim)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <Icon name="edit-2" size={14} style={{ cursor: "pointer" }} />
                    <Icon name="copy" size={14} style={{ cursor: "pointer" }} />
                    <Icon name="printer" size={14} style={{ cursor: "pointer" }} />
                    <Icon name="minus" size={14} style={{ cursor: "pointer" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end", alignItems: "center", color: "var(--dim)", fontSize: 12, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Показано 1 - 3 из 3 записей</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)", padding: "4px", borderRadius: 4 }}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <span>на странице</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
