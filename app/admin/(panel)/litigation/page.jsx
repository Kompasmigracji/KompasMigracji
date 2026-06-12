"use client";
/* KompasCRM — Legal Appeals & Litigation Tracker */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function LitigationPage() {
  const [activeTab, setActiveTab] = useState("appeals");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [appeals] = useState([]);

  const [hearings] = useState([]);

  // AI Litigation logs
  const [litiLogs, setLitiLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-059 generated draft Odwołanie to Szef Urzędu for Dmytro Kovalenko." },
      { type: "agent", text: "Agent-108 verified deadline schedule matching 14-day appeal rule." },
      { type: "coordinator", text: "Coordinator [Agent-C07] reassigned hearing HRG-101 to Alex Jenkins." },
      { type: "system", text: "President digital stamp appended to NSA complaint file WSA-2026-99." },
      { type: "agent", text: "Agent-128 generated WSA PDF package with SHA-256 certificate hash." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setLitiLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: "ID Справи", cell: (row) => <span style={{ fontFamily: "monospace", fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</span> },
    { header: "Клієнт", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.client} size={24} />
        <span style={{ fontWeight: 550 }}>{row.client}</span>
      </div>
    )},
    { header: "Тип Скарги & Орган", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.type}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.authority}</div>
      </div>
    )},
    { header: "Дедлайн", cell: (row) => (
      <span style={{ color: row.status === "draft" ? "var(--color-danger)" : "var(--fg)" }}>{row.deadline}</span>
    )},
    { header: "Статус", cell: (row) => {
      let color = "blue";
      if (row.status === "draft") color = "warning";
      if (row.status === "filed") color = "primary";
      if (row.status === "won") color = "green";
      if (row.status === "lost") color = "red";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Юрист", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.lawyer}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button 
          className="kc-btn kc-btn-ghost" 
          onClick={() => {
            setSelectedTemplate(row.type);
            setShowTemplateModal(true);
          }}
        >
          <Icon name="file-text" size={16} />
        </button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Оскарження & Суди (Litigation Tracker)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Відстеження апеляцій до Szef Urzędu, скарг до WSA/NSA та судових засідань.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => {
          setSelectedTemplate("Appeal to Szef Urzędu");
          setShowTemplateModal(true);
        }}>
          <Icon name="plus" size={16} /> Нове оскарження
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kc-grid kc-grid-3" style={{ marginBottom: "var(--space-sm)" }}>
        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "var(--brass-bg)" }}>
              <Icon name="folder" size={18} color="var(--color-primary)" />
            </div>
            <Badge status="brass" text="Active" />
          </div>
          <div className="kc-stat-val">12</div>
          <div className="kc-stat-lbl">Активні апеляції</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,184,122,0.1)" }}>
              <Icon name="check" size={18} color="var(--color-success)" />
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success)" }}>Good</span>
          </div>
          <div className="kc-stat-val">84.5%</div>
          <div className="kc-stat-lbl">Успішність (Win Rate)</div>
        </div>

        <div className="kc-stat">
          <div className="kc-stat-top">
            <div className="kc-stat-ico" style={{ background: "rgba(95,155,213,0.1)" }}>
              <Icon name="calendar" size={18} color="var(--color-info)" />
            </div>
            <Badge status="blue" text="Court" />
          </div>
          <div className="kc-stat-val">2</div>
          <div className="kc-stat-lbl">Судові засідання</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        <button onClick={() => setActiveTab("appeals")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "appeals" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "appeals" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}>
          <Icon name="folder" size={16} /> Реєстр апеляцій
        </button>
        <button onClick={() => setActiveTab("hearings")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "hearings" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "hearings" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}>
          <Icon name="calendar" size={16} /> Судові засідання
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0
          }}>
          <Icon name="cpu" size={16} /> AI Legal Logs
        </button>
      </div>

      {/* Tab contents */}
      <div style={{ flex: 1, minHeight: 300 }}>
        {activeTab === "appeals" && (
          <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
            <DataTable columns={columns} data={appeals} />
          </div>
        )}

        {activeTab === "hearings" && (
          <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Клієнт</th>
                  <th>Суд / Зала</th>
                  <th>Дата та Час</th>
                  <th>Адвокат</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {hearings.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 600 }}>{h.client}</td>
                    <td>{h.court}</td>
                    <td>{h.date} о {h.time}</td>
                    <td>{h.lawyer}</td>
                    <td>
                      <Badge status="green" text={h.status.toUpperCase()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи судового AI Диспетчера</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {litiLogs.map((log, index) => {
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

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="kc-modal-bg" onClick={() => setShowTemplateModal(false)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Генерація проекту документа</h3>
              <button onClick={() => setShowTemplateModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: "var(--space-md)" }}>
              Офіційний шаблон оскарження для: <strong>{selectedTemplate}</strong>.
            </p>

            <div style={{ background: "var(--panel-2)", padding: "16px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px", color: "var(--fg)", maxHeight: "200px", overflowY: "auto", border: "1px solid var(--border)", marginBottom: "var(--space-md)", lineHeight: "1.6" }}>
              <div><strong>DO: Szefa Urzędu do Spraw Cudzoziemców</strong></div>
              <div>Za pośrednictwem: Wojewody Mazowieckiego</div>
              <br/>
              <div><strong>ODWOŁANIE</strong></div>
              <div>od decyzji Wojewody Mazowieckiego z dnia 15 maja 2026 r.</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="kc-btn" onClick={() => setShowTemplateModal(false)}>Закрити</button>
              <button className="kc-btn kc-btn-primary" onClick={() => {
                alert("Проект оскарження успішно згенерований AI Юристом!");
                setShowTemplateModal(false);
              }}>
                <Icon name="download" size={16} /> Експорт PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
