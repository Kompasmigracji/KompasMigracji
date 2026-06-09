"use client";
/* KompasCRM — Enterprise Audit Log Viewer */
import React, { useEffect, useState } from "react";
import { Spinner, EmptyState, Icon, Badge, DataTable } from "@/components/admin/ui";

export default function AuditLogPage() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit")
      .then(res => res.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setLogs(d.logs || []);
      })
      .catch(() => setError("Не вдалося завантажити аудит-логи"));
  }, []);

  const handleExportCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) return;
    
    // Header
    let csv = "ID,Date,Actor,Email,Action,Entity,Entity ID,Meta\n";
    
    // Rows
    filteredLogs.forEach(row => {
      const date = new Date(row.created_at).toISOString();
      const actor = (row.actor_name || "System").replace(/"/g, '""');
      const email = (row.actor_email || "").replace(/"/g, '""');
      const action = (row.action || "").replace(/"/g, '""');
      const entity = (row.entity || "").replace(/"/g, '""');
      const entityId = row.entity_id || "";
      const meta = JSON.stringify(row.meta || {}).replace(/"/g, '""');
      
      csv += `${row.id},"${date}","${actor}","${email}","${action}","${entity}","${entityId}","${meta}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kompascrm_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = (logs || []).filter(row => {
    // 1. Search
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      (row.actor_name || "").toLowerCase().includes(term) ||
      (row.actor_email || "").toLowerCase().includes(term) ||
      (row.entity || "").toLowerCase().includes(term) ||
      (row.action || "").toLowerCase().includes(term);

    // 2. Action
    const matchesAction = !actionFilter || row.action === actionFilter;

    // 3. Entity
    const matchesEntity = !entityFilter || row.entity === entityFilter;

    // 4. Date range
    let matchesDate = true;
    if (startDate) {
      const start = new Date(startDate).getTime();
      const current = new Date(row.created_at).getTime();
      if (current < start) matchesDate = false;
    }
    if (endDate) {
      // Add 1 day to end date to include whole day
      const end = new Date(endDate).getTime() + 86400000;
      const current = new Date(row.created_at).getTime();
      if (current > end) matchesDate = false;
    }

    return matchesSearch && matchesAction && matchesEntity && matchesDate;
  });

  const columns = [
    { 
      header: "Дата та час", 
      cell: (row) => (
        <span className="kc-mono" style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
          {new Date(row.created_at).toLocaleString("uk-UA")}
        </span>
      ) 
    },
    { 
      header: "Користувач", 
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{row.actor_name || "Система"}</div>
          <div style={{ fontSize: "10px", color: "var(--dim)" }}>{row.actor_email || "system@primus.local"}</div>
        </div>
      ) 
    },
    { 
      header: "Дія", 
      cell: (row) => {
        let badgeStatus = "dim";
        const act = row.action?.toUpperCase() || "";
        if (act.includes("CREATE") || act.includes("INSERT")) badgeStatus = "green";
        else if (act.includes("UPDATE") || act.includes("PATCH") || act.includes("PUT") || act.includes("EDIT")) badgeStatus = "brass";
        else if (act.includes("DELETE") || act.includes("REMOVE")) badgeStatus = "red";
        else if (act.includes("LOGIN")) badgeStatus = "blue";
        return <Badge status={badgeStatus} text={row.action} />;
      }
    },
    { 
      header: "Об'єкт / Сутність", 
      cell: (row) => (
        <span>
          <strong style={{ fontSize: "var(--text-xs)" }}>{row.entity?.toUpperCase()}</strong>{" "}
          {row.entity_id && <span style={{ color: "var(--dim)", fontSize: 10 }}>#{row.entity_id}</span>}
        </span>
      )
    },
    { 
      header: "Деталі зміни", 
      cell: (row) => (
        <button 
          className="kc-btn" 
          onClick={() => setSelectedLog(row)}
          style={{ padding: "4px 8px", fontSize: "11px", minHeight: 24 }}
          disabled={!row.meta}
        >
          <Icon name="search" size={12} /> Переглянути
        </button>
      )
    }
  ];

  // Get unique entities for filter select
  const uniqueEntities = Array.from(new Set((logs || []).map(r => r.entity).filter(Boolean)));
  const uniqueActions = Array.from(new Set((logs || []).map(r => r.action).filter(Boolean)));

  return (
    <div style={{ display: "grid", gridTemplateColumns: selectedLog ? "1fr 360px" : "1fr", gap: "var(--space-lg)", alignItems: "start" }}>
      
      {/* List Workdesk */}
      <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 className="kc-h2" style={{ margin: 0 }}>Журнал аудиту системи (Telemetry)</h2>
            <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
              Лог усіх критичних змін та модифікацій даних у KompasCRM. Відповідає вимогам GDPR/RODO.
            </p>
          </div>
          <button className="kc-btn kc-btn-ghost" onClick={handleExportCSV} disabled={!filteredLogs.length}>
            <Icon name="download" size={16} /> Експорт у CSV
          </button>
        </div>

        {/* Filter controls panel */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, background: "var(--panel-2)", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <div className="kc-field" style={{ margin: 0 }}>
            <label className="kc-label" style={{ fontSize: 10 }}>Пошук за ключем</label>
            <input className="kc-input" style={{ minHeight: 30, fontSize: 12 }} placeholder="Ім'я, email, дія..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="kc-field" style={{ margin: 0 }}>
            <label className="kc-label" style={{ fontSize: 10 }}>Фільтр дії</label>
            <select className="kc-select" style={{ minHeight: 30, fontSize: 12, padding: "0 8px" }} value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option value="">Усі дії</option>
              {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="kc-field" style={{ margin: 0 }}>
            <label className="kc-label" style={{ fontSize: 10 }}>Сутність</label>
            <select className="kc-select" style={{ minHeight: 30, fontSize: 12, padding: "0 8px" }} value={entityFilter} onChange={e => setEntityFilter(e.target.value)}>
              <option value="">Усі сутності</option>
              {uniqueEntities.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="kc-field" style={{ margin: 0 }}>
            <label className="kc-label" style={{ fontSize: 10 }}>Дата з</label>
            <input type="date" className="kc-input" style={{ minHeight: 30, fontSize: 12 }} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <div className="kc-field" style={{ margin: 0 }}>
            <label className="kc-label" style={{ fontSize: 10 }}>Дата по</label>
            <input type="date" className="kc-input" style={{ minHeight: 30, fontSize: 12 }} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        {error ? (
          <div className="kc-error"><Icon name="alert" size={18} /> {error}</div>
        ) : !logs ? (
          <Spinner />
        ) : filteredLogs.length === 0 ? (
          <EmptyState title="Аудит-логи не знайдені" description="Жодних дій не зареєстровано за обраними критеріями." icon="file-text" />
        ) : (
          <DataTable columns={columns} data={filteredLogs} />
        )}
      </div>

      {/* Slide-over Side Drawer Panel */}
      {selectedLog && (
        <div className="kc-card" style={{ background: "var(--panel-2)", border: "1px solid var(--border)", padding: "var(--space-md)", minHeight: 600, display: "flex", flexDirection: "column", gap: "var(--space-md)", position: "sticky", top: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="file-text" size={16} /> Деталі запису аудиту
            </h3>
            <button className="kc-btn" style={{ padding: 4, minHeight: 24 }} onClick={() => setSelectedLog(null)}>
              <Icon name="x" size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "var(--text-xs)" }}>
            <div>
              <span style={{ color: "var(--dim)" }}>ID Запису:</span>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{selectedLog.id}</div>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>Час:</span>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{new Date(selectedLog.created_at).toLocaleString("uk-UA")}</div>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>Оператор:</span>
              <div style={{ fontWeight: 600, marginTop: 2 }}>
                {selectedLog.actor_name || "Система"} ({selectedLog.actor_email || "system@primus.local"})
              </div>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>Дія:</span>
              <div style={{ marginTop: 2 }}><Badge status="blue" text={selectedLog.action} /></div>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>Сутність / ID:</span>
              <div style={{ fontWeight: 600, marginTop: 2 }}>
                {selectedLog.entity?.toUpperCase()} #{selectedLog.entity_id || "N/A"}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Дані події (JSON Payload):</span>
            <pre style={{
              flex: 1, padding: 12, background: "var(--panel)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", fontSize: 11, fontFamily: "var(--font-mono)",
              lineHeight: 1.5, overflow: "auto", whiteSpace: "pre-wrap", margin: 0, maxHeight: 300
            }}>
              {JSON.stringify(selectedLog.meta, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
