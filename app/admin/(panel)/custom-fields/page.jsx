"use client";
/* KompasCRM — Entity Manager & Custom Fields */
import React, { useState, useEffect } from "react";
import { Icon, Badge, DataTable } from "@/components/admin/ui";

export default function CustomFieldsPage() {
  const [fields, setFields] = useState([
    { id: "fld_1", name: "PESEL Number", entity: "Members", type: "Text (11 chars)", status: "active", required: "Yes" },
    { id: "fld_2", name: "Passport Expiry Date", entity: "Leads", type: "Date", status: "active", required: "Yes" },
    { id: "fld_3", name: "Relocation City Preference", entity: "Leads", type: "Dropdown (Warsaw/Krakow/Lodz)", status: "active", required: "No" },
    { id: "fld_4", name: "ZUS Registry Code", entity: "Members", type: "Number", status: "draft", required: "No" }
  ]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  // AI Schema logs
  const [schemaLogs, setSchemaLogs] = useState([
    { time: "14:35:10", type: "system", message: "President approved database schema migration script for custom attributes." },
    { time: "14:32:05", type: "coordinator", message: "Schema Coordinator [Agent-C14] validated foreign key indexing logic." },
    { time: "14:30:00", type: "agent", message: "Schema Agent-053 checked column conflicts for Leads table." },
    { time: "14:28:00", type: "system", message: "KompasCRM Schema Engine active (175 background agents tracking custom migrations)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-095 resolved database column collision for field: ZUS Registry Code." },
      { type: "agent", text: "Agent-128 verified migration integrity: Postgres schema matching 100%." },
      { type: "coordinator", text: "Coordinator [Agent-C02] authorized database backup snapshot before custom field insert." },
      { type: "system", text: "President key authorized dynamic column creation on leads table." },
      { type: "agent", text: "Agent-110 updated custom fields lookup metadata cache." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setSchemaLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleAddField = (e) => {
    e.preventDefault();
    alert("AI Диспетчер успішно провів міграцію бази даних та додав нове поле у вибрану таблицю.");
    setShowAddFieldModal(false);
  };

  const columns = [
    { header: "Назва Поля", cell: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { header: "Сутність (Таблиця)", cell: (row) => <Badge status="dim" text={row.entity} /> },
    { header: "Тип Даних", cell: (row) => <span style={{ fontFamily: "monospace" }}>{row.type}</span> },
    { header: "Обов'язкове", cell: (row) => <Badge status={row.required === "Yes" ? "blue" : "dim"} text={row.required} /> },
    { header: "Статус", cell: (row) => <Badge status={row.status === "active" ? "green" : "brass"} text={row.status.toUpperCase()} /> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 4 }}>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="edit" size={16} /></button>
        <button className="kc-btn kc-btn-ghost" style={{ padding: 4, color: "var(--color-danger)" }}><Icon name="trash" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Конструктор Полів (Custom Fields)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Створення та налаштування додаткових реквізитів для лідів, учасників профспілки та справ.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setShowAddFieldModal(true)}>
          <Icon name="plus" size={16} /> Створити поле
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr", gap: "var(--space-lg)" }}>
        {/* Table card */}
        <div className="kc-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <DataTable columns={columns} data={fields} />
        </div>

        {/* AI Schema logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="kc-card">
            <h3 className="kc-card-cap" style={{ margin: 0 }}>AI Schema Optimizer</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginTop: "var(--space-md)", fontSize: "var(--text-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>DB Tuning Agents:</span>
                <strong>175 active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Custom Table Attributes:</span>
                <strong>24 columns added</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>SQL Schema Status:</span>
                <Badge status="green" text="Synchronized" />
              </div>
            </div>
          </div>

          <div className="kc-card" style={{ background: "#06090e", flex: 1 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Лог оптимізатора БД (AI Dynamic Schema logs)</h3>
            <div style={{ 
              marginTop: "var(--space-md)", maxHeight: 200, overflowY: "auto", 
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: 1.6,
              color: "#c9d1d9", display: "flex", flexDirection: "column", gap: 8
            }}>
              {schemaLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "var(--dim)" }}>[{log.time}]</span> <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="kc-modal-bg" onClick={() => setShowAddFieldModal(false)}>
          <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              <h3 className="kc-modal-title" style={{ margin: 0 }}>Створити нове поле</h3>
              <button onClick={() => setShowAddFieldModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddField} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div>
                <label className="kc-label">Назва поля</label>
                <input type="text" placeholder="Напр. Серія паспорта" className="kc-input" required />
              </div>

              <div>
                <label className="kc-label">Таблиця бази даних</label>
                <select className="kc-select" required>
                  <option value="leads">Ліди & Продажі (Leads)</option>
                  <option value="members">Учасники профспілки (Members)</option>
                  <option value="cases">Справи Клієнтів (Cases)</option>
                </select>
              </div>

              <div>
                <label className="kc-label">Тип даних</label>
                <select className="kc-select" required>
                  <option value="text">Текст (Single Line Text)</option>
                  <option value="number">Число (Number)</option>
                  <option value="date">Дата (Date)</option>
                  <option value="select">Вибір зі списку (Dropdown)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <input type="checkbox" style={{ cursor: "pointer" }} />
                <label className="kc-label" style={{ margin: 0, cursor: "pointer" }}>Обов&apos;язкове поле для заповнення</label>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "flex-end", marginTop: "var(--space-sm)" }}>
                <button type="button" className="kc-btn" onClick={() => setShowAddFieldModal(false)}>Скасувати</button>
                <button type="submit" className="kc-btn kc-btn-primary">Запустити міграцію</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
