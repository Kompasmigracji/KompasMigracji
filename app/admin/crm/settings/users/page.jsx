"use client";
import React from "react";
import { Icon, Avatar } from "@/components/admin/ui";

const MOCK_USERS = [
  { id: 1, name: "Alex Khryuko", role: "Administrator", email: "alex.khryuko@gmail.com", status: "Активный", workStatus: "Online", lastLogin: "Сегодня, 22:30", twoFactor: "Выключена", createdAt: "20.02.2023", active: true },
  { id: 2, name: "Олена Слободянюк", role: "Administrator", email: "elena.slobod@gmail.com", status: "Активный", workStatus: "Online", lastLogin: "23.03 19:20", twoFactor: "Выключена", createdAt: "18.04.10:32", active: true },
  { id: 3, name: "Аліна Новікова", role: "Administrator", email: "alina.nov@gmail.com", status: "Заблокирован", workStatus: "Offline", lastLogin: "08.01 22:48", twoFactor: "Выключена", createdAt: "22.08.2023 22:14", active: false },
  { id: 4, name: "Юлія Непина", role: "Administrator", email: "julia.nepyna@gmail.com", status: "Активный", workStatus: "Online", lastLogin: "Вчера 18:00", twoFactor: "Выключена", createdAt: "22.05.2024 08:58", active: true },
  { id: 5, name: "Олександр Рай", role: "Manager", email: "alex.ray@gmail.com", status: "Активный", workStatus: "Online", lastLogin: "Сегодня 22:15", twoFactor: "Выключена", createdAt: "10.11.2023 14:00", active: true },
  { id: 6, name: "Даша Пилипченко", role: "Manager", email: "dasha.p@gmail.com", status: "Активный", workStatus: "Online", lastLogin: "Сегодня 20:10", twoFactor: "Выключена", createdAt: "11.06.2024 12:35", active: true },
];

export default function UsersSettingsPage() {
  return (
    <div style={{ padding: "24px", background: "var(--bg-color)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Пользователи</h1>
          
          <div style={{ position: "relative", width: 300 }}>
            <Icon name="search" size={16} color="var(--faint)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" 
              placeholder="Поиск" 
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 4, border: "1px solid var(--border)", background: "#fff", outline: "none", fontSize: 13 }}
            />
          </div>
        </div>

        <button style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <Icon name="plus" size={16} /> Добавить пользователя
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
        {MOCK_USERS.map((user) => (
          <div key={user.id} style={{ background: "var(--panel)", borderRadius: 8, border: "1px solid var(--border)", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            
            {/* Card Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={user.name} size={40} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 4 }}>
                    {user.name}
                    <Icon name="check-circle" size={14} color="#94a3b8" />
                  </span>
                  <span style={{ fontSize: 10, background: "#1e3a8a", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 600, alignSelf: "flex-start", textTransform: "uppercase" }}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button style={{ background: "none", border: "none", color: "var(--faint)", cursor: "pointer" }}>
                <Icon name="more-horizontal" size={16} />
              </button>
            </div>

            {/* Card Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>E-mail</span>
                <a href={`mailto:${user.email}`} style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>{user.email}</a>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>Статус</span>
                <span style={{ color: user.active ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{user.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>Рабочий статус</span>
                <span style={{ background: user.workStatus === "Online" ? "#dcfce7" : "#fee2e2", color: user.workStatus === "Online" ? "#16a34a" : "#dc2626", padding: "2px 8px", borderRadius: 12, fontWeight: 600, fontSize: 11 }}>
                  {user.workStatus}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>Последнее изменение рабочего статуса</span>
                <span style={{ color: "var(--text)" }}>—</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>Последний вход</span>
                <span style={{ color: "var(--text)" }}>{user.lastLogin}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>Двухэтапная проверка</span>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>{user.twoFactor}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--faint)", fontWeight: 500 }}>Дата создания</span>
                <span style={{ color: "var(--text)" }}>{user.createdAt}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
