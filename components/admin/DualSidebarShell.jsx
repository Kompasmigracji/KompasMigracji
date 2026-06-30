"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Avatar } from "./ui";

const NAV_DATA = [
  {
    id: "sales",
    icon: "shopping-cart",
    label: "Продажи",
    groups: [
      {
        title: "",
        items: [
          { label: "Воронки", href: "/admin/crm-demo/funnels" },
          { label: "Заказы", href: "/admin/crm-demo/orders" },
          { label: "Списки заказов", href: "/admin/crm-demo/order-lists" },
          { label: "Покупатели", href: "/admin/crm-demo/buyers" },
          { label: "История звонков", href: "/admin/crm-demo/calls" },
        ]
      },
      {
        title: "ФИНАНСЫ",
        items: [
          { label: "Журнал платежей", href: "/admin/crm-demo/payments" },
        ]
      }
    ]
  },
  {
    id: "products",
    icon: "package",
    label: "Товары",
    groups: [
      {
        title: "КАТАЛОГ",
        items: [
          { label: "Все товары", href: "/admin/crm-demo/products" },
          { label: "Склады", href: "/admin/crm-demo/inventory" },
        ]
      }
    ]
  },
  {
    id: "analytics",
    icon: "bar-chart-2",
    label: "Аналитика",
    groups: [
      {
        title: "ОТЧЕТЫ",
        items: [
          { label: "Дашборд", href: "/admin/crm-demo/dashboard" },
          { label: "Эффективность", href: "/admin/crm-demo/efficiency" },
        ]
      }
    ]
  }
];

export default function DualSidebarShell({ children }) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("sales");

  const currentNav = NAV_DATA.find(n => n.id === activeMenu) || NAV_DATA[0];

  return (
    <div className="kc-root" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Primary Sidebar (Icons) */}
      <aside style={{
        width: 64,
        background: "#0d1117",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        flexShrink: 0,
        zIndex: 20
      }}>
        {/* Brand Lock/Compass Logo */}
        <div style={{
          width: 40, height: 40, borderRadius: 20, background: "var(--color-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 32, cursor: "pointer", boxShadow: "0 0 15px rgba(217, 158, 84, 0.4)"
        }}>
          <Icon name="compass" size={24} color="#0d1117" />
        </div>

        {/* Primary Nav Icons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center", flex: 1 }}>
          {NAV_DATA.map(nav => {
            const isActive = activeMenu === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveMenu(nav.id)}
                title={nav.label}
                style={{
                  width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
                  background: isActive ? "var(--border)" : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--faint)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = "var(--faint)"; }}
              >
                <Icon name={nav.icon} size={22} />
              </button>
            );
          })}
        </div>

        {/* Bottom Icons (Settings, Profile, etc) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <button style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer" }}>
            <Icon name="bell" size={20} />
          </button>
          <button style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer" }}>
            <Icon name="help-circle" size={20} />
          </button>
          <button style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer" }}>
            <Icon name="settings" size={20} />
          </button>
          <div style={{ width: 32, height: 32, marginTop: 16 }}>
            <Avatar name="Admin" size={32} />
          </div>
        </div>
      </aside>

      {/* Secondary Sidebar (Menu Items) */}
      <aside style={{
        width: 240,
        background: "var(--panel)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 10
      }}>
        {/* Header of Secondary Sidebar */}
        <div style={{
          height: 64, display: "flex", alignItems: "center", padding: "0 20px", gap: 12,
          borderBottom: "1px solid transparent", color: "var(--text)", fontWeight: 700, fontSize: 18
        }}>
          <Icon name={currentNav.icon} size={20} color="var(--color-primary)" />
          {currentNav.label}
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {currentNav.groups.map((grp, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              {grp.title && (
                <div style={{ 
                  display: "flex", alignItems: "center", padding: "0 20px", marginBottom: 12, gap: 12
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.05em" }}>
                    {grp.title}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" }}>
                {grp.items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      style={{
                        padding: "8px 12px", borderRadius: 8, fontSize: 14, textDecoration: "none",
                        color: isActive ? "var(--text)" : "var(--dim)",
                        background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                        fontWeight: isActive ? 600 : 500,
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { if(!isActive) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; } }}
                      onMouseLeave={e => { if(!isActive) { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.background = "transparent"; } }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button (Instructions) */}
        <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
          <button style={{
            width: "100%", padding: "10px", borderRadius: 8, background: "transparent",
            border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <Icon name="external-link" size={14} color="var(--dim)" />
            Инструкции по CRM
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar of main area */}
        <header style={{
          height: 64, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between"
        }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Панель админа</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Search placeholder */}
            <div style={{ background: "var(--panel)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 6, display: "flex", alignItems: "center", gap: 8, color: "var(--faint)", fontSize: 13, width: 200 }}>
              <Icon name="search" size={14} />
              Поиск...
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
