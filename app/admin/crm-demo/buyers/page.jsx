"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { getSupabase } from "@/lib/supabase";

export default function BuyersDemoPage() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;
    
    // Fetch initial buyers
    const fetchBuyers = async () => {
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setBuyers(data);
      }
      setLoading(false);
    };

    fetchBuyers();

    // Subscribe to realtime changes
    const channel = supabase.channel('buyers_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buyers' }, (payload) => {
        fetchBuyers(); // Refresh on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
      
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)" }}>Покупатели</h2>
        
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
          Добавить покупателя
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
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Покупатель</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Email</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Телефон</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Кол-во заказов</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Последний заказ</th>
              <th style={{ padding: "12px 8px", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                Дата создания <Icon name="arrow-down" size={12} color="var(--color-primary)" />
              </th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Менеджер</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Загрузка данных из базы...</td></tr>
            ) : buyers.length === 0 ? (
              <tr><td colSpan="9" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Нет покупателей</td></tr>
            ) : buyers.map(buyer => (
              <tr key={buyer.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="user" size={12} color="var(--dim)" />
                    </div>
                    <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>{buyer.full_name || "Без имени"}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: !buyer.email ? "var(--color-primary)" : "var(--color-info)", fontWeight: buyer.email ? 500 : 400 }}>
                  {buyer.email || "[пусто]"}
                </td>
                <td style={{ padding: "12px 8px", color: !buyer.phone ? "var(--color-primary)" : "var(--color-info)", whiteSpace: "pre-line" }}>
                  {buyer.phone || "[пусто]"}
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  -
                </td>
                <td style={{ padding: "12px 8px", color: "var(--dim)" }}>
                  -
                </td>
                <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                  {new Date(buyer.created_at).toLocaleString('ru-RU')}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ color: "var(--dim)" }}>-</span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--dim)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <Icon name="edit-2" size={14} style={{ cursor: "pointer" }} />
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
            <button style={{ padding: "4px 8px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--text)" }}>2</button>
            <button style={{ padding: "4px 8px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--dim)" }}>{">"}</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Показано 1 - 10 из 25 записей</span>
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
