"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Avatar } from "@/components/admin/ui";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch notifications logic
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.notifications.filter(n => !n.is_read).length);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // 2. Subscribe to realtime updates
    if (supabase) {
      const channel = supabase.channel('public:notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
          console.log("New notification received!", payload.new);
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          // Play a gentle notification sound if needed
          try { new Audio("/notification-ding.mp3").play().catch(() => {}); } catch(e) {}
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Handle opening notifications drawer
  const handleOpenNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsHelpOpen(false);
    setIsSettingsOpen(false);
    
    if (!isNotificationsOpen && unreadCount > 0) {
      // Mark as read in DB
      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const currentNav = NAV_DATA.find(n => n.id === activeMenu) || NAV_DATA[0];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-color)" }}>
      {/* 
        ==================================================
        IP WATERMARK (GLOBAL OVERLAY)
        ==================================================
      */}
      <div style={{
        position: 'fixed', bottom: 10, right: 10, zIndex: 9999, pointerEvents: 'none',
        color: 'rgba(0,0,0,0.1)', fontSize: '10px', fontFamily: 'monospace', textAlign: 'right'
      }}>
        Intellectual Property of iPhoenix Oleksandr Khrystodul<br/>
        +48729417050 | iPhoenixGSM@gmail.com
      </div>

      {/* Primary Sidebar (Icons) */}
      <aside 
        className="premium-glass"
        style={{
          width: 64,
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
            const isActive = activeMenu === nav.id && !isNotificationsOpen && !isHelpOpen && !isSettingsOpen;
            return (
              <button
                key={nav.id}
                onClick={() => { setActiveMenu(nav.id); setIsNotificationsOpen(false); setIsHelpOpen(false); setIsSettingsOpen(false); }}
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
              onClick={handleOpenNotifications}
              style={{ 
                background: isNotificationsOpen ? "rgba(255,255,255,0.1)" : "transparent", 
                border: "none", color: isNotificationsOpen ? "#fff" : "var(--faint)", cursor: "pointer",
                width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <Icon name="bell" size={20} />
              {unreadCount > 0 && (
                <div style={{ 
                  position: "absolute", top: 8, right: 10, width: 8, height: 8, 
                  background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 0 2px #0d1117" 
                }}></div>
              )}
            </button>
          </div>
          <button 
            onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotificationsOpen(false); setIsSettingsOpen(false); }}
            style={{ 
              background: isHelpOpen ? "rgba(255,255,255,0.1)" : "transparent", 
              border: "none", color: isHelpOpen ? "#fff" : "var(--faint)", cursor: "pointer", 
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
          >
            <Icon name="help-circle" size={20} />
          </button>
          <button 
            onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsNotificationsOpen(false); setIsHelpOpen(false); }}
            style={{ 
              background: isSettingsOpen ? "var(--color-primary)" : "transparent", 
              border: "none", color: isSettingsOpen ? "#fff" : "var(--faint)", cursor: "pointer", 
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
          >
            <Icon name="settings" size={20} />
          </button>
          <button 
            onClick={() => { setIsBillingOpen(!isBillingOpen); setIsNotificationsOpen(false); setIsHelpOpen(false); setIsSettingsOpen(false); setIsProfileOpen(false); }}
            style={{ 
              background: isBillingOpen ? "var(--color-primary)" : "transparent", 
              border: "none", color: isBillingOpen ? "#fff" : "var(--faint)", cursor: "pointer", 
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
          >
            <Icon name="briefcase" size={20} />
          </button>
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); setIsHelpOpen(false); setIsSettingsOpen(false); setIsBillingOpen(false); }}
            style={{ width: 32, height: 32, marginTop: 8, padding: 0, border: "none", background: "none", cursor: "pointer", borderRadius: "50%", boxShadow: isProfileOpen ? "0 0 0 2px var(--color-primary)" : "none" }}
          >
            <Avatar name="Admin" size={32} />
          </button>
        </div>
        
        {/* Intellectual Property Watermark (Vertical) */}
        <div style={{ position: "absolute", bottom: 80, left: 0, width: 64, color: "rgba(255,255,255,0.07)", fontSize: 8, textAlign: "center", pointerEvents: "none", transform: "rotate(-90deg)", whiteSpace: "nowrap", transformOrigin: "center" }}>
          © iPhoenix Oleksandr Khrystodul<br/>+48729417050 iPhoenixGSM@gmail.com
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
            <span style={{ fontWeight: 700, fontSize: 16 }}>Уведомления <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>({notifications.length})</span></span>
          </div>
          <Icon name="settings" size={16} color="#94a3b8" style={{ cursor: "pointer" }} />
        </div>
        <div style={{ display: "flex", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <button style={{ background: "none", border: "none", borderBottom: "2px solid #fff", color: "#fff", padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>События</button>
          <button style={{ background: "none", border: "none", borderBottom: "2px solid transparent", color: "#94a3b8", padding: "12px 16px", cursor: "pointer", fontSize: 13 }}>Системные</button>
        </div>
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" }}>
          {notifications.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
              Уведомлений нет
            </div>
          ) : (
            notifications.map((notif, i) => (
              <div key={notif.id || i} style={{ 
                padding: "16px 20px", 
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column", gap: 6,
                background: notif.is_read ? "transparent" : "rgba(255,255,255,0.05)",
                position: "relative"
              }}>
                {!notif.is_read && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#ef4444" }}></div>}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name={notif.type === "telegram" ? "send" : notif.type === "viber" ? "phone" : "info"} size={14} color="#94a3b8" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{notif.title}</span>
                </div>
                {notif.message && <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.4 }}>{notif.message}</div>}
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                  {new Date(notif.created_at || Date.now()).toLocaleString("ru-RU", { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Help Slide-out Panel */}
      <div style={{
        position: "absolute",
        top: 0,
        left: isHelpOpen ? 64 : -400,
        width: 350,
        height: "100vh",
        background: "#3263a5", // The exact blue color from the Help screenshot
        zIndex: 40,
        transition: "left 0.3s ease",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        color: "#fff"
      }}>
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="help-circle" size={18} color="#cbd5e1" />
          <span style={{ fontWeight: 700, fontSize: 18 }}>Помощь</span>
        </div>
        
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5 }}>ЗАДАТЬ ВОПРОС</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}></div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "background 0.2s" }}>
              <Icon name="message-circle" size={16} /> Здесь в чате
            </a>
            <a href="https://t.me/iPhoenix" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#229ED9", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.2s" }}>
              <Icon name="send" size={16} /> Telegram
            </a>
            <a href="viber://chat?number=%2B48729417050" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#7360F2", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.2s" }}>
              <Icon name="phone" size={16} /> Viber
            </a>
            <a href="https://wa.me/48729417050" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.2s" }}>
              <Icon name="message-square" size={16} /> WhatsApp
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.2s" }}>
              <Icon name="camera" size={16} /> Instagram
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1877F2", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.2s" }}>
              <Icon name="facebook" size={16} /> Facebook
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5 }}>ВНЕШНИЕ РЕСУРСЫ</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <a href="#" style={{ color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              Инструкции по keyCRM <Icon name="external-link" size={12} color="#94a3b8" />
            </a>
            <a href="#" style={{ color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              Обновления <Icon name="external-link" size={12} color="#94a3b8" />
            </a>
          </div>
        </div>
      </div>

      {/* Billing Slide-out Panel */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: isBillingOpen ? 64 : -400,
        width: 320,
        background: "#4b7fcc",
        zIndex: 50,
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "4px 0 15px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        borderRadius: "0 8px 8px 0"
      }}>
        <div style={{ padding: "20px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px 0", color: "#fff" }}>Состояние счета</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, marginBottom: 20 }}>
            <span>Остаток на счету:</span>
            <span style={{ fontWeight: 700 }}>0,00 USD</span>
          </div>

          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Использование в текущем месяце:</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.3)", paddingBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Базовый тариф</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>19,00 USD</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.3)", paddingBottom: 4 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Заявки</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>Всего 74 заявок</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700 }}>FREE</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.3)", paddingBottom: 4 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Сообщения</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>Всего 1850 сообщений</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700 }}>FREE</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>ВСЕГО:</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>19,00 USD</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "background 0.2s" }}>
            <Icon name="credit-card" size={14} /> Перейти к оплате
          </button>
          <a href="#" style={{ color: "#fff", fontSize: 12, textDecoration: "none", fontWeight: 500, transition: "opacity 0.2s" }}>История платежей</a>
        </div>
      </div>

      {/* Profile Slide-out Panel */}
      <div style={{
        position: "absolute",
        bottom: 10,
        left: isProfileOpen ? 64 : -400,
        width: 320,
        background: "#4b7fcc",
        zIndex: 50,
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "4px 0 15px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        borderRadius: "0 8px 8px 0",
        overflow: "hidden"
      }}>
        {/* Banner */}
        <div style={{ padding: "16px", background: "#0ea5e9", margin: "16px", borderRadius: 8, position: "relative", overflow: "hidden" }}>
          <p style={{ margin: "0 0 12px 0", fontSize: 13, fontWeight: 600, lineHeight: 1.4, position: "relative", zIndex: 2 }}>
            Приглашайте новых пользователей и получайте до 50% от их оплат в течении года
          </p>
          <button style={{ background: "transparent", border: "1px solid #fff", color: "#fff", padding: "6px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", position: "relative", zIndex: 2 }}>
            Узнать больше о программе
          </button>
          {/* Decorative coin */}
          <div style={{ position: "absolute", right: -10, top: "20%", width: 60, height: 60, background: "#fbbf24", borderRadius: "50%", border: "4px dashed #f59e0b", opacity: 0.8, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", fontSize: 32, fontWeight: 700 }}>$</div>
        </div>

        {/* User Info */}
        <div style={{ padding: "0 20px 20px 20px" }}>
          <span style={{ background: "#fff", color: "#1e3a8a", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, marginBottom: 12, display: "inline-block" }}>Administrator</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name="Alex Khrysto" size={48} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>Alex Khrysto</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>iphoenixgsm@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Links and Toggles */}
        <div style={{ background: "rgba(0,0,0,0.1)", padding: "20px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ background: "#10b981", color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Online</span>
            {/* Toggle ON */}
            <div style={{ width: 34, height: 20, background: "#0ea5e9", borderRadius: 20, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 16 }}></div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Темная тема</span>
            {/* Toggle OFF */}
            <div style={{ width: 34, height: 20, background: "#cbd5e1", borderRadius: 20, position: "relative", cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: 2 }}></div>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Мой профиль</div>
          <div style={{ fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>Просмотр под другой ролью</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16 }}>
            <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <Icon name="log-out" size={14} /> Выйти
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
               Рус <Icon name="chevron-down" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Slide-out Panel */}
      <div style={{
        position: "absolute",
        top: 0,
        left: isSettingsOpen ? 64 : -400,
        width: 350,
        height: "100vh",
        background: "#3263a5", // The exact blue color from the screenshots
        zIndex: 40,
        transition: "left 0.3s ease",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        overflowY: "auto"
      }}>
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="settings" size={18} color="#cbd5e1" />
          <span style={{ fontWeight: 700, fontSize: 18 }}>Настройки</span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", padding: "0 0 20px 0" }}>
          {[
            { label: "Основные", path: "/admin/crm-demo/settings/general" },
            { label: "Источники", path: "/admin/crm-demo/settings/sources" },
            { label: "Коммуникации", path: "/admin/crm-demo/settings/communications" },
            { label: "Воронки", path: "/admin/crm-demo/settings/funnels" },
            { label: "Заказы", path: "/admin/crm-demo/settings/orders" }, 
            { label: "Товары", path: "/admin/crm-demo/settings/products" },
            { label: "Доставки", path: "#" },
            { label: "Финансы", path: "/admin/crm-demo/settings/finances" },
            { label: "Дополнительно", path: "/admin/crm-demo/settings/additional" },
            { label: "Пользователи", path: "/admin/crm-demo/settings/users" },
            { label: "Роли", path: "/admin/crm-demo/settings/roles" }
          ].map(item => (
            <Link 
              key={item.label} 
              href={item.path} 
              onClick={() => setIsSettingsOpen(false)}
              style={{ padding: "12px 20px", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "background 0.2s" }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, marginBottom: 12, padding: "0 20px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5, textTransform: "uppercase" }}>Доступ</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          {[
            "Пользователи", "Роли", "История действий"
          ].map(item => (
            <a key={item} href="#" style={{ padding: "12px 20px", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "background 0.2s" }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Secondary Sidebar (Menu Items) */}
      <aside 
        className="premium-glass"
        style={{
          width: 240,
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
                {grp.items.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link 
                        href={item.href}
                        style={{
                          padding: "8px 12px", borderRadius: 8, fontSize: 14, textDecoration: "none",
                          color: isActive ? "var(--text)" : "var(--dim)",
                          background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                          fontWeight: isActive ? 600 : 500,
                          transition: "all 0.15s",
                          display: "block"
                        }}
                        onMouseEnter={e => { if(!isActive) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; } }}
                        onMouseLeave={e => { if(!isActive) { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.background = "transparent"; } }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
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
        <header 
          className="premium-glass"
          style={{
            height: 64, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", zIndex: 5
          }}
        >
          <Link href="/admin/crm-demo" style={{ textDecoration: "none" }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)", cursor: "pointer" }}>iPhoenixCRM</h1>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Search placeholder */}
            <motion.div 
              whileFocus={{ scale: 1.02 }}
              style={{ background: "rgba(0,0,0,0.04)", border: "1px solid var(--border)", padding: "8px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, color: "var(--faint)", fontSize: 13, width: 240, transition: "background 0.2s" }}
            >
              <Icon name="search" size={14} />
              <input type="text" placeholder="Быстрый поиск..." style={{ background: "transparent", border: "none", outline: "none", width: "100%", color: "var(--text)" }} />
            </motion.div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ minHeight: "100%" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
