"use client";
/* /admin/leads — лиды воронки: Telegram-бот, сайт, FB, IG.
   Читает из существующей таблицы leads (статусы: new, contacted, closed, dropped). */
import React, { useEffect, useState, useCallback } from "react";
import { Spinner, Empty, Icon } from "@/components/admin/ui";

/* Статусы из таблицы leads проекта */
const FILTERS = [
  ["", "Всі"],
  ["new", "Нові"],
  ["contacted", "Контакт"],
  ["closed", "Закрито"],
  ["dropped", "Відмова"],
];

const SOURCE_LABEL = {
  bot:       "🤖 Telegram",
  site:      "🌐 Сайт",
  facebook:  "👤 Facebook",
  instagram: "📸 Instagram",
  other:     "Інше",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async (st) => {
    setLeads(null);
    const res = await fetch("/api/admin/leads?status=" + encodeURIComponent(st));
    const d = await res.json();
    setLeads(d.leads || []);
  }, []);

  useEffect(() => { load(filter); }, [filter, load]);

  const setStatus = async (id, status) => {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const visible = leads
    ? search.trim()
      ? leads.filter((l) => {
          const q = search.toLowerCase();
          return (
            (l.name || "").toLowerCase().includes(q) ||
            (l.contact || "").toLowerCase().includes(q) ||
            (l.country || "").toLowerCase().includes(q) ||
            (l.service || "").toLowerCase().includes(q) ||
            (l.message || "").toLowerCase().includes(q)
          );
        })
      : leads
    : null;

  return (
    <div>
      {/* Фильтры + поиск */}
      <div className="kc-row" style={{ gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
        {FILTERS.map(([v, l]) => (
          <button key={v}
            className={"kc-btn " + (filter === v ? "kc-btn-primary" : "kc-btn-ghost")}
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
        <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: 10, color: "#5a6470" }}>
            <Icon name="search" size={16} />
          </span>
          <input className="kc-input" style={{ paddingLeft: 34 }}
            placeholder="Пошук по імені, телефону, меседжу…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {visible === null ? <Spinner /> : visible.length === 0 ? (
        <Empty text="Лідів немає" />
      ) : (
        <div className="kc-table-wrap">
          <table className="kc-table">
            <thead>
              <tr>
                <th>Джерело</th>
                <th>{"Ім'я"} / username</th>
                <th>Контакт</th>
                <th>Повідомлення</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id}>
                  <td>
                    <span className="kc-badge kc-badge-blue" style={{ fontSize: 11 }}>
                      {SOURCE_LABEL[l.source] || l.source}
                    </span>
                    {l.country && (
                      <div style={{ color: "#5a6470", fontSize: 11, marginTop: 3 }}>{l.country}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{l.name || "—"}</div>
                    {l.username && (
                      <a href={"https://t.me/" + l.username} target="_blank" rel="noreferrer"
                        style={{ color: "#5f9bd5", fontSize: 11, textDecoration: "none" }}>
                        @{l.username}
                      </a>
                    )}
                  </td>
                  <td className="kc-mono" style={{ color: "#828c9b", fontSize: 12 }}>
                    {l.contact || "—"}
                  </td>
                  <td style={{ color: "#828c9b", maxWidth: 260 }}>
                    {l.service && (
                      <div style={{ color: "#a78bfa", fontSize: 11, marginBottom: 2 }}>{l.service}</div>
                    )}
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                      {l.message || "—"}
                    </div>
                  </td>
                  <td style={{ color: "#5a6470", fontSize: 12, whiteSpace: "nowrap" }}>
                    {l.created_at
                      ? new Date(l.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "2-digit" })
                      : "—"}
                  </td>
                  <td>
                    <select className="kc-select"
                      style={{ padding: "5px 8px", fontSize: 12, minWidth: 110 }}
                      value={l.status || "new"}
                      onChange={(e) => setStatus(l.id, e.target.value)}>
                      <option value="new">🆕 Новий</option>
                      <option value="contacted">📞 Контакт</option>
                      <option value="closed">✅ Закрито</option>
                      <option value="dropped">❌ Відмова</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="kc-stat-sub" style={{ marginTop: 12 }}>
        <Icon name="inbox" size={12} />
        {" "}Показано {visible?.length ?? "…"} лідів · таблиця leads
      </div>
    </div>
  );
}
