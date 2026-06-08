"use client";
/* iPhoenixCRM — Event Management & Webinars */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function EventsPage() {
  const [events] = useState([
    { id: "EVT-01", name: "Blue Card & Relocation 2026", date: "June 15, 2026 • 18:00", type: "Webinar", rsvps: 245, attendees: "-", status: "upcoming", conversion: "—" },
    { id: "EVT-02", name: "Offline: Legal Meetup Krakow", date: "May 28, 2026 • 19:00", type: "Offline", rsvps: 50, attendees: 42, status: "completed", conversion: "14%" },
    { id: "EVT-03", name: "Karta Pobytu Basics (UA)", date: "May 10, 2026 • 17:00", type: "Webinar", rsvps: 800, attendees: 320, status: "completed", conversion: "22%" }
  ]);

  const [attendees] = useState([
    { id: 1, name: "Ivan Petrov", email: "ivan.p@example.com", status: "Registered", ticket: "Free", followUp: "Pending" },
    { id: 2, name: "Maria Garcia", email: "m.garcia@tech.es", status: "Attended", ticket: "VIP", followUp: "Contacted" },
    { id: 3, name: "Oleg V.", email: "oleg99@mail.ua", status: "No-Show", ticket: "Free", followUp: "Emailed" }
  ]);

  const columnsEvents = [
    { header: "Event Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.type === "Webinar" ? "monitor" : "map-pin"} size={20} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.date}</div>
        </div>
      </div>
    )},
    { header: "Type", cell: (row) => <Badge status="default" text={row.type} /> },
    { header: "RSVPs", cell: (row) => <span style={{ fontWeight: 600 }}>{row.rsvps}</span> },
    { header: "Attendees", cell: (row) => <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{row.attendees}</span> },
    { header: "Sales Conv.", cell: (row) => (
      <span style={{ fontSize: "var(--text-sm)", fontWeight: row.conversion !== "—" ? 700 : 400, color: row.conversion !== "—" ? "var(--color-primary)" : "var(--dim)" }}>
        {row.conversion}
      </span>
    )},
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "upcoming" ? "warning" : "success"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="users" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  const columnsAttendees = [
    { header: "Registrant", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.name.substring(0,2).toUpperCase()} size={28} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>{row.name}</div>
          <div style={{ fontSize: "11px", color: "var(--dim)" }}>{row.email}</div>
        </div>
      </div>
    )},
    { header: "Status", cell: (row) => {
      let color = "warning";
      if (row.status === "Attended") color = "success";
      if (row.status === "No-Show") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Follow-Up", cell: (row) => <span style={{ fontSize: "12px", color: "var(--dim)" }}>{row.followUp}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost" title="Create Lead"><Icon name="user-plus" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Events & Webinars</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Host webinars, collect RSVPs, and turn attendees into paying clients.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="calendar" size={16} /> Connect Zoom</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Event</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total RSVPs (This Month)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>1,095</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Attendance Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>46%</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Revenue from Events</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>€12,400</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden" }}>
        
        {/* Left: Event List */}
        <div className="kc-card" style={{ flex: 2, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
              <Icon name="search" size={16} color="var(--dim)" />
              <input type="text" placeholder="Search events..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
            </div>
            <select className="kc-input" style={{ width: 120 }}>
              <option>All Types</option>
              <option>Webinar</option>
              <option>Offline</option>
            </select>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <DataTable columns={columnsEvents} data={events} />
          </div>
        </div>

        {/* Right: Attendee List Preview */}
        <div className="kc-card" style={{ flex: 1, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: "rgba(59, 130, 246, 0.05)", border: "1px solid var(--color-primary)" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", background: "var(--panel)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "14px" }}>Attendees Preview</h3>
            <Badge status="primary" text="Blue Card Webinar" />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <DataTable columns={columnsAttendees} data={attendees} />
          </div>
          <div style={{ padding: "var(--space-md)", background: "var(--panel)", borderTop: "1px solid var(--border)" }}>
            <button className="kc-btn kc-btn-primary" style={{ width: "100%" }}>Create Follow-up Campaign</button>
          </div>
        </div>

      </div>
    </div>
  );
}
