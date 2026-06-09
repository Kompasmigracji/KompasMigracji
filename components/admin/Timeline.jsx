"use client";
/* KompasCRM — Chronological Activity Timeline Component */
import React, { useEffect, useState, useCallback } from "react";
import { Icon, Spinner, EmptyState } from "./ui";

const TYPE_ICONS = {
  note: { name: "clipboard", color: "var(--color-primary)", bg: "var(--brass-bg)" },
  email: { name: "send", color: "var(--color-info)", bg: "rgba(95, 155, 213, 0.1)" },
  call: { name: "activity", color: "var(--color-success)", bg: "rgba(95, 184, 122, 0.1)" },
  meeting: { name: "users", color: "var(--color-warning)", bg: "rgba(229, 168, 75, 0.1)" },
  status_change: { name: "zap", color: "var(--color-info)", bg: "rgba(95, 155, 213, 0.1)" },
  file: { name: "file", color: "var(--color-primary)", bg: "var(--brass-bg)" },
  system: { name: "cpu", color: "var(--faint)", bg: "var(--panel-2)" },
};

const TYPE_LABELS = {
  note: "Нотатка",
  email: "Надіслано Email",
  call: "Дзвінок",
  meeting: "Зустріч / Запис",
  status_change: "Зміна статусу",
  file: "Файл",
  system: "Системна подія",
};

export default function Timeline({ entityType, entityId }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState("note");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/activities?entity_type=${entityType}&entity_id=${entityId}`);
      const d = await res.json();
      setActivities(d.activities || []);
    } catch {
      setError("Помилка при завантаженні історії");
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (entityType && entityId) {
      loadActivities();
    }
  }, [entityType, entityId, loadActivities]);

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setBusy(true);
    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: String(entityId),
          type: noteType,
          title: TYPE_LABELS[noteType] || "Коментар",
          body: noteText,
        }),
      });

      const d = await res.json();
      if (d.error) {
        setError(d.error);
      } else {
        setNoteText("");
        // Prepend new activity
        setActivities((prev) => [d.activity, ...prev]);
      }
    } catch {
      setError("Не вдалося відправити повідомлення");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      
      {/* Note creation box */}
      <form onSubmit={handleSubmitNote} className="kc-card" style={{ padding: "var(--space-md)", background: "var(--panel-2)" }}>
        <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <select 
            className="kc-select" 
            value={noteType} 
            onChange={(e) => setNoteType(e.target.value)}
            style={{ width: "auto", minHeight: 32, padding: "4px 8px" }}
          >
            <option value="note">📝 Нотатка</option>
            <option value="call">📞 Дзвінок</option>
            <option value="meeting">🤝 Зустріч</option>
          </select>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--faint)", alignSelf: "center" }}>
            Додати запис у стрічку активності
          </span>
        </div>

        <textarea 
          className="kc-textarea" 
          placeholder="Напишіть нотатку, деталі дзвінка або коментар..." 
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          style={{ minHeight: 80, fontSize: "var(--text-sm)", padding: 8, background: "var(--bg)", fontFamily: "var(--font-body)" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-sm)" }}>
          {error ? (
            <span style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)" }}>{error}</span>
          ) : (
            <span />
          )}
          <button 
            type="submit" 
            className="kc-btn kc-btn-primary" 
            disabled={busy || !noteText.trim()} 
            style={{ minHeight: 32, padding: "4px 16px" }}
          >
            {busy ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </form>

      {/* Timeline items list */}
      {isLoading ? (
        <Spinner />
      ) : activities.length === 0 ? (
        <EmptyState title="Історія пуста" description="Жодних взаємодій чи подій ще не зареєстровано." icon="clock" />
      ) : (
        <div style={{ position: "relative", paddingLeft: "var(--space-lg)" }}>
          
          {/* Vertical line through timeline */}
          <div style={{ 
            position: "absolute", left: 16, top: 12, bottom: 12, 
            width: 2, background: "var(--border)", zIndex: 1 
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {activities.map((act) => {
              const cfg = TYPE_ICONS[act.type] || TYPE_ICONS.note;
              return (
                <div key={act.id} style={{ display: "flex", gap: "var(--space-md)", position: "relative", zIndex: 2 }}>
                  
                  {/* Timeline icon circle wrapper */}
                  <div style={{ 
                    width: 32, height: 32, borderRadius: "50%", background: cfg.bg, 
                    border: "2px solid var(--border)", display: "flex", alignItems: "center", 
                    justifyContent: "center", color: cfg.color, flexShrink: 0, marginLeft: -24 
                  }}>
                    <Icon name={cfg.name} size={14} />
                  </div>

                  {/* Activity content card */}
                  <div className="kc-card" style={{ flex: 1, padding: "var(--space-md)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>
                        {act.title || TYPE_LABELS[act.type] || "Подія"}
                      </span>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--faint)" }}>
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>

                    {act.body && (
                      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text)", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                        {act.body}
                      </p>
                    )}

                    {act.actor_name && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                        <Icon name="user" size={12} color="var(--faint)" />
                        <span>Виконавець: {act.actor_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
