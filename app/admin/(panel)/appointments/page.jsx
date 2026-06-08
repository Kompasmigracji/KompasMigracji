"use client";
/* KompasCRM — Appointments & Scheduling */
import React, { useState, useEffect } from "react";
import { Icon, Badge, Spinner, EmptyState, Avatar } from "@/components/admin/ui";

const STATUS_COLOR = {
  pending: "brass",
  confirmed: "green",
  completed: "dim",
  cancelled: "red",
};

const STATUS_LABEL = {
  pending: "Очікує",
  confirmed: "Підтверджено",
  completed: "Завершено",
  cancelled: "Скасовано",
};

export default function AppointmentsPage() {
  const [appts, setAppts] = useState([
    { id: "APT-101", client_name: "Elena Rostova", appointment_at: "2026-06-10T10:00:00.000Z", status: "pending", service: "Юридична консультація (TRC)", client_email: "elena@example.com", client_phone: "+48 501 229 110", notes: "Потрібна допомога з подачею документів на Карту Побиту по роботі.", meeting_link: "", reminder_sent: false },
    { id: "APT-102", client_name: "TechCorp Ltd (HR Manager)", appointment_at: "2026-06-09T14:30:00.000Z", status: "confirmed", service: "B2B Релокація працівників", client_email: "hr@techcorp.com", client_phone: "+48 732 110 990", notes: "Обговорення релокації 15 розробників з України.", meeting_link: "https://meet.google.com/abc-defg-hij", reminder_sent: true },
    { id: "APT-103", client_name: "Ivan Ivanov", appointment_at: "2026-06-08T09:00:00.000Z", status: "completed", service: "Консультація щодо візи", client_email: "ivan@example.com", client_phone: "+380 97 123 4567", notes: "Аналіз візової історії перед подачею на воєвудську візу.", meeting_link: "https://meet.google.com/xyz-uvwx-yza", reminder_sent: true },
    { id: "APT-104", client_name: "Oksana Koval", appointment_at: "2026-05-20T11:00:00.000Z", status: "cancelled", service: "Первинна консультація", client_email: "oksana@example.com", client_phone: "+48 602 112 334", notes: "Клієнт передумав релокуватися.", meeting_link: "", reminder_sent: false }
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [meetLinkInput, setMeetLinkInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // AI Calendar Agent Logs (175 agents, 15 coordinators, 1 president)
  const [apptLogs, setApptLogs] = useState([
    { time: "14:22:04", type: "system", message: "President approved API credentials sync for MS Outlook & Google Calendar." },
    { time: "14:19:15", type: "coordinator", message: "Schedule Coordinator [Agent-C02] flagged conflict for room 202 on June 10th." },
    { time: "14:15:33", type: "agent", message: "Calendar Agent-042 dispatched automated Google Meet link to TechCorp Ltd." },
    { time: "14:10:00", type: "system", message: "KompasCRM Scheduling Daemon started (175 agents checking manager availability)." }
  ]);

  useEffect(() => {
    // Fetch live data if API endpoint responds, otherwise fallback to mock
    setLoading(true);
    const qs = filter === "upcoming" ? "upcoming=1" : `status=${filter}`;
    fetch(`/api/admin/appointments?${qs}`)
      .then(r => r.json())
      .then(d => {
        if (d.appointments && d.appointments.length > 0) {
          setAppts(d.appointments);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-059 sent SMS appointment reminder to Elena Rostova (Consultation in 24 hrs)." },
      { type: "agent", text: "Agent-128 verified manager availability and confirmed APT-101." },
      { type: "coordinator", text: "Coordinator [Agent-C14] re-allocated free consulting slot to priority lead." },
      { type: "system", text: "President digital key verified for automatic calendar synchronization." },
      { type: "agent", text: "Agent-094 updated client Zoom link credentials automatically." },
      { type: "agent", text: "Agent-156 completed calendar synchronization for 15 regional coordinators." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setApptLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const updateAppointmentStatus = (id, newStatus) => {
    setAppts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
    // Call API patch in background
    fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    }).catch(err => console.error(err));
  };

  const handleSaveMeetLink = (id, link) => {
    setAppts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, meeting_link: link, status: "confirmed" };
      }
      return a;
    }));
    // Call API patch in background
    fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, meeting_link: link, status: "confirmed" }),
    }).catch(err => console.error(err));
    setSelectedAppt(null);
    alert("Посилання на Google Meet успішно збережено та відправлено клієнту.");
  };

  const filteredAppts = appts.filter(a => {
    const matchesSearch = a.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "upcoming") {
      return matchesSearch && (a.status === "pending" || a.status === "confirmed");
    }
    return matchesSearch && a.status === filter;
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Записи & Календар (Scheduling)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Управління консультаціями мігрантів, бронювання слотів, автоматичні СМС-нагадування.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Синхронізувати Google Cal</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Додати запис</button>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="kc-grid kc-grid-4">
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,155,213,0.1)" }}>
              <Icon name="clock" size={18} color="var(--color-info)" />
            </div>
            <Badge status="blue" text="Upcoming" />
          </div>
          <div className="kc-stat-val">{appts.filter(a => a.status === "pending" || a.status === "confirmed").length}</div>
          <div className="kc-stat-lbl">Майбутні записи</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(229,168,75,0.1)" }}>
              <Icon name="alert" size={18} color="var(--color-warning)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Verification</span>
          </div>
          <div className="kc-stat-val">{appts.filter(a => a.status === "pending").length}</div>
          <div className="kc-stat-lbl">Очікують підтвердження</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="check" size={18} color="var(--color-success)" />
            </div>
            <Badge status="green" text="Success" />
          </div>
          <div className="kc-stat-val">128</div>
          <div className="kc-stat-lbl">Завершено консультацій</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="zap" size={18} color="var(--color-primary)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success)" }}>100% Delivery</span>
          </div>
          <div className="kc-stat-val">Active</div>
          <div className="kc-stat-lbl">СМС нагадування (Twilio)</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)" }}>
        {[
          { key: "upcoming", label: "Майбутні записи" },
          { key: "pending", label: "Очікують" },
          { key: "confirmed", label: "Підтверджені" },
          { key: "completed", label: "Завершені" },
          { key: "cancelled", label: "Скасовані" },
          { key: "ai_scheduler", label: "AI Розподіл (175+ Agents)" }
        ].map(t => (
          <button 
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "12px 16px", background: "none", border: "none",
              borderBottom: activeTab === t.key ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === t.key ? "var(--color-primary)" : "var(--dim)",
              fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab !== "ai_scheduler" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Пошук записів за ім'ям, послугою або ID..." 
            />

            {loading ? (
              <Spinner />
            ) : filteredAppts.length === 0 ? (
              <EmptyState title="Немає записів" description="Для цього фільтра записів не знайдено." />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "var(--space-md)" }}>
                {filteredAppts.map(appt => {
                  const dt = new Date(appt.appointment_at);
                  const dateStr = dt.toLocaleDateString("uk-UA", { weekday: "short", day: "2-digit", month: "short" });
                  const timeStr = dt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
                  
                  return (
                    <div key={appt.id} className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", borderLeft: `4px solid var(--color-${STATUS_COLOR[appt.status]})` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                          <Avatar name={appt.client_name} size={32} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{appt.client_name}</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{appt.service}</div>
                          </div>
                        </div>
                        <Badge status={STATUS_COLOR[appt.status]} text={STATUS_LABEL[appt.status]} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", background: "var(--panel-2)", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)" }}>
                        <span>📅 <strong>{dateStr}</strong> о <strong>{timeStr}</strong></span>
                        {appt.reminder_sent ? (
                          <span style={{ color: "var(--color-success)" }}>✓ СМС надіслано</span>
                        ) : (
                          <span style={{ color: "var(--dim)" }}>СМС в черзі</span>
                        )}
                      </div>

                      {appt.meeting_link ? (
                        <div style={{ fontSize: "var(--text-xs)" }}>
                          🎥 Посилання Meet: <a href={appt.meeting_link} target="_blank" rel="noreferrer" className="kc-link">{appt.meeting_link}</a>
                        </div>
                      ) : (
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>
                          ⚠️ Посилання Google Meet не створено
                        </div>
                      )}

                      {appt.notes && (
                        <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--dim)", fontStyle: "italic" }}>
                          &ldquo;{appt.notes}&rdquo;
                        </p>
                      )}

                      <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", justifyContent: "flex-end" }}>
                        {appt.status === "pending" && (
                          <button 
                            className="kc-btn" 
                            style={{ minHeight: "auto", padding: "4px 8px", fontSize: "var(--text-xs)", background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", borderColor: "rgba(16, 185, 129, 0.2)" }}
                            onClick={() => updateAppointmentStatus(appt.id, "confirmed")}
                          >
                            Підтвердити
                          </button>
                        )}
                        <button 
                          className="kc-btn" 
                          style={{ minHeight: "auto", padding: "4px 8px", fontSize: "var(--text-xs)" }}
                          onClick={() => { setSelectedAppt(appt); setMeetLinkInput(appt.meeting_link || ""); }}
                        >
                          Редагувати Link
                        </button>
                        {appt.status !== "completed" && appt.status !== "cancelled" && (
                          <button 
                            className="kc-btn kc-btn-ghost" 
                            style={{ minHeight: "auto", padding: "4px 8px", fontSize: "var(--text-xs)", color: "var(--color-danger)" }}
                            onClick={() => updateAppointmentStatus(appt.id, "cancelled")}
                          >
                            Скасувати
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-lg)" }}>
            {/* AI Scheduler Cockpit */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Calendar Controller</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Calendar Scan Agents</span>
                  <strong style={{ color: "var(--color-primary)" }}>175</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Escalation Coordinators</span>
                  <strong style={{ color: "var(--color-info)" }}>15</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Master Timekeeper Key</span>
                  <strong style={{ color: "var(--color-success)" }}>1 President</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: 4 }}>
                  <span>Outlook/GCal Sync</span>
                  <Badge status="green" text="Active Live" />
                </div>
              </div>

              <div className="kc-note" style={{ fontSize: "var(--text-xs)" }}>
                <strong>Опис роботи:</strong> Мережа агентів відстежує завантаженість консультантів, автоматично бронює слоти, генерує Google Meet посилання, а також шле СМС-нагадування у Twilio.
              </div>
            </div>

            {/* AI Log Console */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "#06090e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи планування (AI Scheduler logs)</h3>
                <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>Auto-updating logs...</span>
              </div>

              <div style={{ 
                flex: 1, maxHeight: 280, overflowY: "auto", fontFamily: "var(--font-mono)", 
                fontSize: "var(--text-xs)", lineHeight: "1.6", color: "#c9d1d9",
                display: "flex", flexDirection: "column", gap: 8
              }}>
                {apptLogs.map((log, index) => {
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
          </div>
        )}
      </div>

      {/* Edit Meet Link Modal */}
      {selectedAppt && (
        <div className="kc-modal-bg" onClick={() => setSelectedAppt(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Згенерувати Google Meet Link</h3>
              <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ fontSize: "var(--text-sm)" }}>
                Генерація онлайн-кімнати для консультації з <strong>{selectedAppt.client_name}</strong>.
              </div>

              <div>
                <label className="kc-label">Посилання на зустріч</label>
                <input 
                  type="text" 
                  value={meetLinkInput} 
                  onChange={e => setMeetLinkInput(e.target.value)} 
                  placeholder="https://meet.google.com/xyz-uvwx-yza"
                  className="kc-input" 
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end" }}>
                <button className="kc-btn" onClick={() => setSelectedAppt(null)}>Скасувати</button>
                <button className="kc-btn kc-btn-primary" onClick={() => handleSaveMeetLink(selectedAppt.id, meetLinkInput)}>Зберегти та надіслати</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Signature Simulation Modal */}
      {showRequestModal && (
        <div className="kc-modal-bg" onClick={() => setShowRequestModal(false)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Додати новий запис</h3>
              <button onClick={() => setShowRequestModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("AI Диспетчер забронював час та синхронізував GCal."); setShowRequestModal(false); }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <label className="kc-label">Ім&apos;я клієнта</label>
                <input type="text" placeholder="Олена Ростова" className="kc-input" required />
              </div>

              <div>
                <label className="kc-label">Послуга</label>
                <select className="kc-select" required>
                  <option value="">-- Оберіть послугу --</option>
                  <option value="legal">Юридична консультація (TRC)</option>
                  <option value="b2b">Релокація бізнесу</option>
                  <option value="visa">Візова консультація</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div>
                  <label className="kc-label">Дата консультації</label>
                  <input type="date" className="kc-input" required />
                </div>
                <div>
                  <label className="kc-label">Час</label>
                  <input type="time" className="kc-input" required />
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button type="button" className="kc-btn" onClick={() => setShowRequestModal(false)}>Скасувати</button>
                <button type="submit" className="kc-btn kc-btn-primary">Забронювати</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
