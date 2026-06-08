"use client";
import React, { useState } from "react";
import { Icon, Avatar, Badge } from "./ui";

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
      gap: "var(--space-md)", 
      overflowX: "auto", 
      paddingBottom: "var(--space-md)",
      minHeight: "calc(100vh - 200px)"
    }}>
      {columns.map((col) => {
        const colCards = cards.filter(c => String(c.columnId) === String(col.id));
        const totalAmount = colCards.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        
        return (
          <div 
            key={col.id}
            style={{
              flex: "0 0 300px",
              background: "var(--panel-2)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              border: dragOverColId === col.id ? `2px dashed ${col.color || 'var(--color-primary)'}` : "2px solid transparent",
              transition: "border-color 0.2s"
            }}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div style={{ 
              padding: "var(--space-md)", 
              borderBottom: "1px solid var(--border)",
              borderTop: `4px solid ${col.color || 'var(--border)'}`,
              borderTopLeftRadius: "var(--radius-lg)",
              borderTopRightRadius: "var(--radius-lg)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600 }}>{col.title}</h3>
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
              padding: "var(--space-sm)", 
              display: "flex", 
              flexDirection: "column", 
              gap: "var(--space-sm)",
              overflowY: "auto"
            }}>
              {colCards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, String(card.id))}
                  onDragEnd={handleDragEnd}
                  onClick={() => onCardClick && onCardClick(card)}
                  style={{
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-md)",
                    cursor: "grab",
                    boxShadow: "var(--shadow-sm)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    borderLeft: `3px solid ${col.color || 'var(--border)'}`
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text)" }}>
                      {card.title}
                    </div>
                    {card.badge && (
                      <Badge status={card.badge.status} text={card.badge.text} />
                    )}
                  </div>
                  
                  {card.subtitle && (
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 8 }}>
                      {card.subtitle}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-sm)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {card.tags?.map((tag, i) => (
                        <span key={i} style={{ 
                          fontSize: 10, padding: "2px 6px", background: "var(--panel-2)", 
                          borderRadius: 4, color: "var(--faint)", textTransform: "uppercase" 
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {card.assignee && (
                      <Avatar name={card.assignee.name} size={24} />
                    )}
                  </div>
                </div>
              ))}
              
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
