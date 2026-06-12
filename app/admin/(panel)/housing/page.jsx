"use client";
/* KompasCRM — Relocation Housing & Property Management */
import React, { useState, useEffect } from "react";
import { Icon, Badge, Avatar, ProgressBar, SearchInput } from "@/components/admin/ui";

export default function HousingPage() {
  const [activeTab, setActiveTab] = useState("properties");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock Properties Data
  const [properties, setProperties] = useState([]);

  // Rent Transactions History
  const [transactions, setTransactions] = useState([]);

  // AI Placement Engine Live Agent Logs (175 agents, 15 coordinators, 1 president)
  const [placementLogs, setPlacementLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-043 confirmed deposit payment cleared for lead Ivan Karpenko." },
      { type: "agent", text: "Agent-079 flagged expired contract for tenant in Wolska 45." },
      { type: "coordinator", text: "Coordinator [Agent-C03] updated monthly occupancy threshold metrics for Warsaw." },
      { type: "system", text: "President signed rental cooperation agreement #H-12 with Warsaw property owner." },
      { type: "agent", text: "Agent-128 dispatched automated SMS reminder to tenant Serhiy Chumak for overdue rent." },
      { type: "agent", text: "Agent-095 booked apartment ul. Zlota 9 for incoming executive client." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setPlacementLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateBooking = (e) => {
    e.preventDefault();
    alert("AI Диспетчер успішно створив резервацію ліжка та надіслав договір клієнту на e-Signature.");
    setShowBookingModal(false);
  };

  const filteredProperties = properties.filter(p =>
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Житло & Хостели (Accommodations)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Контроль заселення релокованих працівників, облік ліжко-місць, орендні платежі.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary" onClick={() => setShowBookingModal(true)}>
            <Icon name="plus" size={16} /> Забронювати ліжко
          </button>
          <button className="kc-btn kc-btn-primary">
            <Icon name="plus" size={16} /> Додати об&apos;єкт
          </button>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="kc-grid kc-grid-4">
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="home" size={18} color="var(--color-primary)" />
            </div>
            <Badge status="green" text="Active" />
          </div>
          <div className="kc-stat-val">{properties.length}</div>
          <div className="kc-stat-lbl">Об&apos;єктів під опікою</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="users" size={18} color="var(--color-success)" />
            </div>
            <span>89.2%</span>
          </div>
          <div className="kc-stat-val">61 / 111</div>
          <div className="kc-stat-lbl">Зайнято ліжко-місць</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,155,213,0.1)" }}>
              <Icon name="card" size={18} color="var(--color-info)" />
            </div>
            <Badge status="blue" text="June" />
          </div>
          <div className="kc-stat-val">18,400 PLN</div>
          <div className="kc-stat-lbl">Орендна збірка</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(217,108,108,0.1)" }}>
              <Icon name="alert" size={18} color="var(--color-danger)" />
            </div>
            <span style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)" }}>Overdue</span>
          </div>
          <div className="kc-stat-val" style={{ color: "var(--color-danger)" }}>1 Tenant</div>
          <div className="kc-stat-lbl">Боржники з оренди</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        <button 
          onClick={() => setActiveTab("properties")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "properties" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "properties" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="home" size={16} /> Житлові Об&apos;єкти
        </button>
        <button 
          onClick={() => setActiveTab("payments")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "payments" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "payments" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="card" size={16} /> Транзакції оренди
        </button>
        <button 
          onClick={() => setActiveTab("ai_allocator")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "ai_allocator" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "ai_allocator" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="cpu" size={16} /> AI Розселення (175+ Agents)
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === "properties" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Пошук житла за адресою, типом чи ID об'єкта..." 
            />

            <div className="kc-table-wrap">
              <table className="kc-table">
                <thead>
                  <tr>
                    <th>ID Об&apos;єкта</th>
                    <th>Адреса</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>Заселено</th>
                    <th>Ціна</th>
                    <th style={{ textAlign: "right" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>{row.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name="map-pin" size={14} color="var(--dim)" />
                          <span style={{ fontWeight: 500 }}>{row.address}</span>
                        </div>
                      </td>
                      <td><Badge status="info" text={row.type} /></td>
                      <td>
                        {row.status === "full" && <Badge status="red" text="Зайнято" />}
                        {row.status === "near_capacity" && <Badge status="brass" text="Мало місць" />}
                        {row.status === "available" && <Badge status="green" text="Вільні місця" />}
                        {row.status === "vacant" && <Badge status="dim" text="Порожній" />}
                      </td>
                      <td>
                        <button 
                          className="kc-btn kc-btn-ghost" 
                          style={{ padding: "2px 8px", minHeight: "auto", fontSize: "var(--text-xs)", display: "inline-flex", alignItems: "center", gap: 4 }}
                          onClick={() => setSelectedProperty(row)}
                        >
                          <Icon name="users" size={12} color="var(--color-primary)" />
                          <strong>{row.occupied} / {row.capacity} осіб</strong>
                        </button>
                      </td>
                      <td><strong style={{ color: "var(--color-success)" }}>{row.rent}</strong></td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button 
                            className="kc-btn kc-btn-ghost" 
                            style={{ padding: 6, minHeight: "auto" }}
                            title="Переглянути мешканців"
                            onClick={() => setSelectedProperty(row)}
                          >
                            <Icon name="users" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>Історія Орендних Нарахувань & Оплат</h3>
            
            <div className="kc-table-wrap">
              <table className="kc-table">
                <thead>
                  <tr>
                    <th>Транзакція ID</th>
                    <th>Мешканець</th>
                    <th>Об&apos;єкт</th>
                    <th>Сума</th>
                    <th>Дата платежу</th>
                    <th>Спосіб</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{tx.id}</td>
                      <td>{tx.tenant}</td>
                      <td>{tx.property}</td>
                      <td><strong style={{ color: "var(--color-primary)" }}>{tx.amount}</strong></td>
                      <td>{tx.date}</td>
                      <td>{tx.method}</td>
                      <td>
                        {tx.status === "cleared" ? (
                          <Badge status="green" text="Зараховано" />
                        ) : (
                          <Badge status="red" text="Помилка" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ai_allocator" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "var(--space-lg)" }}>
            {/* AI Allocator Cockpit */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Housing Allocator</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Matching Agents</span>
                  <strong style={{ color: "var(--color-primary)" }}>175</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Regional Allocators</span>
                  <strong style={{ color: "var(--color-info)" }}>15</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Executive Approver</span>
                  <strong style={{ color: "var(--color-success)" }}>1 President</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: 4 }}>
                  <span>Status</span>
                  <Badge status="green" text="Fully Automatic" />
                </div>
              </div>

              <div className="kc-note" style={{ fontSize: "var(--text-xs)" }}>
                <strong>Опис роботи:</strong> AI-мережа аналізує місце роботи релокованого мігранта і автоматично підбирає найближчий гуртожиток з вільними ліжками для оптимізації щоденного доїзду.
              </div>
            </div>

            {/* AI Log Console */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "#06090e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи розселення (AI Operations logs)</h3>
                <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>Auto-updating logs...</span>
              </div>

              <div style={{ 
                flex: 1, maxHeight: 280, overflowY: "auto", fontFamily: "var(--font-mono)", 
                fontSize: "var(--text-xs)", lineHeight: "1.6", color: "#c9d1d9",
                display: "flex", flexDirection: "column", gap: 8
              }}>
                {placementLogs.map((log, index) => {
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

      {/* Property Occupants Detail Modal */}
      {selectedProperty && (
        <div className="kc-modal-bg" onClick={() => setSelectedProperty(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <div>
                <h3 className="kc-modal-title" style={{ margin: 0 }}>Мешканці Об&apos;єкта</h3>
                <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: "4px 0 0" }}>{selectedProperty.address} · {selectedProperty.rent}</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {selectedProperty.tenants.length > 0 ? (
                <div className="kc-table-wrap" style={{ maxHeight: 250, overflowY: "auto" }}>
                  <table className="kc-table" style={{ fontSize: "var(--text-xs)" }}>
                    <thead>
                      <tr>
                        <th>Прізвище Ім&apos;я</th>
                        <th>Кімната</th>
                        <th>Оплата</th>
                        <th>Заселено</th>
                        <th>Кінець договору</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProperty.tenants.map((t, idx) => (
                        <tr key={idx} style={{ cursor: "default" }}>
                          <td style={{ fontWeight: 600 }}>{t.name}</td>
                          <td>{t.room}</td>
                          <td>
                            {t.rentStatus === "paid" ? (
                              <Badge status="green" text="Сплачено" />
                            ) : (
                              <Badge status="red" text="Борг" />
                            )}
                          </td>
                          <td>{t.checkedIn}</td>
                          <td>{t.contractEnds}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--dim)" }}>
                  <Icon name="home" size={36} style={{ opacity: 0.3 }} />
                  <p style={{ margin: "8px 0 0" }}>На цьому об&apos;єкті немає активних мешканців.</p>
                </div>
              )}
              
              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button className="kc-btn" onClick={() => setSelectedProperty(null)}>Закрити</button>
                <button className="kc-btn kc-btn-primary" onClick={() => {
                  setSelectedProperty(null);
                  setActiveTab("ai_allocator");
                }}>
                  <Icon name="cpu" size={14} /> AI Перерозподіл місць
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bed Booking Simulation Modal */}
      {showBookingModal && (
        <div className="kc-modal-bg" onClick={() => setShowBookingModal(false)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Забронювати ліжко-місце</h3>
              <button onClick={() => setShowBookingModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <label className="kc-label">Виберіть мігранта / клієнта</label>
                <select className="kc-select" required>
                  <option value="">-- Оберіть особу --</option>
                  <option value="1">Ivan Karpenko (Новий лід)</option>
                  <option value="2">Tetiana Hryn (Документи готові)</option>
                  <option value="3">Vasyl Stus (В процесі релокації)</option>
                </select>
              </div>

              <div>
                <label className="kc-label">Виберіть об&apos;єкт розселення</label>
                <select className="kc-select" required>
                  <option value="">-- Оберіть хостел/квартиру --</option>
                  {properties.filter(p => p.occupied < p.capacity).map(p => (
                    <option key={p.id} value={p.id}>{p.address} (Вільні ліжка: {p.capacity - p.occupied})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div>
                  <label className="kc-label">Дата заселення</label>
                  <input type="date" className="kc-input" required />
                </div>
                <div>
                  <label className="kc-label">Дата виїзду (договір)</label>
                  <input type="date" className="kc-input" required />
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button type="button" className="kc-btn" onClick={() => setShowBookingModal(false)}>Скасувати</button>
                <button type="submit" className="kc-btn kc-btn-primary">Забронювати місць</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
