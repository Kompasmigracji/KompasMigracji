"use client";
/* iPhoenixCRM — AI Meeting Intelligence (Otter.ai / Fireflies.ai style) */
import React, { useState } from "react";
import { Icon, Badge, Avatar } from "@/components/admin/ui";

export default function TranscriptsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState(0);

  const meetings = [
    { id: "MTG-104", client: "Elena Rostova", type: "Discovery Call", duration: "45m 12s", date: "Today, 14:00", sentiment: "positive" },
    { id: "MTG-103", client: "Alexey Volkov", type: "Visa Consultation", duration: "1h 10m", date: "Yesterday, 10:30", sentiment: "neutral" },
    { id: "MTG-102", client: "TechCorp Ltd.", type: "B2B Partnership", duration: "32m 45s", date: "May 25, 2026", sentiment: "positive" },
    { id: "MTG-101", client: "Ivan Ivanov", type: "Urgent Support", duration: "14m 20s", date: "May 24, 2026", sentiment: "negative" }
  ];

  const meeting = meetings[selectedMeeting];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>AI Call Intelligence</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Automatically transcribe meetings, extract action items, and analyze sentiment.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="video" size={16} /> Join Zoom/Meet</button>
          <button className="kc-btn kc-btn-primary"><Icon name="mic" size={16} /> Record Now</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden" }}>
        
        {/* Left Sidebar: Meetings List */}
        <div className="kc-card" style={{ width: 300, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", background: "var(--panel-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", padding: "6px 10px", borderRadius: 6 }}>
              <Icon name="search" size={14} color="var(--dim)" />
              <input type="text" placeholder="Search transcripts..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-xs)" }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {meetings.map((m, idx) => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMeeting(idx)}
                style={{ 
                  padding: "var(--space-md)", 
                  borderBottom: "1px solid var(--border)", 
                  cursor: "pointer",
                  background: selectedMeeting === idx ? "color-mix(in srgb, var(--color-primary) 10%, var(--bg))" : "transparent",
                  borderLeft: selectedMeeting === idx ? "3px solid var(--color-primary)" : "3px solid transparent"
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", marginBottom: 4 }}>{m.client}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", justifyContent: "space-between" }}>
                  <span>{m.type}</span>
                  <span>{m.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Transcript Viewer */}
        <div className="kc-card" style={{ flex: 2, display: "flex", flexDirection: "column", padding: 0 }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="kc-h3" style={{ margin: 0, fontSize: "var(--text-md)" }}>{meeting.client} — {meeting.type}</h3>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>{meeting.date} • {meeting.duration}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="kc-btn kc-btn-ghost"><Icon name="play-circle" size={16} /> Audio</button>
              <button className="kc-btn kc-btn-ghost"><Icon name="download" size={16} /> PDF</button>
            </div>
          </div>
          
          <div style={{ flex: 1, padding: "var(--space-md)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Avatar name="Alex Jenkins" size={32} />
              <div style={{ background: "var(--panel-2)", padding: 12, borderRadius: 8, borderTopLeftRadius: 0, flex: 1 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4 }}>Alex Jenkins (00:01)</div>
                <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.5 }}>
                  Hi Elena, thank you for joining the call today. How can we assist you with your visa application?
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 12, flexDirection: "row-reverse" }}>
              <Avatar name="Elena Rostova" size={32} />
              <div style={{ background: "color-mix(in srgb, var(--color-primary) 10%, var(--bg))", padding: 12, borderRadius: 8, borderTopRightRadius: 0, flex: 1 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4, textAlign: "right" }}>Elena Rostova (00:08)</div>
                <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.5 }}>
                  Hello Alex. I need to apply for a D-type visa for Poland, but I am not sure about the financial requirements. Do I need to show my bank statements for the last 6 months?
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <Avatar name="Alex Jenkins" size={32} />
              <div style={{ background: "var(--panel-2)", padding: 12, borderRadius: 8, borderTopLeftRadius: 0, flex: 1 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4 }}>Alex Jenkins (00:22)</div>
                <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.5 }}>
                  Yes, exactly. The consulate requires a certified bank statement for the last 6 months showing a minimum balance. I will send you the exact checklist of documents right after our call.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Insights */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)", overflowY: "auto" }}>
          
          <div className="kc-card">
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="zap" size={16} color="var(--color-primary)" /> AI Summary
            </h3>
            <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--fg)" }}>
              The client is applying for a Polish D-Type visa and inquired about the financial proof requirements. Alex confirmed that 6 months of bank statements are required and promised to send the document checklist.
            </p>
          </div>

          <div className="kc-card">
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="check-square" size={16} color="var(--color-success)" /> Action Items
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "var(--panel-2)", padding: 8, borderRadius: 6 }}>
                <input type="checkbox" style={{ marginTop: 4 }} />
                <span style={{ fontSize: "var(--text-sm)" }}>Send D-Type Visa Document Checklist to Elena. <Badge status="info" text="Assigned: Alex" /></span>
              </div>
            </div>
            <button className="kc-btn kc-btn-secondary" style={{ width: "100%", marginTop: "var(--space-md)", justifyContent: "center" }}>
              Sync to Taiga/Tasks
            </button>
          </div>

          <div className="kc-card">
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="pie-chart" size={16} color="var(--color-warning)" /> Meeting Metrics
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--dim)" }}>Talk Ratio</span>
                <span style={{ fontWeight: 600 }}>Rep 45% / Client 55%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--dim)" }}>Sentiment</span>
                <Badge status={meeting.sentiment === "positive" ? "success" : meeting.sentiment === "negative" ? "danger" : "default"} text={meeting.sentiment.toUpperCase()} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                <span style={{ color: "var(--dim)" }}>Longest Monologue</span>
                <span style={{ fontWeight: 600 }}>2m 14s (Client)</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
