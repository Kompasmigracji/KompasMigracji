"use client";
import React, { useState, useEffect } from "react";
import { Icon, Spinner, EmptyState } from "./ui";

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchNotifications();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="kc-modal-bg" style={{ justifyContent: "flex-end", padding: 0 }} onClick={onClose}>
      <div 
        className="kc-modal" 
        style={{ 
          height: "100vh", width: "100%", maxWidth: 400, margin: 0, 
          borderRadius: 0, display: "flex", flexDirection: "column",
          animation: "kc-fade-left 0.2s ease-out"
        }} 
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes kc-fade-left {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>Notifications</h2>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            {unreadCount > 0 && (
              <button className="kc-btn kc-btn-ghost" onClick={markAllAsRead} style={{ fontSize: 12, padding: "4px 8px" }}>
                Mark all read
              </button>
            )}
            <button className="kc-btn kc-btn-ghost" onClick={onClose} style={{ padding: "4px 8px" }}>
              <Icon name="x" size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", margin: "0 -var(--space-lg)", padding: "0 var(--space-lg)" }}>
          {isLoading ? (
            <Spinner />
          ) : notifications.length === 0 ? (
            <div style={{ marginTop: "40px" }}>
              <EmptyState title="All caught up!" description="You don't have any notifications right now." icon="bell" />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  style={{ 
                    padding: "var(--space-md)", borderRadius: "var(--radius-md)", 
                    background: n.is_read ? "var(--bg)" : "var(--panel-2)",
                    borderLeft: n.is_read ? "none" : "3px solid var(--color-primary)",
                    cursor: "pointer", transition: "background 0.2s"
                  }}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-xs)" }}>
                    <strong style={{ fontSize: "var(--text-sm)", color: n.is_read ? "var(--dim)" : "var(--text)" }}>{n.title}</strong>
                    <span style={{ fontSize: 11, color: "var(--faint)" }}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--dim)" }}>{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
