"use client";
import React from "react";
import { Icon } from "@/components/admin/ui";

export default function GeneralSettingsPage() {
  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>Настройки</span>
        <Icon name="chevron-right" size={14} color="var(--faint)" />
        <span style={{ fontWeight: 600 }}>Основные</span>
      </div>

      {/* Main Panel */}
      <div style={{ background: "var(--panel)", borderRadius: 8, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        <form style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          
          {/* Row: Название компании */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              <span style={{ color: "#ef4444" }}>*</span> Название компании
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                defaultValue="kompasm"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 14, color: "#0f172a" }}
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                Название компании будет использоваться при генерации разного типа документов
              </div>
            </div>
          </div>

          {/* Row: Доменное имя */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              Доменное имя
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                defaultValue="kompasm.keycrm.app"
                disabled
                style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #e2e8f0", background: "#f1f5f9", outline: "none", fontSize: 14, color: "#64748b", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* Row: Страна */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              <span style={{ color: "#ef4444" }}>*</span> Страна
            </div>
            <div style={{ flex: 1 }}>
              <select style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 14, color: "#0f172a", appearance: "none" }}>
                <option>Польша</option>
              </select>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                Используется для определения телефонного кода страны по умолчанию
              </div>
            </div>
          </div>

          {/* Row: Часовой пояс */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              <span style={{ color: "#ef4444" }}>*</span> Часовой пояс
            </div>
            <div style={{ flex: 1 }}>
              <select style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #bae6fd", background: "#f0f9ff", outline: "none", fontSize: 14, color: "#0f172a", appearance: "none" }}>
                <option>(UTC +02:00) Warsaw</option>
              </select>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                Используется для отображения всех дат в системе
              </div>
            </div>
          </div>

          {/* Row: Логотип компании */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              Логотип компании
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ position: "relative", width: 120, height: 120, border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                <img src="/logo.png" alt="Logo" style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
                <button type="button" style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "#475569", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Icon name="x" size={14} />
                </button>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 12 }}>
                Логотип компании будет использоваться при генерации разного типа документов
              </div>
            </div>
          </div>

          {/* Row: Рабочий час */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              Рабочий час
            </div>
            <div style={{ flex: 1 }}>
              <button type="button" style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="plus" size={14} /> Добавить расписание
              </button>
            </div>
          </div>

          <div style={{ width: "100%", height: 1, background: "var(--border)", margin: "8px 0" }}></div>

          {/* Row: API ключ */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 250, flexShrink: 0, fontSize: 13, paddingTop: 10 }}>
              API ключ
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex" }}>
                <input 
                  type="text" 
                  defaultValue="YjYxOGU3MWNkYmVhMTlDOGE1YzhYZdhNGJkY2YxYjYzNGFmNjc0Mw"
                  readOnly
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "4px 0 0 4px", border: "1px solid #bae6fd", borderRight: "none", background: "#f0f9ff", outline: "none", fontSize: 14, color: "#94a3b8" }}
                />
                <button type="button" style={{ background: "#bae6fd", border: "1px solid #bae6fd", padding: "0 12px", borderRadius: "0 4px 4px 0", color: "#0ea5e9", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Icon name="copy" size={16} />
                </button>
              </div>
              <div style={{ fontSize: 13, color: "#3b82f6", marginTop: 8, cursor: "pointer" }}>
                Документация API
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
            <div style={{ width: 250, flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <button type="button" style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Сохранить
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
