"use client";
/* iPhoenixCRM — Appointment Booking & Scheduling (Calendly style) */
import React, { useState } from "react";
import { Icon, Badge, Avatar } from "@/components/admin/ui";

export default function BookingPage() {
  const [eventTypes] = useState([
    { id: "EVT-01", title: "15-Min Discovery Call", duration: "15 min", type: "Free", link: "kompas.crm/meet/discovery", active: true, color: "var(--color-primary)" },
    { id: "EVT-02", title: "B2B Legal Consultation", duration: "60 min", type: "€150", link: "kompas.crm/meet/b2b-consult", active: true, color: "var(--color-success)" },
    { id: "EVT-03", title: "Document Review", duration: "30 min", type: "€50", link: "kompas.crm/meet/doc-review", active: true, color: "var(--color-warning)" },
    { id: "EVT-04", title: "Urgent VIP Call", duration: "45 min", type: "€300", link: "kompas.crm/meet/vip", active: false, color: "var(--color-danger)" }
  ]);

  const [upcoming] = useState([
    { id: "MEET-1", client: "Anna Smirnova", type: "15-Min Discovery Call", date: "Today, 14:30", via: "Google Meet", status: "confirmed" },
    { id: "MEET-2", client: "TechCorp Ltd", type: "B2B Legal Consultation", date: "Today, 16:00", via: "Zoom", status: "paid" },
    { id: "MEET-3", client: "Oleg V.", type: "Document Review", date: "Tomorrow, 10:00", via: "Phone Call", status: "pending" }
  ]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Appointment Booking</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Let clients schedule and pay for consultations without the back-and-forth emails.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Calendar Sync</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Event Type</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-xl)", overflowX: "auto", paddingBottom: 8 }}>
        {eventTypes.map(evt => (
          <div key={evt.id} className="kc-card" style={{ minWidth: 320, opacity: evt.active ? 1 : 0.6, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: evt.color }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="video" size={16} color="var(--dim)" />
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{evt.duration}</span>
              </div>
              <Badge status={evt.type === "Free" ? "default" : "success"} text={evt.type} />
            </div>
            <h3 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--text-lg)" }}>{evt.title}</h3>
            <a href="#" style={{ color: "var(--color-primary)", fontSize: "var(--text-sm)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              {evt.link} <Icon name="external-link" size={12} />
            </a>
            <div style={{ borderTop: "1px solid var(--border)", marginTop: "var(--space-md)", paddingTop: "var(--space-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px" }}><Icon name="copy" size={14} /> Copy Link</button>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--dim)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: evt.active ? "var(--color-success)" : "var(--dim)" }}></div>
                {evt.active ? "ON" : "OFF"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)" }}>Upcoming Meetings</h3>
      <div style={{ background: "var(--panel)", borderRadius: 12, border: "1px solid var(--border)", flex: 1, overflowY: "auto" }}>
        {upcoming.map((meet, index) => (
          <div key={meet.id} style={{ 
            padding: "var(--space-md)", 
            borderBottom: index !== upcoming.length - 1 ? "1px solid var(--border)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
              <div style={{ width: 64, textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--fg)" }}>{meet.date.split(", ")[0]}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{meet.date.split(", ")[1]}</div>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border)" }}></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{meet.client}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="bookmark" size={14} /> {meet.type}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
              <Badge status={meet.status === "paid" ? "success" : meet.status === "pending" ? "warning" : "info"} text={meet.status.toUpperCase()} />
              <button className="kc-btn kc-btn-primary" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Icon name="video" size={14} /> Join {meet.via}
              </button>
              <button className="kc-btn kc-btn-ghost"><Icon name="more-vertical" size={16} /></button>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && (
          <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--dim)" }}>
            <Icon name="calendar" size={48} color="var(--border)" style={{ marginBottom: 16 }} />
            <div>No upcoming meetings.</div>
          </div>
        )}
      </div>
    </div>
  );
}
