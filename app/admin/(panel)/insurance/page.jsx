"use client";
/* KompasCRM — Health Insurance & ZUS Coordinator (Ubezpieczenia i ZUS) */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState("policies"); // policies, zusChecklist, logs
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({ clientName: "", package: "Standard", premium: "120 PLN/mo" });

  const [policies] = useState([
    { id: "POL-701", client: "Dmytro Kovalenko", type: "ZUS (Державне)", policyNo: "PESEL 920102...", premium: "450 PLN/mo", expires: "Безстроково (ZUS ZUA)", status: "active", verifiedDocs: "ZUS ZUA + RCA (Травень)" },
    { id: "POL-702", client: "Kamil Nowak", type: "Приватне (PZU Wojażer)", policyNo: "PZU-8930219", premium: "150 PLN/mo", expires: "June 25, 2026", status: "expiring", verifiedDocs: "Поліс PDF" },
    { id: "POL-703", client: "Anna Schmidt", type: "Приватне (LuxMed)", policyNo: "LUX-1029481", premium: "180 PLN/mo", expires: "Dec 31, 2026", status: "active", verifiedDocs: "Сертифікат покриття" },
    { id: "POL-704", client: "Oleksandr Lysenko", type: "Приватне (PZU Wojażer)", policyNo: "PZU-7204910", premium: "120 PLN/mo", expires: "May 15, 2026", status: "expired", verifiedDocs: "Прострочений поліс" }
  ]);

  const [checklist] = useState([
    { id: "CHK-01", client: "Ivan Petrov", registered: "ZUS ZUA подано", monthlyReport: "ZUS RCA відсутній", actionRequired: "Запитати підтвердження оплати" },
    { id: "CHK-02", client: "Elena Rostova", registered: "ZUS ZUA подано", monthlyReport: "ZUS RCA подано", actionRequired: "Немає (Відповідність вимогам)" }
  ]);

  // AI Insurance logs
  const [insuLogs, setInsuLogs] = useState([
    { time: "18:25:01", type: "system", message: "President approved ZUS RCA declaration verification rule." },
    { time: "18:22:10", type: "coordinator", message: "ZUS Coordinator [Agent-C05] cross-checked PESEL registries for 45 active members." },
    { time: "18:19:44", type: "agent", message: "Insurance Agent-039 generated LuxMed custom coverage quote." },
    { time: "18:15:00", type: "system", message: "KompasCRM ZUS Compliance network online (175 automated agents active)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-054 audited declaration files: ZUS RCA verified for Dmytro Kovalenko." },
      { type: "agent", text: "Agent-092 parsed PZU policy PDF metadata and updated expiration dates." },
      { type: "coordinator", text: "Coordinator [Agent-C11] flagged POL-704 as EXPIRED: triggering SMS alert." },
      { type: "system", text: "President digital credentials signed and sent monthly declarations batch to PUE ZUS gateway." },
      { type: "agent", text: "Agent-128 matched tax identifier codes for 5 relocators." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setInsuLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: "ID", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "Клієнт", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontWeight: 550 }}>{row.client}</span>
      </div>
    )},
    { header: "Тип & Номер полісу", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.type}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>{row.policyNo}</div>
      </div>
    )},
    { header: "Внесок / Вартість", cell: (row) => <span style={{ fontWeight: 550 }}>{row.premium}</span> },
    { header: "Дата закінчення", cell: (row) => (
      <span style={{ color: row.status === "expired" ? "var(--color-danger)" : row.status === "expiring" ? "var(--color-warning)" : "var(--fg)" }}>
        {row.expires}
      </span>
    )},
    { header: "Статус", cell: (row) => {
      let color = "green";
      if (row.status === "expiring") color = "brass";
      if (row.status === "expired") color = "red";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Перевірені документи", cell: (row) => (
      <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.verifiedDocs}</span>
    )}
  ];

  function handleGenerateQuote() {
    if (!quoteData.clientName) return;
    alert(`Приватна пропозиція на ${quoteData.premium} успішно сформована AI Страховиком для ${quoteData.clientName}!`);
    setShowQuoteModal(false);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Страхування & ZUS (Ubezpieczenia i ZUS)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Моніторинг медичного страхування клієнтів для карт побиту та перевірка відрахувань ZUS.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setShowQuoteModal(true)}>
          <Icon name="plus" size={16} /> Оформити Поліс
        </button>
      </div>

      {/* KPI Stats */}
      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-sm)", flexWrap: "wrap" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)", minWidth: 180 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Активне покриття</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>112</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)", minWidth: 180 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Закінчується дія</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>3</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)", minWidth: 180 }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Партнери</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: "var(--space-xs)" }}>PZU, LuxMed</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)" }}>
        <button onClick={() => setActiveTab("policies")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "policies" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "policies" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="shield" size={16} /> Реєстр Полісів
        </button>
        <button onClick={() => setActiveTab("zusChecklist")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "zusChecklist" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "zusChecklist" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="check" size={16} /> Контроль ZUS
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="cpu" size={16} /> AI ZUS Logs
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 300 }}>
        {activeTab === "policies" && (
          <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
            <DataTable columns={columns} data={policies} />
          </div>
        )}

        {activeTab === "zusChecklist" && (
          <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Клієнт</th>
                  <th>ДеDeclaration ZUS ZUA (Реєстрація)</th>
                  <th>Декларація ZUS RCA (Внески)</th>
                  <th>Потрібна дія</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.client}</td>
                    <td>
                      <Badge status="green" text={c.registered.toUpperCase()} />
                    </td>
                    <td>
                      <Badge 
                        status={c.monthlyReport.includes("відсутній") ? "red" : "green"} 
                        text={c.monthlyReport.toUpperCase()} 
                      />
                    </td>
                    <td style={{ color: c.monthlyReport.includes("відсутній") ? "var(--color-danger)" : "var(--dim)", fontWeight: 500 }}>
                      {c.actionRequired}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи автоматичної перевірки відрахувань ZUS</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {insuLogs.map((log, index) => {
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

      {/* Policy Quote Modal */}
      {showQuoteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="kc-card" style={{ maxWidth: "450px", width: "90%" }}>
            <h3 style={{ margin: "0 0 var(--space-sm) 0" }}>Розрахунок медичної страховки</h3>
            <p style={{ fontSize: "var(--text-sm)", margin: "0 0 var(--space-md) 0", color: "var(--dim)" }}>
              Оформлення приватного полісу PZU Wojażer чи LuxMed для іноземців.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "var(--space-md)" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Ім'я клієнта</label>
                <input 
                  type="text" 
                  placeholder="напр. Олена Ростова" 
                  className="kc-input" 
                  value={quoteData.clientName}
                  onChange={(e) => setQuoteData({ ...quoteData, clientName: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Пакет покриття</label>
                <select 
                  className="kc-input" 
                  style={{ width: "100%" }}
                  value={quoteData.package}
                  onChange={(e) => {
                    const val = e.target.value;
                    let premium = "120 PLN/mo";
                    if (val === "Premium") premium = "250 PLN/mo";
                    if (val === "Family") premium = "450 PLN/mo";
                    setQuoteData({ ...quoteData, package: val, premium });
                  }}
                >
                  <option value="Standard">Standard (Вимоги воєводи)</option>
                  <option value="Premium">Premium (LuxMed клініки)</option>
                  <option value="Family">Сімейний пакет (PZU Family)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Розрахований внесок</label>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-success)" }}>
                  {quoteData.premium}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-secondary" onClick={() => setShowQuoteModal(false)}>Скасувати</button>
              <button className="kc-btn kc-btn-primary" onClick={handleGenerateQuote} disabled={!quoteData.clientName}>
                Оформити Поліс
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
