"use client";
// F5 UI: NPS survey public page — accessed via token link
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const BRAND = "#D8232A";

const LABELS = {
  0: "Zdecydowanie nie polecam",
  1: "Nie polecam",
  2: "Raczej nie polecam",
  3: "Nie polecam",
  4: "Raczej nie polecam",
  5: "Neutralnie",
  6: "Raczej polecam",
  7: "Polecam",
  8: "Polecam",
  9: "Zdecydowanie polecam",
  10: "Zdecydowanie polecam!",
};

function getScoreColor(n) {
  if (n <= 6) return "#EF4444";
  if (n <= 8) return "#F59E0B";
  return "#10B981";
}

function NpsForm() {
  const params = useSearchParams();
  const token = params.get("token");

  const [survey, setSurvey] = useState(null);
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`/api/nps?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else if (d.alreadySubmitted) setDone(true);
        else setSurvey(d);
        setLoading(false);
      })
      .catch(() => { setError("Blad sieci"); setLoading(false); });
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (score === null) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, score, comment }),
      });
      const d = await r.json();
      if (d.ok) setDone(true);
      else setError(d.error || "Blad");
    } catch { setError("Blad sieci"); }
    setSubmitting(false);
  };

  return (
    <main style={{
      minHeight: "100vh", background: "#F0F2F5",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px 16px", fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>&#x1F9ED;</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Kompas Migracji</div>
        </div>

        <div style={{
          background: "#fff", borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)", overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#6B7280" }}>Ladowanie...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>&#x274C;</div>
              <div style={{ fontWeight: 700, color: "#111" }}>Blad</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 8 }}>{error}</div>
            </div>
          ) : done ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>&#x2B50;</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 10px" }}>
                Dziekujemy za opinie!
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                Twoja ocena pomaga nam sie rozwijac i lepiej sluzyc kolejnym klientom.
              </p>
              <a
                href="https://wa.me/48729271848"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block", marginTop: 20, padding: "10px 22px",
                  background: "#25D366", color: "#fff", borderRadius: 8,
                  textDecoration: "none", fontWeight: 700, fontSize: 14,
                }}
              >
                &#x1F4AC; WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ background: BRAND + "10", padding: "20px 24px", borderBottom: `3px solid ${BRAND}` }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 4 }}>
                  Jak oceniasz nasze uslugi?
                </div>
                {survey?.clientName && (
                  <div style={{ fontSize: 13, color: "#6B7280" }}>
                    Czesc, {survey.clientName}! Zajmie to 30 sekund.
                  </div>
                )}
              </div>

              <div style={{ padding: "24px 24px 20px" }}>
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 16, fontWeight: 500 }}>
                  W skali 0-10, jak bardzo polecilbys/polecilabys Kompas Migracji znajomym?
                </div>

                {/* Score buttons */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                  {Array.from({ length: 11 }, (_, n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setScore(n)}
                      style={{
                        width: 40, height: 40, borderRadius: 8, fontSize: 14, fontWeight: 700,
                        cursor: "pointer", border: score === n ? "2px solid transparent" : "2px solid #E5E7EB",
                        background: score === n ? getScoreColor(n) : "#F9FAFB",
                        color: score === n ? "#fff" : "#374151",
                        transition: "all 0.15s",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* Score labels */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginBottom: 20 }}>
                  <span>Zdecydowanie nie</span>
                  <span>Zdecydowanie tak</span>
                </div>

                {score !== null && (
                  <div style={{
                    padding: "8px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600,
                    background: getScoreColor(score) + "15", color: getScoreColor(score),
                  }}>
                    {score} / 10 — {LABELS[score]}
                  </div>
                )}

                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Co mozemy poprawic? (opcjonalnie)"
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: "1.5px solid #E5E7EB", fontSize: 13, color: "#111",
                    fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                    background: "#F9FAFB", outline: "none", marginBottom: 16,
                  }}
                />

                {error && <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>{error}</div>}

                <button
                  type="submit"
                  disabled={score === null || submitting}
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 10, background: BRAND,
                    color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
                    opacity: (score === null || submitting) ? 0.5 : 1, transition: "opacity 0.2s",
                  }}
                >
                  {submitting ? "Wysylamy..." : "Wyslij opinie &#x2192;"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#9CA3AF" }}>
          &#x1F512; Kompas Migracji sp. z o.o. &middot; kompasmigracji.com
        </div>
      </div>
    </main>
  );
}

export default function NpsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48, textAlign: "center" }}>Ladowanie...</div>}>
      <NpsForm />
    </Suspense>
  );
}
