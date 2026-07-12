"use client";
/* KompasCRM — Core App Shell (Sidebar + Topbar) */
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { navFor, ROLE_LABEL } from "@/lib/rbac";
import { Icon, Spinner, Avatar } from "./ui";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";
import AgentConsole from "./AgentConsole";
import enMsg from "@/messages/admin/en.json";
import plMsg from "@/messages/admin/pl.json";
import ukMsg from "@/messages/admin/uk.json";
import ruMsg from "@/messages/admin/ru.json";

const translations = { en: enMsg, pl: plMsg, uk: ukMsg, ru: ruMsg };


export default function Shell({ children }) {
  const [user, setUser] = useState(undefined); // undefined=loading, null=none
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
      
    const saved = localStorage.getItem("kc-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);

    const savedLang = localStorage.getItem("kc-lang");
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  // Close mobile menu and auto-expand group when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (user && pathname) {
      const nav = navFor(user.role || "member");
      const current = nav.find(n => n.href !== "/admin" && pathname.startsWith(n.href));
      if (current?.group && current.group !== openGroup) {
        setOpenGroup(current.group);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("kc-theme", next);
  };

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("kc-lang", l);
    setIsLangMenuOpen(false);
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (user === undefined) {
    return (
      <div className="kc-root" data-theme={theme} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  const nav = navFor(user?.role || "member");
  const current = nav.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  );

  // Extract module name from pathname (e.g. /admin/booking -> booking)
  const moduleName = pathname.split("/")[2] || "";

  const t = translations[lang] || translations.en;

  return (
    <div className="kc-root" data-theme={theme}>
      <div className="kc-shell">
        
        {/* MOBILE OVERLAY */}
        {isMobileMenuOpen && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.05)', zIndex: 90 }} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`kc-side ${isMobileMenuOpen ? 'kc-side-open' : ''}`}>
          <div className="kc-brand">
            <div className="kc-brand-mark">
              <Icon name="compass" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <div className="kc-brand-name">KompasCRM</div>
              <div className="kc-brand-sub">ENTERPRISE EDITION</div>
            </div>
          </div>

          <nav className="kc-nav">
            <div className="kc-nav-cap">{t.mainMenu}</div>
            {(() => {
              const groupedNav = nav.reduce((acc, item) => {
                if (!item.group) {
                  acc.unshift({ isGroup: false, ...item });
                } else {
                  let group = acc.find(g => g.isGroup && g.name === item.group);
                  if (!group) {
                    group = { isGroup: true, name: item.group, items: [] };
                    acc.push(group);
                  }
                  group.items.push(item);
                }
                return acc;
              }, []);

              return groupedNav.map((groupOrItem) => {
                if (!groupOrItem.isGroup) {
                  const n = groupOrItem;
                  const on = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
                  return (
                    <Link key={n.href} href={n.href} className={`kc-nav-item ${on ? "kc-on" : ""}`}>
                      <Icon name={n.icon} size={18} />
                      <span>{n.label}</span>
                    </Link>
                  );
                }

                const isExpanded = openGroup === groupOrItem.name;
                
                return (
                  <div key={groupOrItem.name} className="kc-nav-group" style={{ marginBottom: 4 }}>
                    <button 
                      onClick={() => setOpenGroup(isExpanded ? "" : groupOrItem.name)}
                      className={`kc-nav-item ${isExpanded ? "kc-group-open" : ""}`}
                      style={{
                        background: isExpanded ? "var(--bg-hover)" : "transparent",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        color: isExpanded ? "var(--color-primary)" : "var(--dim)",
                        justifyContent: "space-between",
                        paddingRight: 12,
                        fontWeight: isExpanded ? 600 : 500,
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Icon name={isExpanded ? "folder-minus" : "folder"} size={18} />
                        <span>{groupOrItem.name}</span>
                      </div>
                      <Icon name="chevron-down" size={14} style={{ 
                        transform: isExpanded ? "rotate(-180deg)" : "rotate(0deg)", 
                        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" 
                      }} />
                    </button>
                    <div style={{
                      maxHeight: isExpanded ? `${groupOrItem.items.length * 64 + 8}px` : "0",
                      opacity: isExpanded ? 1 : 0,
                      overflow: "hidden",
                      transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      marginTop: isExpanded ? 4 : 0,
                      paddingLeft: 12,
                      borderLeft: "2px solid var(--border)",
                      marginLeft: 16
                    }}>
                      {groupOrItem.items.map(n => {
                        const on = pathname.startsWith(n.href);
                        return (
                          <Link key={n.href} href={n.href} className={`kc-nav-item ${on ? "kc-on" : ""}`} style={{ minHeight: 34, paddingLeft: 10, fontSize: "12px", borderLeft: on ? "2px solid var(--color-primary)" : "none", color: on ? "var(--text)" : "var(--faint)" }}>
                            <Icon name={n.icon} size={14} />
                            <span>{n.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </nav>

          <div className="kc-side-foot">
            <div className="kc-user">
              <Avatar name={user?.name || "?"} role={ROLE_LABEL[user?.role] || user?.role} />
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                  title={t.language}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)", padding: 4 }}
                >
                  <Icon name="globe" size={18} />
                </button>
                {isLangMenuOpen && (
                  <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 8, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: 4, zIndex: 100, display: "flex", flexDirection: "column", gap: 2 }}>
                    {Object.keys(translations).map(l => (
                      <button key={l} onClick={() => changeLang(l)} style={{ background: lang === l ? "var(--bg-hover)" : "none", border: "none", color: "var(--fg)", padding: "4px 12px", textAlign: "left", cursor: "pointer", borderRadius: 4 }}>
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={logout} 
                title={t.logout}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--faint)", padding: 4 }}
              >
                <Icon name="logout" size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="kc-main">
          <header className="kc-topbar">
            <div className="kc-topbar-left">
              {/* Mobile Menu Toggle */}
              <button 
                className="kc-btn kc-btn-ghost" 
                style={{ padding: '8px', display: 'none' }} 
                onClick={() => setIsMobileMenuOpen(true)}
                id="mobile-menu-btn"
              >
                <Icon name="menu" size={20} />
              </button>
              
              <style>{`
                @media (max-width: 768px) { #mobile-menu-btn { display: flex !important; } }
              `}</style>

              <h1>{current?.label || "Dashboard"}</h1>
            </div>

            <div className="kc-topbar-right">
              <button className="kc-theme-btn" title={t.search} onClick={() => setIsSearchOpen(true)}>
                <Icon name="search" size={16} />
              </button>
              
              <button className="kc-theme-btn" title={t.notifications} onClick={() => setIsNotificationsOpen(true)}>
                <div style={{ position: 'relative' }}>
                  <Icon name="bell" size={16} />
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, background: 'var(--color-danger)', borderRadius: '50%' }} />
                </div>
              </button>

              <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

              <button 
                onClick={() => setIsConsoleOpen(!isConsoleOpen)} 
                className={`kc-theme-btn ${isConsoleOpen ? 'kc-on' : ''}`}
                title="AI Agent Console"
                style={{ color: isConsoleOpen ? 'var(--color-primary)' : 'inherit', marginRight: 4 }}
              >
                <Icon name="cpu" size={16} />
              </button>

              <button onClick={toggleTheme} className="kc-theme-btn" title={t.theme}>
                <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
                <span>{theme === "dark" ? t.light : t.dark}</span>
              </button>
            </div>
          </header>
          
          <main className="kc-content kc-page-enter" style={{ display: 'flex', gap: 'var(--space-lg)', position: 'relative', height: 'calc(100vh - 60px)', padding: 0, maxWidth: 'none' }}>
            <div style={{ flex: 1, minWidth: 0, padding: 'var(--space-lg)', overflowY: 'auto', height: '100%' }}>
              {children}
            </div>
            {isConsoleOpen && (
              <AgentConsole module={moduleName} onClose={() => setIsConsoleOpen(false)} />
            )}
          </main>
        </div>
      </div>
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
