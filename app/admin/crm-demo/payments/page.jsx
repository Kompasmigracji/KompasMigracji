"use client";
import React, { useEffect, useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { getSupabase } from "@/lib/supabase";

export default function PaymentsDemoPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from('custom_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPayments(data);
      }
      setLoading(false);
    };

    fetchPayments();

    const channel = supabase.channel('custom_payments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_payments' }, (payload) => {
        fetchPayments(); // Refresh on any change
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
        <h2 style={{ margin: 0, fontSize: 20, color: "var(--text)" }}>Журнал платежей</h2>
        
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
          Добавить оплату
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
              <th style={{ padding: "12px 16px", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                Дата и время <Icon name="arrow-down" size={12} />
              </th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Детали платежа</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>Пользователь</th>
              <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>Сумма</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Загрузка платежей...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: 24, textAlign: "center", color: "var(--dim)" }}>Журнал пуст</td></tr>
            ) : payments.map(pay => {
              const isIncome = pay.type === "income";
              const isCancelled = pay.status === "cancelled";
              const borderColor = isIncome ? "#10b981" : "#ef4444";
              const badgeBg = isIncome ? "#d1fae5" : "#fee2e2";
              
              const dateObj = new Date(pay.created_at);
              const dateStr = dateObj.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              
              return (
                <tr key={pay.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                  <td style={{ padding: "12px 16px", color: "var(--dim)", whiteSpace: "nowrap" }}>
                    {dateStr}
                  </td>
                  <td style={{ padding: "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", borderLeft: `3px solid ${borderColor}` }}>
                      <div>
                        <span style={{ background: badgeBg, color: borderColor, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                          {pay.type_label}
                        </span>
                      </div>
                      <span style={{ color: "var(--color-primary)", fontSize: 13 }}>{pay.description}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={pay.manager} size={24} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "var(--text)" }}>{pay.manager}</span>
                        <span style={{ fontSize: 10, color: "var(--dim)" }}>Administrator</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "right", color: borderColor, fontWeight: 600, fontSize: 13 }}>
                    {pay.amount} {pay.currency}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {isCancelled ? (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "1px solid #fca5a5", color: "#ef4444", padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>
                        <Icon name="x" size={12} /> Отменено
                      </div>
                    ) : (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "1px solid #6ee7b7", color: "#10b981", padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>
                        <Icon name="check" size={12} /> Оплачено
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}
