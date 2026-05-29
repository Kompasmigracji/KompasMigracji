"use client";
// F3 admin UI: Subscription management dashboard
import React, { useEffect, useState } from "react";
import { Spinner, Empty, Badge, StatCard } from "@/components/admin/ui";

const STATUS_COLOR = {
  active: "#10B981", trial: "#3B82F6", past_due: "#F59E0B",
  expired: "#6B7280", cancelled: "#EF4444",
};
const STATUS_LABEL = {
  active: "Активна", trial: "Пробний", past_due: "Прострочена",
  expired: "Закінчилась", cancelled: "Скасована",
};

const PLAN_BADGE = {
  basic: { color: "#6B7280", label: "Basic" },
  standard: { color: "#D8232A", label: "Standard" },
  premium: { color: "#7C3AED", label: "Premium" },
};

export default function SubscriptionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [msg, setMsg] = useState("");

  const load = (status) =>
    fetch(`/api/admin/subscriptions?status=${status}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));

  useEffect(() => { load(filter); }, [filter]);

  const changeStatus = async (id, status) => {
    setMsg("");
    const r = await fetch("/api/admin/subscriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const d = await r.json();
    if (d.ok) { setMsg("Збережено"); load(filter); }
    else setMsg(d.error || "Помилка");
  };

  const stats = data?.stats || {};
  const subs = data?.subscriptions || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Підписки</div>
        <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>
          F1-F4 · Управління активними та прострочeними підписками
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatCard icon="users" value={stats.active || 0} label="Активних" />
        <StatCard icon="alert" value={stats.past_due || 0} label="Прострочених" />
        <StatCard icon="cash" value={`${stats.mrr || 0} PLN`} label="MRR з підписок" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["active", "trial", "past_due", "cancelled", "expired"].map(s => (
          <button key={s} onClick={() => { setFilter(s); setLoading(true); }}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: "pointer",
              border: filter === s ? `2px solid ${STATUS_COLOR[s] || "#6B7280"}` : "2px solid var(--border)",
              background: filter === s ? (STATUS_COLOR[s] || "#6B7280") + "18" : "transparent",
              color: filter === s ? (STATUS_COLOR[s] || "#6B7280") : "var(--dim)",
            }}>
            {STATUS_LABEL[s] || s}
          </button>
        ))}
      </div>

      {msg && <div style={{ fontSize: 12, color: "#10B981", marginBottom: 12 }}>{msg}</div>}

      {loading ? <Spinner /> : subs.length === 0 ? <Empty text="Немає підписок" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {subs.map(sub => {
            const plan = PLAN_BADGE[sub.plan_slug] || { color: "#6B7280", label: sub.plan_slug };
            return (
              <div key={sub.id} className="kc-card" style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
                        {sub.client_name || sub.member_name || "—"}
                      </span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                        background: plan.color + "20", color: plan.color,
                      }}>{plan.label}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 10, fontSize: 11,
                        background: (STATUS_COLOR[sub.status] || "#6B7280") + "15",
                        color: STATUS_COLOR[sub.status] || "#6B7280",
                      }}>{STATUS_LABEL[sub.status] || sub.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>
                      {sub.email || sub.member_email || "Без email"}
                      {sub.amount_pln ? ` · ${sub.amount_pln} PLN/мiс` : ""}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 2 }}>
                      {sub.next_billing_at
                        ? `Наступне: ${new Date(sub.next_billing_at).toLocaleDateString("uk-UA")}`
                        : "Дата невизначена"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {sub.status !== "active" && (
                      <button onClick={() => changeStatus(sub.id, "active")}
                        style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: "#10B98118", color: "#10B981", border: "none", cursor: "pointer" }}>
                        Активувати
                      </button>
                    )}
                    {sub.status === "active" && (
                      <button onClick={() => changeStatus(sub.id, "cancelled")}
                        style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11,
                          background: "#EF444418", color: "#EF4444", border: "none", cursor: "pointer" }}>
                        Скасувати
                      </button>
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
