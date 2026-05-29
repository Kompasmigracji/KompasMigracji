/* Innovation 4: Client Portal — case status view
   F10: Shows case status for client by PIN
   F12: Reads access log from portal session */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const GREEN  = "#10B981";
const BLUE   = "#3B82F6";
const ORANGE = "#F59E0B";
const RED    = "#EF4444";

const STATUS_MAP = {
  new:         { label:"Заявку отримано",        color: BLUE,   icon:"📋" },
  in_progress: { label:"В роботі",               color: ORANGE, icon:"⚙️" },
  closed:      { label:"Завершено",               color: GREEN,  icon:"✅" },
  converted:   { label:"Завершено успішно",       color: GREEN,  icon:"🎉" },
  active:      { label:"В роботі",               color: ORANGE, icon:"⚙️" },
};

const URGENCY_MAP = {
  low:    { label:"Звичайна",  color:"#6B7280" },
  medium: { label:"Середня",   color: ORANGE },
  high:   { label:"Висока",    color: RED },
  urgent: { label:"Термінова", color: RED },
};

function Step({ n, label, done }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
      <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
        background: done ? GREEN : "#E5E7EB",
        color: done ? "#fff" : "#9CA3AF",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:12, fontWeight:700 }}>
        {done ? "✓" : n}
      </div>
      <div style={{ flex:1, paddingTop:4, fontSize:13, color: done ? "#111" : "#9CA3AF",
        fontWeight: done ? 600 : 400 }}>
        {label}
      </div>
    </div>
  );
}

export default function PortalCasePage() {
  const { pin } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pin) return;
    fetch("/api/portal/auth", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ pin }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Мережева помилка"));
  }, [pin]);

  if (error) {
    return (
      <main style={{ minHeight:"100vh", background:"#F0F2F5", display:"flex", alignItems:"center",
        justifyContent:"center", padding:"20px 16px", fontFamily:"'Segoe UI',Arial,sans-serif" }}>
        <div style={{ textAlign:"center", maxWidth:360 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>❌</div>
          <div style={{ fontWeight:700, fontSize:16, color:"#111", marginBottom:8 }}>PIN не знайдено</div>
          <div style={{ fontSize:13, color:"#6B7280", marginBottom:20 }}>{error}</div>
          <Link href="/portal" style={{ display:"inline-block", padding:"10px 20px", borderRadius:8,
            background:"#D8232A", color:"#fff", fontWeight:700, textDecoration:"none" }}>
            ← Спробувати знову
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ minHeight:"100vh", background:"#F0F2F5", display:"flex", alignItems:"center",
        justifyContent:"center", fontFamily:"'Segoe UI',Arial,sans-serif" }}>
        <div style={{ fontSize:13, color:"#6B7280" }}>Завантаження...</div>
      </main>
    );
  }

  const status = STATUS_MAP[data.status] || STATUS_MAP.new;
  const urgency = data.urgency ? URGENCY_MAP[data.urgency] : null;
  const isDone = data.status === "closed" || data.status === "converted";

  const steps = [
    { label:"Заявку отримано",            done: true },
    { label:"Розгляд менеджером",          done: data.status !== "new" },
    { label:"Документи перевірено",        done: isDone },
    { label:"Справу завершено",            done: isDone },
  ];

  return (
    <main style={{ minHeight:"100vh", background:"#F0F2F5", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"20px 16px", fontFamily:"'Segoe UI',Arial,sans-serif" }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:24, marginBottom:4 }}>🧭</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#111" }}>Kompas Migracji</div>
        </div>

        <div style={{ background:"#fff", borderRadius:14, boxShadow:"0 4px 24px rgba(0,0,0,0.1)",
          overflow:"hidden" }}>

          {/* Status header */}
          <div style={{ background: status.color+"18", borderBottom:`3px solid ${status.color}`,
            padding:"20px 24px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{status.icon}</div>
            <div style={{ fontWeight:800, fontSize:18, color: status.color }}>{status.label}</div>
            {data.clientName && (
              <div style={{ fontSize:13, color:"#6B7280", marginTop:4 }}>
                Клієнт: <strong>{data.clientName}</strong>
              </div>
            )}
          </div>

          <div style={{ padding:"20px 24px" }}>
            {/* PIN */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              marginBottom:16, padding:"8px 12px", background:"#F9FAFB",
              borderRadius:8, border:"1px solid #E5E7EB" }}>
              <span style={{ fontSize:11, color:"#9CA3AF", fontWeight:600, textTransform:"uppercase" }}>PIN</span>
              <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:14, color:"#111",
                letterSpacing:"0.1em" }}>{pin}</span>
            </div>

            {/* Details */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {data.service && (
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"#6B7280" }}>Послуга</span>
                  <span style={{ fontSize:12, fontWeight:600, color:"#111" }}>{data.service}</span>
                </div>
              )}
              {urgency && (
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"#6B7280" }}>Пріоритет</span>
                  <span style={{ fontSize:12, fontWeight:600, color: urgency.color }}>{urgency.label}</span>
                </div>
              )}
              {data.createdAt && (
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"#6B7280" }}>Дата заявки</span>
                  <span style={{ fontSize:12, color:"#111" }}>
                    {new Date(data.createdAt).toLocaleDateString("uk-UA")}
                  </span>
                </div>
              )}
            </div>

            {/* Steps */}
            <div style={{ borderTop:"1px solid #E5E7EB", paddingTop:16, marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase",
                letterSpacing:"0.05em", marginBottom:12 }}>Прогрес справи</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {steps.map((s, i) => <Step key={i} n={i+1} label={s.label} done={s.done}/>)}
              </div>
            </div>

            {/* Notes */}
            {data.notes && (
              <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8,
                padding:"10px 12px", marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#92400E", marginBottom:4 }}>
                  Повідомлення від менеджера
                </div>
                <div style={{ fontSize:13, color:"#78350F", lineHeight:1.5 }}>{data.notes}</div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <a href="https://wa.me/48729271848" target="_blank" rel="noreferrer"
                style={{ display:"block", textAlign:"center", padding:"11px 0", borderRadius:8,
                  background:"rgba(37,211,102,0.1)", border:"1.5px solid rgba(37,211,102,0.3)",
                  color:"#16a34a", fontWeight:700, fontSize:13, textDecoration:"none" }}>
                💬 Написати менеджеру в WhatsApp
              </a>
              <Link href="/portal"
                style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:8,
                  border:"1.5px solid #E5E7EB", color:"#6B7280", fontWeight:600, fontSize:13,
                  textDecoration:"none" }}>
                ← Ввести інший PIN
              </Link>
            </div>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:"#9CA3AF" }}>
          🔒 Захищений доступ · оновлено {new Date(data.accessedAt || new Date()).toLocaleString("uk-UA")}
        </div>
      </div>
    </main>
  );
}
