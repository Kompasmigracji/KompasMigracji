"use client";
/* /admin/setup — одноразова ініціалізація: створення першого адміністратора.
   Блокується після появи першого адміна в БД. */
import "@/styles/kompascrm.css";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function SetupForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup")
      .then(r => r.json())
      .then(d => {
        setNeedsSetup(d.needsSetup);
        setChecking(false);
        if (!d.needsSetup) {
          setTimeout(() => router.push("/admin/login"), 1500);
        }
      })
      .catch(() => { setNeedsSetup(true); setChecking(false); });
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.password) {
      setError("Усі поля обов'язкові");
      return;
    }
    if (form.password.length < 8) {
      setError("Пароль — мінімум 8 символів");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Паролі не збігаються");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || `Помилка ${res.status}`);
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/admin"), 1500);
    } catch {
      setError("Мережа недоступна");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="kc-root">
        <div className="kc-login">
          <div className="kc-login-card">
            <div className="kc-stat-sub" style={{ textAlign: "center" }}>Перевірка стану системи…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!needsSetup) {
    return (
      <div className="kc-root">
        <div className="kc-login">
          <div className="kc-login-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div className="kc-login-title">Налаштовано</div>
              <div className="kc-stat-sub">Адміністратор вже існує. Переходимо на сторінку входу…</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="kc-root">
        <div className="kc-login">
          <div className="kc-login-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
              <div className="kc-login-title">Готово!</div>
              <div className="kc-stat-sub">Адміністратора створено. Входимо в панель…</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kc-root">
      <div className="kc-login">
        <div className="kc-login-card kc-page-enter">
          <div className="kc-login-mark" style={{ background: "rgba(217,158,84,0.15)", borderRadius: 14, padding: 12 }}>
            🧭
          </div>
          <div className="kc-login-title">Початкове налаштування</div>
          <div className="kc-login-sub">Створення першого адміністратора KompasCRM</div>

          <div className="kc-note" style={{ marginBottom: 16 }}>
            ⚠️ Ця сторінка доступна лише до створення першого адміністратора.
            Після цього вона буде автоматично заблокована.
          </div>

          {error && (
            <div className="kc-error" style={{ marginBottom: 14 }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit}>
            <div className="kc-field">
              <label className="kc-label">{"Повне ім'я"}</label>
              <input
                className="kc-input"
                type="text"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="Олексій Христо"
                autoFocus
              />
            </div>
            <div className="kc-field">
              <label className="kc-label">Email</label>
              <input
                className="kc-input"
                type="email"
                autoCapitalize="none"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@kompasmigracji.com"
              />
            </div>
            <div className="kc-field">
              <label className="kc-label">Пароль (мін. 8 символів)</label>
              <input
                className="kc-input"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="kc-field">
              <label className="kc-label">Повторіть пароль</label>
              <input
                className="kc-input"
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="kc-btn kc-btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            >
              {loading ? "Створення…" : "🚀 Створити адміністратора"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <a href="/admin/login" className="kc-link" style={{ fontSize: 13 }}>
              Вже є акаунт? Увійти →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense>
      <SetupForm />
    </Suspense>
  );
}
