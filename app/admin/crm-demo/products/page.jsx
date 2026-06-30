"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";

const MOCK_PRODUCTS = [
  { id: 1, name: "Довідка про несудимість", category: "Довідки", price: "450.00 PLN", qty: "5 шт" },
  { id: 2, name: "Карта побиту", category: "Легалізація", price: "1200.00 PLN", qty: "3 шт" },
  { id: 3, name: "Автомобіль (реєстрація)", category: "Авто", price: "550.00 PLN", qty: "10 шт" },
  { id: 4, name: "Юридична година", category: "Консультації", price: "450.00 PLN", qty: "2 шт" },
  { id: 5, name: "Песель UKR", category: "Легалізація", price: "300.00 PLN", qty: "5 шт" },
  { id: 6, name: "Присяжний переклад", category: "Переклади", price: "150.00 PLN", qty: "8 шт" },
  { id: 7, name: "Відкриття JDG", category: "Бізнес", price: "1500.00 PLN", qty: "1 шт" },
];

export default function ProductsDemoPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)" }}>Каталог</h2>
        
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

        {/* Category Dropdown (Mock) */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          background: "var(--panel-2)", 
          border: "1px solid var(--border)", 
          borderRadius: 6,
          padding: "6px 12px",
          gap: 8,
          cursor: "pointer"
        }}>
          <Icon name="menu" size={16} color="var(--dim)" />
          <span style={{ color: "var(--text)", fontSize: 13 }}>Выбрать категорию</span>
          <Icon name="chevron-down" size={14} color="var(--dim)" />
        </div>

        <button style={{ 
          background: "var(--panel-2)", border: "1px solid var(--border)", 
          padding: "8px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center"
        }}>
          <Icon name="sliders" size={14} color="var(--dim)" />
        </button>

        <button style={{ 
          background: "var(--color-primary)", color: "#fff", border: "none", 
          padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginLeft: "auto"
        }}>
          <Icon name="plus" size={14} />
          Добавить товар
        </button>
      </div>

      {/* Data Table */}
      <div style={{ 
        background: "var(--panel)", 
        border: "1px solid var(--border)", 
        borderRadius: 8,
        overflowX: "auto" 
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", color: "var(--dim)", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", width: 40 }}>
                <input type="checkbox" />
              </th>
              <th style={{ padding: "12px 8px", width: 40 }}>
                <Icon name="image" size={14} color="var(--dim)" />
              </th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Наименование</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Категория</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Стоимость</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Количество</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Наличие</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PRODUCTS.map(product => (
              <tr key={product.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ width: 32, height: 32, background: "var(--panel-2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="package" size={16} color="var(--dim)" />
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--color-primary)", fontWeight: 500 }}>
                  {product.name}
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {product.category}
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)", fontWeight: 500 }}>
                  {product.price}
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  {product.qty}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#d1fae5", color: "#10b981", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></span>
                    В НАЛИЧИИ
                  </div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--dim)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <Icon name="edit-2" size={14} style={{ cursor: "pointer" }} />
                    <Icon name="copy" size={14} style={{ cursor: "pointer" }} />
                    <Icon name="trash-2" size={14} style={{ cursor: "pointer" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--dim)", fontSize: 12, borderTop: "1px solid var(--border)", background: "var(--panel)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button style={{ padding: "4px 8px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--dim)" }}>{"<"}</button>
            <button style={{ padding: "4px 8px", background: "var(--color-primary)", border: "1px solid var(--color-primary)", borderRadius: 4, cursor: "pointer", color: "#fff", fontWeight: 600 }}>1</button>
            <button style={{ padding: "4px 8px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--dim)" }}>{">"}</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Показано 1 - 7 из 7 записей</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)", padding: "4px", borderRadius: 4 }}>
                <option>15</option>
                <option>25</option>
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
