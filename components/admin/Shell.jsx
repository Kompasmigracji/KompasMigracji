"use client";
/* iPhoenixCRM — Core App Shell (Sidebar + Topbar) */
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { navFor, ROLE_LABEL } from "@/lib/rbac";
import { Icon, Spinner, Avatar } from "./ui";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";

export default function Shell({ children }) {
  const [user, setUser] = useState(undefined); // undefined=loading, null=none
  const [theme, setTheme] = useState("dark");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
      
    const saved = localStorage.getItem("kc-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("kc-theme", next);
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

  return (
    <div className="kc-root" data-theme={theme}>
      <div className="kc-shell">
        
        {/* MOBILE OVERLAY */}
        {isMobileMenuOpen && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} 
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
              <div className="kc-brand-name">iPhoenixCRM</div>
              <div className="kc-brand-sub">ENTERPRISE EDITION</div>
            </div>
          </div>

          <nav className="kc-nav">
            <div className="kc-nav-cap">Main Menu</div>
            {nav.map((n) => {
              const on = n.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className={`kc-nav-item ${on ? "kc-on" : ""}`}>
                  <Icon name={n.icon} size={18} />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="kc-side-foot">
            <div className="kc-user">
              <Avatar name={user?.name || "?"} />
              <div style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
                <div className="kc-user-name">{user?.name}</div>
                <div className="kc-user-role">{ROLE_LABEL[user?.role] || user?.role}</div>
              </div>
              <button 
                onClick={logout} 
                title="Logout"
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
              <button className="kc-theme-btn" title="Global Search (Cmd+K)" onClick={() => setIsSearchOpen(true)}>
                <Icon name="search" size={16} />
              </button>
              
              <button className="kc-theme-btn" title="Notifications" onClick={() => setIsNotificationsOpen(true)}>
                <div style={{ position: 'relative' }}>
                  <Icon name="bell" size={16} />
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, background: 'var(--color-danger)', borderRadius: '50%' }} />
                </div>
              </button>

              <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

              <button onClick={toggleTheme} className="kc-theme-btn" title="Toggle Theme">
                <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
                <span>{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>
          </header>
          
          <main className="kc-content kc-page-enter">
            {children}
          </main>
        </div>
      </div>
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
