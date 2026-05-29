"use client";
/* KompasCRM — переиспользуемые UI-компоненты. */
import React from "react";

/* ---------- иконки (минимальный SVG-набор) ---------- */
const PATHS = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  compass: "M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  cash: "M2 5h20v14H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  plus: "M12 5v14M5 12h14",
  back: "M19 12H5M12 19l-7-7 7-7",
  check: "M20 6 9 17l-5-5",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
  restore: "M1 4v6h6M3.51 15a9 9 0 1 0 .49-4.46",
  alert:  "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  sun: "M12 17A5 5 0 1 0 12 7a5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  send: "M22 2 11 13M22 2 15 22 11 13 2 9z",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  copy: "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};
export function Icon({ name, size = 18, color = "currentColor", fill = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? color : "none"} stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] || PATHS.grid} />
    </svg>
  );
}

/* ---------- статкарта ---------- */
export function StatCard({ icon, value, label, sub }) {
  return (
    <div className="kc-stat">
      <div className="kc-stat-top">
        <div className="kc-stat-ico"><Icon name={icon} size={17} color="#d99e54" /></div>
      </div>
      <div className="kc-stat-val">{value}</div>
      <div className="kc-stat-lbl">{label}</div>
      {sub ? <div className="kc-stat-sub">{sub}</div> : null}
    </div>
  );
}

/* ---------- бейдж статуса ---------- */
const BADGE = {
  active: ["kc-badge-green", "Активний"],
  pending: ["kc-badge-brass", "Очікує"],
  suspended: ["kc-badge-red", "Заблокований"],
  new: ["kc-badge-blue", "Новий"],
  in_progress: ["kc-badge-brass", "В роботі"],
  converted: ["kc-badge-green", "Конверсія"],
  closed: ["kc-badge-dim", "Закрито"],
  open: ["kc-badge-blue", "Відкрито"],
  resolved: ["kc-badge-green", "Вирішено"],
  paid: ["kc-badge-green", "Оплачено"],
  unpaid: ["kc-badge-red", "Не оплачено"],
  exempt: ["kc-badge-dim", "Звільнений"],
  // универсальные тона (с обязательным text)
  brass: ["kc-badge-brass", ""],
  blue: ["kc-badge-blue", ""],
  green: ["kc-badge-green", ""],
  red: ["kc-badge-red", ""],
  dim: ["kc-badge-dim", ""],
};
export function Badge({ status, text }) {
  const [cls, label] = BADGE[status] || ["kc-badge-dim", status];
  return <span className={"kc-badge " + cls}>{text || label}</span>;
}

/* ---------- спарклайн (SVG, без зависимостей) ---------- */
export function Sparkline({ data = [], w = 220, h = 56 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((v, i) => `${i * step},${h - (v / max) * (h - 8) - 4}`);
  const area = `0,${h} ${pts.join(" ")} ${w},${h}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <polygon points={area} fill="#d99e5422" />
      <polyline points={pts.join(" ")} fill="none" stroke="#d99e54" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- спиннер / пусто ---------- */
export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 36 }}>
      <div className="kc-spin" />
    </div>
  );
}
export function Empty({ text = "Немає даних" }) {
  return <div className="kc-empty">{text}</div>;
}

/* ---------- горизонтальные столбцы (распределение) ---------- */
export function BarList({ items = [], unit = "" }) {
  if (!items.length) return <Empty text="Нет данных" />;
  const max = Math.max(...items.map((i) => Number(i.value) || 0), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it) => (
        <div key={it.label}>
          <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13 }}>{it.label}</span>
            <span className="kc-mono" style={{ fontSize: 12.5, color: "#828c9b" }}>
              {it.value}{unit}
            </span>
          </div>
          <div style={{ height: 8, background: "var(--bg)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{
              height: 8,
              width: ((Number(it.value) || 0) / max) * 100 + "%",
              background: it.color || "var(--brass)",
              borderRadius: 5,
              transition: "width .4s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
