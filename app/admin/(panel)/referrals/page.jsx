"use client";
/* Innovation 2: Referral Program — F4 auto-code, F5 click tracking, F6 reward */
import React, { useEffect, useState } from "react";
import { Spinner, Icon } from "@/components/admin/ui";

const ACCENT = "#F59E0B";
const GREEN  = "#10B981";

function StatPill({ label, value, color }) {
  return (
    <div style={{ background:"var(--card)", borderRadius:10, padding:"12px 16px", border:"1px solid var(--border)" }}>
      <div style={{ fontSize:11, color:"var(--dim)", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:700, color: color || "var(--text)" }}>{value}</div>
    </div>
  );
}

export default function ReferralsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [selUser, setSelUser] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genMsg, setGenMsg] = useState("");

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

  // F4: Generate ref code for selected user
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

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontWeight:700, fontSize:15, color:"var(--text)" }}>Реферальна Програма</div>
        <div style={{ fontSize:12, color:"var(--dim)", marginTop:2 }}>Innovation 2 · F4 авто-код · F5 кліки · F6 нагороди</div>
      </div>

      {/* Totals */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <StatPill label="Кліків (всього)" value={totals.clicks} color={ACCENT}/>
        <StatPill label="Конверсій" value={totals.conversions} color={GREEN}/>
        <StatPill label="Нагород видано" value={`${Number(totals.rewards).toFixed(0)} zł`} color="#8B5CF6"/>
      </div>

      {/* F4: Generate code */}
      <div className="kc-card" style={{ padding:"14px 16px", marginBottom:20 }}>
        <div className="kc-card-cap" style={{ marginBottom:10 }}>F4: Видати реферальний код учаснику</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <select value={selUser} onChange={e => setSelUser(e.target.value)}
            style={{ flex:1, minWidth:200, padding:"7px 10px", borderRadius:7, border:"1px solid var(--border)",
              background:"var(--input)", color:"var(--text)", fontSize:13 }}>
            <option value="">— Оберіть учасника —</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
            ))}
          </select>
          <button onClick={generateCode} disabled={!selUser || genLoading}
            style={{ padding:"7px 16px", borderRadius:7, background:ACCENT, color:"#fff",
              fontWeight:600, fontSize:13, border:"none", cursor:"pointer", opacity: (!selUser || genLoading) ? 0.5 : 1 }}>
            <Icon name="link" size={13}/> {genLoading ? "..." : "Генерувати"}
          </button>
        </div>
        {genMsg && (
          <div style={{ marginTop:8, fontSize:12, color:GREEN }}>{genMsg}</div>
        )}
      </div>

      {/* Table */}
      {referrals.length === 0 ? (
        <div className="kc-card" style={{ textAlign:"center", padding:"40px 0", color:"var(--faint)" }}>
          <Icon name="link" size={28} color="var(--border)"/>
          <div style={{ marginTop:10, fontSize:13 }}>Поки немає реферальних кодів</div>
          <div style={{ fontSize:12, marginTop:4 }}>Видайте код учасникам, щоб відстежувати рефералів</div>
        </div>
      ) : (
        <div className="kc-card" style={{ overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Учасник","Код (посилання)","Кліки","Конверсії","Нагорода","Дата"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:600,
                    color:"var(--dim)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id} style={{ borderBottom:"1px solid var(--border)" }}>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ fontWeight:600, color:"var(--text)", fontSize:12 }}>{r.user_name}</div>
                    <div style={{ fontSize:11, color:"var(--dim)" }}>{r.user_email}</div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <code style={{ background:"var(--border)", padding:"2px 6px", borderRadius:4, fontSize:12,
                        color:ACCENT, fontWeight:700, fontFamily:"monospace" }}>{r.code}</code>
                      <button
                        onClick={() => navigator.clipboard?.writeText(`${siteUrl}/api/ref/${r.code}`)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"var(--dim)", padding:0 }}
                        title="Копіювати посилання">
                        <Icon name="copy" size={12}/>
                      </button>
                    </div>
                    <div style={{ fontSize:10, color:"var(--faint)", marginTop:2 }}>
                      /api/ref/{r.code}
                    </div>
                  </td>
                  <td style={{ padding:"10px 12px", fontWeight:700, color:"var(--text)" }}>{r.clicks}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ fontWeight:700, color: r.conversions > 0 ? GREEN : "var(--dim)" }}>
                      {r.conversions}
                    </span>
                  </td>
                  <td style={{ padding:"10px 12px", fontWeight:700, color:"#8B5CF6" }}>
                    {Number(r.reward_total).toFixed(0)} zł
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:11, color:"var(--dim)" }}>
                    {new Date(r.created_at).toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop:14, fontSize:11, color:"var(--faint)", textAlign:"center" }}>
        F5: кліки відстежуються через /api/ref/[CODE] · F6: нагороди нараховуються вручну або автоматично при конверсії
      </div>
    </div>
  );
}
