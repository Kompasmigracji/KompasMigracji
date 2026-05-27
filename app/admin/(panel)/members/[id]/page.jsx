"use client";
/* /admin/members/:id — картка учасника профспiлки. */
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Spinner, Empty, Icon, StatCard } from "@/components/admin/ui";

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/members/" + id);
    const d = await res.json();
    if (d.error) { setError(d.error); return; }
    setData(d);
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line

  const setStatus = async (status) => {
    setBusy(true); setMsg("");
    const res = await fetch("/api/admin/members/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const d = await res.json();
    setBusy(false);
    if (d.error) { setMsg("⚠ " + d.error); return; }
    setMsg("Статус оновлено");
    setData((p) => ({ ...p, member: { ...p.member, status } }));
    setTimeout(() => setMsg(""), 2500);
  };

  const setDuesStatus = async (dues_status) => {
    setBusy(true); setMsg("");
    const res = await fetch("/api/admin/members/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dues_status }),
    });
    const d = await res.json();
    setBusy(false);
    if (d.error) { setMsg("⚠ " + d.error); return; }
    setMsg("Статус внескiв оновлено");
    setData((p) => ({ ...p, member: { ...p.member, dues_status } }));
    setTimeout(() => setMsg(""), 2500);
  };

  if (error) {
    return (
      <div>
        <button className="kc-btn kc-btn-ghost" style={{ marginBottom: 14 }}
          onClick={() => router.push("/admin/members")}>
          <Icon name="back" size={15} /> Назад до списку
        </button>
        <div className="kc-error">
          <Icon name="settings" size={15} color="#d96c6c" />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  if (!data) return <Spinner />;

  const m = data.member;
  const duePaid = data.dues.filter((d) => d.paid).length;
  const activeCases = data.cases.filter(
    (c) => c.status !== "closed" && c.status !== "resolved"
  ).length;

  return (
    <div className="kc-page-enter">
      {/* шапка */}
      <div className="kc-row" style={{ marginBottom: 18 }}>
        <button className="kc-btn kc-btn-ghost" onClick={() => router.push("/admin/members")}>
          <Icon name="back" size={15} /> Назад
        </button>
        <div className="kc-mono" style={{ color: "var(--brass)", flex: 1 }}>
          {m.member_no || "Без номера"}
        </div>
      </div>

      {msg && (
        <div className={msg.startsWith("⚠") ? "kc-error" : "kc-note"}
          style={{ marginBottom: 14 }}>{msg}</div>
      )}

      {/* основнi данi */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600 }}>
          {m.full_name}
        </div>
        <div style={{ color: "var(--dim)", fontSize: 13, margin: "4px 0 12px" }}>{m.email}</div>

        <div className="kc-row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <Badge status={m.status} />
          <Badge status={m.dues_status || "unpaid"} />
          <Badge status="dim" text={m.category || "standard"} />
          {m.city && <Badge status="blue" text={m.city} />}
        </div>

        <div className="kc-grid kc-grid-2" style={{ gap: 10 }}>
          {/* статус учасника */}
          <div>
            <div className="kc-label">Статус учасника</div>
            <select className="kc-select" value={m.status}
              onChange={(e) => setStatus(e.target.value)} disabled={busy}>
              <option value="active">Активний</option>
              <option value="suspended">Заблокований</option>
              <option value="pending">Очiкує</option>
            </select>
          </div>
          {/* статус внескiв */}
          <div>
            <div className="kc-label">Статус внескiв</div>
            <select className="kc-select" value={m.dues_status || "unpaid"}
              onChange={(e) => setDuesStatus(e.target.value)} disabled={busy}>
              <option value="paid">Оплачено</option>
              <option value="unpaid">Не оплачено</option>
              <option value="exempt">Звiльнений</option>
            </select>
          </div>
        </div>
      </div>

      {/* метрики */}
      <div className="kc-grid kc-grid-2" style={{ marginBottom: 14 }}>
        <StatCard icon="cash" value={duePaid + " / " + data.dues.length}
          label="Внескiв оплачено" />
        <StatCard icon="briefcase" value={activeCases} label="Активних звернень" />
      </div>

      {/* контакти */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div className="kc-card-cap">Контактнi данi</div>
        <div className="kc-row" style={{ padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--dim)", width: 110, fontSize: 13 }}>Телефон</span>
          <span style={{ fontSize: 13.5 }}>{m.phone || "—"}</span>
        </div>
        <div className="kc-row" style={{ padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--dim)", width: 110, fontSize: 13 }}>Мiсто</span>
          <span style={{ fontSize: 13.5 }}>{m.city || "—"}</span>
        </div>
        <div className="kc-row" style={{ padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--dim)", width: 110, fontSize: 13 }}>Дата вступу</span>
          <span style={{ fontSize: 13.5 }}>
            {m.join_date ? new Date(m.join_date).toLocaleDateString("uk-UA") : "—"}
          </span>
        </div>
        <div className="kc-row" style={{ padding: "7px 0" }}>
          <span style={{ color: "var(--dim)", width: 110, fontSize: 13 }}>Зареєстровано</span>
          <span style={{ fontSize: 13.5 }}>
            {m.created_at ? new Date(m.created_at).toLocaleDateString("uk-UA") : "—"}
          </span>
        </div>
      </div>

      {/* справи */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div className="kc-card-cap">Юридичнi звернення</div>
        {data.cases.length ? data.cases.map((c) => (
          <div key={c.id} className="kc-row"
            style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ flex: 1, fontSize: 13.5 }}>{c.title}</span>
            <Badge status={c.status} />
          </div>
        )) : <Empty text="Звернень немає" />}
      </div>

      {/* внески */}
      <div className="kc-card">
        <div className="kc-card-cap">Iсторiя внескiв</div>
        {data.dues.length ? data.dues.map((d) => (
          <div key={d.id} className="kc-row"
            style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
            <span className="kc-mono" style={{ flex: 1 }}>{d.period}</span>
            <span style={{ color: "var(--dim)" }}>{Number(d.amount).toFixed(2)} zł</span>
            <Badge status={d.paid ? "paid" : "unpaid"} />
          </div>
        )) : <Empty text="Внескiв немає" />}
      </div>
    </div>
  );
}
