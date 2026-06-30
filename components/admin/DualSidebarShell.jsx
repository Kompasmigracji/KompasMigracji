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
          { label: "Чаты", href: "/admin/crm-demo/chats" },
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
        title: "",
        items: [
          { label: "Товары", href: "/admin/crm-demo/products" },
          { label: "Публикации", href: "/admin/crm-demo/publications" },
          { label: "Остатки", href: "/admin/crm-demo/inventory" },
          { label: "Движение товаров", href: "/admin/crm-demo/movements" },
          { label: "Категории", href: "/admin/crm-demo/categories" },
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const currentNav = NAV_DATA.find(n => n.id === activeMenu) || NAV_DATA[0];

  return (
    <div className="kc-root" style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      
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
        zIndex: 50
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
            const isActive = activeMenu === nav.id && !isNotificationsOpen;
            return (
              <button
                key={nav.id}
                onClick={() => { setActiveMenu(nav.id); setIsNotificationsOpen(false); }}
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
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              style={{ 
                background: isNotificationsOpen ? "rgba(255,255,255,0.1)" : "transparent", 
                border: "none", color: isNotificationsOpen ? "#fff" : "var(--faint)", cursor: "pointer",
                width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <Icon name="bell" size={20} />
              <div style={{ position: "absolute", top: 10, right: 12, width: 6, height: 6, background: "#ef4444", borderRadius: "50%" }}></div>
            </button>
          </div>
          <button style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer", width: 44, height: 44 }}>
            <Icon name="help-circle" size={20} />
          </button>
          <button style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer", width: 44, height: 44 }}>
            <Icon name="settings" size={20} />
          </button>
          <button style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer", width: 44, height: 44 }}>
            <Icon name="briefcase" size={20} />
          </button>
          <div style={{ width: 32, height: 32, marginTop: 8 }}>
            <Avatar name="Admin" size={32} />
          </div>
        </div>
      </aside>

      {/* Notifications Slide-out Panel */}
      <div style={{
        position: "absolute",
        top: 0,
        left: isNotificationsOpen ? 64 : -400,
        width: 350,
        height: "100vh",
        background: "#1c2c54", // A specific blue-ish theme from the screenshot
        zIndex: 40,
        transition: "left 0.3s ease",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        color: "#fff"
      }}>
        <div style={{ padding: "24px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="bell" size={18} color="#94a3b8" />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Уведомления <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>(12)</span></span>
          </div>
          <Icon name="settings" size={16} color="#94a3b8" style={{ cursor: "pointer" }} />
        </div>
        <div style={{ display: "flex", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <button style={{ background: "none", border: "none", borderBottom: "2px solid transparent", color: "#94a3b8", padding: "12px 16px", cursor: "pointer", fontSize: 13 }}>События</button>
          <button style={{ background: "none", border: "none", borderBottom: "2px solid #fff", color: "#fff", padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Системные (12)</button>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13 }}>
          Уведомлений нет
        </div>
      </div>

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
