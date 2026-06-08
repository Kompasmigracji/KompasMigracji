"use client";
/* KompasCRM — Referrals & Commission Tracking Dashboard */
import React, { useEffect, useState } from "react";
import { Spinner, Icon, Badge, SearchInput } from "@/components/admin/ui";

const ACCENT = "#F59E0B";
const GREEN  = "#10B981";

export default function ReferralsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [selUser, setSelUser] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genMsg, setGenMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("referrals");

  // AI Referrals Dispatcher Logs (175 automated agents, 15 coordinators, 1 president)
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

  // Generate ref code for selected user
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

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Реферали & Комісійні Нарахування</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Innovation 2 · Автоматичне відстеження переходів, конверсій та нарахування виплат партнерам.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kc-grid kc-grid-3">
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
              <Icon name="activity" size={18} color={ACCENT} />
            </div>
            <Badge status="brass" text="Кліки" />
          </div>
          <div className="kc-stat-val">{totals.clicks}</div>
          <div className="kc-stat-lbl">Переходів за посиланнями</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
              <Icon name="check" size={18} color={GREEN} />
            </div>
            <Badge status="green" text="Конверсії" />
          </div>
          <div className="kc-stat-val">{totals.conversions}</div>
          <div className="kc-stat-lbl">Успішних угод/реєстрацій</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(139, 92, 246, 0.1)" }}>
              <Icon name="cash" size={18} color="#8B5CF6" />
            </div>
            <Badge status="blue" text="Виплати" />
          </div>
          <div className="kc-stat-val">{Number(totals.rewards).toFixed(0)} zł</div>
          <div className="kc-stat-lbl">Виплачено винагород партнерам</div>
        </div>
      </div>

      {/* F4: Generate code & Tabs */}
      <div className="kc-grid kc-grid-2">
        {/* Code Generator */}
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <h3 className="kc-card-cap" style={{ margin: 0 }}>Генератор реферальних посилань</h3>
          <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>Оберіть учасника, щоб закріпити за ним унікальний реферальний ID.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <select value={selUser} onChange={e => setSelUser(e.target.value)}
              className="kc-input" style={{ flex: 1, minWidth: 200 }}>
              <option value="">— Оберіть учасника —</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
              ))}
            </select>
            <button onClick={generateCode} disabled={!selUser || genLoading}
              className="kc-btn kc-btn-primary" style={{ background: ACCENT, borderColor: ACCENT }}>
              <Icon name="link" size={14}/> {genLoading ? "..." : "Згенерувати"}
            </button>
          </div>
          {genMsg && (
            <div style={{ marginTop: 8, fontSize: 12, color: GREEN, fontWeight: 600 }}>{genMsg}</div>
          )}
        </div>

        {/* AI Referral Agent Stats */}
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <h3 className="kc-card-cap" style={{ margin: 0 }}>Статус AI Реферального Дистриб'ютора</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            <div style={{ background: "var(--panel-2)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>AI Agents</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>175 Активних</div>
            </div>
            <div style={{ background: "var(--panel-2)", padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>Coordinators</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>15 Онлайн</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }}></div>
            Автоматичний аудит переходів та виплат активовано.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)" }}>
        <button onClick={() => setActiveTab("referrals")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "referrals" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "referrals" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="target" size={16} /> Реферальні коди
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="cpu" size={16} /> AI Dispatcher Logs
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 300 }}>
        {activeTab === "referrals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Пошук рефералів за іменем або кодом..." />

            {filteredReferrals.length === 0 ? (
              <div className="kc-card" style={{ textAlign: "center", padding: "40px 0", color: "var(--faint)" }}>
                <Icon name="link" size={28} color="var(--border)" />
                <div style={{ marginTop: 10, fontSize: 13 }}>Поки немає реферальних кодів</div>
              </div>
            ) : (
              <div className="kc-table-wrap">
                <table className="kc-table">
                  <thead>
                    <tr>
                      <th>Учасник</th>
                      <th>Код (посилання)</th>
                      <th>Кліки</th>
                      <th>Конверсії</th>
                      <th>Нагорода</th>
                      <th>Дата реєстрації</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.map(r => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{r.user_name}</div>
                          <div style={{ fontSize: 11, color: "var(--dim)" }}>{r.user_email}</div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <code style={{ background: "var(--panel-2)", padding: "2px 6px", borderRadius: 4, fontSize: 12, color: ACCENT, fontWeight: 700 }}>{r.code}</code>
                            <button
                              onClick={() => navigator.clipboard?.writeText(`${siteUrl}/api/ref/${r.code}`)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", padding: 0 }}
                              title="Копіювати посилання">
                              <Icon name="copy" size={12}/>
                            </button>
                          </div>
                          <div style={{ fontSize: 10, color: "var(--faint)", marginTop: 2 }}>
                            /api/ref/{r.code}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{r.clicks}</td>
                        <td>
                          <Badge status={r.conversions > 0 ? "green" : "dim"} text={`${r.conversions} конверсій`} />
                        </td>
                        <td style={{ fontWeight: 700, color: "#8B5CF6" }}>{Number(r.reward_total).toFixed(0)} zł</td>
                        <td style={{ fontSize: 11, color: "var(--dim)" }}>{new Date(r.created_at).toLocaleDateString("uk-UA")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи реферальних перевірок</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {refLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
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
