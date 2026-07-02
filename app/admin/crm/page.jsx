import React from "react";
import { Icon } from "@/components/admin/ui";

export default function CrmDemoPage() {
  return (
    <div style={{ maxWidth: 1000, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--panel-2), var(--panel))",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h2 style={{ fontSize: 24, margin: "0 0 8px", color: "var(--text)" }}>Добро пожаловать в KompasCRM</h2>
          <p style={{ margin: 0, color: "var(--dim)", fontSize: 15, maxWidth: 500, lineHeight: 1.5 }}>
            Это новая концепция админ-панели с двухколоночным сайдбаром (в стиле KeyCRM), адаптированная под дизайн-систему KompasMigracji. 
          </p>
        </div>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(217,158,84,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="zap" size={32} color="var(--color-primary)" />
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Новых лидов", val: "14", icon: "user-plus", c: "var(--color-info)" },
          { label: "Заказов в работе", val: "38", icon: "shopping-bag", c: "var(--color-warning)" },
          { label: "Успешных сделок", val: "12", icon: "check-circle", c: "var(--color-success)" },
          { label: "Выручка", val: "48,500 zł", icon: "dollar-sign", c: "var(--color-primary)" },
        ].map(m => (
          <div key={m.label} style={{
            background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: 20
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, ${m.c} 15%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={m.icon} size={18} color={m.c} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dim)" }}>{m.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{m.val}</div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity Table Placeholder */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16, color: "var(--text)" }}>Последние заказы</h3>
          <button style={{ background: "transparent", border: "none", color: "var(--color-primary)", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            Смотреть все →
          </button>
        </div>
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--faint)", fontSize: 14 }}>
          Выберите раздел слева, чтобы просмотреть данные.
        </div>
      </div>
    </div>
  );
}
