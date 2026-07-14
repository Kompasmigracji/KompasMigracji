"use client";
/* Renders on /payment/success after a provider (P24/PayU/Stripe) redirects back.
   That redirect fires on both success AND failure/cancel — P24 in particular has
   a single urlReturn for every outcome — so this page must confirm the payment
   against our own DB (updated by the async webhook) instead of assuming success
   just because the customer landed here. */
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const P24_RED    = "#D8232A";
const P24_GREEN  = "#44A649";
const P24_AMBER  = "#B45309";
const P24_BORDER = "#DEE2E6";
const P24_BG     = "#F8F9FA";
const P24_TEXT   = "#212529";
const P24_MUTED  = "#6C757D";

function P24Logo() {
  return (
    <svg width="110" height="26" viewBox="0 0 126 30" fill="none" aria-label="Przelewy24">
      <rect width="126" height="30" rx="5" fill={P24_RED} />
      <text x="63" y="21" textAnchor="middle" fill="#fff" fontFamily="'Arial Black',Arial,sans-serif" fontSize="13" fontWeight="900" letterSpacing="0.4">przelewy24</text>
    </svg>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", background: "#EBEEF2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',Arial,sans-serif", padding: "20px 16px" }}>
      <div style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        <div style={{ background: "#fff", borderBottom: `1px solid ${P24_BORDER}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <P24Logo />
          <div style={{ fontSize: 11, color: P24_MUTED, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Bezpieczna płatność
          </div>
        </div>
        {children}
        <div style={{ background: P24_BG, borderTop: `1px solid ${P24_BORDER}`, padding: "10px 20px", textAlign: "center" }}>
          <span style={{ fontSize: 10, color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            SSL 256-bit · Przelewy24 sp. z o.o. · Nadzór KNF
          </span>
        </div>
      </div>
    </main>
  );
}

function CheckingView() {
  return (
    <div style={{ padding: "48px 28px", textAlign: "center" }}>
      <div style={{ width: 40, height: 40, margin: "0 auto 20px", border: `3px solid ${P24_BORDER}`, borderTopColor: P24_GREEN, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: 14, color: P24_MUTED, margin: 0 }}>Перевіряємо статус оплати…</p>
    </div>
  );
}

function PaidView() {
  return (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(68,166,73,0.12)", border: `2px solid ${P24_GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: P24_TEXT, textAlign: "center", margin: "0 0 8px" }}>
        Płatność zakończona sukcesem!
      </h1>
      <p style={{ fontSize: 14, color: P24_MUTED, textAlign: "center", lineHeight: 1.7, margin: "0 0 24px" }}>
        Оплата підтверджена. Дякуємо за довіру до <strong style={{ color: P24_TEXT }}>Kompas Migracji</strong>.
        <br />Наш спеціаліст зв&apos;яжеться з вами найближчим часом.
      </p>
      <div style={{ background: P24_BG, border: `1px solid ${P24_BORDER}`, borderRadius: 8, padding: "14px 16px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: P24_MUTED, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Що далі?</div>
        {["Чек надіслано на вказаний email", "Спеціаліст зв'яжеться протягом 2 годин", "Розпочнемо роботу над вашою справою"].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: P24_GREEN, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: P24_TEXT, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: P24_MUTED, marginBottom: 8 }}>Питання? Зв&apos;яжіться з нами:</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 7, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#16a34a", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            💬 WhatsApp
          </a>
          <a href="tel:+48729271848" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 7, background: P24_BG, border: `1px solid ${P24_BORDER}`, color: P24_TEXT, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            📞 +48 729 271 848
          </a>
        </div>
      </div>
      <Link href="/" style={{ display: "block", textAlign: "center", padding: "12px 0", borderRadius: 8, background: P24_GREEN, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
        На головну →
      </Link>
    </div>
  );
}

function PendingView() {
  return (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(180,83,9,0.1)", border: `2px solid ${P24_AMBER}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={P24_AMBER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
        </svg>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: P24_TEXT, textAlign: "center", margin: "0 0 8px" }}>
        Оплату ще не підтверджено
      </h1>
      <p style={{ fontSize: 14, color: P24_MUTED, textAlign: "center", lineHeight: 1.7, margin: "0 0 24px" }}>
        Якщо ви щойно завершили оплату — зачекайте, підтвердження іноді приходить із затримкою,
        і ми напишемо вам у WhatsApp, як тільки отримаємо його від банку.
        <br />Якщо оплату не було завершено — спробуйте ще раз.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <Link href="/test/pricing" style={{ display: "block", textAlign: "center", padding: "12px 0", borderRadius: 8, background: P24_GREEN, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
          Спробувати ще раз →
        </Link>
        <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "11px 0", borderRadius: 8, background: "rgba(37,211,102,0.1)", border: "1.5px solid rgba(37,211,102,0.3)", color: "#16a34a", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
          💬 Зв&apos;язатися з менеджером
        </a>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 12, color: P24_MUTED }}>Телефон: </span>
        <a href="tel:+48729271848" style={{ fontSize: 13, fontWeight: 700, color: P24_TEXT, textDecoration: "none" }}>+48 729 271 848</a>
      </div>
    </div>
  );
}

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 6; // ~15s total

export default function PaymentStatusClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  // No session id on the URL (old links, direct visits) — keep prior behavior.
  const [state, setState] = useState<"checking" | "paid" | "pending">(sessionId ? "checking" : "paid");

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/payment/status?session=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "paid") {
          setState("paid");
          return;
        }
      } catch {
        // network hiccup — keep polling until we hit the attempt limit
      }
      if (cancelled) return;
      if (attempts >= MAX_POLLS) {
        setState("pending");
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <Shell>
      {state === "checking" && <CheckingView />}
      {state === "paid" && <PaidView />}
      {state === "pending" && <PendingView />}
    </Shell>
  );
}
