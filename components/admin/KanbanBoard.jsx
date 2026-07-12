"use client";
/* KompasCRM — Kanban Board (дизайн-система kc-*, CSS-змінні тем).
   Використовується на /admin/leads, /admin/deals та ін.
   API: columns [{id,title,color}], cards [{id,title,subtitle,columnId,amount,tags,assignee,timeAgo,isUrgent}] */
import React, { useState } from "react";
import { Icon, Avatar } from "./ui";
import { motion } from "framer-motion";

/* col.color очікується як CSS-колір (var(--color-info), #hex, rgb…).
   Старі виклики могли передавати Tailwind-класи — відсіюємо їх. */
function cssColor(value, fallback = "var(--color-primary)") {
  if (typeof value !== "string") return fallback;
  const v = value.trim();
  if (v.startsWith("var(") || v.startsWith("#") || v.startsWith("rgb") || v.startsWith("hsl")) return v;
  return fallback;
}

function sourceIcon(tag) {
  const s = (tag || "").toLowerCase();
  if (s.includes("telegram") || s === "bot") return "send";
  if (s.includes("viber") || s.includes("phone")) return "phone";
  if (s.includes("site") || s.includes("web")) return "globe";
  if (s.includes("mail")) return "mail";
  return "message-circle";
}

const zl = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

export default function KanbanBoard({ columns, cards, onCardMove, onCardClick }) {
  const [dragOverColId, setDragOverColId] = useState(null);

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
    setTimeout(() => { e.target.style.opacity = "0.5"; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDragOverColId(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColId !== colId) setDragOverColId(colId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColId(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverColId(null);
    const cardId = e.dataTransfer.getData("text/plain");
    if (cardId && onCardMove) {
      const card = cards.find((c) => String(c.id) === cardId);
      if (card && String(card.columnId) !== String(colId)) {
        onCardMove(cardId, colId);
      }
    }
  };

  return (
    <div style={{
      display: "flex", gap: "var(--space-md)", alignItems: "flex-start",
      overflowX: "auto", paddingBottom: "var(--space-md)", minHeight: 420,
    }}>
      {columns.map((col) => {
        const color = cssColor(col.color);
        const colCards = cards.filter((c) => String(c.columnId) === String(col.id));
        const totalAmount = colCards.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        const isDraggedOver = dragOverColId === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{
              flex: "0 0 300px", width: 300, display: "flex", flexDirection: "column",
              background: "var(--panel)", borderRadius: "var(--radius-lg)",
              border: isDraggedOver ? `1.5px dashed ${color}` : "1px solid var(--border)",
              borderTop: `3px solid ${color}`,
              transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
              boxShadow: isDraggedOver ? `0 0 0 3px color-mix(in srgb, ${color} 20%, transparent)` : "none",
            }}
          >
            {/* Заголовок колонки */}
            <div style={{
              padding: "var(--space-md)", borderBottom: "1px solid var(--border)",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)" }}>
                  {col.title}
                </h3>
                <span style={{
                  background: `color-mix(in srgb, ${color} 15%, transparent)`, color,
                  padding: "1px 8px", borderRadius: 999, fontSize: "var(--text-xs)", fontWeight: 700,
                }}>
                  {colCards.length}
                </span>
              </div>
              {totalAmount > 0 && (
                <div className="kc-mono" style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                  {zl.format(totalAmount)} zł
                </div>
              )}
            </div>

            {/* Тіло колонки (drop-зона) */}
            <div style={{
              flex: 1, padding: "var(--space-sm)", display: "flex", flexDirection: "column",
              gap: "var(--space-sm)", overflowY: "auto", maxHeight: "calc(100vh - 320px)", minHeight: 120,
            }}>
              {colCards.map((card) => (
                /* Зовнішній div несе нативний HTML5 DnD: на motion.div пропси
                   onDragStart/onDragEnd перехоплює framer-motion (свої жести)
                   і до DOM вони не доходять. */
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, String(card.id))}
                  onDragEnd={handleDragEnd}
                  onClick={() => onCardClick && onCardClick(card)}
                >
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2, boxShadow: "var(--shadow-md, 0 6px 18px rgba(0,0,0,0.18))" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "var(--panel-2)", border: "1px solid var(--border)",
                    borderLeft: `3px solid ${color}`, borderRadius: "var(--radius-md)",
                    padding: "var(--space-md)", cursor: "grab",
                    display: "flex", flexDirection: "column", gap: 8,
                  }}
                >
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)", lineHeight: 1.35, wordBreak: "break-word" }}>
                    {card.title}
                  </div>

                  {card.subtitle && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: "var(--text-xs)", padding: "2px 8px", borderRadius: "var(--radius-sm)",
                        background: card.isUrgent ? "color-mix(in srgb, var(--color-danger) 12%, transparent)" : "var(--panel)",
                        color: card.isUrgent ? "var(--color-danger)" : "var(--dim)",
                        border: "1px solid var(--border)",
                      }}>
                        {card.subtitle}
                      </span>
                      {card.timeAgo && (
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--faint)" }}>{card.timeAgo}</span>
                      )}
                    </div>
                  )}

                  {card.tags?.filter(Boolean).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                      <Icon name={sourceIcon(card.tags[0])} size={12} />
                      <span>{card.tags.filter(Boolean).join(" · ")}</span>
                    </div>
                  )}

                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 2,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <Avatar name={card.assignee?.name || "?"} size={20} hideName />
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {card.assignee?.name || "Не призначено"}
                      </span>
                    </div>
                    {Number(card.amount) > 0 && (
                      <span className="kc-mono" style={{ fontSize: "var(--text-xs)", fontWeight: 700, color }}>
                        {zl.format(Number(card.amount))} zł
                      </span>
                    )}
                  </div>
                </motion.div>
                </div>
              ))}

              {colCards.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "var(--space-lg) var(--space-md)",
                  color: "var(--faint)", fontSize: "var(--text-xs)", fontWeight: 600,
                  letterSpacing: 0.6, textTransform: "uppercase",
                  border: "1.5px dashed var(--border)", borderRadius: "var(--radius-md)",
                }}>
                  Перетягніть сюди
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
