"use client";
/* /payment/mock/[sessionId] — Тестова сторінка оплати.
   Використовується коли P24_SANDBOX=mock або ключі P24 не задані.
   Відтворює вигляд платіжної сторінки, але без реальних грошей. */
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function MockPaymentPage() {
  const { sessionId } = useParams();
  const sp            = useSearchParams();
  const router        = useRouter();

  const amountGroszy = parseInt(sp.get("amount") || "0", 10);
  const amountPln    = (amountGroszy / 100).toFixed(2);
  const description  = sp.get("desc") || "Послуга";
  const currency     = sp.get("cur")  || "PLN";

  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState("idle"); // idle | confirming | done | rejected

  async function handlePay(success) {
    setLoading(true);
    setStep(success ? "confirming" : "rejected");
    try {
      const res = await fetch("/api/payment-mock-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, success }),
      });
      const d = await res.json();
      if (!d.ok && d.error) {
        alert("Помилка: " + d.error);
        setStep("idle");
        setLoading(false);
        return;
      }
    } catch {
      alert("Мережа недоступна");
      setStep("idle");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      router.push(success ? "/payment/success" : "/payment/failed");
    }, 800);
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0f172a",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Банер "ТЕСТ" */}
        <div style={{
          background: "rgba(251,191,36,0.15)",
          border: "1px solid rgba(251,191,36,0.4)",
          borderRadius: 10, padding: "8px 16px",
          marginBottom: 16, textAlign: "center",
          color: "#fbbf24", fontSize: 13, fontWeight: 700,
          letterSpacing: "0.05em",
        }}>
          ⚠️ ТЕСТОВИЙ РЕЖИМ — гроші не списуються
        </div>

        {/* Картка */}
        <div style={{
          background: "#1c2433",
          border: "1px solid #2d3748",
          borderRadius: 20, padding: "36px 32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          {/* Лого P24 (текст) */}
          <div style={{
            textAlign: "center", marginBottom: 24,
            color: "#5a6470", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em",
          }}>
            🔵 Przelewy24 — Symulator płatności
          </div>

          {/* Сума */}
          <div style={{
            background: "#0f1623", border: "1px solid #2d3748",
            borderRadius: 12, padding: "20px 24px", marginBottom: 24,
            textAlign: "center",
          }}>
            <div style={{ color: "#8a96a3", fontSize: 13, marginBottom: 6 }}>
              Сума до сплати:
            </div>
            <div style={{ color: "#e2e8f0", fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {amountPln} <span style={{ fontSize: 22, color: "#8a96a3" }}>{currency}</span>
            </div>
            <div style={{ color: "#5a6470", fontSize: 12, marginTop: 8 }}>
              {description}
            </div>
          </div>

          {/* ID сесії */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#5a6470", marginBottom: 4 }}>Session ID:</div>
            <code style={{
              display: "block", background: "#0f1623",
              border: "1px solid #2d3748", borderRadius: 8,
              padding: "6px 10px", fontSize: 11,
              color: "#8a96a3", wordBreak: "break-all",
            }}>
              {sessionId}
            </code>
          </div>

          {/* Кнопки */}
          {step === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => handlePay(true)}
                disabled={loading}
                style={{
                  width: "100%", padding: "14px 20px",
                  borderRadius: 12, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff", fontSize: 16, fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
                  transition: "opacity 0.15s",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                ✅ Підтвердити оплату
              </button>
              <button
                onClick={() => handlePay(false)}
                disabled={loading}
                style={{
                  width: "100%", padding: "12px 20px",
                  borderRadius: 12, border: "1px solid rgba(220,38,38,0.3)",
                  cursor: "pointer", background: "rgba(220,38,38,0.1)",
                  color: "#dc2626", fontSize: 14, fontWeight: 600,
                  transition: "opacity 0.15s", opacity: loading ? 0.6 : 1,
                }}
              >
                ❌ Відхилити (симулювати помилку)
              </button>
            </div>
          )}

          {step === "confirming" && (
            <div style={{
              textAlign: "center", padding: "16px 0",
              color: "#22c55e", fontSize: 15, fontWeight: 600,
            }}>
              ⏳ Обробка платежу…
            </div>
          )}

          {step === "rejected" && (
            <div style={{
              textAlign: "center", padding: "16px 0",
              color: "#dc2626", fontSize: 15, fontWeight: 600,
            }}>
              ❌ Платіж відхилено…
            </div>
          )}

          {/* Підказка */}
          <div style={{
            marginTop: 20, padding: "10px 14px",
            background: "rgba(251,191,36,0.07)", borderRadius: 8,
            fontSize: 11, color: "#92400e", lineHeight: 1.5,
          }}>
            💡 Це тестова сторінка. Реальна P24 буде підключена після реєстрації.
          </div>
        </div>
      </div>
    </main>
  );
}
