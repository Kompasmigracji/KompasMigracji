"use client";
/* /admin/me — личный кабинет участника профсоюза.
   Участник видит только свои данные (middleware + RBAC) и правит свои контакты. */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Spinner, Empty, Icon, StatCard } from "@/components/admin/ui";

export default function Cabinet() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: "", city: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const me = await fetch("/api/admin/auth/me").then((r) => r.json());
    if (!me.user) { router.push("/admin/login"); return; }
    const res = await fetch("/api/admin/members/" + me.user.id);
    const d = await res.json();
    if (d.error) { setError(d.error); return; }
    setData(d);
    setForm({ phone: d.member.phone || "", city: d.member.city || "" });
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const saveContacts = async () => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/admin/members/" + data.member.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, city: form.city }),
      });
      const d = await res.json();
      if (d.error) { setMsg("⚠ " + d.error); return; }
      setEditing(false);
      setMsg("Контакты обновлены");
      setData((p) => ({ ...p, member: { ...p.member, phone: form.phone, city: form.city } }));
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("⚠ Сеть недоступна");
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="kc-error">
        <Icon name="settings" size={15} color="#d96c6c" />
        <span>{error}</span>
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
    <div style={{ maxWidth: 760, margin: "0 auto" }} className="kc-page-enter">
      {/* шапка кабинета */}
      <div className="kc-row" style={{ marginBottom: 18 }}>
        <div className="kc-brand-mark"><Icon name="compass" size={21} color="#d99e54" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18 }}>
            Кабинет участника
          </div>
          <div style={{ color: "#828c9b", fontSize: 12 }}>Профсоюз Kompas Migracji</div>
        </div>
        <button className="kc-btn kc-btn-ghost" onClick={logout}>
          <Icon name="logout" size={15} /> Выйти
        </button>
      </div>

      {/* профиль */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600 }}>
          {m.full_name}
        </div>
        <div className="kc-mono" style={{ color: "#d99e54", marginTop: 2 }}>{m.member_no}</div>
        <div className="kc-row" style={{ gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <Badge status={m.status} />
          <Badge status={m.dues_status || "unpaid"} />
          <Badge status="open" text={m.category || "standard"} />
        </div>
      </div>

      <div className="kc-grid kc-grid-2" style={{ marginBottom: 14 }}>
        <StatCard icon="cash" value={duePaid + " / " + data.dues.length}
          label="Взносов оплачено" />
        <StatCard icon="briefcase" value={activeCases} label="Активных обращений" />
      </div>

      {/* контактные данные — самообслуживание */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div className="kc-row" style={{ justifyContent: "space-between" }}>
          <div className="kc-card-cap" style={{ margin: 0 }}>Контактные данные</div>
          {!editing && (
            <button className="kc-link" onClick={() => setEditing(true)}
              style={{ fontSize: 13, background: "none", border: "none" }}>
              Изменить
            </button>
          )}
        </div>
        {msg && (
          <div className={msg.startsWith("⚠") ? "kc-error" : "kc-note"}
            style={{ margin: "10px 0" }}>
            {msg}
          </div>
        )}
        {editing ? (
          <div style={{ marginTop: 10 }}>
            <div className="kc-field">
              <label className="kc-label">Телефон</label>
              <input className="kc-input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+48 ..." />
            </div>
            <div className="kc-field">
              <label className="kc-label">Город</label>
              <input className="kc-input" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Gdańsk" />
            </div>
            <div className="kc-row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <button className="kc-btn kc-btn-ghost"
                onClick={() => {
                  setEditing(false);
                  setForm({ phone: m.phone || "", city: m.city || "" });
                }}>
                Отмена
              </button>
              <button className="kc-btn kc-btn-primary" disabled={busy}
                onClick={saveContacts}>
                {busy ? "Сохранение…" : "Сохранить"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 10 }}>
            <div className="kc-row" style={{ padding: "7px 0" }}>
              <span style={{ color: "#828c9b", width: 90, fontSize: 13 }}>Email</span>
              <span style={{ fontSize: 13.5 }}>{m.email}</span>
            </div>
            <div className="kc-row" style={{ padding: "7px 0" }}>
              <span style={{ color: "#828c9b", width: 90, fontSize: 13 }}>Телефон</span>
              <span style={{ fontSize: 13.5 }}>{m.phone || "—"}</span>
            </div>
            <div className="kc-row" style={{ padding: "7px 0" }}>
              <span style={{ color: "#828c9b", width: 90, fontSize: 13 }}>Город</span>
              <span style={{ fontSize: 13.5 }}>{m.city || "—"}</span>
            </div>
          </div>
        )}
      </div>

      {/* мои дела */}
      <div className="kc-card" style={{ marginBottom: 14 }}>
        <div className="kc-card-cap">Мои юридические обращения</div>
        {data.cases.length ? data.cases.map((c) => (
          <div key={c.id} className="kc-row"
            style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ flex: 1, fontSize: 13.5 }}>{c.title}</span>
            <Badge status={c.status} />
          </div>
        )) : <Empty text="Обращений пока нет" />}
      </div>

      {/* мои взносы */}
      <div className="kc-card">
        <div className="kc-card-cap">История взносов</div>
        {data.dues.length ? data.dues.map((d) => (
          <div key={d.id} className="kc-row"
            style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
            <span className="kc-mono" style={{ flex: 1 }}>{d.period}</span>
            <span style={{ color: "#828c9b" }}>{Number(d.amount).toFixed(2)} zł</span>
            <Badge status={d.paid ? "paid" : "unpaid"} />
          </div>
        )) : <Empty text="Взносов нет" />}
      </div>
    </div>
  );
}
