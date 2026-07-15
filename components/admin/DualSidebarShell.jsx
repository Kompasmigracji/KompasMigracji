"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Avatar } from "@/components/admin/ui";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitch from "@/components/ThemeSwitch";
import CommandPalette from "./CommandPalette";
import AiCopilotSidebar from "./AiCopilotSidebar";

const NAV_DATA = [
  {
    id: "sales",
    icon: "shopping-cart",
    label: "Продажи",
    groups: [
      {
        title: "",
        items: [
          { label: "Дашборд", href: "/admin/crm/dashboard" },
          { label: "Ліди", href: "/admin/crm/leads" },
          { label: "Воронка лідів (Kanban)", href: "/admin/crm/funnels" },
          { label: "Воронка угод (Deals)", href: "/admin/crm/deals" },
          { label: "Покупці", href: "/admin/crm/buyers" },
          { label: "Автоматизація (E2E)", href: "/admin/crm/automation-test" },
          { label: "Списки заказов", href: "/admin/crm/order-lists" },
          { label: "Покупатели", href: "/admin/crm/buyers" },
          { label: "История звонков", href: "/admin/crm/calls" },
        ]
      },
      {
        title: "ПРОДАЖІ ТА МАРКЕТИНГ",
        items: [
          { label: "Email Розсилки", href: "/admin/crm/emails" },
          { label: "Мої Задачі", href: "/admin/crm/tasks" },
        ]
      },
      {
        title: "HR / РЕКРУТИНГ",
        items: [
          { label: "Вакансії", href: "/admin/crm/jobs" },
        ]
      },
      {
        title: "ФИНАНСЫ",
        items: [
          { label: "Журнал платежей", href: "/admin/crm/payments" },
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
          { label: "Товары", href: "/admin/crm/products" },
          { label: "Публикации", href: "/admin/crm/publications" },
          { label: "Остатки", href: "/admin/crm/inventory" },
          { label: "Движение товаров", href: "/admin/crm/movements" },
          { label: "Категории", href: "/admin/crm/categories" },
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
          { label: "Дашборд", href: "/admin/crm/dashboard" },
          { label: "Фінансові Звіти", href: "/admin/crm/reports" },
          { label: "Эффективность", href: "/admin/crm/efficiency" },
        ]
      }
    ]
  },
  {
    id: "legacy",
    icon: "archive",
    label: "Старий адмін",
    groups: [
      {
        title: "",
        items: [
          { label: "Старий адмін (усі модулі) ↗", href: "/admin" },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Fetch notifications logic
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
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

    if (supabase) {
      const channel = supabase.channel('public:notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          try { new Audio("/notification-ding.mp3").play().catch(() => {}); } catch(e) {}
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsHelpOpen(false);
    setIsSettingsOpen(false);
    
    if (!isNotificationsOpen && unreadCount > 0) {
      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const currentNav = NAV_DATA.find(n => n.id === activeMenu) || NAV_DATA[0];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f7] dark:bg-[#0a0a0a] text-gray-700 dark:text-gray-300 font-sans selection:bg-blue-500/30 relative">
      
      {/* IP WATERMARK */}
      <div className="fixed bottom-2 right-2 z-[9999] pointer-events-none text-[10px] font-mono text-white/10 text-right">
        Intellectual Property of iPhoenix Oleksandr Khrystodul<br/>
        +48729417050 | iPhoenixGSM@gmail.com
      </div>

      {/* Primary Sidebar (Icons) */}
      <aside className="hidden md:flex w-16 border-r border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-xl flex-col items-center py-4 shrink-0 z-50 relative">
        {/* Brand Lock/Compass Logo */}
        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center mb-8 cursor-pointer transition-transform hover:scale-110">
          <Icon name="compass" size={20} color="#60a5fa" />
        </div>

        {/* Primary Nav Icons */}
        <div className="flex flex-col gap-4 w-full items-center flex-1">
          {NAV_DATA.map(nav => {
            const isActive = activeMenu === nav.id && !isNotificationsOpen && !isHelpOpen && !isSettingsOpen;
            return (
              <button
                key={nav.id}
                onClick={() => { setActiveMenu(nav.id); setIsNotificationsOpen(false); setIsHelpOpen(false); setIsSettingsOpen(false); }}
                title={nav.label}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 relative group
                  ${isActive ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'}`}
              >
                <Icon name={nav.icon} size={22} />
                {isActive && (
                  <motion.div layoutId="activeNavIndicator" className="absolute left-0 w-1 h-full bg-blue-500 rounded-r-md" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Icons (Settings, Profile, etc) */}
        <div className="flex flex-col gap-4 items-center">
          <div className="relative">
            <button 
              onClick={handleOpenNotifications}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
                ${isNotificationsOpen ? 'bg-white/80 dark:bg-white/20 text-gray-900 dark:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'}`}
            >
              <Icon name="bell" size={20} />
              {unreadCount > 0 && (
                <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_0_2px_#050505]"></div>
              )}
            </button>
          </div>
          <button 
            onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotificationsOpen(false); setIsSettingsOpen(false); }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
              ${isHelpOpen ? 'bg-white/80 dark:bg-white/20 text-gray-900 dark:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'}`}
          >
            <Icon name="help-circle" size={20} />
          </button>
          <button 
            onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsNotificationsOpen(false); setIsHelpOpen(false); }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
              ${isSettingsOpen ? 'bg-white/80 dark:bg-white/20 text-gray-900 dark:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'}`}
          >
            <Icon name="settings" size={20} />
          </button>
          <button 
            onClick={() => { setIsBillingOpen(!isBillingOpen); setIsNotificationsOpen(false); setIsHelpOpen(false); setIsSettingsOpen(false); setIsProfileOpen(false); setIsCopilotOpen(false); }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
              ${isBillingOpen ? 'bg-white/80 dark:bg-white/20 text-gray-900 dark:text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'}`}
          >
            <Icon name="briefcase" size={20} />
          </button>
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); setIsHelpOpen(false); setIsSettingsOpen(false); setIsBillingOpen(false); }}
            className={`w-8 h-8 mt-2 rounded-full overflow-hidden transition-all duration-300 border-2 
              ${isProfileOpen ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-transparent hover:border-gray-500'}`}
          >
            <Avatar name="Admin" size={28} />
          </button>
        </div>
      </aside>

      {/* Slide-out Panels */}
      <AnimatePresence>
        {/* Notifications */}
        {isNotificationsOpen && (
          <motion.div 
            initial={{ x: -400 }} animate={{ x: 64 }} exit={{ x: -400 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 w-[350px] h-screen bg-white/95 dark:bg-[#111]/95 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 z-40 shadow-2xl flex flex-col text-gray-900 dark:text-white"
          >
            <div className="p-6 pb-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <Icon name="bell" size={18} color="#94a3b8" />
                <span className="font-bold text-lg">Уведомления <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">({notifications.length})</span></span>
              </div>
              <Icon name="settings" size={16} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="flex px-5 border-b border-black/10 dark:border-white/10">
              <button className="border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-4 py-3 text-sm font-semibold">События</button>
              <button className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-3 text-sm transition-colors">Системные</button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">Уведомлений нет</div>
              ) : (
                notifications.map((notif, i) => (
                  <div key={notif.id || i} className={`p-4 border-b border-black/5 dark:border-white/5 flex flex-col gap-1.5 relative transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${notif.is_read ? 'bg-transparent' : 'bg-blue-500/5 dark:bg-blue-500/10'}`}>
                    {!notif.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                    <div className="flex items-center gap-2">
                      <Icon name={notif.type === "telegram" ? "send" : notif.type === "viber" ? "phone" : "info"} size={14} className="text-gray-500" />
                      <span className="text-sm font-semibold text-gray-800">{notif.title}</span>
                    </div>
                    {notif.message && <div className="text-sm text-gray-500 leading-relaxed">{notif.message}</div>}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at || Date.now()).toLocaleString("ru-RU", { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Help */}
        {isHelpOpen && (
          <motion.div 
            initial={{ x: -400 }} animate={{ x: 64 }} exit={{ x: -400 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 w-[350px] h-screen bg-white/95 dark:bg-[#111]/95 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 z-40 shadow-2xl flex flex-col text-gray-900 dark:text-white p-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Icon name="help-circle" size={20} className="text-blue-400" />
              <span className="font-bold text-xl">Помощь</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-gray-500 tracking-wider">ЗАДАТЬ ВОПРОС</span>
              <div className="flex-1 h-px bg-white/80"></div>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href="https://t.me/iPhoenix" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#229ED9]/10 text-[#229ED9] border border-[#229ED9]/20 p-3 rounded-xl text-sm font-semibold hover:bg-[#229ED9]/20 transition-colors">
                <Icon name="send" size={16} /> Telegram
              </a>
              <a href="https://wa.me/48729417050" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 p-3 rounded-xl text-sm font-semibold hover:bg-[#25D366]/20 transition-colors">
                <Icon name="message-square" size={16} /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}

        {/* Settings */}
        {isSettingsOpen && (
          <motion.div 
            initial={{ x: -400 }} animate={{ x: 64 }} exit={{ x: -400 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 w-[350px] h-screen bg-white/95 dark:bg-[#111]/95 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 z-40 shadow-2xl flex flex-col text-gray-900 dark:text-white"
          >
            <div className="p-6 flex items-center gap-3">
              <Icon name="settings" size={20} className="text-blue-400" />
              <span className="font-bold text-xl">Настройки</span>
            </div>
            
            <div className="flex flex-col py-2">
              {[
                { label: "Основные", path: "/admin/crm/settings/general" },
                { label: "Источники", path: "/admin/crm/settings/sources" },
                { label: "Коммуникации", path: "/admin/crm/settings/communications" },
                { label: "Воронки", path: "/admin/crm/settings/funnels" },
                { label: "Заказы", path: "/admin/crm/settings/orders" }, 
                { label: "Товары", path: "/admin/crm/settings/products" },
                { label: "Финансы", path: "/admin/crm/settings/finances" },
                { label: "Пользователи", path: "/admin/crm/settings/users" },
                { label: "Роли", path: "/admin/crm/settings/roles" }
              ].map(item => (
                <Link 
                  key={item.label} 
                  href={item.path} 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Sidebar (Menu Items) */}
      <aside className="hidden md:flex w-[240px] border-r border-black/5 dark:border-white/5 bg-[#f5f5f7] dark:bg-[#0a0a0a] flex-col shrink-0 z-10">
        <div className="h-16 flex items-center px-6 gap-3 font-bold text-lg text-gray-900 dark:text-white">
          <Icon name={currentNav.icon} size={20} className="text-blue-400" />
          {currentNav.label}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          {currentNav.groups.map((grp, i) => (
            <div key={i}>
              {grp.title && (
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-3 px-2">
                  {grp.title}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {grp.items.map(item => {
                  const isItemActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3
                        ${isItemActive 
                          ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-transparent'}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f5f5f7] dark:bg-[#0a0a0a]">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen" />
        
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-black/5 dark:border-white/5 shrink-0 relative z-10 backdrop-blur-sm">
          <button 
            className="md:hidden w-10 h-10 rounded-xl bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <ThemeSwitch />
            <div className="hidden md:block text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-white/10 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10">
              Workspace: <span className="text-gray-900 dark:text-white font-bold ml-1">Kompas Migracji</span>
            </div>
            <button 
              onClick={() => setIsCopilotOpen(true)}
              className="hidden lg:flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-[0_5px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.6)] hover:scale-105 transition-all"
            >
              <Icon name="cpu" size={16} /> Copilot
            </button>
            <div className="hidden lg:block w-px h-6 bg-black/10 dark:bg-white/10 mx-2"></div>
            <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Перейти на сайт
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
          {children}
        </div>
      </main>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-0 z-[9999] flex"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative w-[280px] bg-[#f5f5f7] dark:bg-[#111] h-full flex flex-col shadow-2xl">
              <div className="h-16 flex items-center justify-between px-4 border-b border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5">
                <span className="font-bold text-lg text-gray-900 dark:text-white">iPhoenixCRM</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  <Icon name="x" size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {NAV_DATA.map((nav) => (
                  <div key={nav.id}>
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3">
                      <Icon name={nav.icon} size={18} className="text-blue-500" />
                      {nav.label}
                    </div>
                    <div className="flex flex-col gap-1 pl-6 border-l-2 border-black/5 ml-2">
                      {nav.groups.flatMap(g => g.items).map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`py-2 text-sm font-medium ${pathname === item.href ? 'text-blue-500 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CommandPalette />
      <AiCopilotSidebar isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
}
