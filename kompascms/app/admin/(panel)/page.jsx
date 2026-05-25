"use client";
/* Дашборд /admin — кастомная аналитика проекта Kompas Migracji. */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  StatCard, Sparkline, Badge, Spinner, Empty, Icon, BarList,
} from "@/components/admin/ui";

const SOURCE_LABEL = {
  bot: "Telegram-бот", site: "Сайт", facebook: "Facebook",
  instagram: "Instagram", other: "Другое",
};
const SOURCE_COLOR = {
  bot: "#5f9bd5", site: "#d99e54", facebook: "#5f9bd5",
  instagram: "#d96c6c", other: "#5a6470",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setStats(d)))
      .catch(() => setError("Не удалось загрузить аналитику"));
  }, []);

  if (error) {
    return (
      <div className="kc-error">
        <Icon name="settings" size={15} color="#d96c6c" />
        <span>{error}</span>
      </div>
    );
  }
  if (!stats) return <Spinner />;

  const conv = stats.leads.total
    ? Math.round((stats.leads.converted / stats.leads.total) * 100)
    : 0;
  const duesTotal = stats.duesCollected + (stats.duesOutstanding || 0);
  const duesRate = duesTotal ? Math.round((stats.duesCollected / duesTotal) * 100) : 0;
  const sources = (stats.leadsBySource || []).map((s) => ({
    label: SOURCE_LABEL[s.source] || s.source,
    value: s.count,
    color: SOURCE_COLOR[s.source] || "#d99e54",
  }));

  return (
    <div>
      {/* верхние метрики */}
      <div className="kc-grid kc-grid-4" style={{ marginBottom: 14 }}>
        <StatCard icon="users" value={stats.members.total} label="Участников профсоюза"
          sub={`${stats.members.active} активных · ${stats.members.pending} ожидают`} />
        <StatCard icon="inbox" value={stats.leads.new} label="Новых лидов"
          sub={`всего ${stats.leads.total} · конверсия ${conv}%`} />
        <StatCard icon="briefcase" value={stats.cases.active} label="Активных дел"
          sub={`${stats.cases.resolved} решено`} />
        <StatCard icon="cash" value={stats.duesCollected.toLocaleString("ru-RU") + " zł"}
          label="Собрано взносов" sub={`собираемость ${duesRate}%`} />
      </div>

      {/* аналитика: динамика + воронка */}
      <div className="kc-grid kc-grid-2" style={{ marginBottom: 14 }}>
        <div className="kc-card">
          <div className="kc-card-cap">Регистрации участников · 14 дней</div>
          <Sparkline data={stats.series} />
          <div className="kc-row" style={{ justifyContent: "space-between", marginTop: 8 }}>
            <span className="kc-stat-sub">14 дней назад</span>
            <span className="kc-stat-sub">
              всего за период: {stats.series.reduce((a, b) => a + b, 0)}
            </span>
            <span className="kc-stat-sub">сегодня</span>
          </div>
        </div>

        <div className="kc-card">
          <div className="kc-card-cap">Воронка лидов · по источникам</div>
          {sources.length
            ? <BarList items={sources} />
            : <Empty text="Лидов пока нет" />}
        </div>
      </div>

      {/* сбор взносов + последние лиды */}
      <div className="kc-grid kc-grid-2">
        <div className="kc-card">
          <div className="kc-card-cap">Членские взносы</div>
          <div className="kc-row" style={{ gap: 22, marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 600 }}>
                {stats.duesCollected.toLocaleString("ru-RU")} zł
              </div>
              <div className="kc-stat-sub">собрано</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 600, color: "#d96c6c" }}>
                {(stats.duesOutstanding || 0).toLocaleString("ru-RU")} zł
              </div>
              <div className="kc-stat-sub">к доплате</div>
            </div>
          </div>
          <div style={{ height: 8, background: "var(--bg)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ height: 8, width: duesRate + "%", background: "var(--green)", borderRadius: 5 }} />
          </div>
          <div className="kc-stat-sub" style={{ marginTop: 6 }}>
            Собираемость взносов: {duesRate}%
          </div>
        </div>

        <div className="kc-card">
          <div className="kc-card-cap">Последние лиды</div>
          {stats.recentLeads.length ? stats.recentLeads.map((l) => (
            <div key={l.id} className="kc-row"
              style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
              <Badge status={l.source === "bot" ? "in_progress" : "new"}
                text={SOURCE_LABEL[l.source] || l.source} />
              <span style={{ flex: 1, fontSize: 13.5 }}>{l.name || "Без имени"}</span>
              <Badge status={l.status} />
            </div>
          )) : <Empty text="Лидов пока нет" />}
          <Link href="/admin/leads" className="kc-link"
            style={{ fontSize: 13, display: "inline-block", marginTop: 10 }}>
            Все лиды →
          </Link>
        </div>
      </div>
    </div>
  );
}
