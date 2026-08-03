"use client";
/* KompasCRM — Automations monitoring & control panel
   Backed by 21 real server-side runners in app/api/admin/automations/[id]/run/route.js.
   There is no visual workflow builder on the backend — each automation is a fixed
   server function; this page lists them, shows their run history, and lets an
   admin trigger or enable/disable them. */
import React, { useState, useEffect, useCallback } from "react";
import { Icon, Spinner, EmptyState, Badge, StatCard } from "@/components/admin/ui";

const AUTOMATIONS = [
  { id: "lead-scorer", name: "Автоскоринг лідів", desc: "Оцінює нові ліди за терміновістю та джерелом" },
  { id: "welcome-sequence", name: "Welcome-послідовність", desc: "Автоматичні привітальні повідомлення новим лідам" },
  { id: "reactivation", name: "Реактивація залеглих", desc: "Знаходить ліди без активності понад 7 днів" },
  { id: "follow-up-nudge", name: "Нагадування консультанту", desc: "Сигналізує про ліди без відповіді 24+ год" },
  { id: "referral-reward", name: "Реферальна винагорода", desc: "Підсумовує активність реферальної програми" },
  { id: "doc-expiry-monitor", name: "Дедлайни документів", desc: "Стежить за термінами дії документів членів" },
  { id: "doc-checklist-gen", name: "Генератор чеклісту", desc: "Додає чекліст документів до нових справ" },
  { id: "case-status-broadcast", name: "Статус справи → Telegram", desc: "Сповіщає про зміни статусів справ" },
  { id: "payment-reminder", name: "Нагадування про оплату", desc: "Нагадує про неоплачені внески 25+ днів" },
  { id: "subscription-renewal", name: "Продовження підписки", desc: "Попереджає про підписки, що закінчуються" },
  { id: "mrr-anomaly-alert", name: "MRR Аномалія-алерт", desc: "Сповіщає про суттєве відхилення MRR від цілі" },
  { id: "telegram-smart-reply", name: "Telegram AI-відповіді", desc: "Статистика вхідних повідомлень через бот" },
  { id: "weekly-legal-digest", name: "Правовий дайджест", desc: "Щотижневий дайджест для активних членів" },
  { id: "segment-broadcast", name: "Сегментована розсилка", desc: "Підрахунок сегментів користувачів для розсилки" },
  { id: "emergency-router", name: "Маршрутизатор терміновостей", desc: "Виявляє термінові звернення (депортація, суд)" },
  { id: "member-onboarding", name: "Онбординг нового члена", desc: "Запускає онбординг для нових членів" },
  { id: "milestone-celebrate", name: "Святкування досягнень", desc: "Сповіщає про досягнення членів" },
  { id: "legal-change-alert", name: "Моніторинг законодавства", desc: "Перевіряє публікації УДСЦ (gov.pl)" },
  { id: "employer-matcher", name: "Матчинг з роботодавцями", desc: "Готовність до матчингу активних членів" },
  { id: "system-health-monitor", name: "Моніторинг системи", desc: "Перевіряє доступність Telegram/Supabase/Vercel" },
  { id: "mrr-forecast-engine", name: "Прогноз MRR та відтоку", desc: "Прогнозує MRR на основі 6-місячного тренду" },
];

export default function AutomationsPage() {
  const [states, setStates] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const load = useCallback(() => {
    fetch("/api/admin/automations")
      .then((r) => r.json())
      .then((data) => {
        setStates(data.states || {});
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runNow = async (id) => {
    setRunning(id);
    setLastResult(null);
    try {
      const res = await fetch(`/api/admin/automations/${id}/run`, { method: "POST" });
      const data = await res.json();
      setLastResult({ id, ok: data.ok, message: data.message || data.error });
      load();
    } catch (e) {
      setLastResult({ id, ok: false, message: e.message });
    } finally {
      setRunning(null);
    }
  };

  const toggle = async (id, enabled) => {
    setToggling(id);
    try {
      await fetch(`/api/admin/automations/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      load();
    } finally {
      setToggling(null);
    }
  };

  const activeCount = AUTOMATIONS.filter((a) => states[a.id]?.enabled).length;
  const totalRuns = Object.values(states).reduce((s, st) => s + (st.runs || 0), 0);
  const totalErrors = Object.values(states).reduce((s, st) => s + (st.errors || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Automations & Workflows</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            21 серверних автоматизацій для лідів, справ, оплат та сповіщень.
          </p>
        </div>
      </div>

      <div className="kc-grid kc-grid-3" style={{ marginBottom: "var(--space-lg)" }}>
        <StatCard icon="zap" value={`${activeCount}/${AUTOMATIONS.length}`} label="Увімкнено" />
        <StatCard icon="check" value={totalRuns} label="Всього запусків" />
        <StatCard icon="alert" value={totalErrors} label="Помилок" />
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-2xl)" }}>
          <Spinner />
        </div>
      ) : (
        <div className="kc-grid kc-grid-3">
          {AUTOMATIONS.map((a) => {
            const st = states[a.id];
            const enabled = !!st?.enabled;
            const result = lastResult?.id === a.id ? lastResult : null;
            return (
              <div key={a.id} className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 className="kc-h3" style={{ margin: 0, fontSize: "var(--text-md)" }}>{a.name}</h3>
                  <Badge status={enabled ? "success" : "dim"} text={enabled ? "On" : "Off"} />
                </div>
                <p style={{ color: "var(--dim)", fontSize: "var(--text-sm)", margin: 0, flex: 1 }}>{a.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                  <div>Запусків: {st?.runs ?? 0}{st?.errors ? ` (помилок: ${st.errors})` : ""}</div>
                  <div>Останній запуск: {st?.lastRun ? new Date(st.lastRun).toLocaleString("uk-UA") : "—"}</div>
                </div>

                {result && (
                  <div style={{
                    fontSize: "var(--text-xs)",
                    padding: "var(--space-sm)",
                    borderRadius: "var(--radius-sm)",
                    background: result.ok ? "color-mix(in srgb, var(--color-success) 10%, transparent)" : "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                    color: result.ok ? "var(--color-success)" : "var(--color-danger)",
                  }}>
                    {result.message}
                  </div>
                )}

                <div style={{ display: "flex", gap: "var(--space-sm)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)" }}>
                  <button
                    className="kc-btn kc-btn-primary"
                    style={{ flex: 1 }}
                    disabled={running === a.id}
                    onClick={() => runNow(a.id)}
                  >
                    <Icon name="zap" size={14} /> {running === a.id ? "..." : "Run Now"}
                  </button>
                  <button
                    className="kc-btn kc-btn-ghost"
                    disabled={toggling === a.id}
                    onClick={() => toggle(a.id, !enabled)}
                  >
                    {enabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="kc-card" style={{ marginTop: "var(--space-lg)" }}>
        <h3 className="kc-h3" style={{ marginTop: 0 }}>Recent activity</h3>
        {logs.length === 0 ? (
          <EmptyState title="Ще немає запусків" description="Натисніть Run Now на будь-якій автоматизації вище." icon="zap" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {logs.map((l) => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-md)", fontSize: "var(--text-sm)", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge status={l.ok ? "success" : "danger"} text={l.ok ? "OK" : "Error"} />
                  <span>{AUTOMATIONS.find((a) => a.id === l.auto)?.name || l.auto}</span>
                </div>
                <span style={{ color: "var(--dim)" }}>{l.msg}</span>
                <span style={{ color: "var(--dim)", whiteSpace: "nowrap" }}>{l.ts ? new Date(l.ts).toLocaleString("uk-UA") : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
