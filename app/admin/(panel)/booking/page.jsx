"use client";
/* iPhoenixCRM — Office Appointments (E-Kolejka) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function BookingPage() {
  const [appointments] = useState([
    { id: "APT-201", client: "Ivan Petrov", purpose: "Sign Power of Attorney", time: "10:00 AM", duration: "30 min", lawyer: "Maria Garcia", room: "Room 1 (Warsaw)", status: "completed" },
    { id: "APT-202", client: "Anna Schmidt", purpose: "Original Documents Handover", time: "11:30 AM", duration: "15 min", lawyer: "Alex Jenkins", room: "Room 2 (Warsaw)", status: "in_office" },
    { id: "APT-203", client: "Rajesh Kumar", purpose: "TRC Initial Consultation", time: "14:00 PM", duration: "60 min", lawyer: "Oleg V.", room: "Room 1 (Warsaw)", status: "upcoming" },
    { id: "APT-204", client: "TechCorp HR", purpose: "B2B Contract Signing", time: "16:30 PM", duration: "45 min", lawyer: "Maria Garcia", room: "VIP Lounge", status: "canceled" }
  ]);

  const columns = [
    { header: "Time", cell: (row) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 700, fontSize: "16px", color: row.status === "in_office" ? "var(--color-primary)" : "var(--fg)" }}>{row.time}</span>
        <span style={{ fontSize: "12px", color: "var(--dim)" }}>{row.duration}</span>
      </div>
    )},
    { header: "Client", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.client.substring(0,2).toUpperCase()} size={36} />
        <span style={{ fontWeight: 600 }}>{row.client}</span>
      </div>
    )},
    { header: "Purpose", cell: (row) => (
      <span style={{ fontSize: "var(--text-sm)" }}>{row.purpose}</span>
    )},
    { header: "Lawyer / Agent", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="user" size={14} color="var(--dim)" />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.lawyer}</span>
      </div>
    )},
    { header: "Room", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.room}</span> },
    { header: "Status", cell: (row) => {
      let color = "primary";
      let text = row.status.toUpperCase().replace("_", " ");
      if (row.status === "completed") color = "success";
      if (row.status === "canceled") color = "default";
      if (row.status === "upcoming") color = "warning";
      return <Badge status={color} text={text} />;
    }},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "upcoming" && (
          <button className="kc-btn kc-btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }}>Check In</button>
        )}
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Office Appointments</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage daily schedules, physical office visits, and electronic queuing.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="link" size={16} /> Copy Booking Link</button>
          <button className="kc-btn kc-btn-primary"><Icon name="calendar" size={16} /> New Appointment</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Date Picker & Stats Card */}
        <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--space-lg)", background: "var(--panel-2)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", borderRadius: 12, padding: "12px 24px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "12px", color: "var(--color-primary)", fontWeight: 700, textTransform: "uppercase" }}>Tuesday</span>
            <span style={{ fontSize: "36px", fontWeight: 800 }}>09</span>
            <span style={{ fontSize: "12px", color: "var(--dim)" }}>June 2026</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: "13px", color: "var(--dim)" }}>Total Today</span>
              <span style={{ fontWeight: 700 }}>14 Visits</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: "13px", color: "var(--color-success)" }}>Completed</span>
              <span style={{ fontWeight: 700, color: "var(--color-success)" }}>4</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "var(--color-primary)" }}>Currently in Office</span>
              <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>2</span>
            </div>
          </div>
        </div>

        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Room Availability</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>2 / 4</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Rooms currently occupied.</div>
        </div>
        
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Wait Time</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>4 min</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Clients waiting in reception.</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center", background: "var(--panel)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by client name or purpose..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 160 }}>
            <option>All Lawyers</option>
            <option>Maria Garcia</option>
            <option>Alex Jenkins</option>
            <option>Oleg V.</option>
          </select>
          <select className="kc-input" style={{ width: 160 }}>
            <option>Warsaw Office</option>
            <option>Krakow Office</option>
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataTable columns={columns} data={appointments} />
        </div>
      </div>
    </div>
  );
}
