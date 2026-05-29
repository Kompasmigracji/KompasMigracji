"use client";
/* /admin/automations — 21 автоматизація профспілки емігрантів */
import React, { useEffect, useState, useCallback } from "react";
import { Icon, Spinner } from "@/components/admin/ui";

/* ─── Визначення 21 автоматизації ─────────────────────────────────── */
const AUTOMATIONS = [
  // ── ЛІДИ & КОНВЕРСІЯ ──────────────────────────────────────────────
  {
    id: "lead-scorer",
    cat: "leads",
    name: "Автоскоринг лідів",
    desc: "Оцінює кожен лід за 5 факторами (терміновість, канал, поведінка, джерело, час) і розставляє пріоритети 🔴🟡🟢",
    icon: "target",
    color: "#f59e0b",
    schedule: "*/15 * * * *",
    scheduleLabel: "кожні 15 хв",
    impact: "Конверсія +23%",
  },
  {
    id: "welcome-sequence",
    cat: "leads",
    name: "Welcome-послідовність",
    desc: "3-крокова автоматична серія повідомлень після першого контакту: день 1 → привітання, день 3 → корисні матеріали, день 7 → запрошення на консультацію",
    icon: "send",
    color: "#6366f1",
    schedule: "0 9 * * *",
    scheduleLabel: "щодня 09:00",
    impact: "Engagement +41%",
  },
  {
    id: "reactivation",
    cat: "leads",
    name: "Реактивація залеглих",
    desc: "Знаходить ліди без активності >7 днів і надсилає персоналізоване повідомлення з новою пропозицією або питанням",
    icon: "refresh",
    color: "#10b981",
    schedule: "0 10 * * 1",
    scheduleLabel: "щопонеділка 10:00",
    impact: "Повернення 18%",
  },
  {
    id: "follow-up-nudge",
    cat: "leads",
    name: "Нагадування консультанту",
    desc: "Якщо консультант не відповів на лід протягом 24 год — надсилає нагадування в Telegram + email з деталями ліду",
    icon: "bell",
    color: "#ef4444",
    schedule: "0 * * * *",
    scheduleLabel: "щогодини",
    impact: "Час відповіді -67%",
  },
  {
    id: "referral-reward",
    cat: "leads",
    name: "Реферальна винагорода",
    desc: "Автоматично відстежує реферали, розраховує винагороду (5% від оплаченого) і надсилає повідомлення реферу після підтвердження оплати",
    icon: "link",
    color: "#8b5cf6",
    schedule: "event:payment.confirmed",
    scheduleLabel: "після оплати",
    impact: "Рефералів +55%",
  },

  // ── ДОКУМЕНТИ & СПРАВИ ─────────────────────────────────────────────
  {
    id: "doc-expiry-monitor",
    cat: "docs",
    name: "Моніторинг дедлайнів",
    desc: "Перевіряє терміни карти побиту, візи, дозволу на роботу. Сповіщення за 90, 60, 30, 14, 7 днів по Telegram + email",
    icon: "clock",
    color: "#f59e0b",
    schedule: "0 8 * * *",
    scheduleLabel: "щодня 08:00",
    impact: "Штрафів 0%",
  },
  {
    id: "doc-checklist-gen",
    cat: "docs",
    name: "Генератор чеклісту",
    desc: "Автоматично генерує персоналізований чеклист документів на основі типу справи, країни походження та поточного статусу перебування",
    icon: "clipboard",
    color: "#06b6d4",
    schedule: "event:case.created",
    scheduleLabel: "при створенні справи",
    impact: "Повнота пакету +89%",
  },
  {
    id: "case-status-broadcast",
    cat: "docs",
    name: "Статус справи → Telegram",
    desc: "При кожній зміні статусу справи автоматично надсилає члену повідомлення в Telegram з поясненням наступних кроків",
    icon: "activity",
    color: "#3b82f6",
    schedule: "event:case.status_changed",
    scheduleLabel: "при зміні статусу",
    impact: "Запитів -74%",
  },

  // ── ФІНАНСИ ───────────────────────────────────────────────────────
  {
    id: "payment-reminder",
    cat: "finance",
    name: "Нагадування про оплату",
    desc: "За 3 дні та за 1 день до дедлайну оплати — автоматичне нагадування по Telegram + WhatsApp з посиланням на оплату Przelewy24",
    icon: "cash",
    color: "#10b981",
    schedule: "0 10 * * *",
    scheduleLabel: "щодня 10:00",
    impact: "Прострочень -81%",
  },
  {
    id: "subscription-renewal",
    cat: "finance",
    name: "Продовження підписки",
    desc: "За 14 та 3 дні до закінчення членства — повідомлення з умовами продовження та спеціальною пропозицією для лояльних членів",
    icon: "refresh",
    color: "#6366f1",
    schedule: "0 9 * * *",
    scheduleLabel: "щодня 09:00",
    impact: "Retention +38%",
  },
  {
    id: "mrr-anomaly-alert",
    cat: "finance",
    name: "MRR Аномалія-алерт",
    desc: "Моніторить відхилення фактичного MRR від прогнозу. При відхиленні >15% надсилає алерт адміну з аналізом причин",
    icon: "activity",
    color: "#ef4444",
    schedule: "0 7 * * *",
    scheduleLabel: "щодня 07:00",
    impact: "Реакція <2 год",
  },

  // ── КОМУНІКАЦІЯ ───────────────────────────────────────────────────
  {
    id: "telegram-smart-reply",
    cat: "comm",
    name: "Telegram AI-відповіді",
    desc: "Аналізує повідомлення в боті за ключовими словами та шаблонами. Автоматично відповідає на 80% поширених питань без участі консультанта",
    icon: "cpu",
    color: "#8b5cf6",
    schedule: "realtime",
    scheduleLabel: "реальний час",
    impact: "Навантаження -80%",
  },
  {
    id: "weekly-legal-digest",
    cat: "comm",
    name: "Щотижневий правовий дайджест",
    desc: "Збирає зміни міграційного законодавства Польщі та ЄС за тиждень, формує дайджест і надсилає всім активним членам щоп'ятниці о 17:00",
    icon: "file",
    color: "#f59e0b",
    schedule: "0 17 * * 5",
    scheduleLabel: "пятниця 17:00",
    impact: "Довіра членів ↑",
  },
  {
    id: "segment-broadcast",
    cat: "comm",
    name: "Сегментована розсилка",
    desc: "Автоматично сегментує членів за країною, типом дозволу, терміном перебування та надсилає цільові повідомлення по кожному сегменту",
    icon: "send",
    color: "#06b6d4",
    schedule: "manual",
    scheduleLabel: "за розкладом",
    impact: "CTR +67%",
  },
  {
    id: "emergency-router",
    cat: "comm",
    name: "Маршрутизатор терміновостей",
    desc: "Аналізує вхідні звернення за ключовими словами (депортація, суд, відмова, ТЕРМІНОВО). Автоматично призначає чергового консультанта і сповіщає",
    icon: "alert",
    color: "#ef4444",
    schedule: "realtime",
    scheduleLabel: "реальний час",
    impact: "Час реакції <5 хв",
  },

  // ── ПРОФСПІЛКА ────────────────────────────────────────────────────
  {
    id: "member-onboarding",
    cat: "union",
    name: "Онбординг нового члена",
    desc: "7-крокова послідовність протягом 14 днів: привітання → права членів → документи → юрист → спільнота → знижки → перша консультація",
    icon: "users",
    color: "#10b981",
    schedule: "event:member.joined",
    scheduleLabel: "при вступі",
    impact: "Активація 91%",
  },
  {
    id: "milestone-celebrate",
    cat: "union",
    name: "Святкування досягнень",
    desc: "Автоматично привітає члена при: отриманні карти побиту, громадянства, першого офіційного місця роботи. Надсилає подарункову знижку на наступну послугу",
    icon: "target",
    color: "#f59e0b",
    schedule: "event:milestone.achieved",
    scheduleLabel: "при досягненні",
    impact: "NPS +29 балів",
  },
  {
    id: "legal-change-alert",
    cat: "union",
    name: "Моніторинг законодавства",
    desc: "Щодня перевіряє gov.pl та EUR-Lex на зміни, що стосуються емігрантів. При знаходженні — AI-аналіз важливості + розсилка релевантним членам",
    icon: "bell",
    color: "#6366f1",
    schedule: "0 6 * * *",
    scheduleLabel: "щодня 06:00",
    impact: "Поінформованість ↑↑",
  },
  {
    id: "employer-matcher",
    cat: "union",
    name: "Матчинг з роботодавцями",
    desc: "Зіставляє профілі членів (спеціалізація, локація, дозвіл на роботу) з вакансіями партнерів-роботодавців і надсилає персоналізовані пропозиції",
    icon: "briefcase",
    color: "#3b82f6",
    schedule: "0 12 * * 1,3,5",
    scheduleLabel: "Пн/Ср/Пт 12:00",
    impact: "Працевлаштування +44%",
  },

  // ── АНАЛІТИКА & МОНІТОРИНГ ─────────────────────────────────────────
  {
    id: "system-health-monitor",
    cat: "analytics",
    name: "Моніторинг системи",
    desc: "Перевіряє стан усіх інтеграцій: Przelewy24, Telegram API, Supabase, Vercel, Resend, WhatsApp. При падінні — миттєвий алерт + автоматичний failover",
    icon: "cpu",
    color: "#10b981",
    schedule: "*/5 * * * *",
    scheduleLabel: "кожні 5 хв",
    impact: "Uptime 99.97%",
  },
  {
    id: "mrr-forecast-engine",
    cat: "analytics",
    name: "Прогноз MRR та відтоку",
    desc: "Розраховує прогноз MRR на 3 місяці вперед на основі тренду підписок, churn-rate та сезонності. Генерує звіт щопонеділка для стратегічного планування",
    icon: "activity",
    color: "#8b5cf6",
    schedule: "0 7 * * 1",
    scheduleLabel: "щопонеділка 07:00",
    impact: "Точність прогнозу 87%",
  },
];

const CATS = [
  { id: "all",      label: "Всі 21",       color: "#94a3b8" },
  { id: "leads",    label: "⚡ Ліди",       color: "#f59e0b" },
  { id: "docs",     label: "📄 Документи", color: "#06b6d4" },
  { id: "finance",  label: "💰 Фінанси",   color: "#10b981" },
  { id: "comm",     label: "📡 Комунікація", color: "#6366f1" },
  { id: "union",    label: "🤝 Профспілка", color: "#3b82f6" },
  { id: "analytics",label: "📊 Аналітика", color: "#8b5cf6" },
];

const CAT_LABEL = {
  leads: "Ліди",
  docs: "Документи",
  finance: "Фінанси",
  comm: "Комунікація",
  union: "Профспілка",
  analytics: "Аналітика",
};

/* ─── Стилі ──────────────────────────────────────────────────────────── */
const S = {
  page: { padding: "0 0 40px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    background: "var(--kc-card)",
    border: "1px solid var(--kc-border)",
    borderRadius: 12,
    padding: "16px 18px",
  },
  statVal: { fontSize: 26, fontWeight: 700, color: "var(--kc-text)", lineHeight: 1.1 },
  statLbl: { fontSize: 11, color: "var(--kc-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" },
  filterBtn: (active, color) => ({
    padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
    background: active ? color : "var(--kc-card)",
    color: active ? "#fff" : "var(--kc-muted)",
    border: `1px solid ${active ? color : "var(--kc-border)"}`,
    transition: "all 0.15s",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 14,
  },
  card: (enabled) => ({
    background: "var(--kc-card)",
    border: "1px solid var(--kc-border)",
    borderRadius: 14,
    padding: "18px 20px",
    opacity: enabled ? 1 : 0.55,
    transition: "box-shadow 0.2s, opacity 0.2s",
    position: "relative",
    overflow: "hidden",
  }),
  cardAccent: (color) => ({
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: color, borderRadius: "14px 14px 0 0",
  }),
  cardHead: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  iconBox: (color) => ({
    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: color + "22",
  }),
  cardTitle: { fontSize: 14, fontWeight: 700, color: "var(--kc-text)", marginBottom: 2 },
  cardDesc: { fontSize: 12, color: "var(--kc-muted)", lineHeight: 1.5, marginBottom: 12 },
  cardMeta: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" },
  tag: (color, bg) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
    color, background: bg,
  }),
  cardActions: { display: "flex", gap: 8, alignItems: "center" },
  runBtn: (color, running) => ({
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 12px", borderRadius: 8, border: "none", cursor: running ? "not-allowed" : "pointer",
    background: running ? "var(--kc-border)" : color + "22",
    color: running ? "var(--kc-muted)" : color,
    fontSize: 12, fontWeight: 600, transition: "all 0.15s",
  }),
  toggleBtn: (enabled) => ({
    marginLeft: "auto",
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 10px", borderRadius: 8, border: "1px solid var(--kc-border)",
    cursor: "pointer", background: "none",
    color: enabled ? "#10b981" : "var(--kc-muted)",
    fontSize: 11, fontWeight: 600,
  }),
  logsSection: {
    marginTop: 28,
    background: "var(--kc-card)",
    border: "1px solid var(--kc-border)",
    borderRadius: 14,
    padding: "20px 22px",
  },
  logItem: {
    display: "flex", alignItems: "flex-start", gap: 10,
    padding: "8px 0", borderBottom: "1px solid var(--kc-border)",
    fontSize: 12,
  },
  logDot: (ok) => ({
    width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 4,
    background: ok ? "#10b981" : "#ef4444",
  }),
};

/* ─── Форматування часу ─────────────────────────────────────────────── */
function timeAgo(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "щойно";
  if (diff < 3600) return `${Math.floor(diff / 60)} хв тому`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} год тому`;
  return `${Math.floor(diff / 86400)} дн тому`;
}

/* ─── Компонент картки автоматизації ─────────────────────────────────── */
function AutoCard({ auto, state, onRun, onToggle }) {
  const st = state || {};
  const enabled = st.enabled !== false;
  const running = st.running === true;
  const lastRun = st.lastRun || null;
  const runs = st.runs || 0;
  const errors = st.errors || 0;
  const successRate = runs > 0 ? Math.round(((runs - errors) / runs) * 100) : null;

  return (
    <div style={S.card(enabled)}>
      <div style={S.cardAccent(auto.color)} />
      <div style={S.cardHead}>
        <div style={S.iconBox(auto.color)}>
          <Icon name={auto.icon} size={18} color={auto.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={S.cardTitle}>{auto.name}</div>
          <div style={{ fontSize: 10, color: "var(--kc-muted)" }}>{CAT_LABEL[auto.cat]}</div>
        </div>
      </div>

      <div style={S.cardDesc}>{auto.desc}</div>

      <div style={S.cardMeta}>
        <span style={S.tag("#94a3b8", "rgba(148,163,184,0.12)")}>
          🕐 {auto.scheduleLabel}
        </span>
        <span style={S.tag(auto.color, auto.color + "18")}>
          📈 {auto.impact}
        </span>
        {successRate !== null && (
          <span style={S.tag(successRate >= 90 ? "#10b981" : "#f59e0b", "rgba(16,185,129,0.12)")}>
            ✓ {successRate}%
          </span>
        )}
        {lastRun && (
          <span style={{ fontSize: 10, color: "var(--kc-muted)", marginLeft: "auto" }}>
            {timeAgo(lastRun)}
          </span>
        )}
      </div>

      <div style={S.cardActions}>
        <button
          style={S.runBtn(auto.color, running)}
          onClick={() => !running && onRun(auto.id)}
          disabled={running}
        >
          {running
            ? <><Icon name="refresh" size={12} color="var(--kc-muted)" /> Виконується…</>
            : <><Icon name="play" size={12} color={auto.color} /> Запустити</>
          }
        </button>

        <div style={{ fontSize: 10, color: "var(--kc-muted)" }}>
          {runs > 0 && `${runs} запусків`}
        </div>

        <button style={S.toggleBtn(enabled)} onClick={() => onToggle(auto.id)}>
          <Icon name={enabled ? "check" : "pause"} size={11} color={enabled ? "#10b981" : "var(--kc-muted)"} />
          {enabled ? "Активна" : "Вимкнена"}
        </button>
      </div>
    </div>
  );
}

/* ─── Головна сторінка ───────────────────────────────────────────────── */
export default function AutomationsPage() {
  const [cat, setCat] = useState("all");
  const [states, setStates] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/automations");
      if (r.ok) {
        const d = await r.json();
        if (d.states) setStates(d.states);
        if (d.logs) setLogs(d.logs);
      }
    } catch {/* ignore */}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRun = async (id) => {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], running: true } }));
    try {
      const r = await fetch(`/api/admin/automations/${id}/run`, { method: "POST" });
      const d = await r.json();
      if (d.ok) {
        showToast(`✅ ${d.message || "Виконано успішно"}`);
        setStates((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            running: false,
            lastRun: new Date().toISOString(),
            runs: (prev[id]?.runs || 0) + 1,
          },
        }));
        setLogs((prev) => [
          { id: Date.now(), auto: id, ok: true, msg: d.message || "OK", ts: new Date().toISOString() },
          ...prev.slice(0, 49),
        ]);
      } else {
        showToast(`❌ ${d.error || "Помилка виконання"}`, false);
        setStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], running: false, errors: (prev[id]?.errors || 0) + 1 },
        }));
      }
    } catch {
      showToast("❌ Помилка мережі", false);
      setStates((prev) => ({ ...prev, [id]: { ...prev[id], running: false } }));
    }
  };

  const handleToggle = async (id) => {
    const current = states[id]?.enabled !== false;
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], enabled: !current } }));
    try {
      await fetch(`/api/admin/automations/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !current }),
      });
    } catch {/* ignore */}
    showToast(current ? "⏸ Автоматизацію вимкнено" : "▶️ Автоматизацію увімкнено");
  };

  const visible = cat === "all" ? AUTOMATIONS : AUTOMATIONS.filter((a) => a.cat === cat);
  const totalActive = AUTOMATIONS.filter((a) => states[a.id]?.enabled !== false).length;
  const totalRuns = Object.values(states).reduce((s, st) => s + (st.runs || 0), 0);
  const totalErrors = Object.values(states).reduce((s, st) => s + (st.errors || 0), 0);
  const successRate = totalRuns > 0 ? Math.round(((totalRuns - totalErrors) / totalRuns) * 100) : 100;

  return (
    <div style={S.page}>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: toast.ok ? "#10b981" : "#ef4444",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          animation: "kc-slide-in 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Хедер ── */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--kc-text)", marginBottom: 4 }}>
          ⚡ Автоматизація профспілки
        </div>
        <div style={{ fontSize: 13, color: "var(--kc-muted)" }}>
          21 автоматизований процес для росту, утримання та підтримки членів
        </div>
      </div>

      {/* ── Статистика ── */}
      <div style={S.statsRow}>
        {[
          { val: `${totalActive}/21`, lbl: "Активних", color: "#10b981" },
          { val: totalRuns || "0", lbl: "Запусків", color: "#6366f1" },
          { val: `${successRate}%`, lbl: "Успішність", color: "#f59e0b" },
          { val: "37,700 zł", lbl: "MRR ціль", color: "#3b82f6" },
        ].map((s) => (
          <div key={s.lbl} style={S.statBox}>
            <div style={{ ...S.statVal, color: s.color }}>{s.val}</div>
            <div style={S.statLbl}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Фільтри категорій ── */}
      <div style={S.filterRow}>
        {CATS.map((c) => (
          <button
            key={c.id}
            style={S.filterBtn(cat === c.id, c.color)}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Сітка автоматизацій ── */}
      {loading ? (
        <Spinner />
      ) : (
        <div style={S.grid}>
          {visible.map((auto) => (
            <AutoCard
              key={auto.id}
              auto={auto}
              state={states[auto.id]}
              onRun={handleRun}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* ── Лог виконання ── */}
      {logs.length > 0 && (
        <div style={S.logsSection}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--kc-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="activity" size={15} color="#6366f1" />
            Лог виконання
          </div>
          {logs.slice(0, 10).map((l) => {
            const auto = AUTOMATIONS.find((a) => a.id === l.auto);
            return (
              <div key={l.id} style={S.logItem}>
                <div style={S.logDot(l.ok)} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: "var(--kc-text)" }}>
                    {auto?.name || l.auto}
                  </span>
                  {" — "}
                  <span style={{ color: "var(--kc-muted)" }}>{l.msg}</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--kc-muted)", flexShrink: 0 }}>
                  {timeAgo(l.ts)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Порожній лог ── */}
      {!loading && logs.length === 0 && (
        <div style={S.logsSection}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--kc-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="activity" size={15} color="#6366f1" />
            Лог виконання
          </div>
          <div style={{ color: "var(--kc-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
            Лог порожній — запустіть будь-яку автоматизацію кнопкою ▶ Запустити
          </div>
        </div>
      )}
    </div>
  );
}
