"use client";
/* KompasCRM — Internal Team Chat & Mentions */
import React, { useState, useRef, useEffect } from "react";
import { Icon, Avatar, Badge } from "@/components/admin/ui";

export default function TeamChatPage() {
  const [activeChannel, setActiveChannel] = useState("#sales-team");
  
  const [messages] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div style={{ height: "calc(100vh - 100px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Team Chat</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Communicate securely with your team. Mention colleagues and share CRM records.
          </p>
        </div>
      </div>

      <div className="kc-card" style={{ flex: 1, padding: 0, display: "flex", overflow: "hidden" }}>
        
        {/* Left Sidebar (Channels & DMs) */}
        <div style={{ width: 260, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--panel-2)" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", padding: "8px 12px", borderRadius: 8 }}>
              <Icon name="search" size={14} color="var(--dim)" />
              <input type="text" placeholder="Search chats..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "12px" }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-md)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--dim)", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.5px" }}>Channels</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "var(--space-lg)" }}>
              <div style={{ padding: "8px 12px", borderRadius: 6, background: activeChannel === "#general" ? "var(--color-primary)" : "transparent", color: activeChannel === "#general" ? "white" : "var(--fg)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setActiveChannel("#general")}>
                <Icon name="hash" size={14} /> general
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 6, background: activeChannel === "#sales-team" ? "var(--color-primary)" : "transparent", color: activeChannel === "#sales-team" ? "white" : "var(--fg)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setActiveChannel("#sales-team")}>
                <Icon name="hash" size={14} /> sales-team <Badge status="danger" text="2" style={{ marginLeft: "auto", border: "none" }} />
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 6, background: activeChannel === "#legal-updates" ? "var(--color-primary)" : "transparent", color: activeChannel === "#legal-updates" ? "white" : "var(--fg)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setActiveChannel("#legal-updates")}>
                <Icon name="hash" size={14} /> legal-updates
              </div>
            </div>

            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--dim)", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.5px", display: "flex", justifyContent: "space-between" }}>
              Direct Messages <Icon name="plus" size={12} style={{ cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <Avatar name="MG" size={24} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, background: "var(--color-success)", borderRadius: 4, border: "1px solid var(--panel-2)" }}></div>
                </div>
                <span style={{ fontSize: "13px" }}>Maria Garcia</span>
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                 <div style={{ position: "relative" }}>
                  <Avatar name="AN" size={24} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, background: "var(--color-warning)", borderRadius: 4, border: "1px solid var(--panel-2)" }}></div>
                </div>
                <span style={{ fontSize: "13px", opacity: 0.7 }}>Anna Schmidt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
          
          {/* Chat Header */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel)" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="hash" size={18} color="var(--dim)" /> {activeChannel.replace("#", "")}
              </div>
              <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: 2 }}>
                4 members • Discussion for the sales department
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, color: "var(--dim)" }}>
              <Icon name="phone" size={18} style={{ cursor: "pointer" }} />
              <Icon name="video" size={18} style={{ cursor: "pointer" }} />
              <Icon name="info" size={18} style={{ cursor: "pointer" }} />
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--dim)", background: "var(--panel-2)", padding: "4px 12px", borderRadius: 12 }}>Today</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
                {!msg.isSystem && <Avatar name={msg.avatar} size={36} />}
                
                <div style={{ flex: 1 }}>
                  {!msg.isSystem && (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>{msg.sender}</span>
                      <span style={{ fontSize: "11px", color: "var(--dim)" }}>{msg.time}</span>
                    </div>
                  )}
                  
                  {msg.isSystem ? (
                     <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", color: "var(--dim)", background: "rgba(16, 185, 129, 0.05)", padding: "8px 12px", borderRadius: 8, border: "1px dashed var(--color-success)" }}>
                        {msg.content}
                     </div>
                  ) : (
                    <div style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--fg)" }}>
                      {/* Highlight mentions */}
                      {msg.content.split(/(@[\w\s]+)/).map((part, i) => {
                        if (part.startsWith("@")) {
                          return <span key={i} style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--color-primary)", padding: "0 4px", borderRadius: 4, fontWeight: 500 }}>{part}</span>;
                        }
                        return part;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--panel)" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden", transition: "border-color 0.2s" }} onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
              
              <textarea 
                placeholder={`Message ${activeChannel}...`} 
                style={{ width: "100%", border: "none", background: "transparent", padding: "12px 16px", outline: "none", fontSize: "14px", color: "var(--fg)", resize: "none", minHeight: "60px" }}
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "var(--panel-2)", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 12, color: "var(--dim)" }}>
                  <Icon name="bold" size={14} style={{ cursor: "pointer" }} />
                  <Icon name="italic" size={14} style={{ cursor: "pointer" }} />
                  <Icon name="link" size={14} style={{ cursor: "pointer" }} />
                  <div style={{ width: 1, height: 16, background: "var(--border)" }}></div>
                  <Icon name="smile" size={14} style={{ cursor: "pointer" }} />
                  <Icon name="paperclip" size={14} style={{ cursor: "pointer" }} title="Attach File" />
                  <Icon name="at-sign" size={14} style={{ cursor: "pointer" }} title="Mention Someone" />
                </div>
                <button className="kc-btn kc-btn-primary" style={{ padding: "6px 16px" }}><Icon name="send" size={14} /> Send</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
