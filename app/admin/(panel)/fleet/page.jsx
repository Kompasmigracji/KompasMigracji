"use client";
/* KompasCRM — Fleet Management & Logistics */
import React, { useState, useEffect } from "react";
import { Icon, Badge, Avatar, ProgressBar, SearchInput } from "@/components/admin/ui";

export default function FleetPage() {
  const [activeTab, setActiveTab] = useState("trips");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  // Mock Passengers Data for Manifests
  const [trips, setTrips] = useState([
    {
      id: "TRP-2026-42",
      route: "Kyiv ➔ Warsaw",
      driver: "Oleh Melnyk",
      vehicle: "Mercedes Sprinter (KA 1234)",
      status: "en_route",
      border: "Krakivets",
      passengers: [
        { name: "Ivan Petrenko", passport: "AA123456", visaStatus: "valid", destination: "Warsaw", status: "boarded" },
        { name: "Maria Kovalenko", passport: "AB987654", visaStatus: "valid", destination: "Warsaw", status: "boarded" },
        { name: "Oleksandr Shevchenko", passport: "AC556677", visaStatus: "visa_free", destination: "Lublin", status: "boarded" },
        { name: "Olga Boyko", passport: "AD889900", visaStatus: "valid", destination: "Warsaw", status: "boarded" },
        { name: "Dmytro Hrytsenko", passport: "AE112233", visaStatus: "valid", destination: "Warsaw", status: "boarded" }
      ],
      gps: { lat: "50.4501", lng: "30.5234", speed: "85 km/h", eta: "4h 20m" }
    },
    {
      id: "TRP-2026-43",
      route: "Lviv ➔ Krakow",
      driver: "Andriy Boyko",
      vehicle: "VW Crafter (BC 4321)",
      status: "at_border",
      border: "Shehyni",
      passengers: [
        { name: "Yulia Bondar", passport: "BA887766", visaStatus: "residence_card", destination: "Krakow", status: "checking" },
        { name: "Artem Morozov", passport: "BB554433", visaStatus: "valid", destination: "Krakow", status: "checking" },
        { name: "Natalia Kravets", passport: "BC221100", visaStatus: "visa_free", destination: "Katowice", status: "checking" }
      ],
      gps: { lat: "49.8419", lng: "24.0315", speed: "0 km/h (Queue)", eta: "1h 15m (border delay)" }
    },
    {
      id: "TRP-2026-44",
      route: "Warsaw ➔ Kyiv",
      driver: "Serhiy Tkach",
      vehicle: "Mercedes Sprinter (KA 5566)",
      status: "completed",
      border: "Dorohusk",
      passengers: [
        { name: "Viktor Melnyk", passport: "CA111222", visaStatus: "valid", destination: "Kyiv", status: "arrived" },
        { name: "Tetiana Polishchuk", passport: "CB333444", visaStatus: "valid", destination: "Kyiv", status: "arrived" }
      ],
      gps: { lat: "50.4501", lng: "30.5234", speed: "0 km/h", eta: "Completed" }
    },
    {
      id: "TRP-2026-45",
      route: "Odesa ➔ Poznan",
      driver: "Vasyl Lymar",
      vehicle: "Renault Master (BH 9901)",
      status: "scheduled",
      border: "Krakivets",
      passengers: [
        { name: "Roman Sydorenko", passport: "DA444555", visaStatus: "valid", destination: "Poznan", status: "registered" },
        { name: "Svitlana Moroz", passport: "DB666777", visaStatus: "visa_free", destination: "Wroclaw", status: "registered" }
      ],
      gps: { lat: "46.4825", lng: "30.7233", speed: "Scheduled", eta: "Starts at 18:00" }
    }
  ]);

  // Fuel Cards State
  const [fuelCards, setFuelCards] = useState([
    { id: "FC-ORLEN-01", provider: "Orlen Flota", assignedTo: "Oleh Melnyk", balance: 650, limit: 2000, status: "active" },
    { id: "FC-SHELL-02", provider: "Shell Card", assignedTo: "Andriy Boyko", balance: 1420, limit: 3000, status: "active" },
    { id: "FC-BP-03", provider: "BP Plus", assignedTo: "Serhiy Tkach", balance: 250, limit: 2500, status: "active" },
    { id: "FC-DKV-04", provider: "DKV Card", assignedTo: "Vasyl Lymar", balance: 0, limit: 4000, status: "suspended" }
  ]);

  // Border Points & Current Queues (Mock live data)
  const [borders] = useState([
    { name: "Krakivets - Korczowa", queueCars: 45, waitTime: "1.5 hours", status: "clear" },
    { name: "Shehyni - Medyka", queueCars: 120, waitTime: "3.5 hours", status: "congested" },
    { name: "Rava-Ruska - Hrebenne", queueCars: 30, waitTime: "1 hour", status: "clear" },
    { name: "Dorohusk - Jahodyn", queueCars: 95, waitTime: "2.8 hours", status: "moderate" }
  ]);

  // AI Dispatch Agents Logs (Real-time simulation: 175 agents + 15 coordinators + 1 president)
  const [agentLogs, setAgentLogs] = useState([
    { time: "13:30:04", type: "system", message: "President approved fuel budget allocations for Q2 2026." },
    { time: "13:28:15", type: "coordinator", message: "Lead Coordinator [Agent-C04] reassigned VW Crafter to route Lviv-Krakow." },
    { time: "13:25:40", type: "agent", message: "Dispatch Agent-087 verified passport validation for passenger Ivan Petrenko." },
    { time: "13:22:11", type: "agent", message: "Dispatch Agent-142 pulled live border wait time for Krakivets (1.5 hours)." },
    { time: "13:20:00", type: "system", message: "KompasCRM AI Operations network fully online (175 dispatch agents, 15 regional coordinators active)." }
  ]);

  useEffect(() => {
    // Simulate active background operations from the 175 dispatch agents, coordinators, and the president
    const messages = [
      { type: "agent", text: "Agent-054 recalculated ETA for TRP-2026-43 due to Shehyni customs delay." },
      { type: "agent", text: "Agent-112 processed Polish e-toll fee (e-TOLL PL) for vehicle KA 1234." },
      { type: "coordinator", text: "Coordinator [Agent-C09] confirmed vehicle manifest matching with border guard API." },
      { type: "agent", text: "Agent-009 flagged passenger Tetiana Polishchuk check-in at Warsaw terminal." },
      { type: "system", text: "President signed digital order #F-294 for automated bulk fuel replenishment." },
      { type: "agent", text: "Agent-166 synced fuel transaction data from Orlen API." },
      { type: "coordinator", text: "Coordinator [Agent-C15] authorized border entry clearance manifest for TRP-2026-42." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setAgentLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19) // Keep last 20 entries
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const toggleFuelCardStatus = (id) => {
    setFuelCards(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === "active" ? "suspended" : "active" };
      }
      return c;
    }));
  };

  const filteredTrips = trips.filter(t => 
    t.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.border.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Top Banner / Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Логістика & Автопарк (Fleet Management)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Контроль транскордонних перевезень, GPS маніфести, паливні картки та диспетчеризація.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary" onClick={() => setActiveTab("agents")}>
            <Icon name="cpu" size={16} /> AI Dispatch Cockpit
          </button>
          <button className="kc-btn kc-btn-primary">
            <Icon name="plus" size={16} /> Додати рейс
          </button>
        </div>
      </div>

      {/* Modern Dashboard Stats Grid */}
      <div className="kc-grid kc-grid-4">
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="truck" size={18} color="var(--color-primary)" />
            </div>
            <Badge status="green" text="Live" />
          </div>
          <div className="kc-stat-val">
            {trips.filter(t => t.status === "en_route" || t.status === "at_border").length} / {trips.length}
          </div>
          <div className="kc-stat-lbl">Рейсів в дорозі</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(229,168,75,0.1)" }}>
              <Icon name="flag" size={18} color="var(--color-warning)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>Delayed</span>
          </div>
          <div className="kc-stat-val" style={{ color: "var(--color-warning)" }}>1</div>
          <div className="kc-stat-lbl">Черга на кордоні</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,155,213,0.1)" }}>
              <Icon name="card" size={18} color="var(--color-info)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>ORLEN / SHELL</span>
          </div>
          <div className="kc-stat-val">3 Active</div>
          <div className="kc-stat-lbl">Паливні карти</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="users" size={18} color="var(--color-success)" />
            </div>
            <Badge status="blue" text="Today" />
          </div>
          <div className="kc-stat-val">12</div>
          <div className="kc-stat-lbl">Пасажирів у маніфестах</div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        <button 
          onClick={() => setActiveTab("trips")} 
          style={{
            padding: "12px 16px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "trips" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "trips" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="truck" size={16} /> Рейси & Пасажирські Маніфести
        </button>
        <button 
          onClick={() => setActiveTab("borders")} 
          style={{
            padding: "12px 16px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "borders" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "borders" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="map" size={16} /> GPS Маніфести & Кордони
        </button>
        <button 
          onClick={() => setActiveTab("fuel")} 
          style={{
            padding: "12px 16px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "fuel" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "fuel" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="card" size={16} /> Паливні Картки & Ліміти
        </button>
        <button 
          onClick={() => setActiveTab("agents")} 
          style={{
            padding: "12px 16px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "agents" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "agents" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0
          }}
        >
          <Icon name="cpu" size={16} /> AI Диспетчерська (175+ Agents)
        </button>
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === "trips" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", gap: "var(--space-md)" }}>
              <div style={{ flex: 1 }}>
                <SearchInput 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  placeholder="Пошук за рейсом, водієм, кордоном чи номером авто..." 
                />
              </div>
            </div>

            <div className="kc-table-wrap">
              <table className="kc-table">
                <thead>
                  <tr>
                    <th>Рейс ID</th>
                    <th>Маршрут</th>
                    <th>Статус</th>
                    <th>Водій & Авто</th>
                    <th>Пасажири</th>
                    <th>Пункт пропуску</th>
                    <th style={{ textAlign: "right" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name="truck" size={16} color="var(--dim)" />
                          <span style={{ fontWeight: 600 }}>{row.id}</span>
                        </div>
                      </td>
                      <td><span style={{ fontWeight: 500 }}>{row.route}</span></td>
                      <td>
                        {row.status === "completed" && <Badge status="green" text="Завершено" />}
                        {row.status === "at_border" && <Badge status="brass" text="На Кордоні" />}
                        {row.status === "en_route" && <Badge status="blue" text="В Дорозі" />}
                        {row.status === "scheduled" && <Badge status="dim" text="Заплановано" />}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar name={row.driver} size={24} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "var(--text-sm)" }}>{row.driver}</span>
                            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.vehicle}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="kc-btn kc-btn-ghost" 
                          style={{ padding: "2px 8px", minHeight: "auto", fontSize: "var(--text-xs)", display: "inline-flex", alignItems: "center", gap: 4 }}
                          onClick={() => setSelectedTrip(row)}
                        >
                          <Icon name="users" size={12} color="var(--color-primary)" />
                          <strong>{row.passengers.length} осіб</strong>
                        </button>
                      </td>
                      <td>
                        <span style={{ color: "var(--dim)" }}>
                          <Icon name="flag" size={12} /> {row.border}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button 
                            className="kc-btn kc-btn-ghost" 
                            style={{ padding: 6, minHeight: "auto" }}
                            title="Пасажирський маніфест"
                            onClick={() => setSelectedTrip(row)}
                          >
                            <Icon name="users" size={16} />
                          </button>
                          <button 
                            className="kc-btn kc-btn-ghost" 
                            style={{ padding: 6, minHeight: "auto" }}
                            title="Показати GPS на мапі"
                            onClick={() => { setSelectedTrip(row); setActiveTab("borders"); }}
                          >
                            <Icon name="navigation" size={16} />
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

        {activeTab === "borders" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "var(--space-lg)" }}>
            {/* Left Column: GPS manifests */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>Супутникові GPS Маніфести & Координати</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {trips.map((trip) => (
                  <div key={trip.id} style={{ padding: "var(--space-md)", background: "var(--panel-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-primary)" }}>{trip.id}</span>
                        <span style={{ marginLeft: 8, fontWeight: 500, fontSize: "var(--text-xs)", color: "var(--dim)" }}>({trip.vehicle})</span>
                      </div>
                      <div>
                        {trip.status === "en_route" && <Badge status="blue" text="En Route" />}
                        {trip.status === "at_border" && <Badge status="brass" text="At Border" />}
                        {trip.status === "completed" && <Badge status="green" text="Arrived" />}
                        {trip.status === "scheduled" && <Badge status="dim" text="Scheduled" />}
                      </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", fontSize: "var(--text-xs)" }}>
                      <div>
                        <div style={{ color: "var(--faint)" }}>Текучі координати:</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>Lat: {trip.gps.lat}, Lng: {trip.gps.lng}</div>
                      </div>
                      <div>
                        <div style={{ color: "var(--faint)" }}>Поточна швидкість & ETA:</div>
                        <div style={{ fontWeight: 500 }}>{trip.gps.speed} · {trip.gps.eta}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: "var(--space-sm)" }}>
                      <ProgressBar progress={trip.status === "completed" ? 100 : trip.status === "at_border" ? 85 : trip.status === "en_route" ? 45 : 0} label="Маршрутний прогрес" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Border Crossings Queue Wait Times */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>Live Затримки на Кордонах (UA/PL)</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {borders.map((border) => (
                  <div key={border.name} style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: "var(--space-sm)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600 }}>{border.name}</span>
                      {border.status === "congested" ? (
                        <Badge status="red" text="Затори" />
                      ) : border.status === "moderate" ? (
                        <Badge status="brass" text="Помірно" />
                      ) : (
                        <Badge status="green" text="Вільний" />
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                      <span>Автомобілів у черзі: <strong>{border.queueCars}</strong></span>
                      <span>Очікування: <strong style={{ color: border.status === "congested" ? "var(--color-danger)" : "var(--text)" }}>{border.waitTime}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="kc-note" style={{ marginTop: "auto", fontSize: "var(--text-xs)" }}>
                <Icon name="zap" size={14} /> Дані оновлюються автоматично системою AI маніфестів кожні 15 хвилин на базі API прикордонних служб.
              </div>
            </div>
          </div>
        )}

        {activeTab === "fuel" && (
          <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0 }}>Паливні Картки Водіїв</h3>
            
            <div className="kc-table-wrap">
              <table className="kc-table">
                <thead>
                  <tr>
                    <th>Номер Карти</th>
                    <th>Провайдер</th>
                    <th>Прикріплений водій</th>
                    <th>Використано (місяць)</th>
                    <th>Кредитний Ліміт</th>
                    <th>Статус</th>
                    <th style={{ textAlign: "right" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelCards.map((card) => (
                    <tr key={card.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{card.id}</td>
                      <td>{card.provider}</td>
                      <td>{card.assignedTo}</td>
                      <td><strong style={{ color: "var(--color-primary)" }}>{card.balance} PLN</strong></td>
                      <td>{card.limit} PLN</td>
                      <td>
                        {card.status === "active" ? (
                          <Badge status="green" text="Активна" />
                        ) : (
                          <Badge status="red" text="Заблокована" />
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button 
                          onClick={() => toggleFuelCardStatus(card.id)}
                          className={`kc-btn kc-btn-ghost`} 
                          style={{
                            padding: "4px 8px", 
                            minHeight: "auto", 
                            fontSize: "var(--text-xs)",
                            color: card.status === "active" ? "var(--color-danger)" : "var(--color-success)"
                          }}
                        >
                          {card.status === "active" ? "Заблокувати" : "Розблокувати"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginTop: "var(--space-sm)" }}>
              <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Загальний ліміт палива</span>
                <div style={{ fontSize: 24, fontWeight: 700, margin: "8px 0" }}>11,500 PLN / місяць</div>
                <ProgressBar progress={((650 + 1420 + 250) / 11500) * 100} label="Використано по компанії" />
              </div>
              <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Остання транзакція</span>
                <div style={{ fontSize: 18, fontWeight: 600, margin: "8px 0", color: "var(--color-success)" }}>+ 340.50 PLN (Orlen)</div>
                <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                  Водій Oleh Melnyk, Sprinter KA 1234. Схвалено AI Диспетчером.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "var(--space-lg)" }}>
            {/* Live Agents Control Dashboard */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Dispatch Network</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Активні Лінійні Агенти</span>
                  <strong style={{ color: "var(--color-primary)" }}>175</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Координатори Напрямків</span>
                  <strong style={{ color: "var(--color-info)" }}>15</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Генеральний Президент</span>
                  <strong style={{ color: "var(--color-success)" }}>1</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: 4 }}>
                  <span>Статус мережі</span>
                  <Badge status="green" text="Цілодобово" />
                </div>
              </div>

              <div className="kc-note" style={{ fontSize: "var(--text-xs)" }}>
                <strong>Режим автопілоту:</strong> Агенти самостійно зчитують маніфести пасажирів, купують квитки, перевіряють статус віз, оплачують польські дороги e-TOLL та виписують транзакції водіям.
              </div>
            </div>

            {/* AI Log Console */}
            <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", background: "#06090e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Консоль Диспетчера (Live AI Agent Logs)</h3>
                <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>Refreshing automatically...</span>
              </div>

              <div style={{ 
                flex: 1, 
                maxHeight: 280, 
                overflowY: "auto", 
                fontFamily: "var(--font-mono)", 
                fontSize: "var(--text-xs)", 
                lineHeight: "1.6",
                color: "#c9d1d9",
                display: "flex",
                flexDirection: "column",
                gap: 8
              }}>
                {agentLogs.map((log, index) => {
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

      {/* Passenger Manifest Sidebar / Detail Drawer (Modal) */}
      {selectedTrip && (
        <div className="kc-modal-bg" onClick={() => setSelectedTrip(null)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <div>
                <h3 className="kc-modal-title" style={{ margin: 0 }}>Маніфест Рейсу {selectedTrip.id}</h3>
                <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", margin: "4px 0 0" }}>{selectedTrip.route} · Водій: {selectedTrip.driver}</p>
              </div>
              <button 
                onClick={() => setSelectedTrip(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                <span>Пасажирський список рейсу ({selectedTrip.passengers.length} осіб)</span>
                <span>Пункт перетину: <strong>{selectedTrip.border}</strong></span>
              </div>

              <div className="kc-table-wrap" style={{ maxHeight: 250, overflowY: "auto" }}>
                <table className="kc-table" style={{ fontSize: "var(--text-xs)" }}>
                  <thead>
                    <tr>
                      <th>Прізвище Ім&apos;я</th>
                      <th>Паспорт</th>
                      <th>Статус Візи</th>
                      <th>Призначення</th>
                      <th>Посадка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTrip.passengers.map((p, idx) => (
                      <tr key={idx} style={{ cursor: "default" }}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ fontFamily: "var(--font-mono)" }}>{p.passport}</td>
                        <td>
                          {p.visaStatus === "valid" && <Badge status="green" text="Віза Ок" />}
                          {p.visaStatus === "visa_free" && <Badge status="blue" text="Біометрія" />}
                          {p.visaStatus === "residence_card" && <Badge status="brass" text="Karta Pobytu" />}
                        </td>
                        <td>{p.destination}</td>
                        <td>
                          {p.status === "boarded" && <Badge status="blue" text="Посадка" />}
                          {p.status === "checking" && <Badge status="brass" text="Контроль" />}
                          {p.status === "arrived" && <Badge status="green" text="Прибув" />}
                          {p.status === "registered" && <Badge status="dim" text="Резерв" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button className="kc-btn" onClick={() => setSelectedTrip(null)}>Закрити</button>
                <button className="kc-btn kc-btn-primary" onClick={() => {
                  alert("AI Диспетчер повторно відправив маніфест польській прикордонній службі (Straż Graniczna)");
                  setSelectedTrip(null);
                }}>
                  <Icon name="send" size={14} /> Надіслати прикордонникам (Straż)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
