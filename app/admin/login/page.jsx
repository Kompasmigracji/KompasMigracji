"use client";
/* Сторінка входу /admin/login */
import "@/styles/kompascrm.css";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/admin/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [token2fa, setToken2fa] = useState("");
  const [step, setStep]         = useState(1);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!email || !password) { setError("Введіть email та пароль"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(step === 1 ? { email, password } : { email, password, token2fa }),
      });

      // Безпечно читаємо тіло — навіть якщо сервер повернув не-JSON (500 HTML)
      let data = {};
      try { data = await res.json(); } catch { /* ignore parse errors */ }

      if (!res.ok) {
        setError(data.error || `Помилка сервера (${res.status})`);
        setLoading(false);
        return;
      }

      if (data.requires2FA) {
        setStep(2);
        setLoading(false);
        return;
      }

      const next = params.get("next") || "/admin";
      router.push(data.user?.role === "member" ? "/admin/me" : next);
    } catch {
      setError("Мережа недоступна — перевірте підключення");
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
          <div className="kc-login-title">KompasCRM</div>
          <div className="kc-login-sub">Командний центр Kompas Migracji</div>

          {error && (
            <div className="kc-error" style={{ marginBottom: 14 }}>
              <Icon name="settings" size={15} color="#d96c6c" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <>
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
            </>
          ) : (
            <div className="kc-field kc-page-enter">
              <label className="kc-label">2FA Код</label>
              <input
                className="kc-input"
                type="text"
                autoComplete="one-time-code"
                value={token2fa}
                onChange={(e) => setToken2fa(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="000000"
                maxLength={6}
                style={{ textAlign: "center", fontSize: "20px", letterSpacing: "4px" }}
              />
              <div style={{ fontSize: "12px", color: "var(--faint)", marginTop: "8px", textAlign: "center" }}>
                Введіть код з Google Authenticator
              </div>
            </div>
          )}

          <button
            className="kc-btn kc-btn-primary"
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          >
            {loading ? "Зачекайте…" : (step === 1 ? "Увійти" : "Підтвердити")}
          </button>
          
          {step === 2 && (
            <button
              className="kc-btn kc-btn-ghost"
              onClick={() => { setStep(1); setToken2fa(""); setError(""); }}
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            >
              ← Назад
            </button>
          )}
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
