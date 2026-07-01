"use client";
// F3 UI: Appointment booking page — public calendar + form
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const BRAND = "#D8232A";

const SERVICES = [
  "Karta pobytu czasowego",
  "Karta pobytu stalego",
  "Obywatelstwo polskie",
  "Rejestracja dzialalnosci",
  "Zezwolenie na prace",
  "Sprawy ZUS / ubezpieczenie",
  "Konsultacja ogolna",
];

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function getNext14Days(): { label: string; value: string }[] {
  const days: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // Skip weekends
    const label = d.toLocaleDateString("pl-PL", { weekday: "short", day: "2-digit", month: "2-digit" });
    const value = d.toISOString().slice(0, 10);
    days.push({ label, value });
  }
  return days;
}

export default function BookPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedAt, setBookedAt] = useState("");

  const days = getNext14Days();

  const submit = async () => {
    if (!name.trim()) { setError("Podaj imie i nazwisko"); return; }
    setLoading(true);
    setError("");
    try {
      const appointmentAt = new Date(`${date}T${time}:00`).toISOString();
      const r = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, appointmentAt, notes }),
      });
      const d = await r.json();
      if (d.id) {
        setBookedAt(new Date(`${date}T${time}:00`).toLocaleString("pl-PL", {
          weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit",
        }));
        setStep(3);
      } else {
        setError(d.error || "Blad rezerwacji");
      }
    } catch {
      setError("Blad sieci");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", background: "#F0F2F5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

        {/* Hero */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #D8232A 100%)",
          padding: "56px 16px 64px", textAlign: "center", color: "#fff",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
            Bezplatna pierwsza konsultacja
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            Zarezerwuj spotkanie z ekspertem
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", maxWidth: 480, margin: "0 auto" }}>
            30-minutowa konsultacja online z naszym specjalista ds. migracji. Bez oplat, bez zobowiazan.
          </p>
        </section>

        {/* Booking card */}
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "40px 16px 60px" }}>
          <div style={{
            background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}>
            {/* Progress bar */}
            <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
              {[
                { n: 1, label: "Usluga i termin" },
                { n: 2, label: "Twoje dane" },
                { n: 3, label: "Potwierdzenie" },
              ].map(s => (
                <div key={s.n} style={{
                  flex: 1, padding: "14px 8px", textAlign: "center", fontSize: 12, fontWeight: 600,
                  color: step >= s.n ? BRAND : "#9CA3AF",
                  borderBottom: step === s.n ? `2px solid ${BRAND}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: "50%",
                    background: step > s.n ? "#10B981" : step === s.n ? BRAND : "#E5E7EB",
                    color: step >= s.n ? "#fff" : "#9CA3AF",
                    fontSize: 11, fontWeight: 700, marginRight: 6,
                  }}>
                    {step > s.n ? "✓" : s.n}
                  </span>
                  {s.label}
                </div>
              ))}
            </div>

            <div style={{ padding: "28px 28px 32px" }}>
              {step === 1 && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      1. Wybierz usluge
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {SERVICES.map(s => (
                        <button
                          key={s}
                          onClick={() => setService(s)}
                          style={{
                            padding: "8px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                            border: service === s ? `2px solid ${BRAND}` : "2px solid #E5E7EB",
                            background: service === s ? BRAND + "12" : "#fff",
                            color: service === s ? BRAND : "#374151", fontWeight: service === s ? 600 : 400,
                            transition: "all 0.15s",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      2. Wybierz date
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {days.map(d => (
                        <button
                          key={d.value}
                          onClick={() => setDate(d.value)}
                          style={{
                            padding: "8px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                            border: date === d.value ? `2px solid ${BRAND}` : "2px solid #E5E7EB",
                            background: date === d.value ? BRAND + "12" : "#fff",
                            color: date === d.value ? BRAND : "#374151", fontWeight: date === d.value ? 600 : 400,
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {date && (
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        3. Wybierz godzine
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {TIMES.map(t => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            style={{
                              padding: "8px 16px", borderRadius: 8, fontSize: 14, cursor: "pointer",
                              border: time === t ? `2px solid ${BRAND}` : "2px solid #E5E7EB",
                              background: time === t ? BRAND : "#fff",
                              color: time === t ? "#fff" : "#374151", fontWeight: 600,
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    disabled={!service || !date || !time}
                    onClick={() => setStep(2)}
                    style={{
                      width: "100%", padding: "13px 0", borderRadius: 10, background: BRAND,
                      color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
                      opacity: (!service || !date || !time) ? 0.4 : 1,
                    }}
                  >
                    Dalej: Twoje dane &rarr;
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8,
                    padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#065F46" }}>
                    &#x1F4C5; {service || "Konsultacja"} &middot; {date} o {time}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { val: name, set: setName, ph: "Imie i nazwisko *", type: "text" },
                      { val: email, set: setEmail, ph: "Email (opcjonalnie)", type: "email" },
                      { val: phone, set: setPhone, ph: "Telefon (opcjonalnie)", type: "tel" },
                    ].map((f, i) => (
                      <input
                        key={i}
                        type={f.type}
                        placeholder={f.ph}
                        value={f.val}
                        onChange={e => f.set(e.target.value)}
                        style={{
                          padding: "11px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                          fontSize: 14, color: "#111", outline: "none", background: "#F9FAFB",
                          fontFamily: "inherit",
                        }}
                      />
                    ))}
                    <textarea
                      placeholder="Krotki opis Twojej sytuacji (opcjonalnie)"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      style={{
                        padding: "11px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB",
                        fontSize: 14, color: "#111", outline: "none", background: "#F9FAFB",
                        fontFamily: "inherit", resize: "vertical",
                      }}
                    />
                  </div>

                  {error && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{error}</div>}

                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1, padding: "12px 0", borderRadius: 10, background: "#F3F4F6",
                        color: "#374151", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
                      }}
                    >
                      &larr; Wstecz
                    </button>
                    <button
                      onClick={submit}
                      disabled={!name.trim() || loading}
                      style={{
                        flex: 2, padding: "12px 0", borderRadius: 10, background: BRAND,
                        color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                        opacity: (!name.trim() || loading) ? 0.6 : 1,
                      }}
                    >
                      {loading ? "Rezerwujemy..." : "Potwierdz rezerwacje &#x2714;"}
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>&#x1F389;</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>
                    Rezerwacja potwierdzona!
                  </h2>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: "0 0 20px" }}>
                    Twoja konsultacja: <strong>{bookedAt}</strong>
                  </p>
                  {email && (
                    <p style={{ fontSize: 13, color: "#6B7280" }}>
                      Potwierdzenie wyslano na: <strong>{email}</strong>
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
                    <a
                      href="https://wa.me/48729271848"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "11px 22px", borderRadius: 9, background: "#25D366",
                        color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                      }}
                    >
                      &#x1F4AC; WhatsApp
                    </a>
                    <a
                      href="/"
                      style={{
                        padding: "11px 22px", borderRadius: 9, background: "#F3F4F6",
                        color: "#374151", fontWeight: 600, fontSize: 14, textDecoration: "none",
                      }}
                    >
                      Strona glowna
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
