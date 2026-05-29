"use client";
// F12: Exit-intent popup — shows on mouse-leave or 45s idle; captures email for free consultation
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "km_exit_popup_shown";
const BRAND = "#D8232A";

export default function ExitPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const show = useCallback(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    // Mouse-leave intent (desktop)
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    // Idle timer fallback (45s)
    const timer = setTimeout(show, 45000);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mouseleave", onLeave);
      clearTimeout(timer);
    };
  }, [show]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Klient",
          contact: email.trim(),
          source: "exit_popup",
          situation: "Bezplatna konsultacja — exit popup",
        }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, maxWidth: 440, width: "100%",
        padding: "32px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        position: "relative",
      }}>
        <button
          onClick={() => setOpen(false)}
          style={{
            position: "absolute", top: 14, right: 14, background: "none",
            border: "none", cursor: "pointer", fontSize: 20, color: "#9CA3AF",
            lineHeight: 1, padding: 4,
          }}
          aria-label="Zamknij"
        >
          &#x2715;
        </button>

        {!sent ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>&#x1F381;</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#111" }}>
                Poczekaj! Mamy dla Ciebie prezent
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                Zostaw swoj email i odbierz <strong style={{ color: BRAND }}>bezplatna konsultacje</strong> z naszym ekspertem ds. migracji (wartosci 150 PLN).
              </p>
            </div>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Twoje imie"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  padding: "11px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                  fontSize: 14, color: "#111", outline: "none",
                  fontFamily: "inherit", background: "#F9FAFB",
                }}
              />
              <input
                type="email"
                placeholder="Twoj email *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  padding: "11px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                  fontSize: 14, color: "#111", outline: "none",
                  fontFamily: "inherit", background: "#F9FAFB",
                }}
              />
              <button
                type="submit"
                disabled={!email.trim() || loading}
                style={{
                  padding: "13px 0", borderRadius: 9, background: BRAND, color: "#fff",
                  fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
                  opacity: (!email.trim() || loading) ? 0.6 : 1, transition: "opacity 0.2s",
                }}
              >
                {loading ? "Wysylamy..." : "Odbierz bezplatna konsultacje "}
              </button>
            </form>

            <div style={{ marginTop: 14, textAlign: "center" }}>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#9CA3AF" }}
              >
                Nie, dziekuje — zamknij
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#x2705;</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#111" }}>
              Gotowe! Skontaktujemy sie jutro
            </h3>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
              Sprawdz rowniez WhatsApp — czesto odpowiadamy szybciej:
            </p>
            <a
              href="https://wa.me/48729271848"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block", marginTop: 12, padding: "10px 22px",
                background: "#25D366", color: "#fff", borderRadius: 8,
                textDecoration: "none", fontWeight: 700, fontSize: 14,
              }}
            >
              &#x1F4AC; WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
