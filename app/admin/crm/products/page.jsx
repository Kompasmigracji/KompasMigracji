"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";


export default function ProductsDemoPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/products');
        const json = await res.json();
        setProducts(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();

    

    

    

    
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--panel)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "var(--color-primary)", width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Icon name="package" size={14} />
          </div>
          <h2 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>Товары</h2>
        </div>
        
        {/* Search Bar */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          background: "var(--bg)", 
          border: "1px solid var(--border)", 
          borderRadius: 4,
          padding: "6px 12px",
          gap: 8,
          width: 300
        }}>
          <Icon name="search" size={14} color="var(--dim)" />
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
          background: "var(--bg)", 
          border: "1px solid var(--border)", 
          borderRadius: 4,
          padding: "6px 12px",
          gap: 8,
          cursor: "pointer",
          minWidth: 180
        }}>
          <span style={{ color: "var(--dim)", fontSize: 13, flex: 1 }}>Выберите категорию...</span>
          <Icon name="chevron-down" size={14} color="var(--dim)" />
        </div>

        <button style={{ 
          background: "var(--color-primary)", color: "#fff", border: "none", 
          padding: "8px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginLeft: "auto"
        }}>
          <Icon name="plus" size={12} />
          Добавить товар
        </button>
      </div>

      {/* Data Table */}
      <div style={{ 
        background: "var(--panel)", 
        border: "1px solid var(--border)", 
        borderRadius: 4,
        overflowX: "auto" 
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000, fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", color: "var(--dim)", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", width: 40 }}>
                <input type="checkbox" />
              </th>
              <th style={{ padding: "12px 8px", width: 40, textAlign: "center" }}>
                -
              </th>
              <th style={{ padding: "12px 8px", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                Название <Icon name="arrow-up" size={10} color="var(--color-primary)" />
              </th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Категория</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Стоимость <Icon name="arrow-up" size={10} color="var(--color-primary)" /></th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Количество <Icon name="arrow-up" size={10} color="var(--color-primary)" /></th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Наличие</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Загрузка товаров из базы...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Нет товаров</td></tr>
            ) : products.map(product => (
              <tr key={product.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", padding: 6, border: "1px solid var(--border)", borderRadius: 4, color: "var(--dim)" }}>
                    <Icon name="camera" size={14} />
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--color-primary)", fontWeight: 500 }}>
                  <Icon name="folder" size={12} style={{ marginRight: 6 }} color="var(--color-primary)" />
                  {product.name}
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  {product.category || "-"}
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)", fontWeight: 500 }}>
                  {Number(product.price).toFixed(2)} PLN
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {product.qty_in_stock} шт
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  {product.qty_in_stock > 0 ? "В наличии" : "Нет"}
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
