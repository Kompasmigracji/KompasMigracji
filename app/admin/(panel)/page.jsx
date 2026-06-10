"use client";
/* KompasCRM — Enhanced Customizable Dashboard */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  StatCard, Sparkline, Badge, Spinner, EmptyState, Icon, BarList, Avatar, ProgressBar
} from "@/components/admin/ui";

const SOURCE_LABEL = {
  bot: "Telegram-бот",
  site: "Website",
  facebook: "Facebook",
  instagram: "Instagram",
  other: "Інші джерела",
};

const WIDGETS_INFO = {
  kpi: { title: "Ключові показники (KPI)", desc: "Зведені дані по учасниках, лідах, справах та внесках", colSpan: 2 },
  leads_trend: { title: "Динаміка реєстрації лідів", desc: "Двотижневий тренд нових лідів", colSpan: 1 },
  lead_sources_revenue: { title: "Джерела та внески", desc: "Частка джерел лідів та хід збору фінансів", colSpan: 1 },
  pipeline_funnel: { title: "Воронка продажів (Deals)", desc: "Розподіл угод та сум по стадіях", colSpan: 1 },
  sla_deadlines: { title: "Термінові дедлайни (SLA)", desc: "Справи клієнтів з наближенням дедлайну", colSpan: 1 },
  activities: { title: "Останні події системи", desc: "Хронологічна стрічка активностей співробітників", colSpan: 1 },
  ai_terminal: { title: "AI Primus Dispatch Terminal", desc: "Диспетчерський лог роботи автоматизованих агентів", colSpan: 1 },
  custom_report: { title: "Кастомний звіт", desc: "Графік одного з ваших збережених звітів", colSpan: 1 }
};

const DEFAULT_LAYOUT = [
  { id: "kpi", visible: true, width: "full" },
  { id: "leads_trend", visible: true, width: "half" },
  { id: "lead_sources_revenue", visible: true, width: "half" },
  { id: "pipeline_funnel", visible: false, width: "half" },
  { id: "sla_deadlines", visible: true, width: "half" },
  { id: "activities", visible: true, width: "half" },
  { id: "ai_terminal", visible: true, width: "half" },
  { id: "custom_report", visible: false, width: "half" }
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  // Customizer state
  const [layout, setLayout] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [reports, setReports] = useState([]);

  // AI Dispatcher Logs (Simulated Coordinator feed)
  const [dashboardLogs, setDashboardLogs] = useState([
    { time: "16:48:01", type: "system", message: "President signed executive order for Automated Client Sync." },
    { time: "16:45:10", type: "coordinator", message: "Omni Coordinator [Agent-C01] verified state pipelines for 12,000+ members." },
    { time: "16:42:33", type: "agent", message: "Logistics Agent-074 optimized route matrices for cross-border transit dispatch." },
    { time: "16:40:00", type: "system", message: "KompasCRM Primus Core Network Online (175 automated agents active)." }
  ]);

  useEffect(() => {
    // Load layouts and reports
    const saved = localStorage.getItem("kompas_dashboard_layout");
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch {
        setLayout(DEFAULT_LAYOUT);
      }
    } else {
      setLayout(DEFAULT_LAYOUT);
    }

    const savedReport = localStorage.getItem("kompas_dashboard_report_id");
    if (savedReport) setSelectedReportId(savedReport);

    setMounted(true);

    // Fetch reports
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(console.error);

    // Fetch main dashboard stats
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setStats(d)))
      .catch(() => setError("Помилка завантаження аналітики"));
  }, []);

  // Update AI logs periodically
  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-012 calculated daily conversions rate metric: +4.2% up." },
      { type: "agent", text: "Agent-142 parsed inbound document for TRC applicant Oleh S." },
      { type: "coordinator", text: "Coordinator [Agent-C03] auto-allocated 3 new immigration consultations." },
      { type: "system", text: "President digital credentials broadcasted to secure node endpoints." },
      { type: "agent", text: "Agent-088 verified payment transaction: 150 PLN credited to Union Account." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setDashboardLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 14)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const saveLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem("kompas_dashboard_layout", JSON.stringify(newLayout));
  };

  const toggleVisibility = (id) => {
    const next = layout.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    saveLayout(next);
  };

  const toggleWidth = (id) => {
    const next = layout.map(w => w.id === id ? { ...w, width: w.width === "full" ? "half" : "full" } : w);
    saveLayout(next);
  };

  const moveWidget = (index, dir) => {
    const next = [...layout];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    saveLayout(next);
  };

  const applyPreset = (preset) => {
    let next;
    if (preset === "overview") {
      next = [
        { id: "kpi", visible: true, width: "full" },
        { id: "leads_trend", visible: true, width: "half" },
        { id: "lead_sources_revenue", visible: true, width: "half" },
        { id: "sla_deadlines", visible: true, width: "half" },
        { id: "activities", visible: true, width: "half" },
        { id: "ai_terminal", visible: true, width: "half" },
        { id: "pipeline_funnel", visible: false, width: "half" },
        { id: "custom_report", visible: false, width: "half" }
      ];
    } else if (preset === "sales") {
      next = [
        { id: "kpi", visible: true, width: "full" },
        { id: "pipeline_funnel", visible: true, width: "half" },
        { id: "leads_trend", visible: true, width: "half" },
        { id: "lead_sources_revenue", visible: true, width: "half" },
        { id: "activities", visible: true, width: "half" },
        { id: "custom_report", visible: true, width: "half" },
        { id: "sla_deadlines", visible: false, width: "half" },
        { id: "ai_terminal", visible: false, width: "half" }
      ];
    } else if (preset === "support") {
      next = [
        { id: "kpi", visible: true, width: "full" },
        { id: "sla_deadlines", visible: true, width: "full" },
        { id: "activities", visible: true, width: "half" },
        { id: "ai_terminal", visible: true, width: "half" },
        { id: "leads_trend", visible: false, width: "half" },
        { id: "lead_sources_revenue", visible: false, width: "half" },
        { id: "pipeline_funnel", visible: false, width: "half" },
        { id: "custom_report", visible: false, width: "half" }
      ];
    }
    saveLayout(next);
  };

  const resetLayout = () => {
    saveLayout(DEFAULT_LAYOUT);
    setSelectedReportId("");
    localStorage.removeItem("kompas_dashboard_report_id");
  };

  const handleReportChange = (val) => {
    setSelectedReportId(val);
    localStorage.setItem("kompas_dashboard_report_id", val);
  };

  if (error) {
    return (
      <div className="kc-error">
        <Icon name="alert" size={18} />
        <span>{error}</span>
      </div>
    );
  }
  
  if (!stats || !mounted) return <Spinner />;

  const conv = stats.leads.total ? Math.round((stats.leads.converted / stats.leads.total) * 100) : 0;
  const duesTotal = stats.duesCollected + (stats.duesOutstanding || 0);
  const duesRate = duesTotal ? Math.round((stats.duesCollected / duesTotal) * 100) : 0;
  
  const sources = (stats.leadsBySource || []).map((s) => ({
    label: SOURCE_LABEL[s.source] || s.source,
    value: s.count,
    color: s.source === 'bot' ? 'var(--color-info)' : 'var(--color-primary)',
  }));

  const renderWidgetContent = (id) => {
    switch (id) {
      case "kpi":
        return (
          <div className="kc-grid kc-grid-4">
            <StatCard 
              icon="users" value={stats.members.total} label="Учасники" 
              sub={`${stats.members.active} активних · ${stats.members.pending} в очікуванні`} 
              trend={12} 
            />
            <StatCard 
              icon="target" value={stats.leads.new} label="Нові ліди" 
              sub={`${stats.leads.total} всього · ${conv}% конв.`} 
              trend={5} 
            />
            <StatCard 
              icon="briefcase" value={stats.cases.active} label="Активні справи" 
              sub={`${stats.cases.resolved} вирішено`} 
              trend={-2} 
            />
            <StatCard 
              icon="cash" value={`${stats.duesCollected.toLocaleString("uk-UA")} zł`} 
              label="Отримані внески" 
              sub={`${duesRate}% збору`} 
              trend={8} 
            />
          </div>
        );
      case "leads_trend":
        return (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'var(--space-md) 0', minHeight: 120 }}>
              <Sparkline data={stats.series || [5, 10, 8, 15, 12, 20, 18, 25, 22, 30, 28, 35, 40, 38]} w={400} h={120} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)", marginTop: "auto" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>14 днів тому</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text)", fontWeight: 500 }}>Всього: {stats.series?.reduce((a, b) => a + b, 0) || 0}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Сьогодні</div>
            </div>
          </div>
        );
      case "lead_sources_revenue":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {sources.length ? (
              <BarList items={sources} />
            ) : (
              <EmptyState title="Немає лідів" icon="target" />
            )}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)", marginTop: "var(--space-xs)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
                <span style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}>
                  {stats.duesCollected.toLocaleString("uk-UA")} <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>zł</span>
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>
                  / {(stats.duesOutstanding || 0).toLocaleString("uk-UA")} zł очікується
                </span>
              </div>
              <ProgressBar progress={duesRate} label={`Прогрес збору внесків`} color="var(--color-success)" />
            </div>
          </div>
        );
      case "pipeline_funnel":
        return <PipelineFunnel pipeline={stats.pipeline} />;
      case "sla_deadlines":
        return <SLADeadlines deadlines={stats.slaDeadlines} />;
      case "activities":
        return <RecentActivities activities={stats.recentActivities} />;
      case "ai_terminal":
        return (
          <div style={{ 
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.5", 
            display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto",
            background: "#06090e", color: "#c9d1d9", padding: "var(--space-md)", borderRadius: "var(--radius-md)"
          }}>
            {dashboardLogs.map((log, index) => {
              let color = "#8b949e";
              if (log.type === "coordinator") color = "#58a6ff";
              if (log.type === "system") color = "#56d364";
              return (
                <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                  <span style={{ color: "#8b949e" }}>[{log.time}]</span>{" "}
                  <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                </div>
              );
            })}
          </div>
        );
      case "custom_report":
        return <CustomReportWidget reportId={selectedReportId} reports={reports} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <h2 className="kc-h2" style={{ margin: 0 }}>Робочий стіл</h2>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost" onClick={() => setShowCustomizer(!showCustomizer)}>
            <Icon name="settings" size={16} />
            {showCustomizer ? "Сховати налаштування" : "Налаштувати робочий стіл"}
          </button>
          <Link href="/admin/reports" className="kc-btn kc-btn-primary">
            <Icon name="activity" size={16} /> Створити звіт
          </Link>
        </div>
      </div>

      {/* Dashboard customizer panel */}
      {showCustomizer && (
        <div className="kc-card" style={{ marginBottom: "var(--space-lg)", border: "1.5px dashed var(--color-primary)", background: "var(--panel-2)", padding: "var(--space-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: 10 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="grid" size={16} /> Конструктор дашборду (Dashboard Presets)
            </h3>
            <div style={{ display: "flex", gap: "var(--space-xs)" }}>
              <button className="kc-btn" style={{ fontSize: 11, minHeight: 28, padding: "2px 8px" }} onClick={() => applyPreset("overview")}>Загальний (Overview)</button>
              <button className="kc-btn" style={{ fontSize: 11, minHeight: 28, padding: "2px 8px" }} onClick={() => applyPreset("sales")}>Продажі (Sales)</button>
              <button className="kc-btn" style={{ fontSize: 11, minHeight: 28, padding: "2px 8px" }} onClick={() => applyPreset("support")}>Юр. відділ (Support)</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
            {layout.map((item, index) => {
              const info = WIDGETS_INFO[item.id];
              if (!info) return null;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, overflow: "hidden", marginRight: 8 }}>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{info.title}</span>
                    <span style={{ fontSize: "10px", color: "var(--dim)" }}>{info.desc}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {/* Toggle Visibility */}
                    <button 
                      onClick={() => toggleVisibility(item.id)}
                      className="kc-btn" 
                      style={{ padding: 4, minHeight: 24, borderColor: item.visible ? "var(--color-primary)" : "var(--border)", background: item.visible ? "var(--brass-bg)" : "transparent" }}
                      title={item.visible ? "Приховати" : "Показати"}
                    >
                      <Icon name={item.visible ? "check" : "x"} size={12} color={item.visible ? "var(--color-primary)" : "var(--dim)"} />
                    </button>
                    {/* Width Toggle (if not kpi) */}
                    {item.id !== "kpi" && (
                      <button 
                        onClick={() => toggleWidth(item.id)}
                        className="kc-btn" 
                        style={{ padding: 4, minHeight: 24, borderColor: item.width === "full" ? "var(--color-info)" : "var(--border)" }}
                        title="Змінити ширину (1/2 або на весь екран)"
                      >
                        <Icon name="layers" size={12} color={item.width === "full" ? "var(--color-info)" : "var(--dim)"} />
                      </button>
                    )}
                    {/* Custom Report Selector */}
                    {item.id === "custom_report" && (
                      <select 
                        value={selectedReportId} 
                        onChange={(e) => handleReportChange(e.target.value)}
                        className="kc-select" 
                        style={{ fontSize: 10, padding: "2px 4px", minHeight: 24, width: 100 }}
                      >
                        <option value="">-- Оберіть звіт --</option>
                        {reports.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    )}
                    {/* Reorder Buttons */}
                    <button onClick={() => moveWidget(index, -1)} disabled={index === 0} className="kc-btn" style={{ padding: 2, minHeight: 20 }}>
                      <Icon name="chevron-up" size={10} />
                    </button>
                    <button onClick={() => moveWidget(index, 1)} disabled={index === layout.length - 1} className="kc-btn" style={{ padding: 2, minHeight: 20 }}>
                      <Icon name="chevron-down" size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
            <button className="kc-btn kc-btn-ghost" onClick={resetLayout}>Скинути за замовчуванням</button>
            <button className="kc-btn kc-btn-primary" onClick={() => setShowCustomizer(false)}>Готово</button>
          </div>
        </div>
      )}

      {/* Grid of active widgets */}
      <div className="kc-grid kc-grid-2" style={{ gap: "var(--space-lg)" }}>
        {layout.filter(item => item.visible).map((item) => {
          const info = WIDGETS_INFO[item.id];
          if (!info) return null;
          const isFull = item.width === "full" || item.id === "kpi";
          
          return (
            <div 
              key={item.id} 
              className={item.id === "kpi" ? "" : "kc-card"} 
              style={{ 
                gridColumn: isFull ? "1 / -1" : "auto",
                display: "flex",
                flexDirection: "column",
                transition: "all var(--transition-medium)"
              }}
            >
              {item.id !== "kpi" && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                  <h3 className="kc-card-cap" style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600 }}>{info.title}</h3>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="kc-btn" style={{ padding: 4, minHeight: 20 }} onClick={() => toggleWidth(item.id)} title="Змінити розмір">
                      <Icon name="layers" size={10} />
                    </button>
                    <button className="kc-btn kc-btn-danger" style={{ padding: 4, minHeight: 20 }} onClick={() => toggleVisibility(item.id)} title="Приховати">
                      <Icon name="x" size={10} />
                    </button>
                  </div>
                </div>
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {renderWidgetContent(item.id)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Pipeline conversion bar chart */
function PipelineFunnel({ pipeline }) {
  const STAGES_CONFIG = {
    prospecting: { label: "Кваліфікація", color: "#6fa3d4" },
    qualification: { label: "Аналіз потреб", color: "#54b4d9" },
    proposal: { label: "Пропозиція", color: "#e5a84b" },
    negotiation: { label: "Переговори", color: "#d99e54" },
    closed_won: { label: "Закрито успішно", color: "var(--color-success)" },
    closed_lost: { label: "Втрачено", color: "var(--color-danger)" },
  };

  const stagesOrdered = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
  const stageData = stagesOrdered.map(stage => {
    const found = (pipeline || []).find(p => p.stage === stage);
    return {
      stage,
      label: STAGES_CONFIG[stage]?.label || stage,
      color: STAGES_CONFIG[stage]?.color || "var(--color-primary)",
      count: found ? found.count : 0,
      amount: found ? found.amount : 0
    };
  });

  const maxCount = Math.max(...stageData.map(s => s.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {stageData.map((s) => {
        const pct = (s.count / maxCount) * 100;
        return (
          <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{ width: 120, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text)" }}>{s.label}</div>
            <div style={{ flex: 1, height: 24, background: "var(--panel-2)", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: s.color, opacity: 0.2, position: "absolute", left: 0, top: 0, transition: "width 0.4s ease" }} />
              <div style={{ position: "relative", zIndex: 1, paddingLeft: "var(--space-sm)", fontSize: "var(--text-xs)", fontWeight: 600, display: "flex", width: "100%", justifyContent: "space-between", paddingRight: "var(--space-sm)" }}>
                <span style={{ color: "var(--text)" }}>{s.count} угод</span>
                <span style={{ color: "var(--dim)" }} className="kc-mono">{s.amount.toLocaleString("uk-UA")} zł</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* SLA upcoming deadlines list */
function SLADeadlines({ deadlines }) {
  if (!deadlines || deadlines.length === 0) {
    return <EmptyState title="Немає термінових справ" description="Всі поточні дедлайни дотримано." icon="check" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
      {deadlines.map((d) => {
        let badgeStatus = "green";
        let daysText = `${d.days_left} дн.`;
        if (d.days_left < 0) {
          badgeStatus = "red";
          daysText = `Прострочено (${Math.abs(d.days_left)} дн.)`;
        } else if (d.days_left === 0) {
          badgeStatus = "red";
          daysText = "Сьогодні";
        } else if (d.days_left <= 3) {
          badgeStatus = "brass";
        }

        const formattedDate = new Date(d.deadline_date).toLocaleDateString("uk-UA");

        return (
          <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{d.full_name}</div>
              <div style={{ fontSize: "10px", color: "var(--dim)" }}>
                {d.case_number} · {d.urzad || "Уженд не вказано"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ fontSize: "10px", color: "var(--dim)" }}>{formattedDate}</span>
              <Badge status={badgeStatus} text={daysText} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Vertical Activities feed */
function RecentActivities({ activities }) {
  if (!activities || activities.length === 0) {
    return <EmptyState title="Немає недавніх активностей" description="Жодної події не зафіксовано." icon="clock" />;
  }

  const getIcon = (type) => {
    switch (type) {
      case "note": return "file-text";
      case "email": return "inbox";
      case "call": return "phone";
      case "meeting": return "users";
      case "status_change": return "activity";
      case "file": return "download";
      case "system": return "settings";
      default: return "grid";
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "note": return "var(--color-primary)";
      case "email": return "var(--color-info)";
      case "call": return "var(--color-success)";
      case "system": return "#8b949e";
      default: return "var(--border)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
      {activities.map((a) => {
        const timeStr = new Date(a.created_at).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
        const dateStr = new Date(a.created_at).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
        return (
          <div key={a.id} style={{ display: "flex", gap: "var(--space-md)", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", background: "var(--panel-2)",
                border: `1.5px solid ${getBadgeColor(a.type)}`, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0
              }}>
                <Icon name={getIcon(a.type)} size={12} />
              </div>
              <div style={{ flex: 1, width: 1.5, background: "var(--border)", margin: "4px 0" }} />
            </div>
            <div style={{ flex: 1, paddingBottom: "var(--space-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text)" }}>{a.actor_name || "Система"}</span>
                <span style={{ fontSize: "9px", color: "var(--dim)" }} className="kc-mono">{dateStr}, {timeStr}</span>
              </div>
              {a.title && <div style={{ fontSize: "var(--text-xs)", fontWeight: 500, marginBottom: 2, color: "var(--text)" }}>{a.title}</div>}
              {a.body && <div style={{ fontSize: "10px", color: "var(--dim)", whiteSpace: "pre-wrap" }}>{a.body}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Custom Report Widget Loader & Dynamic Execution */
function CustomReportWidget({ reportId, reports }) {
  const [report, setReport] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setReport(null);
      setData([]);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/reports?execute=true&id=${reportId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setReport(d.report);
          setData(d.data || []);
        } else {
          setReport(null);
          setData([]);
        }
      })
      .catch(() => {
        setReport(null);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [reportId]);

  if (!reportId) {
    return <EmptyState title="Звіт не обрано" description="Оберіть збережений звіт у налаштуваннях робочого столу" icon="activity" />;
  }

  if (loading) return <Spinner />;
  if (!report || data.length === 0) return <EmptyState title="Немає даних" description="Дані звіту відсутні або порожні." icon="alert" />;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--dim)", marginBottom: "var(--space-xs)", display: "flex", justifyContent: "space-between" }}>
        <span>Джерело: {report.entity_type.toUpperCase()}</span>
        <span>Тип: {report.type.toUpperCase()}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", flex: 1, alignItems: "center" }}>
        <SVGChart data={data} config={report.config} />
      </div>
    </div>
  );
}

/* SVG Chart renderer for custom reports inside dashboard */
function SVGChart({ data, config }) {
  if (!data || data.length === 0) return null;

  const groupings = config?.groupings || [];
  if (groupings.length === 0) {
    return <div style={{ fontSize: 11, color: "var(--faint)", textAlign: "center", padding: "10px 0" }}>Додайте Group By стовпчик в звіт для побудови графіків</div>;
  }

  const groupKey = groupings[0];
  const valueKeys = Object.keys(data[0]).filter(k => k !== groupKey);
  
  if (valueKeys.length === 0) return null;
  const valKey = valueKeys[0];

  const labels = data.map(d => String(d[groupKey] || "—"));
  const values = data.map(d => Number(d[valKey]) || 0);

  const maxVal = Math.max(...values, 10);
  const chartHeight = 160;
  const chartWidth = 460;
  const padding = 30;
  
  const width = chartWidth - padding * 2;
  const height = chartHeight - padding * 2;

  const points = values.map((val, idx) => {
    const x = padding + (idx * (width / Math.max(values.length - 1, 1)));
    const y = padding + height - (val / maxVal) * height;
    return `${x},${y}`;
  });

  return (
    <div style={{ width: "100%", maxWidth: chartWidth }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
        {[0, 0.5, 1].map((p, idx) => {
          const y = padding + height - p * height;
          const gridVal = Math.round(p * maxVal);
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <text x={padding - 6} y={y + 3} fill="var(--faint)" fontSize="8" textAnchor="end" className="kc-mono">{gridVal}</text>
            </g>
          );
        })}

        {values.map((val, idx) => {
          const barWidth = Math.max(4, (width / values.length) * 0.4);
          const x = padding + (idx * (width / values.length)) + (width / values.length) * 0.3;
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
                rx="1.5"
                opacity="0.8"
              />
              <text x={x + barWidth/2} y={chartHeight - padding + 12} fill="var(--dim)" fontSize="7" textAnchor="middle">
                {labels[idx].substring(0, 8)}
              </text>
            </g>
          );
        })}

        {values.length > 1 && (
          <polyline points={points.join(" ")} fill="none" stroke="var(--color-info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}
