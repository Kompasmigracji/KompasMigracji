"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar, Badge } from "@/components/admin/ui";


export default function OrdersDemoPage() {
  const [activeFilter, setActiveFilter] = useState("новый");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/orders');
        const json = await res.json();
        setOrders(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();

    

    

    

    
  }, []);

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
              border: f.outline ? `1px solid ${f.color}` : "1px solid transparent",
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
            {loading ? (
              <tr><td colSpan="13" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Загрузка данных из базы...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="13" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Нет заказов</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {order.order_number}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)" }}>
                    <Icon name="phone" size={14} color="#a855f7" />
                    Приватний вайбер
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {new Date(order.created_at).toLocaleString('ru-RU')}
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
                  <span style={{ color: "var(--dim)" }}>-</span>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--color-primary)" }}>
                  {order.buyers?.full_name || "Без имени"}
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
                  -
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ color: "var(--dim)" }}>-</span>
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
