/* Innovation 4: Client Self-Service Portal — PIN login
   F10: auto PIN lookup, F12: access log */
"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BRAND = "#D8232A";

export default function PortalPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const d = await r.json();
      if (r.ok) {
        router.push(`/portal/case/${pin.trim().toUpperCase()}`);
      } else {
        setError(d.error || "Невірний PIN");
        setLoading(false);
      }
    } catch {
      setError("Мережева помилка");
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight:"100vh", background:"#F0F2F5", display:"flex", alignItems:"center",
      justifyContent:"center", fontFamily:"'Segoe UI',Arial,sans-serif", padding:"20px 16px" }}>
      <div style={{ width:"100%", maxWidth:380 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:32, marginBottom:6 }}>🧭</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#111" }}>Kompas Migracji</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:4 }}>Портал клієнта</div>
        </div>

        <div style={{ background:"#fff", borderRadius:14, boxShadow:"0 4px 24px rgba(0,0,0,0.1)",
          padding:"28px 24px" }}>
          <h2 style={{ fontSize:17, fontWeight:700, color:"#111", textAlign:"center", margin:"0 0 6px" }}>
            Статус вашої заявки
          </h2>
          <p style={{ fontSize:13, color:"#6B7280", textAlign:"center", margin:"0 0 22px", lineHeight:1.5 }}>
            Введіть PIN-код, який ми надіслали вам у Telegram або WhatsApp
          </p>

          <form onSubmit={submit}>
            <input
              value={pin}
              onChange={e => setPin(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="PIN-КОД (напр. A1B2C3)"
              autoFocus
              style={{ width:"100%", padding:"12px 14px", borderRadius:9, fontSize:18,
                border: `2px solid ${error ? "#EF4444" : "#E5E7EB"}`,
                textAlign:"center", fontWeight:700, letterSpacing:"0.15em",
                fontFamily:"monospace", background:"#F9FAFB", color:"#111",
                boxSizing:"border-box", outline:"none", marginBottom:12 }}
            />
            {error && (
              <div style={{ color:"#EF4444", fontSize:12, textAlign:"center", marginBottom:10 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={!pin.trim() || loading}
              style={{ width:"100%", padding:"12px 0", borderRadius:9, background:BRAND,
                color:"#fff", fontWeight:700, fontSize:15, border:"none", cursor:"pointer",
                opacity: (!pin.trim() || loading) ? 0.6 : 1, transition:"opacity 0.2s" }}>
              {loading ? "Перевіряємо..." : "Переглянути статус →"}
            </button>
          </form>

          <div style={{ marginTop:18, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:8 }}>
              Немає PIN-коду? Зверніться до менеджера:
            </div>
            <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13,
                color:"#16a34a", fontWeight:600, textDecoration:"none" }}>
              💬 WhatsApp: +48 729 271 848
            </a>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:16, fontSize:11, color:"#9CA3AF" }}>
          🔒 Захищений доступ · Kompas Migracji sp. z o.o.
        </div>
      </div>
    </main>
  );
}
