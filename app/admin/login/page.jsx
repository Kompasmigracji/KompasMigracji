"use client";
/* Сторінка входу /admin/login */
import "@/styles/kompascms.css";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/admin/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!email || !password) { setError("Введите email и пароль"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Безпечно читаємо тіло — навіть якщо сервер повернув не-JSON (500 HTML)
      let data = {};
      try { data = await res.json(); } catch { /* ignore parse errors */ }

      if (!res.ok) {
        setError(data.error || `Ошибка сервера (${res.status})`);
        setLoading(false);
        return;
      }

      const next = params.get("next") || "/admin";
      router.push(data.user?.role === "member" ? "/admin/me" : next);
    } catch {
      setError("Сеть недоступна — проверьте подключение");
      setLoading(false);
    }
  };

  return (
    <div className="kc-root">
      <div className="kc-login">
        <div className="kc-login-card kc-page-enter">
          <div className="kc-login-mark">
            <Icon name="compass" size={27} color="#d99e54" />
          </div>
          <div className="kc-login-title">KompasCMS</div>
          <div className="kc-login-sub">Командный центр Kompas Migracji</div>

          {error && (
            <div className="kc-error" style={{ marginBottom: 14 }}>
              <Icon name="settings" size={15} color="#d96c6c" />
              <span>{error}</span>
            </div>
          )}

          <div className="kc-field">
            <label className="kc-label">Email</label>
            <input
              className="kc-input"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kompasmigracji.com"
            />
          </div>
          <div className="kc-field">
            <label className="kc-label">Пароль</label>
            <input
              className="kc-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
            />
          </div>

          <button
            className="kc-btn kc-btn-primary"
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          >
            {loading ? "Вход…" : "Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
