"use client";
/* KompasCRM — Kanban Board (premium glass, matches /admin/crm design language).
   Used on /admin/crm/funnels, /admin/crm/deals, and the legacy /admin/leads, /admin/deals.
   API: columns [{id,title,color}], cards [{id,title,subtitle,columnId,amount,tags,assignee,timeAgo,isUrgent}]
   `color` should be a real color (#hex / rgb / hsl) — CSS custom properties like
   var(--color-info) or Tailwind class strings are NOT resolvable here and are
   filtered out via cssColor() below, falling back to a neutral blue. */
import React, { useState } from "react";
import { Icon, Avatar } from "./ui";
import { motion } from "framer-motion";

function cssColor(value, fallback = "#3b82f6") {
  if (typeof value !== "string") return fallback;
  const v = value.trim();
  if (v.startsWith("#") || v.startsWith("rgb") || v.startsWith("hsl")) return v;
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
    <div className="flex gap-5 items-start overflow-x-auto pb-4 min-h-[420px]">
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
            className="relative flex-none w-[300px] flex flex-col rounded-2xl overflow-hidden
                       bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl
                       border border-black/10 dark:border-white/10
                       shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                       transition-[border-color,box-shadow] duration-300"
            style={{
              borderTop: `3px solid ${color}`,
              ...(isDraggedOver
                ? { boxShadow: `0 0 0 3px ${color}33`, borderColor: color }
                : {}),
            }}
          >
            {/* Ambient glow behind the header, echoes the stage color */}
            <div
              className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.12] dark:opacity-[0.18] blur-2xl"
              style={{ background: color }}
            />

            {/* Column header */}
            <div className="relative z-10 px-4 py-3.5 border-b border-black/10 dark:border-white/10 flex flex-col gap-1.5">
              <div className="flex justify-between items-center gap-2">
                <h3 className="m-0 text-sm font-bold text-gray-900 dark:text-white tracking-tight truncate">
                  {col.title}
                </h3>
                <span
                  className="shrink-0 text-xs font-extrabold px-2.5 py-0.5 rounded-full tabular-nums"
                  style={{ background: `${color}26`, color }}
                >
                  {colCards.length}
                </span>
              </div>
              {totalAmount > 0 && (
                <div className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">
                  {zl.format(totalAmount)} zł
                </div>
              )}
            </div>

            {/* Drop zone / cards */}
            <div className="relative z-10 flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto min-h-[130px] max-h-[calc(100vh-320px)]">
              {colCards.map((card) => (
                /* Native HTML5 DnD lives on this outer div — framer-motion
                   intercepts its own gesture props on the inner motion.div,
                   so onDragStart/onDragEnd never reach the DOM from there. */
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
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col gap-2 p-3.5 rounded-xl cursor-grab
                               bg-white dark:bg-[#161616] border border-black/10 dark:border-white/10
                               shadow-sm hover:shadow-lg dark:hover:shadow-black/40 transition-shadow duration-200"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-white leading-snug break-words">
                      {card.title}
                    </div>

                    {card.subtitle && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border ${
                            card.isUrgent
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-black/[0.03] dark:bg-white/5 text-gray-500 dark:text-gray-400 border-black/5 dark:border-white/10"
                          }`}
                        >
                          {card.subtitle}
                        </span>
                        {card.timeAgo && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">{card.timeAgo}</span>
                        )}
                      </div>
                    )}

                    {card.tags?.filter(Boolean).length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Icon name={sourceIcon(card.tags[0])} size={12} />
                        <span className="truncate">{card.tags.filter(Boolean).join(" · ")}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-2 border-t border-black/5 dark:border-white/10 pt-2 mt-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Avatar name={card.assignee?.name || "?"} size={20} hideName />
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {card.assignee?.name || "Не призначено"}
                        </span>
                      </div>
                      {Number(card.amount) > 0 && (
                        <span className="font-mono text-xs font-bold tabular-nums shrink-0" style={{ color }}>
                          {zl.format(Number(card.amount))} zł
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}

              {colCards.length === 0 && (
                <div className="text-center py-8 px-3 text-gray-400 dark:text-gray-600 text-xs font-bold uppercase tracking-wider border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
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
