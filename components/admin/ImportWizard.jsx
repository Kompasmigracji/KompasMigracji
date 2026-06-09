"use client";
/* KompasCRM — Import CSV Wizard Component */
import React, { useState } from "react";
import { Icon, Spinner } from "./ui";

const FIELD_OPTIONS = {
  leads: [
    { value: "source", label: "Джерело (source)" },
    { value: "name", label: "Ім'я клієнта (name)" },
    { value: "contact", label: "Контактні дані (contact)" },
    { value: "message", label: "Повідомлення (message)" },
    { value: "status", label: "Статус ліда (status)" },
    { value: "assigned_to", label: "ID виконавця (assigned_to)" },
  ],
  members: [
    { value: "email", label: "Email учасника" },
    { value: "full_name", label: "ПІБ учасника" },
    { value: "phone", label: "Телефон" },
    { value: "status", label: "Статус (active/suspended)" },
    { value: "member_no", label: "Номер картки (member_no)" },
    { value: "category", label: "Категорія" },
    { value: "city", label: "Місто" },
    { value: "country", label: "Країна" },
    { value: "join_date", label: "Дата вступу" },
    { value: "dues_status", label: "Статус внесків (paid/unpaid)" },
    { value: "notes", label: "Примітки" },
  ],
  deals: [
    { value: "title", label: "Назва угоди (title)" },
    { value: "amount", label: "Сума (amount)" },
    { value: "currency", label: "Валюта (currency)" },
    { value: "stage", label: "Етап (stage)" },
    { value: "probability", label: "Ймовірність %" },
    { value: "expected_close", label: "Дата закриття" },
    { value: "lead_id", label: "ID Ліда" },
    { value: "member_id", label: "ID Клієнта" },
    { value: "assigned_to", label: "ID Виконавця" },
    { value: "notes", label: "Примітки" },
  ],
  cases: [
    { value: "full_name", label: "ПІБ Клієнта (full_name)" },
    { value: "contact", label: "Контакт (contact)" },
    { value: "case_number", label: "Номер справи в Уженді" },
    { value: "urzad", label: "Вiддiл Уженду (urzad)" },
    { value: "submission_date", label: "Дата подачi" },
    { value: "deadline_date", label: "Кiнцевий дедлайн" },
    { value: "stage", label: "Етап справи (stage)" },
    { value: "status", label: "Статус (status)" },
    { value: "has_dodatek_1", label: "Має Dodatek №1 (true/false)" },
    { value: "has_zus_cert", label: "Має ZUS (true/false)" },
    { value: "notes", label: "Примітки" },
    { value: "assigned_to", label: "ID Виконавця" },
  ]
};

export default function ImportWizard({ entityType, isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    // Read first line to extract headers
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const firstLine = text.split(/\r?\n/)[0];
      // Simple parse headers (comma separated)
      const parsedHeaders = firstLine.split(",").map(h => h.trim().replace(/^"|"$/g, ''));
      setHeaders(parsedHeaders);
      
      // Auto-map matching fields
      const initialMap = {};
      const options = FIELD_OPTIONS[entityType] || [];
      parsedHeaders.forEach(h => {
        const normalized = h.toLowerCase().replace(/[\s_]+/g, "");
        const match = options.find(opt => 
          opt.value.toLowerCase().replace(/[\s_]+/g, "") === normalized || 
          opt.label.toLowerCase().includes(normalized)
        );
        if (match) {
          initialMap[h] = match.value;
        }
      });
      setFieldMap(initialMap);
      setStep(2);
    };
    reader.readAsText(selectedFile);
  };

  const handleRunImport = async () => {
    setImporting(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("entity_type", entityType);
    formData.append("field_map", JSON.stringify(fieldMap));

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData
      });
      const d = await res.json();
      if (d.error) {
        setError(d.error);
      } else {
        setResults(d);
        setStep(3);
        if (onSuccess) onSuccess();
      }
    } catch {
      setError("Помилка з'єднання при імпорті даних");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="kc-modal-bg" onClick={onClose}>
      <div className="kc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>
            Імпорт CSV — {entityType.toUpperCase()}
          </h2>
          <button className="kc-btn kc-btn-ghost" onClick={onClose}>✕</button>
        </div>

        {/* STEP 1: Upload File */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div 
              style={{
                border: "2px dashed var(--border)",
                background: "var(--panel-2)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-2xl) var(--space-lg)",
                textAlign: "center",
                cursor: "pointer"
              }}
              onClick={() => document.getElementById("csv-file-input").click()}
            >
              <input 
                id="csv-file-input" 
                type="file" 
                accept=".csv" 
                style={{ display: "none" }} 
                onChange={handleFileChange} 
              />
              <div style={{ color: "var(--faint)", marginBottom: 8 }}>
                <Icon name="file-text" size={32} />
              </div>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                Оберіть CSV файл для завантаження
              </span>
              <p style={{ margin: "4px 0 0", fontSize: "var(--text-xs)", color: "var(--faint)" }}>
                Кодування UTF-8, розділювач — кома
              </p>
            </div>
            {error && <div style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)" }}>{error}</div>}
          </div>
        )}

        {/* STEP 2: Map Columns */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
              Співставте стовпчики вашого файлу з полями системи:
            </span>

            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
              {headers.map(h => (
                <div key={h} className="kc-row" style={{ justifyContent: "space-between", background: "var(--panel-2)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                  <span style={{ fontWeight: 500, fontSize: "var(--text-sm)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }} title={h}>
                    {h}
                  </span>
                  <select 
                    className="kc-select" 
                    value={fieldMap[h] || ""} 
                    onChange={e => setFieldMap({ ...fieldMap, [h]: e.target.value })}
                    style={{ width: 220, minHeight: 30, padding: "2px 8px", fontSize: "var(--text-xs)" }}
                  >
                    <option value="">-- Пропустити --</option>
                    {FIELD_OPTIONS[entityType]?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {error && <div style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)" }}>{error}</div>}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setStep(1)}>Назад</button>
              <button className="kc-btn kc-btn-primary" disabled={importing} onClick={handleRunImport}>
                {importing ? "Імпортування..." : "Запустити імпорт"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && results && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(95, 184, 122, 0.1)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-lg)", padding: 16, textAlign: "center" }}>
                <div style={{ color: "var(--color-success)", fontSize: 28, fontWeight: 700 }}>
                  {results.successCount}
                </div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 500 }}>
                  Імпортовано успішно
                </span>
              </div>
              <div style={{ background: results.failCount > 0 ? "rgba(217, 108, 108, 0.1)" : "var(--panel-2)", border: results.failCount > 0 ? "1px solid var(--color-danger)" : "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 16, textAlign: "center" }}>
                <div style={{ color: results.failCount > 0 ? "var(--color-danger)" : "var(--faint)", fontSize: 28, fontWeight: 700 }}>
                  {results.failCount}
                </div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 500 }}>
                  Помилок імпорту
                </span>
              </div>
            </div>

            {results.errors?.length > 0 && (
              <div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", fontWeight: 600 }}>
                  Звіт про помилки:
                </span>
                <div style={{ 
                  background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", 
                  padding: 10, maxHeight: 150, overflowY: "auto", fontSize: "var(--text-xs)", color: "var(--dim)", 
                  marginTop: 6, fontFamily: "var(--font-mono)", display: "flex", flexDirection: "column", gap: 4 
                }}>
                  {results.errors.map((err, idx) => (
                    <div key={idx} style={{ color: "var(--color-danger)" }}>• {err}</div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <button className="kc-btn kc-btn-primary" onClick={onClose}>Готово</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
