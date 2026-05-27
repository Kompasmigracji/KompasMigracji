"use client";
/* /admin/leads — лиды воронки + корзина (soft-delete).
   Нормальный вид: фильтр по статусу, поиск, кнопка удаления в корзину.
   Корзина: восстановление и окончательное удаление (только admin). */
import React, { useEffect, useState, useCallback } from "react";
import { Spinner, Empty, Icon } from "@/components/admin/ui";

const FILTERS = [
  ["", "Всi"],
  ["new", "Новi"],
  ["contacted", "Контакт"],
  ["closed", "Закрито"],
  ["dropped", "Вiдмова"],
];

const SOURCE_LABEL = {
  bot:       "Telegram",
  site:      "Сайт",
  facebook:  "Facebook",
  instagram: "Instagram",
  other:     "Iнше",
};

const SOURCE_COLOR = {
  bot:       "#5f9bd5",
  site:      "#7cbf8e",
  facebook:  "#7b8fd4",
  instagram: "#d47bb0",
};

/* ── форматируем дату ── */
function fmtDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

/* ── кнопка-иконка ── */
function IconBtn({ icon, title, color = "#828c9b", hoverColor, onClick, size = 15 }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 5px",
        borderRadius: 6,
        color: hover && hoverColor ? hoverColor : color,
        transition: "color 0.15s, background 0.15s",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Icon name={icon} size={size} color={hover && hoverColor ? hoverColor : color} />
    </button>
  );
}

/* ── диалог подтверждения ── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#1c2433", borderRadius: 14, padding: "28px 32px",
        maxWidth: 360, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        border: "1px solid #2d3748",
      }}>
        <div style={{ fontSize: 15, color: "#e2e8f0", marginBottom: 20, lineHeight: 1.5 }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel}
            style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #3d4f63", background: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
            Скасувати
          </button>
          <button onClick={onConfirm}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Видалити назавжди
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads]       = useState(null);
  const [filter, setFilter]     = useState("");
  const [search, setSearch]     = useState("");
  const [isTrash, setIsTrash]   = useState(false);
  const [trashCount, setTrashCount] = useState(0);
  const [confirm, setConfirm]   = useState(null); // { id } | null

  /* ── загрузка активных лидов ── */
  const loadLeads = useCallback(async (st) => {
    setLeads(null);
    const res = await fetch("/api/admin/leads?status=" + encodeURIComponent(st));
    const d = await res.json();
    setLeads(d.leads || []);
  }, []);

  /* ── загрузка корзины ── */
  const loadTrash = useCallback(async () => {
    setLeads(null);
    const res = await fetch("/api/admin/leads/trash");
    const d = await res.json();
    setLeads(d.leads || []);
    setTrashCount((d.leads || []).length);
  }, []);

  /* ── получить кол-во в корзине (для бейджа) ── */
  const refreshTrashCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads/trash");
      const d = await res.json();
      setTrashCount((d.leads || []).length);
    } catch {}
  }, []);

  useEffect(() => {
    if (isTrash) {
      loadTrash();
    } else {
      loadLeads(filter);
      refreshTrashCount();
    }
  }, [isTrash, filter, loadLeads, loadTrash, refreshTrashCount]);

  /* ── смена статуса ── */
  const setStatus = async (id, status) => {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  /* ── переместить в корзину ── */
  const moveToTrash = async (id) => {
    await fetch("/api/admin/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setTrashCount((c) => c + 1);
  };

  /* ── восстановить из корзины ── */
  const restore = async (id) => {
    await fetch("/api/admin/leads/trash", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setTrashCount((c) => Math.max(0, c - 1));
  };

  /* ── окончательное удаление ── */
  const deletePermanently = async (id) => {
    await fetch("/api/admin/leads/trash", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setTrashCount((c) => Math.max(0, c - 1));
    setConfirm(null);
  };

  /* ── фильтрация по поиску ── */
  const visible = leads
    ? (!isTrash && search.trim())
      ? leads.filter((l) => {
          const q2 = search.toLowerCase();
          return (
            (l.name    || "").toLowerCase().includes(q2) ||
            (l.contact || "").toLowerCase().includes(q2) ||
            (l.country || "").toLowerCase().includes(q2) ||
            (l.service || "").toLowerCase().includes(q2) ||
            (l.message || "").toLowerCase().includes(q2)
          );
        })
      : leads
    : null;

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message="Видалити лiд назавжди? Цю дiю неможливо скасувати."
          onConfirm={() => deletePermanently(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Панель фильтров ── */}
      <div className="kc-row" style={{ gap: 7, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {!isTrash && FILTERS.map(([v, l]) => (
          <button key={v}
            className={"kc-btn " + (filter === v ? "kc-btn-primary" : "kc-btn-ghost")}
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => setFilter(v)}>{l}</button>
        ))}

        {isTrash && (
          <button
            className="kc-btn kc-btn-ghost"
            style={{ padding: "6px 12px", fontSize: 13 }}
            onClick={() => setIsTrash(false)}>
            ← Назад до лiдiв
          </button>
        )}

        {!isTrash && (
          <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: 10, color: "#5a6470" }}>
              <Icon name="search" size={16} />
            </span>
            <input className="kc-input" style={{ paddingLeft: 34 }}
              placeholder="Пошук по iменi, телефону, меседжу…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        )}

        {/* Кнопка «Кошик» */}
        <button
          onClick={() => { setIsTrash((v) => !v); setSearch(""); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: isTrash ? "#dc2626" : "rgba(220,38,38,0.12)",
            color: isTrash ? "#fff" : "#dc2626",
            fontSize: 13, fontWeight: 600, transition: "background 0.15s",
          }}>
          <Icon name="trash" size={14} color={isTrash ? "#fff" : "#dc2626"} />
          Кошик
          {trashCount > 0 && (
            <span style={{
              background: isTrash ? "rgba(255,255,255,0.25)" : "#dc2626",
              color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: 11, fontWeight: 700,
            }}>{trashCount}</span>
          )}
        </button>
      </div>

      {/* ── Заголовок корзины ── */}
      {isTrash && (
        <div style={{
          background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: 10, padding: "10px 16px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10, color: "#dc2626", fontSize: 13,
        }}>
          <Icon name="trash" size={15} color="#dc2626" />
          <span>Кошик — видаленi лiди. <strong>Вiдновити</strong> або <strong>видалити назавжди</strong> (тiльки адмiн).</span>
        </div>
      )}

      {/* ── Таблица ── */}
      {visible === null ? <Spinner /> : visible.length === 0 ? (
        <Empty text={isTrash ? "Кошик порожнiй" : "Лiдiв немає"} />
      ) : (
        <div className="kc-table-wrap">
          <table className="kc-table">
            <thead>
              <tr>
                <th>Джерело</th>
                <th>{"Iм'я"} / username</th>
                <th>Контакт</th>
                <th>Повiдомлення</th>
                <th>{isTrash ? "Видалено" : "Дата"}</th>
                <th>{isTrash ? "Дiї" : "Статус"}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} style={{ opacity: isTrash ? 0.85 : 1 }}>
                  {/* Джерело */}
                  <td>
                    <span style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 99,
                      fontSize: 11, fontWeight: 600,
                      background: (SOURCE_COLOR[l.source] || "#5a6470") + "22",
                      color: SOURCE_COLOR[l.source] || "#5a6470",
                    }}>
                      {SOURCE_LABEL[l.source] || l.source}
                    </span>
                    {l.country && (
                      <div style={{ color: "#5a6470", fontSize: 11, marginTop: 3 }}>{l.country}</div>
                    )}
                  </td>

                  {/* Имя */}
                  <td>
                    <div style={{ fontWeight: 500 }}>{l.name || "—"}</div>
                    {l.username && (
                      <a href={"https://t.me/" + l.username} target="_blank" rel="noreferrer"
                        style={{ color: "#5f9bd5", fontSize: 11, textDecoration: "none" }}>
                        @{l.username}
                      </a>
                    )}
                  </td>

                  {/* Контакт */}
                  <td className="kc-mono" style={{ color: "#828c9b", fontSize: 12 }}>
                    {l.contact || "—"}
                  </td>

                  {/* Сообщение */}
                  <td style={{ color: "#828c9b", maxWidth: 240 }}>
                    {l.service && (
                      <div style={{ color: "#a78bfa", fontSize: 11, marginBottom: 2 }}>{l.service}</div>
                    )}
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                      {l.message || "—"}
                    </div>
                  </td>

                  {/* Дата / Дата удаления */}
                  <td style={{ color: "#5a6470", fontSize: 12, whiteSpace: "nowrap" }}>
                    {isTrash ? fmtDate(l.deleted_at) : fmtDate(l.created_at)}
                  </td>

                  {/* Статус / Действия */}
                  <td>
                    {isTrash ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {/* Восстановить */}
                        <button
                          onClick={() => restore(l.id)}
                          title="Вiдновити"
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "5px 10px", borderRadius: 7, border: "none",
                            background: "rgba(34,197,94,0.15)", color: "#22c55e",
                            cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}>
                          <Icon name="restore" size={13} color="#22c55e" />
                          Вiдновити
                        </button>
                        {/* Удалить навсегда */}
                        <button
                          onClick={() => setConfirm({ id: l.id })}
                          title="Видалити назавжди"
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "5px 10px", borderRadius: 7, border: "none",
                            background: "rgba(220,38,38,0.13)", color: "#dc2626",
                            cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}>
                          <Icon name="trash" size={13} color="#dc2626" />
                          Назавжди
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select className="kc-select"
                          style={{ padding: "5px 8px", fontSize: 12, minWidth: 110 }}
                          value={l.status || "new"}
                          onChange={(e) => setStatus(l.id, e.target.value)}>
                          <option value="new">Новий</option>
                          <option value="contacted">Контакт</option>
                          <option value="closed">Закрито</option>
                          <option value="dropped">Вiдмова</option>
                        </select>
                        {/* Кнопка в корзину */}
                        <IconBtn
                          icon="trash"
                          title="Перемiстити в кошик"
                          color="#5a6470"
                          hoverColor="#dc2626"
                          onClick={() => moveToTrash(l.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="kc-stat-sub" style={{ marginTop: 12 }}>
        <Icon name={isTrash ? "trash" : "inbox"} size={12} />
        {" "}
        {isTrash
          ? "Кошик — " + (visible?.length ?? "…") + " лiдiв"
          : "Показано " + (visible?.length ?? "…") + " лiдiв · таблиця leads"}
      </div>
    </div>
  );
}
