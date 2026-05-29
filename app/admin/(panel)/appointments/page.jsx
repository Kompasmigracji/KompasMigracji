"use client";
// F7 admin UI: Appointment management dashboard
import React, { useEffect, useState } from "react";
import { Spinner, Empty, Icon } from "@/components/admin/ui";

const STATUS_COLOR = {
  pending: "#F59E0B", confirmed: "#10B981", cancelled: "#EF4444",
  completed: "#6B7280", no_show: "#EF4444",
};
const STATUS_LABEL = {
  pending: "Очiкує", confirmed: "Пiдтверджено", cancelled: "Скасовано",
  completed: "Завершено", no_show: "Не з'явився",
};

export default function AppointmentsPage() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);
  const [meetLink, setMeetLink] = useState("");

  const load = () => {
    setLoading(true);
    const qs = filter === "upcoming" ? "upcoming=1" : `status=${filter}`;
    fetch(`/api/admin/appointments?${qs}`)
      .then(r => r.json())
      .then(d => { setAppts(d.appointments || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const update = async (id, data) => {
    const r = await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    const d = await r.json();
    if (d.ok) { setMsg("Збережено"); setEditing(null); load(); }
    else setMsg(d.error || "Помилка");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Записи на консультацiї</div>
        <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>
          F6-F8 · Бронювання, пiдтвердження, нагадування
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "upcoming", label: "Майбутні" },
          { key: "pending", label: "Очiкують" },
          { key: "confirmed", label: "Пiдтвердженi" },
          { key: "completed", label: "Завершенi" },
          { key: "cancelled", label: "Скасованi" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: filter === f.key ? "2px solid var(--brass)" : "2px solid var(--border)",
              background: filter === f.key ? "var(--brass-dim)" : "transparent",
              color: filter === f.key ? "var(--brass)" : "var(--dim)",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {msg && <div style={{ fontSize: 12, color: "#10B981", marginBottom: 12 }}>{msg}</div>}

      {loading ? <Spinner /> : appts.length === 0 ? <Empty text="Немає записів" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {appts.map(a => {
            const dt = new Date(a.appointment_at);
            const dateStr = dt.toLocaleDateString("uk-UA", { weekday: "short", day: "2-digit", month: "short" });
            const timeStr = dt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
            const isEditing = editing === a.id;

            return (
              <div key={a.id} className="kc-card" style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Date badge */}
                  <div style={{
                    flexShrink: 0, background: "#D8232A", color: "#fff", borderRadius: 10,
                    padding: "8px 12px", textAlign: "center", minWidth: 56,
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{dt.getDate()}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, marginTop: 2 }}>
                      {dt.toLocaleString("uk-UA", { month: "short" }).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>{timeStr}</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{a.client_name}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                        background: (STATUS_COLOR[a.status] || "#6B7280") + "18",
                        color: STATUS_COLOR[a.status] || "#6B7280",
                      }}>{STATUS_LABEL[a.status] || a.status}</span>
                      {a.reminder_sent && (
                        <span style={{ fontSize: 10, color: "#10B981" }}>&#x2713; нагадування</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>
                      {a.service || "Консультацiя"} &middot; {a.client_phone || a.client_email || "—"}
                    </div>
                    {a.meeting_link && (
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        <a href={a.meeting_link} target="_blank" rel="noreferrer"
                          style={{ color: "#3B82F6", textDecoration: "none" }}>
                          &#x1F4F9; Link do spotkania
                        </a>
                      </div>
                    )}
                    {a.notes && (
                      <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 4, fontStyle: "italic" }}>
                        {a.notes.slice(0, 100)}
                      </div>
                    )}

                    {isEditing && (
                      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <input
                          value={meetLink}
                          onChange={e => setMeetLink(e.target.value)}
                          placeholder="https://meet.google.com/..."
                          style={{
                            flex: 1, padding: "7px 10px", borderRadius: 7, fontSize: 12,
                            border: "1px solid var(--border)", background: "var(--input)", color: "var(--text)",
                          }}
                        />
                        <button onClick={() => update(a.id, { meeting_link: meetLink })}
                          style={{ padding: "7px 12px", borderRadius: 7, background: "#3B82F6", color: "#fff",
                            fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
                          Зберегти
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                    {a.status === "pending" && (
                      <button onClick={() => update(a.id, { status: "confirmed" })}
                        style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: "#10B98118", color: "#10B981", border: "none", cursor: "pointer" }}>
                        Пiдтвердити
                      </button>
                    )}
                    {["pending", "confirmed"].includes(a.status) && (
                      <>
                        <button onClick={() => { setEditing(isEditing ? null : a.id); setMeetLink(a.meeting_link || ""); }}
                          style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11,
                            background: "#3B82F618", color: "#3B82F6", border: "none", cursor: "pointer" }}>
                          Link
                        </button>
                        <button onClick={() => update(a.id, { status: "completed" })}
                          style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11,
                            background: "#6B728018", color: "#6B7280", border: "none", cursor: "pointer" }}>
                          Завершити
                        </button>
                        <button onClick={() => update(a.id, { status: "cancelled" })}
                          style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11,
                            background: "#EF444418", color: "#EF4444", border: "none", cursor: "pointer" }}>
                          &#x2715;
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
