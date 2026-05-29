"use client";
/* Innovation 3: Broadcasts — F7 segmentation, F8 Telegram send, F9 stats */
import React, { useEffect, useState } from "react";
import { Spinner, Icon } from "@/components/admin/ui";

const SEGMENTS = [
  { value:"all",       label:"Всі ліди з Telegram",     color:"#3B82F6" },
  { value:"active",    label:"Активні (не закриті)",     color:"#10B981" },
  { value:"new_leads", label:"Нові (30 днів, новий)",    color:"#F59E0B" },
  { value:"members",   label:"Учасники профспілки",      color:"#8B5CF6" },
];

const STATUS_COLOR = { draft:"#6B7280", sending:"#F59E0B", sent:"#10B981", failed:"#EF4444" };
const STATUS_LABEL = { draft:"Чернетка", sending:"Відправляється", sent:"Відправлено", failed:"Помилка" };

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Compose form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(null); // broadcast id being sent
  const [msg, setMsg] = useState("");

  const load = () =>
    fetch("/api/admin/broadcasts")
      .then(r => r.json())
      .then(d => {
        setBroadcasts(Array.isArray(d.broadcasts) ? d.broadcasts : []);
        setLoading(false);
      })
      .catch(() => { setError("Помилка завантаження"); setLoading(false); });

  useEffect(() => { load(); }, []);

  // F7: Fetch segment preview count
  const fetchPreview = async (seg) => {
    setPreviewLoading(true);
    try {
      const r = await fetch(`/api/admin/broadcasts?preview=${seg}`);
      const d = await r.json();
      setPreview(d.count ?? 0);
    } catch { setPreview(null); }
    setPreviewLoading(false);
  };

  useEffect(() => { fetchPreview(segment); }, [segment]);

  const save = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true); setMsg("");
    try {
      const r = await fetch("/api/admin/broadcasts", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ title, body, segment }),
      });
      const d = await r.json();
      if (d.id) {
        setMsg("Чернетку збережено");
        setTitle(""); setBody("");
        load();
      } else { setMsg(d.error || "Помилка"); }
    } catch { setMsg("Мережева помилка"); }
    setSaving(false);
  };

  // F8: Send broadcast
  const sendBroadcast = async (id) => {
    if (!confirm("Підтвердіть надсилання розсилки")) return;
    setSending(id); setMsg("");
    try {
      const r = await fetch(`/api/admin/broadcasts/${id}/send`, { method:"POST" });
      const d = await r.json();
      if (d.ok) {
        setMsg(`Відправлено: ${d.sent} | Помилки: ${d.failed}`);
        load();
      } else { setMsg(d.error || "Помилка надсилання"); }
    } catch { setMsg("Мережева помилка"); }
    setSending(null);
  };

  if (error) return <div className="kc-error">{error}</div>;

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontWeight:700, fontSize:15, color:"var(--text)" }}>Масові Розсилки</div>
        <div style={{ fontSize:12, color:"var(--dim)", marginTop:2 }}>Innovation 3 · F7 сегментація · F8 Telegram · F9 статистика</div>
      </div>

      {/* Compose */}
      <div className="kc-card" style={{ padding:"16px 18px", marginBottom:20 }}>
        <div className="kc-card-cap" style={{ marginBottom:12 }}>Нова розсилка</div>

        <div style={{ marginBottom:10 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Назва розсилки (для внутр. використання)"
            style={{ width:"100%", padding:"8px 10px", borderRadius:7, border:"1px solid var(--border)",
              background:"var(--input)", color:"var(--text)", fontSize:13, boxSizing:"border-box" }}/>
        </div>

        <div style={{ marginBottom:10 }}>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
            placeholder={"Текст повідомлення...\n\nПідтримує HTML: <b>жирний</b>, <i>курсив</i>\nДоступна змінна: {{name}}"}
            style={{ width:"100%", padding:"8px 10px", borderRadius:7, border:"1px solid var(--border)",
              background:"var(--input)", color:"var(--text)", fontSize:13, resize:"vertical",
              fontFamily:"inherit", boxSizing:"border-box" }}/>
        </div>

        {/* F7: Segment selector */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:"var(--dim)", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>
            F7: Сегмент аудиторії
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {SEGMENTS.map(s => (
              <button key={s.value} onClick={() => setSegment(s.value)}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer",
                  border: segment===s.value ? `2px solid ${s.color}` : "2px solid var(--border)",
                  background: segment===s.value ? s.color+"18" : "transparent",
                  color: segment===s.value ? s.color : "var(--dim)",
                  transition:"all 0.15s" }}>
                {s.label}
              </button>
            ))}
          </div>
          {!previewLoading && preview !== null && (
            <div style={{ marginTop:8, fontSize:12, color:"var(--dim)" }}>
              Отримають: <strong>{preview}</strong> {preview === 1 ? "отримувач" : preview < 5 ? "отримувачі" : "отримувачів"}
            </div>
          )}
        </div>

        {msg && <div style={{ fontSize:12, color:"#10B981", marginBottom:8 }}>{msg}</div>}

        <button onClick={save} disabled={!title.trim() || !body.trim() || saving}
          style={{ padding:"8px 18px", borderRadius:7, background:"#3B82F6", color:"#fff",
            fontWeight:600, fontSize:13, border:"none", cursor:"pointer",
            opacity: (!title.trim() || !body.trim() || saving) ? 0.5 : 1 }}>
          {saving ? "Зберігаємо..." : "Зберегти чернетку"}
        </button>
      </div>

      {/* List */}
      {loading ? <Spinner /> : broadcasts.length === 0 ? (
        <div className="kc-card" style={{ textAlign:"center", padding:"40px 0", color:"var(--faint)" }}>
          <Icon name="send" size={28} color="var(--border)"/>
          <div style={{ marginTop:10, fontSize:13 }}>Немає розсилок</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {broadcasts.map(b => {
            const seg = SEGMENTS.find(s => s.value === b.segment) || SEGMENTS[0];
            const isSending = sending === b.id;
            return (
              <div key={b.id} className="kc-card" style={{ padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:600, fontSize:13, color:"var(--text)" }}>{b.title}</span>
                      <span style={{ padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:600,
                        background: STATUS_COLOR[b.status]+"18", color: STATUS_COLOR[b.status] }}>
                        {STATUS_LABEL[b.status] || b.status}
                      </span>
                      <span style={{ padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:600,
                        background: seg.color+"18", color: seg.color }}>
                        {seg.label}
                      </span>
                    </div>
                    <div style={{ fontSize:12, color:"var(--dim)", marginTop:4, lineHeight:1.5, maxWidth:500 }}>
                      {b.body.slice(0, 120)}{b.body.length > 120 ? "..." : ""}
                    </div>
                    {/* F9: Stats */}
                    {b.status === "sent" && (
                      <div style={{ display:"flex", gap:16, marginTop:6 }}>
                        <span style={{ fontSize:11, color:"#10B981" }}>✓ {b.sent_count} доставлено</span>
                        {b.failed_count > 0 && <span style={{ fontSize:11, color:"#EF4444" }}>✗ {b.failed_count} помилок</span>}
                        {b.sent_at && <span style={{ fontSize:11, color:"var(--faint)" }}>{new Date(b.sent_at).toLocaleString("uk-UA")}</span>}
                      </div>
                    )}
                  </div>
                  {b.status === "draft" && (
                    <button onClick={() => sendBroadcast(b.id)} disabled={isSending}
                      style={{ padding:"6px 14px", borderRadius:7, background:"#10B981", color:"#fff",
                        fontWeight:600, fontSize:12, border:"none", cursor:"pointer", flexShrink:0,
                        opacity: isSending ? 0.6 : 1 }}>
                      <Icon name="send" size={12}/>
                      {isSending ? "Надсилаємо..." : "F8: Надіслати"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
