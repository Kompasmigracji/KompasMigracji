"use client";
/* /payment/mock/[sessionId] — симулятор Przelewy24 checkout (тільки в мок-режимі) */
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const P24_ORANGE  = "#FF6A00";
const P24_GREEN   = "#4CAF50";
const P24_BG      = "#F8F9FA";
const P24_BORDER  = "#DEE2E6";
const P24_TEXT    = "#212529";
const P24_MUTED   = "#6C757D";

function P24Logo() {
  return (
    <svg width="120" height="30" viewBox="0 0 120 30" fill="none" aria-label="Przelewy24">
      <rect width="120" height="30" rx="5" fill="#fff" stroke={P24_BORDER}/>
      <text x="60" y="21" textAnchor="middle" fill={P24_ORANGE} fontFamily="'Arial Black',Arial,sans-serif" fontSize="14" fontWeight="900">
        Przelewy<tspan fill={P24_TEXT}>24</tspan>
      </text>
    </svg>
  );
}

const METHODS = [
  { id: "blik",     label: "BLIK",             icon: "📱", desc: "Kod BLIK z aplikacji bankowej" },
  { id: "card",     label: "Karta płatnicza",   icon: "💳", desc: "Visa, Mastercard, Maestro" },
  { id: "transfer", label: "Przelew bankowy",   icon: "🏦", desc: "Szybki przelew online" },
];

export default function MockPaymentPage() {
  const { sessionId } = useParams();
  const sp            = useSearchParams();
  const router        = useRouter();

  const amountGroszy = parseInt(sp.get("amount") || "0", 10);
  const amountPln    = (amountGroszy / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2 });
  const description  = sp.get("desc") || "Послуга";

  const [method,   setMethod]  = useState("blik");
  const [blikCode, setBlik]    = useState("");
  const [loading,  setLoading] = useState(false);
  const [step,     setStep]    = useState("idle"); // idle | processing | done | rejected

  async function handlePay(success) {
    setLoading(true);
    setStep(success ? "processing" : "rejected");
    try {
      await fetch("/api/payment-mock-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, success }),
      });
    } catch { /* network */ }
    setTimeout(() => {
      router.push(success ? "/payment/success" : "/payment/failed");
    }, success ? 1200 : 600);
  }

  const disabled = loading || step !== "idle";

  return (
    <main style={{ minHeight:"100vh", background:"#EBEEF2", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',Arial,sans-serif", padding:"20px 16px" }}>

      {/* ── TEST banner ───────────────────────────────────────────── */}
      <div style={{ width:"100%", maxWidth:480, marginBottom:12, background:"rgba(234,179,8,0.18)", border:"1.5px solid rgba(234,179,8,0.55)", borderRadius:8, padding:"8px 16px", textAlign:"center", color:"#92400E", fontSize:13, fontWeight:700, letterSpacing:"0.04em" }}>
        ⚠️ TRYB TESTOWY — pieniądze nie są pobierane
      </div>

      {/* ── Card ──────────────────────────────────────────────────── */}
      <div style={{ width:"100%", maxWidth:480, background:"#fff", borderRadius:12, boxShadow:"0 8px 40px rgba(0,0,0,0.12)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"#fff", borderBottom:`1px solid ${P24_BORDER}`, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <P24Logo />
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:P24_MUTED, fontWeight:600 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Bezpieczna płatność
          </div>
        </div>

        <div style={{ padding:"20px" }}>

          {/* Order summary */}
          <div style={{ background:P24_BG, border:`1px solid ${P24_BORDER}`, borderRadius:8, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:10, fontWeight:700, color:P24_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Sklep</div>
            <div style={{ fontSize:14, fontWeight:700, color:P24_TEXT, marginBottom:10 }}>Kompas Migracji</div>
            <div style={{ fontSize:10, fontWeight:700, color:P24_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Opis zamówienia</div>
            <div style={{ fontSize:13, color:P24_TEXT, marginBottom:12 }}>{description}</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
              <span style={{ fontSize:11, color:P24_MUTED, fontWeight:600 }}>Do zapłaty:</span>
              <span style={{ fontSize:28, fontWeight:900, color:P24_ORANGE, letterSpacing:"-0.03em", lineHeight:1 }}>{amountPln}</span>
              <span style={{ fontSize:15, fontWeight:800, color:P24_ORANGE }}>PLN</span>
            </div>
          </div>

          {step === "idle" && (
            <>
              {/* Payment method selector */}
              <div style={{ fontSize:11, fontWeight:700, color:P24_MUTED, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Wybierz metodę płatności</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                {METHODS.map(m => {
                  const active = method === m.id;
                  return (
                    <label key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:8, border:`2px solid ${active ? P24_ORANGE : P24_BORDER}`, background: active ? "rgba(255,106,0,0.06)" : "#fff", cursor:"pointer", transition:"all 0.15s" }}>
                      <input type="radio" name="method" value={m.id} checked={active} onChange={() => setMethod(m.id)} style={{ accentColor:P24_ORANGE, width:16, height:16, flexShrink:0 }} />
                      <span style={{ fontSize:20, flexShrink:0 }}>{m.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:P24_TEXT, lineHeight:1.2 }}>{m.label}</div>
                        <div style={{ fontSize:11, color:P24_MUTED, marginTop:2 }}>{m.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* BLIK input */}
              {method === "blik" && (
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:P24_MUTED, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Kod BLIK (6 cyfr)</label>
                  <input
                    type="text" inputMode="numeric" maxLength={6} value={blikCode}
                    onChange={e => setBlik(e.target.value.replace(/\D/g, "").slice(0,6))}
                    placeholder="_ _ _ _ _ _"
                    style={{ width:"100%", padding:"12px 16px", borderRadius:8, border:`2px solid ${P24_BORDER}`, fontSize:22, fontWeight:700, letterSpacing:"0.3em", textAlign:"center", fontFamily:"monospace", boxSizing:"border-box", outline:"none", color:P24_TEXT }}
                  />
                </div>
              )}

              {/* Buttons */}
              <button onClick={() => handlePay(true)} disabled={disabled || (method === "blik" && blikCode.length < 6)}
                style={{ width:"100%", padding:"13px 0", borderRadius:8, border:"none", cursor: disabled || (method === "blik" && blikCode.length < 6) ? "not-allowed" : "pointer", background: disabled || (method === "blik" && blikCode.length < 6) ? "#E9ECEF" : P24_ORANGE, color: disabled || (method === "blik" && blikCode.length < 6) ? "#9CA3AF" : "#fff", fontWeight:800, fontSize:15, letterSpacing:"0.01em", transition:"filter 0.15s", marginBottom:10 }}
              >
                Zapłać {amountPln} PLN →
              </button>

              <button onClick={() => handlePay(false)} disabled={disabled}
                style={{ width:"100%", padding:"10px 0", borderRadius:8, border:`1.5px solid ${P24_BORDER}`, cursor:"pointer", background:"transparent", color:P24_MUTED, fontWeight:600, fontSize:13 }}
              >
                Anuluj płatność
              </button>
            </>
          )}

          {step === "processing" && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
              <div style={{ fontSize:16, fontWeight:700, color:P24_ORANGE }}>Przetwarzanie płatności…</div>
              <div style={{ fontSize:13, color:P24_MUTED, marginTop:6 }}>Nie zamykaj tej strony</div>
            </div>
          )}

          {step === "rejected" && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>❌</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#D8232A" }}>Płatność odrzucona</div>
              <div style={{ fontSize:13, color:P24_MUTED, marginTop:6 }}>Przekierowujemy…</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ background:P24_BG, borderTop:`1px solid ${P24_BORDER}`, padding:"10px 20px", textAlign:"center" }}>
          <span style={{ fontSize:10, color:"#9CA3AF", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P24_GREEN} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            SSL 256-bit · PayPro S.A. (Przelewy24) · Nadzór KNF
          </span>
        </div>
      </div>

      {/* Session ID (dev info) */}
      <div style={{ marginTop:12, fontSize:10, color:"rgba(0,0,0,0.3)", textAlign:"center" }}>
        Session: {sessionId}
      </div>
    </main>
  );
}
