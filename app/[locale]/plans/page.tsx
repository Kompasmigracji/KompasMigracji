"use client";
// F2: Subscription plans page — public marketing page with P24 checkout
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const BRAND = "#D8232A";

interface Plan {
  id: number;
  slug: string;
  name: string;
  price_pln: number;
  price_eur: number;
  billing_cycle: string;
  features: string[];
  is_popular: boolean;
}

const PLAN_ICONS: Record<string, string> = {
  basic: "&#x1F4D6;",
  standard: "&#x2B50;",
  premium: "&#x1F451;",
};

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Modal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !agreed) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug, name, email, phone }),
      });
      const d = await r.json();
      if (d.redirectUrl) {
        window.location.href = d.redirectUrl;
      } else {
        setError(d.error || "Blad serwera");
        setLoading(false);
      }
    } catch {
      setError("Blad sieci");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, maxWidth: 440, width: "100%",
        padding: "32px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, background: "none",
          border: "none", cursor: "pointer", fontSize: 20, color: "#9CA3AF",
        }}>&#x2715;</button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: PLAN_ICONS[plan.slug] || "&#x1F4B3;" }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>Plan {plan.name}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: BRAND, margin: "6px 0" }}>
            {plan.price_pln} PLN<span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>/mies.</span>
          </div>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { val: name, set: setName, ph: "Imie i nazwisko *", type: "text" },
            { val: email, set: setEmail, ph: "Email *", type: "email" },
            { val: phone, set: setPhone, ph: "Telefon (opcjonalnie)", type: "tel" },
          ].map((f, i) => (
            <input
              key={i}
              type={f.type}
              placeholder={f.ph}
              value={f.val}
              onChange={e => f.set(e.target.value)}
              required={f.ph.endsWith("*")}
              style={{
                padding: "11px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                fontSize: 14, color: "#111", outline: "none", background: "#F9FAFB",
                fontFamily: "inherit",
              }}
            />
          ))}
          {error && <div style={{ fontSize: 12, color: "#EF4444" }}>{error}</div>}

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", userSelect: "none", margin: "4px 0 2px" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: 3, accentColor: BRAND, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
              Zapoznałem/am się z{" "}
              <a href="/regulamin" target="_blank" rel="noreferrer" style={{ color: BRAND, textDecoration: "none", fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                Regulaminem Sklepu
              </a>{" "}
              i akceptuję jego warunki
            </span>
          </label>

          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || loading || !agreed}
            style={{
              padding: "13px 0", borderRadius: 9, background: BRAND, color: "#fff",
              fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
              opacity: (!name.trim() || !email.trim() || loading || !agreed) ? 0.6 : 1,
            }}
          >
            {loading ? "Przekierowujemy do platnosci..." : `Subskrybuj ${plan.name} — ${plan.price_pln} PLN/mies.`}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", margin: "12px 0 0" }}>
          Bezpieczna płatność przez Przelewy24 &middot; Można anulować w dowolnym momencie
        </p>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plans")
      .then(r => r.json())
      .then(d => { setPlans(d.plans || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "#F0F2F5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

        {/* Hero */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #D8232A 100%)",
          padding: "72px 16px 80px",
          textAlign: "center", color: "#fff",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            Subskrypcje Kompas Migracji
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
            Profesjonalna pomoc<br />w cenie kawy dziennie
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7 }}>
            Wybierz plan dopasowany do Twoich potrzeb. Mozna anulowac w dowolnym momencie.
            Bez ukrytych oplat.
          </p>
          <div style={{ display: "inline-flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            {["Bezpieczna platnosc", "Dedykowany doradca", "Bez zobowiazan"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#10B981" }}>&#x2713;</span> {t}
              </span>
            ))}
          </div>
        </section>

        {/* Plans grid */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#6B7280" }}>Ladowanie planow...</div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24, alignItems: "start",
            }}>
              {plans.map(plan => (
                <div
                  key={plan.slug}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: plan.is_popular ? `2px solid ${BRAND}` : "2px solid #E5E7EB",
                    padding: "28px 24px",
                    boxShadow: plan.is_popular ? "0 8px 32px rgba(216,35,42,0.15)" : "0 2px 12px rgba(0,0,0,0.06)",
                    position: "relative",
                  }}
                >
                  {plan.is_popular && (
                    <div style={{
                      position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                      background: BRAND, color: "#fff", fontSize: 11, fontWeight: 700,
                      padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                      Najpopularniejszy
                    </div>
                  )}

                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: PLAN_ICONS[plan.slug] || "&#x1F4B3;" }} />
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>{plan.name}</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: BRAND, margin: "8px 0 2px" }}>
                      {plan.price_pln} PLN
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      miesiecznie &middot; ~{plan.price_eur} EUR
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {(Array.isArray(plan.features) ? plan.features : []).map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <CheckIcon />
                        <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelected(plan)}
                    style={{
                      width: "100%", padding: "13px 0", borderRadius: 10,
                      background: plan.is_popular ? BRAND : "#111",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      border: "none", cursor: "pointer", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    Wybierz plan {plan.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap",
            marginTop: 52, padding: "28px 0", borderTop: "1px solid #E5E7EB",
          }}>
            {[
              { icon: "&#x1F512;", text: "Bezpieczna platnosc SSL" },
              { icon: "&#x1F4C4;", text: "Faktura VAT w cenie" },
              { icon: "&#x21A9;&#xFE0F;", text: "Anuluj w dowolnym momencie" },
              { icon: "&#x1F4DE;", text: "Wsparcie 7 dni w tygodniu" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B7280" }}>
                <span style={{ fontSize: 20 }} dangerouslySetInnerHTML={{ __html: b.icon }} />
                {b.text}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: "#fff", padding: "56px 16px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 700, marginBottom: 36 }}>
              Czesto zadawane pytania
            </h2>
            {[
              ["Czy moge anulowac subskrypcje?", "Tak, mozesz anulowac w dowolnym momencie bez zadnych kary. Dostep pozostaje aktywny do konca oplaconego okresu."],
              ["Jak szybko skontaktuje sie konsultant?", "W ciagu 24 godzin od zakupu, w dni robocze do 2 godzin."],
              ["Czy przysluguje mi faktura VAT?", "Tak, faktura VAT jest wystawiana automatycznie po kazdej platnosci."],
              ["Czy dziala to rowniez dla spraw juz w toku?", "Absolutnie — subskrypcja obejmuje rowniez biezace sprawy."],
            ].map(([q, a], i) => (
              <div key={i} style={{ marginBottom: 20, padding: "16px 20px", background: "#F9FAFB", borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 6 }}>{q}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
      {selected && <Modal plan={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
