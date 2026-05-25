"use client";
/* /admin/leads — лиды воронки /api/leads (бот / сайт / FB / IG). */
import React, { useEffect, useState, useCallback } from "react";
import { Badge, Spinner, Empty, Icon } from "@/components/admin/ui";

const FILTERS = [
  ["", "Все"], ["new", "Новые"], ["in_progress", "В работе"],
  ["converted", "Конверсии"], ["closed", "Закрытые"],
];

export default function LeadsPage() {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async (st) => {
    setLeads(null);
    const res = await fetch("/api/admin/leads?status=" + st);
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
    load(filter);
  };

  return (
    <div>
      <div className="kc-row" style={{ gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
        {FILTERS.map(([v, l]) => (
          <button key={v}
            className={"kc-btn " + (filter === v ? "kc-btn-primary" : "kc-btn-ghost")}
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {leads === null ? <Spinner /> : leads.length === 0 ? (
        <Empty text="Лидов нет" />
      ) : (
        <div className="kc-table-wrap">
          <table className="kc-table">
            <thead>
              <tr>
                <th>Источник</th><th>Имя</th><th>Контакт</th>
                <th>Сообщение</th><th>Статус</th><th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td><Badge status="open" text={l.source} /></td>
                  <td style={{ fontWeight: 500 }}>{l.name || "—"}</td>
                  <td className="kc-mono" style={{ color: "#828c9b", fontSize: 12 }}>
                    {l.contact || "—"}
                  </td>
                  <td style={{ color: "#828c9b", maxWidth: 280 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.message || "—"}
                    </div>
                  </td>
                  <td><Badge status={l.status} /></td>
                  <td>
                    <select className="kc-select" style={{ padding: "5px 8px", fontSize: 12 }}
                      value={l.status}
                      onChange={(e) => setStatus(l.id, e.target.value)}>
                      <option value="new">Новый</option>
                      <option value="in_progress">В работе</option>
                      <option value="converted">Конверсия</option>
                      <option value="closed">Закрыт</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="kc-stat-sub" style={{ marginTop: 12 }}>
        <Icon name="inbox" size={12} /> Таблица kompas_leads. Чтобы сюда попадали лиды
        бота/сайта/FB/IG — направь свой /api/leads в эту таблицу.
      </div>
    </div>
  );
}
