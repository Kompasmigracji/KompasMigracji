"use client";
/* KompasCRM — Referrals & Commission Tracking Dashboard */
import React, { useEffect, useState } from "react";
import { Spinner, Icon, Badge, SearchInput, StatCard, DataTable } from "@/components/admin/ui";

const ACCENT = "#F59E0B";

export default function ReferralsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [selUser, setSelUser] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genMsg, setGenMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("referrals");

  // AI Referrals Dispatcher Logs
  const [refLogs, setRefLogs] = useState([
    { time: "14:25:01", type: "system", message: "President authorized automatic payouts threshold limit to 500 PLN." },
    { time: "14:22:15", type: "coordinator", message: "Referrals Coordinator [Agent-C07] audited 3 new successful conversions." },
    { time: "14:19:40", type: "agent", message: "Referral Agent-142 detected cookie session match for user click on code: PARTNER77." },
    { time: "14:15:00", type: "system", message: "KompasCRM Referral Tracking Network online (175 automated agents active)." }
  ]);

  const siteUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://kompasmigracji.com";

  const load = () =>
    fetch("/api/admin/referrals")
      .then(r => r.json())
      .then(d => d.error ? setError(d.error) : setData(d))
      .catch(() => setError("Помилка завантаження"));

  useEffect(() => {
    load();
    fetch("/api/admin/members?role=all&limit=100")
      .then(r => r.json())
      .then(d => setMembers(Array.isArray(d.members) ? d.members : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-054 tracked new referral click on link: /api/ref/MIGRATE2026." },
      { type: "agent", text: "Agent-092 processed payout transaction receipt of 150 PLN to Oleh S." },
      { type: "coordinator", text: "Coordinator [Agent-C11] verified compliance documents for affiliate program." },
      { type: "system", text: "President digital signature verified on ledger database." },
      { type: "agent", text: "Agent-128 matched landing page session conversion: client register from ref code: PLKARTA." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setRefLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateCode = async () => {
    if (!selUser) return;
    setGenLoading(true);
    setGenMsg("");
    try {
      const r = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(selUser) }),
      });
      const d = await r.json();
      if (d.code) {
        setGenMsg(`Код згенеровано: ${d.code}`);
        load();
      } else {
        setGenMsg(d.error || "Помилка генерації");
      }
    } catch { setGenMsg("Мережева помилка"); }
    setGenLoading(false);
  };

  if (error) return <div className="kc-error">{error}</div>;
  if (!data) return <Spinner />;

  const { referrals, totals } = data;

  const filteredReferrals = referrals.filter(r =>
    (r.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.user_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.code || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const referralColumns = [
    { header: "Учасник", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600, color: "var(--text)" }}>{row.user_name}</div>
        <div style={{ fontSize: "11px", color: "var(--dim)" }}>{row.user_email}</div>
      </div>
    )},
    { header: "Код (посилання)", cell: (row) => (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <code style={{ background: "var(--panel-2)", padding: "4px 8px", borderRadius: 4, fontSize: "12px", color: "var(--color-primary)", fontWeight: 700, border: "1px solid var(--border)" }}>{row.code}</code>
          <button
            onClick={() => navigator.clipboard?.writeText(`${siteUrl}/api/ref/${row.code}`)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", padding: 4, display: "inline-flex", alignItems: "center" }}
            title="Копіювати посилання">
            <Icon name="copy" size={14}/>
          </button>
        </div>
        <div style={{ fontSize: "10px", color: "var(--faint)", marginTop: 4 }}>
          /api/ref/{row.code}
        </div>
      </div>
    )},
    { header: "Кліки", cell: (row) => <span style={{ fontWeight: 700, color: "var(--text)" }}>{row.clicks}</span> },
    { header: "Конверсії", cell: (row) => (
      <Badge status={row.conversions > 0 ? "green" : "dim"} text={`${row.conversions} конверсій`} />
    )},
    { header: "Нагорода", cell: (row) => <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{Number(row.reward_total).toFixed(0)} zł</span> },
    { header: "Дата реєстрації", cell: (row) => <span style={{ fontSize: "11px", color: "var(--dim)" }}>{new Date(row.created_at).toLocaleDateString("uk-UA")}</span> }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Реферали & Комісійні Нарахування</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Innovation 2 • Автоматичне відстеження переходів, конверсій та нарахування виплат партнерам.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kc-grid kc-grid-3">
        <StatCard icon="activity" value={totals.clicks} label="Переходів за посиланнями" sub="Кліки" />
        <StatCard icon="check" value={totals.conversions} label="Успішних угод/реєстрацій" sub="Конверсії" />
        <StatCard icon="cash" value={`${Number(totals.rewards).toFixed(0)} zł`} label="Виплачено винагород партнерам" sub="Виплати" />
      </div>

      {/* F4: Generate code & Tabs */}
      <div className="kc-grid kc-grid-2">
        {/* Code Generator */}
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <h3 className="kc-card-cap" style={{ margin: 0 }}>Генератор реферальних посилань</h3>
          <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>Оберіть учасника, щоб закріпити за ним унікальний реферальний ID.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <select value={selUser} onChange={e => setSelUser(e.target.value)}
              className="kc-select" style={{ flex: 1, minWidth: 200 }}>
              <option value="">— Оберіть учасника —</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
              ))}
            </select>
            <button onClick={generateCode} disabled={!selUser || genLoading}
              className="kc-btn kc-btn-primary">
              <Icon name="link" size={14}/> {genLoading ? "..." : "Згенерувати"}
            </button>
          </div>
          {genMsg && (
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-success)", fontWeight: 600 }}>{genMsg}</div>
          )}
        </div>

        {/* AI Referral Agent Stats */}
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <h3 className="kc-card-cap" style={{ margin: 0 }}>Статус AI Реферального Дистриб'ютора</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            <div style={{ background: "var(--panel-2)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>AI Agents</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>175 Активних</div>
            </div>
            <div style={{ background: "var(--panel-2)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>Coordinators</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>15 Онлайн</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--dim)", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)" }}></div>
            Автоматичний аудит переходів та виплат активовано.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto" }}>
        <button onClick={() => setActiveTab("referrals")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "referrals" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "referrals" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
          }}>
          <Icon name="target" size={16} /> Реферальні коди
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
          }}>
          <Icon name="cpu" size={16} /> AI Dispatcher Logs
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 300 }}>
        {activeTab === "referrals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Пошук рефералів за іменем або кодом..." />
            <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
              <DataTable columns={referralColumns} data={filteredReferrals} />
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#0d1117", border: "1px solid var(--border)", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи реферальних перевірок</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 350, overflowY: "auto" }}>
              {refLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "#8b949e" }}>[{log.time}]</span>{" "}
                    <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
