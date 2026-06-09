"use client";
/* KompasCRM — Reports & Business Intelligence Panel */
import React, { useEffect, useState } from "react";
import { Spinner, EmptyState, Icon, Badge, DataTable } from "@/components/admin/ui";

const ENTITY_COLUMNS = {
  leads: [
    { value: "id", label: "ID" },
    { value: "source", label: "Джерело" },
    { value: "name", label: "Ім'я" },
    { value: "contact", label: "Контакт" },
    { value: "message", label: "Повідомлення" },
    { value: "status", label: "Статус" },
    { value: "assigned_to", label: "ID виконавця" },
    { value: "created_at", label: "Дата створення" }
  ],
  members: [
    { value: "id", label: "ID" },
    { value: "email", label: "Email" },
    { value: "full_name", label: "ПІБ" },
    { value: "phone", label: "Телефон" },
    { value: "status", label: "Статус" },
    { value: "member_no", label: "№ квитка" },
    { value: "category", label: "Категорія" },
    { value: "city", label: "Місто" },
    { value: "country", label: "Країна" },
    { value: "join_date", label: "Дата вступу" },
    { value: "dues_status", label: "Статус внесків" },
    { value: "notes", label: "Примітки" }
  ],
  deals: [
    { value: "id", label: "ID" },
    { value: "title", label: "Назва" },
    { value: "stage", label: "Етап" },
    { value: "amount", label: "Сума" },
    { value: "currency", label: "Валюта" },
    { value: "probability", label: "Ймовірність" },
    { value: "expected_close", label: "Дата закриття" },
    { value: "notes", label: "Примітки" },
    { value: "created_at", label: "Дата створення" }
  ],
  cases: [
    { value: "id", label: "ID" },
    { value: "full_name", label: "ПІБ клієнта" },
    { value: "contact", label: "Контакт" },
    { value: "case_number", label: "№ справи" },
    { value: "urzad", label: "Уженд" },
    { value: "stage", label: "Етап" },
    { value: "status", label: "Статус" },
    { value: "has_dodatek_1", label: "Має Dodatek №1" },
    { value: "has_zus_cert", label: "Має ZUS" },
    { value: "deadline_date", label: "Дедлайн" },
    { value: "notes", label: "Примітки" },
    { value: "created_at", label: "Дата створення" }
  ]
};

const AGG_FUNCS = [
  { value: "COUNT", label: "Кількість (COUNT)" },
  { value: "SUM", label: "Сума (SUM)" },
  { value: "AVG", label: "Середнє (AVG)" },
  { value: "MIN", label: "Мінімум (MIN)" },
  { value: "MAX", label: "Максимум (MAX)" }
];

const FILTER_OPS = [
  { value: "=", label: "дорівнює (=)" },
  { value: "!=", label: "не дорівнює (!=)" },
  { value: "ILIKE", label: "містить (like)" },
  { value: ">", label: "більше (>)" },
  { value: "<", label: "менше (<)" }
];

const INITIAL_CONFIG = {
  fields: [],
  groupings: [],
  aggregations: [],
  filters: []
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [activeReport, setActiveReport] = useState(null); // Currently selected report detail
  const [reportData, setReportData] = useState(null); // Loaded execution data
  const [dataLoading, setDataLoading] = useState(false);

  // Creator state
  const [creator, setCreator] = useState(null); // null | new report config

  useEffect(() => {
    loadReports();
  }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const d = await res.json();
      setReports(d.reports || []);
    } catch {
      setError("Не вдалося завантажити збережені звіти");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = async (report) => {
    setActiveReport(report);
    setReportData(null);
    setCreator(null);
    setDataLoading(true);

    try {
      const res = await fetch(`/api/admin/reports?execute=true&id=${report.id}`);
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        setReportData(d.data || []);
      }
    } catch {
      flash("Помилка при виконанні запиту звіту");
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!creator.title || !creator.entity_type) {
      flash("Вкажіть назву та джерело даних");
      return;
    }

    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creator)
      });
      const d = await res.json();
      if (d.error) {
        flash(d.error);
      } else {
        flash("Звіт успішно збережено!");
        setCreator(null);
        loadReports();
        handleSelectReport(d.report);
      }
    } catch {
      flash("Помилка при збереженні");
    }
  };

  const handleDeleteReport = async (id) => {
    if (!confirm("Ви впевнені, що хочете видалити цей звіт?")) return;
    try {
      const res = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("Звіт видалено");
        setActiveReport(null);
        setReportData(null);
        loadReports();
      }
    } catch {
      flash("Помилка при видаленні");
    }
  };

  const handleAddField = (field) => {
    const fields = creator.config.fields.includes(field)
      ? creator.config.fields.filter(f => f !== field)
      : [...creator.config.fields, field];
    setCreator({ ...creator, config: { ...creator.config, fields } });
  };

  const handleAddGrouping = (field) => {
    const groupings = creator.config.groupings.includes(field)
      ? creator.config.groupings.filter(g => g !== field)
      : [...creator.config.groupings, field];
    setCreator({ ...creator, config: { ...creator.config, groupings } });
  };

  const handleAddFilter = () => {
    const filters = [...creator.config.filters, { field: "", op: "=", val: "" }];
    setCreator({ ...creator, config: { ...creator.config, filters } });
  };

  const handleRemoveFilter = (idx) => {
    const filters = creator.config.filters.filter((_, i) => i !== idx);
    setCreator({ ...creator, config: { ...creator.config, filters } });
  };

  const handleFilterChange = (idx, key, val) => {
    const filters = creator.config.filters.map((f, i) => i === idx ? { ...f, [key]: val } : f);
    setCreator({ ...creator, config: { ...creator.config, filters } });
  };

  const handleAddAggregation = () => {
    const aggregations = [...creator.config.aggregations, { func: "COUNT", field: "*" }];
    setCreator({ ...creator, config: { ...creator.config, aggregations } });
  };

  const handleRemoveAggregation = (idx) => {
    const aggregations = creator.config.aggregations.filter((_, i) => i !== idx);
    setCreator({ ...creator, config: { ...creator.config, aggregations } });
  };

  const handleAggregationChange = (idx, key, val) => {
    const aggregations = creator.config.aggregations.map((a, i) => i === idx ? { ...a, [key]: val } : a);
    setCreator({ ...creator, config: { ...creator.config, aggregations } });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "var(--space-lg)", alignItems: "start" }}>
      
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 1000 }} className="kc-note">
          {toast}
        </div>
      )}

      {/* Sidebar: Saved Reports list */}
      <aside className="kc-card" style={{ padding: "var(--space-md)", position: "sticky", top: 80 }}>
        <button 
          className="kc-btn kc-btn-primary" 
          style={{ width: "100%", justifyContent: "center", marginBottom: "var(--space-md)" }}
          onClick={() => {
            setCreator({
              title: "", type: "list", entity_type: "leads", config: { ...INITIAL_CONFIG }, is_shared: false
            });
            setActiveReport(null);
            setReportData(null);
          }}
        >
          <Icon name="plus" size={16} /> Новий звіт
        </button>

        <h3 className="kc-card-cap" style={{ fontSize: 10, marginBottom: "var(--space-sm)" }}>Збережені звіти</h3>
        {loading ? (
          <Spinner />
        ) : reports.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", padding: "var(--space-md) 0" }}>
            Звітів немає
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelectReport(r)}
                style={{
                  textAlign: "left", padding: "8px 12px", border: "none", borderRadius: "var(--radius-md)",
                  background: activeReport?.id === r.id ? "var(--brass-bg)" : "transparent",
                  color: activeReport?.id === r.id ? "var(--color-primary)" : "var(--dim)",
                  fontWeight: activeReport?.id === r.id ? 600 : 500, cursor: "pointer", fontSize: "var(--text-sm)",
                  display: "flex", alignItems: "center", gap: 8, transition: "all var(--transition-fast)"
                }}
              >
                <Icon name={r.type === 'chart' ? 'activity' : 'file-text'} size={14} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{r.title}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* Main Workspace */}
      <main className="kc-card" style={{ minHeight: 600 }}>
        
        {/* Creator panel */}
        {creator && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>Конструктор звітів</h2>
              <button className="kc-btn kc-btn-ghost" onClick={() => setCreator(null)}>Скасувати</button>
            </div>

            <div className="kc-grid kc-grid-2">
              <div className="kc-field">
                <label className="kc-label">Назва звіту *</label>
                <input className="kc-input" placeholder="Наприклад: Конверсія лідів за червень" value={creator.title} onChange={e => setCreator({ ...creator, title: e.target.value })} />
              </div>
              <div className="kc-field">
                <label className="kc-label">Джерело даних *</label>
                <select className="kc-select" value={creator.entity_type} onChange={e => setCreator({ ...creator, entity_type: e.target.value, config: { ...INITIAL_CONFIG } })}>
                  <option value="leads">Ліди & Продажі</option>
                  <option value="members">Учасники Профспілки</option>
                  <option value="deals">Угоди & Продажі</option>
                  <option value="cases">Справи Клієнтів</option>
                </select>
              </div>
            </div>

            <div className="kc-field">
              <label className="kc-label">Тип звіту</label>
              <div style={{ display: "flex", gap: "var(--space-sm)", background: "var(--panel-2)", padding: 4, borderRadius: "var(--radius-md)", width: "fit-content" }}>
                {["list", "summary", "chart"].map(t => (
                  <button
                    key={t}
                    className={`kc-btn ${creator.type === t ? 'kc-btn-primary' : 'kc-btn-ghost'}`}
                    style={{ minHeight: 30, padding: "4px 12px" }}
                    onClick={() => setCreator({ ...creator, type: t })}
                  >
                    {t === "list" ? "Таблиця (List)" : t === "summary" ? "Підсумки (Summary)" : "Графік (Chart)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Selectors */}
            {creator.type === "list" ? (
              <div className="kc-field">
                <label className="kc-label">Виберіть колонки для відображення</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, background: "var(--panel-2)", padding: 12, borderRadius: "var(--radius-md)" }}>
                  {ENTITY_COLUMNS[creator.entity_type]?.map(col => {
                    const active = creator.config.fields.includes(col.value);
                    return (
                      <button
                        key={col.value}
                        type="button"
                        onClick={() => handleAddField(col.value)}
                        className="kc-btn"
                        style={{
                          fontSize: 11, minHeight: 28, padding: "2px 8px",
                          borderColor: active ? "var(--color-primary)" : "var(--border)",
                          background: active ? "var(--brass-bg)" : "var(--panel)",
                          color: active ? "var(--color-primary)" : "var(--dim)"
                        }}
                      >
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Groupings and Aggregations for summary/chart
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                
                <div className="kc-field">
                  <label className="kc-label">Групувати за стовпчиком (Group By)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, background: "var(--panel-2)", padding: 12, borderRadius: "var(--radius-md)" }}>
                    {ENTITY_COLUMNS[creator.entity_type]?.map(col => {
                      const active = creator.config.groupings.includes(col.value);
                      return (
                        <button
                          key={col.value}
                          type="button"
                          onClick={() => handleAddGrouping(col.value)}
                          className="kc-btn"
                          style={{
                            fontSize: 11, minHeight: 28, padding: "2px 8px",
                            borderColor: active ? "var(--color-primary)" : "var(--border)",
                            background: active ? "var(--brass-bg)" : "var(--panel)",
                            color: active ? "var(--color-primary)" : "var(--dim)"
                          }}
                        >
                          {col.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="kc-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label className="kc-label" style={{ margin: 0 }}>Агрегація даних (Metrics / Aggregations)</label>
                    <button className="kc-btn" style={{ minHeight: 24, fontSize: 11, padding: "2px 8px" }} onClick={handleAddAggregation}>
                      + Додати метрику
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {creator.config.aggregations.map((agg, idx) => (
                      <div key={idx} className="kc-row" style={{ gap: 8 }}>
                        <select className="kc-select" value={agg.func} onChange={e => handleAggregationChange(idx, "func", e.target.value)} style={{ width: 180, minHeight: 32, padding: 4 }}>
                          {AGG_FUNCS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                        <select className="kc-select" value={agg.field} onChange={e => handleAggregationChange(idx, "field", e.target.value)} style={{ width: 180, minHeight: 32, padding: 4 }}>
                          <option value="*">Всі рядки (*)</option>
                          {ENTITY_COLUMNS[creator.entity_type]?.map(col => (
                            <option key={col.value} value={col.value}>{col.label}</option>
                          ))}
                        </select>
                        <button className="kc-btn kc-btn-danger" style={{ minHeight: 32, padding: 6 }} onClick={() => handleRemoveAggregation(idx)}>
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom filters */}
            <div className="kc-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="kc-label" style={{ margin: 0 }}>Фільтри (Filters)</label>
                <button className="kc-btn" style={{ minHeight: 24, fontSize: 11, padding: "2px 8px" }} onClick={handleAddFilter}>
                  + Додати фільтр
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {creator.config.filters.map((f, idx) => (
                  <div key={idx} className="kc-row" style={{ gap: 8 }}>
                    <select className="kc-select" value={f.field} onChange={e => handleFilterChange(idx, "field", e.target.value)} style={{ width: 180, minHeight: 32, padding: 4 }}>
                      <option value="">-- Оберіть поле --</option>
                      {ENTITY_COLUMNS[creator.entity_type]?.map(col => (
                        <option key={col.value} value={col.value}>{col.label}</option>
                      ))}
                    </select>
                    <select className="kc-select" value={f.op} onChange={e => handleFilterChange(idx, "op", e.target.value)} style={{ width: 140, minHeight: 32, padding: 4 }}>
                      {FILTER_OPS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                    </select>
                    <input className="kc-input" placeholder="Значення" value={f.val} onChange={e => handleFilterChange(idx, "val", e.target.value)} style={{ flex: 1, minHeight: 32, padding: 4 }} />
                    <button className="kc-btn kc-btn-danger" style={{ minHeight: 32, padding: 6 }} onClick={() => handleRemoveFilter(idx)}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 20 }}>
              <button className="kc-btn kc-btn-primary" onClick={handleSaveReport}>Зберегти звіт</button>
            </div>
          </div>
        )}

        {/* View report execution details */}
        {activeReport && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-md)" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 600 }}>{activeReport.title}</h2>
                <span style={{ fontSize: 11, color: "var(--faint)" }}>
                  Тип: {activeReport.type.toUpperCase()} • Джерело: {activeReport.entity_type.toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button className="kc-btn" onClick={() => handleSelectReport(activeReport)}>
                  <Icon name="refresh" size={14} />
                </button>
                <button className="kc-btn kc-btn-danger" onClick={() => handleDeleteReport(activeReport.id)}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>

            {dataLoading ? (
              <Spinner />
            ) : !reportData ? (
              <EmptyState title="Немає даних" description="Звіт не повернув жодних рядків." icon="alert" />
            ) : (
              // Display visual results depending on type
              <div>
                {/* 1. CHART VIEW */}
                {activeReport.type === "chart" && (
                  <div style={{ background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: "var(--space-lg)", display: "flex", justifyContent: "center" }}>
                    <SVGChart data={reportData} config={activeReport.config} />
                  </div>
                )}

                {/* 2. DATA TABLE VIEW */}
                <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)" }}>Рядки звіту (Результати)</div>
                {reportData.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--faint)" }}>Порожній результат</div>
                ) : (
                  <div className="kc-table-wrap">
                    <table className="kc-table">
                      <thead>
                        <tr>
                          {Object.keys(reportData[0]).map(key => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className={typeof val === 'number' ? 'kc-mono' : ''}>
                                {val === null || val === undefined ? "—" : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Unselected Default View */}
        {!creator && !activeReport && (
          <EmptyState 
            title="Оберіть або створіть звіт" 
            description="Використовуйте конструктор звітів для аналізу лідів, членських внесків, угод та справ клієнтів."
            icon="activity"
          />
        )}
      </main>
    </div>
  );
}


/* Custom premium responsive SVG Charts renderer */
function SVGChart({ data, config }) {
  if (!data || data.length === 0) return null;

  const groupings = config.groupings || [];
  if (groupings.length === 0) {
    return <div style={{ fontSize: 12, color: "var(--faint)" }}>Додайте Group By стовпчик в звіт для побудови графіків</div>;
  }

  const groupKey = groupings[0];
  // Find aggregation keys (all keys that are not the group key)
  const valueKeys = Object.keys(data[0]).filter(k => k !== groupKey);
  
  if (valueKeys.length === 0) return null;
  const valKey = valueKeys[0];

  const labels = data.map(d => String(d[groupKey] || "—"));
  const values = data.map(d => Number(d[valKey]) || 0);

  const maxVal = Math.max(...values, 10);
  const chartHeight = 220;
  const chartWidth = 560;
  const padding = 40;
  
  const width = chartWidth - padding * 2;
  const height = chartHeight - padding * 2;

  // Render Line Chart
  const points = values.map((val, idx) => {
    const x = padding + (idx * (width / Math.max(values.length - 1, 1)));
    const y = padding + height - (val / maxVal) * height;
    return `${x},${y}`;
  });

  return (
    <div style={{ width: "100%", maxWidth: chartWidth }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
          const y = padding + height - p * height;
          const gridVal = Math.round(p * maxVal);
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <text x={padding - 8} y={y + 4} fill="var(--faint)" fontSize="9" textAnchor="end" className="kc-mono">{gridVal}</text>
            </g>
          );
        })}

        {/* Render columns (Bar Chart bars) */}
        {values.map((val, idx) => {
          const barWidth = Math.max(6, (width / values.length) * 0.5);
          const x = padding + (idx * (width / values.length)) + (width / values.length) * 0.25;
          const y = padding + height - (val / maxVal) * height;
          const barHeight = (val / maxVal) * height;
          return (
            <g key={idx}>
              <rect 
                x={x} 
                y={y} 
                width={barWidth} 
                height={Math.max(barHeight, 2)} 
                fill="var(--color-primary)" 
                rx="2"
                opacity="0.85"
              />
              <text x={x + barWidth/2} y={chartHeight - padding + 14} fill="var(--dim)" fontSize="8" textAnchor="middle">
                {labels[idx].substring(0, 10)}
              </text>
            </g>
          );
        })}

        {/* Connecting line */}
        {values.length > 1 && (
          <polyline points={points.join(" ")} fill="none" stroke="var(--color-info)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}
