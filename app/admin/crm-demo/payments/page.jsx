"use client";
import React from "react";
import { Icon, Avatar } from "@/components/admin/ui";

// Mock Data matching the Payment Journal screenshot structure
const MOCK_PAYMENTS = [
  { id: 1, date: "15.06 12:47", type: "income", typeLabel: "Оплаты", desc: "Банковский перевод PL: Чат з Alena Holovina", manager: "Анна Новікова", amount: "500,00 PLN", status: "cancelled" },
  { id: 2, date: "06.05.2023 16:50", type: "expense", typeLabel: "Затраты", desc: "Бонус сотруднику: Чат 2", manager: "Анна Новікова", amount: "-50,00 PLN", status: "paid" },
  { id: 3, date: "06.05.2023 16:50", type: "expense", typeLabel: "Затраты", desc: "Бонус сотруднику: Чат 3", manager: "Анна Новікова", amount: "-50,00 PLN", status: "paid" },
  { id: 4, date: "06.05.2023 16:47", type: "income", typeLabel: "Оплаты", desc: "Банковский перевод PL: Чат 2", manager: "Анна Новікова", amount: "200,00 PLN", status: "paid" },
  { id: 5, date: "06.05.2023 09:16", type: "income", typeLabel: "Оплаты", desc: "Банковская карта UA: Чат з Саша", manager: "Олександр Воронцов", amount: "200,00 PLN", status: "paid" },
  { id: 6, date: "27.06.2023 10:25", type: "income", typeLabel: "Оплаты", desc: "Банковская карта UA: Чат з Vasyl Babiy", manager: "Олександр Воронцов", amount: "220,00 PLN", status: "paid" },
  { id: 7, date: "27.06.2023 09:15", type: "income", typeLabel: "Оплаты", desc: "Банковский перевод PL: Чат 1", manager: "Олександр Воронцов", amount: "200,00 PLN", status: "paid" },
  { id: 8, date: "26.06.2023 20:25", type: "income", typeLabel: "Оплаты", desc: "Банковский перевод PL: Чат з Василь", manager: "Олександр Воронцов", amount: "200,00 PLN", status: "cancelled" },
];

export default function PaymentsDemoPage() {
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
            {MOCK_PAYMENTS.map(pay => {
              const isIncome = pay.type === "income";
              const isCancelled = pay.status === "cancelled";
              const borderColor = isIncome ? "#10b981" : "#ef4444";
              const badgeBg = isIncome ? "#d1fae5" : "#fee2e2";
              
              return (
                <tr key={pay.id} style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
                  <td style={{ padding: "12px 16px", color: "var(--dim)", whiteSpace: "nowrap" }}>
                    {pay.date}
                  </td>
                  <td style={{ padding: "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", borderLeft: `3px solid ${borderColor}` }}>
                      <div>
                        <span style={{ background: badgeBg, color: borderColor, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                          {pay.typeLabel}
                        </span>
                      </div>
                      <span style={{ color: "var(--color-primary)", fontSize: 13 }}>{pay.desc}</span>
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
                    {pay.amount}
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
