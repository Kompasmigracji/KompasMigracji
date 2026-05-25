"use client";
/* KompasCMS — каркас панели: сайдбар + топбар. Оборачивает все страницы (panel). */
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { navFor, ROLE_LABEL } from "@/lib/rbac";
import { Icon, Spinner } from "./ui";

export default function Shell({ children }) {
  const [user, setUser] = useState(undefined); // undefined=загрузка, null=нет
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (user === undefined) {
    return (
      <div className="kc-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  const nav = navFor(user?.role || "member");
  const initials = (user?.name || "?")
    .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const current = nav.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  );

  return (
    <div className="kc-root">
      <div className="kc-shell">
        {/* САЙДБАР */}
        <aside className="kc-side">
          <div className="kc-brand">
            <div className="kc-brand-mark"><Icon name="compass" size={21} color="#d99e54" /></div>
            <div>
              <div className="kc-brand-name">KompasCMS</div>
              <div className="kc-brand-sub">KOMPAS MIGRACJI</div>
            </div>
          </div>

          <nav className="kc-nav">
            <div className="kc-nav-cap">Управление</div>
            {nav.map((n) => {
              const on = n.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={"kc-nav-item" + (on ? " kc-on" : "")}>
                  <Icon name={n.icon} size={17} />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="kc-side-foot">
            <div className="kc-user">
              <div className="kc-avatar">{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="kc-user-name">{user?.name}</div>
                <div className="kc-user-role">{ROLE_LABEL[user?.role] || user?.role}</div>
              </div>
              <button onClick={logout} title="Выйти"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#5a6470" }}>
                <Icon name="logout" size={17} />
              </button>
            </div>
          </div>
        </aside>

        {/* ОСНОВНАЯ ОБЛАСТЬ */}
        <div className="kc-main">
          <header className="kc-topbar">
            <h1>{current?.label || "KompasCMS"}</h1>
          </header>
          <main className="kc-content kc-page-enter">{children}</main>
        </div>
      </div>
    </div>
  );
}
