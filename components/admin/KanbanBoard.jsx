"use client";
import React, { useState } from "react";
import { Icon, Avatar } from "./ui";
import { motion } from "framer-motion";

export default function KanbanBoard({ columns, cards, onCardMove, onCardClick }) {
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);

  const handleDragStart = (e, cardId) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
    setTimeout(() => { e.target.style.opacity = "0.5"; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedCardId(null);
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
      const card = cards.find(c => String(c.id) === cardId);
      if (card && String(card.columnId) !== String(colId)) {
        onCardMove(cardId, colId);
      }
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto w-full pb-6 custom-scrollbar min-h-[calc(100vh-200px)]">
      {columns.map((col) => {
        const colCards = cards.filter(c => String(c.columnId) === String(col.id));
        const totalAmount = colCards.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        
        // Extract border color for glow effects from tailwind class or fallback
        const borderColorClass = col.color?.split(' ').find(c => c.startsWith('border-')) || 'border-gray-500';
        const isDraggedOver = dragOverColId === col.id;
        
        return (
          <div 
            key={col.id}
            className={`flex-none w-[340px] rounded-2xl flex flex-col bg-white/5 border transition-all duration-300
              ${isDraggedOver ? `border-2 border-dashed ${borderColorClass}` : 'border border-white/10'}
              shadow-[0_8px_30px_rgba(0,0,0,0.12)]`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className={`p-5 border-b border-white/10 border-t-[4px] rounded-t-2xl ${borderColorClass} bg-black/20`}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="m-0 text-lg font-bold tracking-tight text-gray-200">{col.title}</h3>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-xs text-gray-400 font-bold">
                  {colCards.length}
                </span>
              </div>
              {totalAmount > 0 && (
                <div className="text-xs text-gray-500 font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
                </div>
              )}
            </div>

            {/* Column Body (Drop Zone) */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              {colCards.map(card => {
                let sourceIcon = "message-circle";
                let sourceColor = "text-gray-400";
                const sLower = (card.tags?.[0] || "").toLowerCase();
                if (sLower.includes("telegram")) { sourceIcon = "send"; sourceColor = "text-blue-400"; }
                else if (sLower.includes("viber")) { sourceIcon = "phone"; sourceColor = "text-purple-400"; }
                else if (sLower.includes("facebook") || sLower.includes("fb")) { sourceIcon = "facebook"; sourceColor = "text-blue-600"; }
                else if (sLower.includes("instagram") || sLower.includes("ig")) { sourceIcon = "instagram"; sourceColor = "text-pink-500"; }

                return (
                  <div key={card.id} className="perspective-1000">
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -4,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, String(card.id))}
                      onDragEnd={handleDragEnd}
                      onClick={() => onCardClick && onCardClick(card)}
                      className="rounded-xl p-5 cursor-grab flex flex-col gap-3 relative overflow-hidden bg-[#0f0f0f] border border-white/10 shadow-lg group transition-colors hover:border-white/20"
                    >
                      {/* Left color bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${col.color?.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-500'}`} />
                      
                      {/* Top right subtle glow */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full pointer-events-none" />

                      {/* Title */}
                      <div className="text-sm font-bold text-gray-200 break-words pr-4 leading-snug">
                        {card.title}
                      </div>
                      
                      {/* Subtitle / Urgency */}
                      {card.subtitle && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border font-bold
                            ${card.isUrgent ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                            <Icon name="clock" size={10} />
                            {card.subtitle}
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">{card.timeAgo}</span>
                        </div>
                      )}

                      {/* Source */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                        <Icon name={sourceIcon} size={12} className={sourceColor} />
                        <span>{card.tags?.[0] || "Direct"}</span>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Avatar name={card.assignee?.name || "Unassigned"} size={20} />
                          <span className="text-xs text-gray-500 font-medium">{card.assignee?.name || "Не призначено"}</span>
                        </div>
                        {card.amount > 0 && (
                          <div className="text-xs font-bold text-blue-400">
                            {card.amount} zł
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
              
              {colCards.length === 0 && (
                <div className="text-center p-8 text-gray-600 text-xs font-semibold border-2 border-dashed border-white/5 rounded-xl uppercase tracking-wider">
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
