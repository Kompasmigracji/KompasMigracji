"use client";
/* KompasCRM — Cloud Call Center & VoIP */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function CallCenterPage() {
  const [calls] = useState([]);

  const [activeCall, setActiveCall] = useState(false);
  const [callTimer, setCallTimer] = useState("00:00");

  const simulateCall = () => {
    setActiveCall(true);
    setCallTimer("00:01");
    // Just a visual simulation
  };

  const endCall = () => {
    setActiveCall(false);
    setCallTimer("00:00");
  };

  const columns = [
    { header: "Contact / Number", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.contact.substring(0,2).toUpperCase()} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.contact}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>{row.phone}</div>
        </div>
      </div>
    )},
    { header: "Direction", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name={row.direction === "Inbound" ? "arrow-down-left" : "arrow-up-right"} size={14} color={row.direction === "Inbound" ? "var(--color-primary)" : "var(--color-success)"} />
        <span style={{ fontWeight: 500 }}>{row.direction}</span>
      </div>
    )},
    { header: "Date & Duration", cell: (row) => (
      <div>
        <div style={{ fontSize: "var(--text-sm)" }}>{row.time}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>{row.duration}</div>
      </div>
    )},
    { header: "Outcome", cell: (row) => (
      <Badge status="default" text={row.outcome} />
    )},
    { header: "Agent", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.agent}</span> },
    { header: "Recording", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.duration !== "00:00" ? (
          <button className="kc-btn kc-btn-ghost" title="Play Recording"><Icon name="play-circle" size={16} color="var(--color-primary)" /></button>
        ) : (
          <span style={{ color: "var(--dim)", fontSize: "12px" }}>N/A</span>
        )}
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Call Center & VoIP Dialer</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Make and receive calls directly from your browser. All calls are recorded and logged.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="headphones" size={16} /> Audio Settings</button>
          <button className="kc-btn kc-btn-primary" onClick={simulateCall} disabled={activeCall}><Icon name="phone" size={16} /> Open Web Dialer</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Calls (Today)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>142</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Avg Talk Time</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-primary)" }}>04:15</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-danger)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Missed Calls</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-danger)" }}>3</div>
        </div>
      </div>

      {/* Active Web Dialer Overlay (Simulated) */}
      {activeCall && (
        <div className="kc-card" style={{ marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f172a", border: "1px solid var(--color-primary)", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
            <div style={{ position: "relative" }}>
              <Avatar name="IP" size={56} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, background: "var(--color-success)", border: "2px solid #0f172a" }}></div>
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="phone-call" size={12} /> CALL IN PROGRESS
              </div>
              <div style={{ fontWeight: 600, fontSize: "var(--text-lg)" }}>Ivan Petrov</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", fontFamily: "monospace" }}>+48 555 123 456</div>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xl)" }}>
            <div style={{ fontFamily: "monospace", fontSize: "32px", fontWeight: 700, color: "white" }}>{callTimer}</div>
            
            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-secondary" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}><Icon name="mic-off" size={16} /></button>
              <button className="kc-btn kc-btn-secondary" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}><Icon name="pause" size={16} /></button>
              <button className="kc-btn kc-btn-primary" style={{ background: "var(--color-danger)", border: "none" }} onClick={endCall}><Icon name="phone-off" size={16} /> End Call</button>
            </div>
          </div>
        </div>
      )}

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by number or contact name..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Calls</option>
            <option>Inbound</option>
            <option>Outbound</option>
            <option>Missed</option>
          </select>
        </div>
        <DataTable columns={columns} data={calls} />
      </div>
    </div>
  );
}
