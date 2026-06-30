"use client";
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
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    const timer = setTimeout(show, 40000);
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
          situation: "Безкоштовна консультація — вихідне вікно",
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
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div style={{
        background: "#fff", borderRadius: 28, maxWidth: 460, width: "100%",
        boxShadow: "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #2563eb, #f97316)" }} />

        <div style={{ padding: "28px 28px 24px" }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute", top: 16, right: 16, background: "none",
              border: "none", cursor: "pointer", fontSize: 20, color: "#9CA3AF",
              lineHeight: 1, padding: 4,
            }}
            aria-label="Закрити"
          >✕</button>

          {!sent ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🤝</div>
                <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "#111", lineHeight: 1.2, letterSpacing: "-0.03em" }}>
                  Не залишайтеся наодинці з цим
                </h2>
                <p style={{ margin: 0, fontSize: 15, color: "#6B7280", lineHeight: 1.5 }}>
                  Залиште свій email — ми зв&#x27;яжемося з вами та дамо безкоштовну оцінку вашої ситуації
                </p>
              </div>

              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Ваше ім'я (необов'язково)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    padding: "14px 16px", borderRadius: 16, border: "1.5px solid #E5E7EB",
                    fontSize: 15, color: "#111", outline: "none",
                    fontFamily: "inherit", background: "#F9FAFB", transition: "all 0.2s"
                  }}
                />
                <input
                  type="email"
                  placeholder="Ваш email *"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    padding: "14px 16px", borderRadius: 16, border: "1.5px solid #E5E7EB",
                    fontSize: 15, color: "#111", outline: "none",
                    fontFamily: "inherit", background: "#F9FAFB", transition: "all 0.2s"
                  }}
                />
                <button
                  type="submit"
                  disabled={!email.trim() || loading}
                  style={{
                    padding: "16px 0", borderRadius: 9999, background: BRAND, color: "#fff",
                    fontWeight: 600, fontSize: 16, border: "none", cursor: "pointer",
                    opacity: (!email.trim() || loading) ? 0.6 : 1, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "0 8px 20px rgba(216,35,42,0.3)"
                  }}
                >
                  {loading ? "Відправляємо..." : "Отримати безкоштовну оцінку →"}
                </button>
              </form>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>або зв&#x27;яжіться прямо зараз:</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href="https://wa.me/48729271848?text=Потребую+допомоги+з+міграційним+питанням"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "10px 20px", borderRadius: 9999, background: "#25D366", color: "#fff",
                      textDecoration: "none", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 12px rgba(37,211,102,0.3)"
                    }}
                  >💬 WhatsApp</a>
                  <a
                    href="tel:+48729271848"
                    style={{
                      padding: "10px 20px", borderRadius: 9999, background: "#f1f5f9", color: "#1e293b",
                      textDecoration: "none", fontWeight: 600, fontSize: 14,
                    }}
                  >📞 Телефон</a>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#9CA3AF", marginTop: 4 }}
                >
                  Закрити без допомоги
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#111" }}>
                Дякуємо! Ми зв&#x27;яжемося з вами
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                Очікуйте повідомлення протягом 2 годин у робочий час
              </p>
              <a
                href="https://wa.me/48729271848"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block", marginTop: 16, padding: "14px 28px",
                  background: "#25D366", color: "#fff", borderRadius: 9999,
                  textDecoration: "none", fontWeight: 600, fontSize: 16,
                  boxShadow: "0 8px 20px rgba(37,211,102,0.3)", transition: "transform 0.2s"
                }}
              >
                💬 Написати у WhatsApp зараз
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
