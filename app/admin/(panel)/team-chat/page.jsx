"use client";
/* KompasCRM — Team Chat & Internal Comms (Slack style) */
import React, { useState } from "react";
import { Icon, Avatar, Badge } from "@/components/admin/ui";

export default function TeamChatPage() {
  const [channels] = useState([
    { id: "C-1", name: "general", unread: 0, active: false },
    { id: "C-2", name: "sales-team", unread: 3, active: true },
    { id: "C-3", name: "legal-updates", unread: 0, active: false },
    { id: "C-4", name: "marketing", unread: 12, active: false }
  ]);

  const [dms] = useState([
    { id: "U-1", name: "Alex Jenkins", status: "online", unread: 0 },
    { id: "U-2", name: "Maria Garcia", status: "offline", unread: 1 },
    { id: "U-3", name: "Oleg V.", status: "online", unread: 0 }
  ]);

  const [messages] = useState([
    { id: "M-1", user: "Maria Garcia", time: "10:15 AM", text: "Hey team, did we get the approval for TechCorp?", avatar: "MG" },
    { id: "M-2", user: "Alex Jenkins", time: "10:18 AM", text: "Yes! They just signed the contract via DocuSign.", avatar: "AJ" },
    { id: "M-3", user: "Maria Garcia", time: "10:20 AM", text: "Awesome! I'll update the CRM record.", avatar: "MG" },
    { id: "M-4", user: "System Copilot", time: "10:21 AM", text: "🤖 Record Updated: Deal 'TechCorp B2B Relocation' moved to WON.", isSystem: true }
  ]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", margin: "-var(--space-lg)" }}>
      
      {/* Header */}
      <div style={{ padding: "var(--space-md) var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <h2 className="kc-h3" style={{ margin: 0 }}>Team Workspace</h2>
          <Badge status="success" text="Online: 12" />
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "4px 12px", borderRadius: 16 }}>
            <Icon name="search" size={14} color="var(--dim)" />
            <input type="text" placeholder="Search messages..." style={{ border: "none", background: "transparent", outline: "none", fontSize: "var(--text-xs)" }} />
          </div>
          <button className="kc-btn kc-btn-ghost"><Icon name="bell" size={16} /></button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Sidebar */}
        <div style={{ width: 260, background: "var(--panel)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "var(--space-md)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--dim)", textTransform: "uppercase" }}>Channels</div>
            <button className="kc-btn kc-btn-ghost" style={{ padding: 2 }}><Icon name="plus" size={14} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "var(--space-xl)" }}>
            {channels.map(c => (
              <div key={c.id} style={{ 
                padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                background: c.active ? "var(--color-primary)" : "transparent",
                color: c.active ? "white" : "var(--fg)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontWeight: c.unread > 0 ? 600 : 400
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ opacity: 0.5 }}>#</span> {c.name}
                </div>
                {c.unread > 0 && (
                  <div style={{ background: c.active ? "rgba(255,255,255,0.2)" : "var(--color-danger)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: 700 }}>
                    {c.unread}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--dim)", textTransform: "uppercase" }}>Direct Messages</div>
            <button className="kc-btn kc-btn-ghost" style={{ padding: 2 }}><Icon name="plus" size={14} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {dms.map(u => (
              <div key={u.id} style={{ 
                padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontWeight: u.unread > 0 ? 600 : 400
              }} className="hover-bg-panel-2">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar name={u.name} size={20} />
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: u.status === "online" ? "var(--color-success)" : "var(--dim)", border: "1px solid var(--panel)" }}></div>
                  </div>
                  {u.name}
                </div>
                {u.unread > 0 && (
                  <div style={{ background: "var(--color-primary)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: 700 }}>
                    {u.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
          
          {/* Chat Header */}
          <div style={{ padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <Icon name="hash" size={20} color="var(--dim)" />
              <h3 style={{ margin: 0, fontSize: "var(--text-lg)" }}>sales-team</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <div style={{ display: "flex", marginLeft: 10 }}>
                <div style={{ border: "2px solid var(--bg)", borderRadius: "50%", marginLeft: -10 }}><Avatar name="AJ" size={28} /></div>
                <div style={{ border: "2px solid var(--bg)", borderRadius: "50%", marginLeft: -10 }}><Avatar name="MG" size={28} /></div>
                <div style={{ border: "2px solid var(--bg)", borderRadius: "50%", marginLeft: -10, width: 28, height: 28, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>+4</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "var(--space-lg)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div style={{ textAlign: "center", position: "relative", margin: "var(--space-lg) 0" }}>
              <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1, background: "var(--border)" }}></div>
              <span style={{ position: "relative", background: "var(--bg)", padding: "0 12px", fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>Today</span>
            </div>

            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", gap: "var(--space-md)" }}>
                {msg.isSystem ? (
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="cpu" size={20} color="var(--dim)" />
                  </div>
                ) : (
                  <Avatar name={msg.avatar} size={40} />
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: msg.isSystem ? "var(--dim)" : "var(--fg)" }}>{msg.user}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{msg.time}</span>
                  </div>
                  <div style={{ 
                    fontSize: "var(--text-sm)", 
                    color: "var(--fg)", 
                    background: msg.isSystem ? "var(--panel-2)" : "transparent",
                    padding: msg.isSystem ? "8px 12px" : 0,
                    borderRadius: msg.isSystem ? 8 : 0,
                    fontStyle: msg.isSystem ? "italic" : "normal"
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: "var(--space-lg)" }}>
            <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "var(--space-sm)", padding: "8px 12px", borderBottom: "1px solid var(--border)", background: "var(--panel-2)" }}>
                <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="bold" size={14} color="var(--dim)" /></button>
                <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="italic" size={14} color="var(--dim)" /></button>
                <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="link" size={14} color="var(--dim)" /></button>
                <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 8px" }}></div>
                <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="at-sign" size={14} color="var(--dim)" /></button>
              </div>
              <textarea 
                placeholder="Message #sales-team..." 
                style={{ width: "100%", border: "none", background: "transparent", padding: "12px", outline: "none", fontSize: "var(--text-sm)", color: "var(--fg)", resize: "none", height: 80 }}
              ></textarea>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--panel-2)" }}>
                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="paperclip" size={16} color="var(--dim)" /></button>
                  <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="smile" size={16} color="var(--dim)" /></button>
                </div>
                <button className="kc-btn kc-btn-primary" style={{ padding: "4px 12px" }}><Icon name="send" size={14} /> Send</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
