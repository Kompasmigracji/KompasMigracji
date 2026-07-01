"use client";
import React, { useState } from "react";
import { Icon, Avatar, Badge } from "./ui";
import { motion, AnimatePresence } from "framer-motion";

export default function KanbanBoard({ columns, cards, onCardMove, onCardClick }) {
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);

  const handleDragStart = (e, cardId) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);
    
    // Custom drag image (optional, makes it look cleaner)
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedCardId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
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
      // Find current col to prevent unnecessary updates
      const card = cards.find(c => String(c.id) === cardId);
      if (card && String(card.columnId) !== String(colId)) {
        onCardMove(cardId, colId);
      }
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      gap: "21px", // Fibonacci
      overflowX: "auto", 
      width: "100%",
      paddingBottom: "21px", // Fibonacci
      minHeight: "calc(100vh - 233px)" // Fibonacci approximation
    }}>
      {columns.map((col) => {
        const colCards = cards.filter(c => String(c.columnId) === String(col.id));
        const totalAmount = colCards.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        
        return (
          <div 
            key={col.id}
            className="premium-glass"
            style={{
              flex: "0 0 377px", // Fibonacci
              borderRadius: 21, // Fibonacci
              display: "flex",
              flexDirection: "column",
              border: dragOverColId === col.id ? `2px dashed ${col.color || 'var(--color-primary)'}` : "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 8px 34px rgba(0,0,0,0.03)", // Fibonacci
              transition: "border-color 0.2s"
            }}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div style={{ 
              padding: "21px", // Fibonacci
              borderBottom: "1px solid var(--border)",
              borderTop: `5px solid ${col.color || 'var(--border)'}`, // Fibonacci
              borderTopLeftRadius: 21, // Fibonacci
              borderTopRightRadius: 21, // Fibonacci
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em" }}>{col.title}</h3>
                <span style={{ 
                  background: "var(--panel)", padding: "2px 8px", 
                  borderRadius: 12, fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 
                }}>
                  {colCards.length}
                </span>
              </div>
              {totalAmount > 0 && (
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                  Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
                </div>
              )}
            </div>

            {/* Column Body (Drop Zone) */}
            <div style={{ 
              flex: 1, 
              padding: "13px", // Fibonacci
              display: "flex", 
              flexDirection: "column", 
              gap: "13px", // Fibonacci
              overflowY: "auto"
            }}>
              {colCards.map(card => {
                // Parse source to pick an icon (telegram, viber, fb, etc)
                let sourceIcon = "message-circle";
                let sourceColor = "var(--dim)";
                const sLower = (card.tags?.[0] || "").toLowerCase();
                if (sLower.includes("telegram")) { sourceIcon = "send"; sourceColor = "#3b82f6"; }
                else if (sLower.includes("viber")) { sourceIcon = "phone"; sourceColor = "#a855f7"; }
                else if (sLower.includes("facebook") || sLower.includes("fb")) { sourceIcon = "facebook"; sourceColor = "#3b5998"; }
                else if (sLower.includes("instagram") || sLower.includes("ig")) { sourceIcon = "instagram"; sourceColor = "#e1306c"; }

                return (
                <div key={card.id} style={{ perspective: "1000px" }}>
                  <motion.div
                    layout
                    className="premium-card"
                    initial={{ opacity: 0, scale: 0.95, rotateX: -5 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.03, // Golden ratio subtle scale
                      rotateX: 3, // Fibonacci
                      rotateY: -3, // Fibonacci
                      boxShadow: "21px 21px 55px rgba(0,0,0,0.08), -13px -13px 34px rgba(255,255,255,0.5)", // Fibonacci
                      y: -5 // Fibonacci
                    }}
                    whileTap={{ scale: 0.98, rotateX: 0, rotateY: 0 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, String(card.id))}
                    onDragEnd={handleDragEnd}
                    onClick={() => onCardClick && onCardClick(card)}
                    style={{
                      borderRadius: 13, // Fibonacci
                      padding: "21px", // Fibonacci
                      cursor: "grab",
                      display: "flex",
                      flexDirection: "column",
                      gap: 13, // Fibonacci
                      position: "relative",
                      overflow: "hidden",
                      transformStyle: "preserve-3d"
                    }}
                  >
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 5, background: col.color || 'var(--border)' }} />
                  <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at top right, ${col.color}15, transparent 70%)` }} />
                  {/* Lead Title & Main Info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", wordBreak: "break-word" }}>
                      {card.title}
                    </div>
                  </div>
                  
                  {/* Time Badge / Subtitle */}
                  {card.subtitle && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ 
                        background: card.isUrgent ? "var(--color-danger)" : "var(--border)", 
                        color: card.isUrgent ? "#fff" : "var(--text)", 
                        fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 4
                      }}>
                        <Icon name="clock" size={10} />
                        {card.subtitle}
                      </div>
                      <span style={{ fontSize: 11, color: "var(--dim)" }}>{card.timeAgo || ""}</span>
                    </div>
                  )}

                  {/* Source and Name/Contact */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--dim)" }}>
                    <Icon name={sourceIcon} size={14} color={sourceColor} />
                    <span>{card.tags?.[0] || "Direct"}</span>
                  </div>

                  {/* Assignee Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5, paddingTop: 13, borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={card.assignee?.name || "Unassigned"} size={21} />
                      <span style={{ fontSize: 13, color: "var(--dim)" }}>{card.assignee?.name || "Не призначено"}</span>
                    </div>
                    {card.amount > 0 && (
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-primary)" }}>
                        {card.amount} zł
                      </div>
                    )}
                  </div>
                  </motion.div>
                </div>
              )})}
              
              {colCards.length === 0 && (
                <div style={{ 
                  textAlign: "center", padding: "var(--space-xl) var(--space-md)", 
                  color: "var(--faint)", fontSize: "var(--text-xs)", 
                  border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" 
                }}>
                  Drag deals here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
