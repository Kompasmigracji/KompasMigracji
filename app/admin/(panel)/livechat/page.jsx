"use client";
/* KompasCRM — Live Chat & Omnichannel Inbox (Intercom style) */
import React, { useState } from "react";
import { Icon, Avatar, Badge } from "@/components/admin/ui";

export default function LiveChatPage() {
  const [conversations] = useState([
    { id: "1", name: "Anna Smirnova", channel: "WhatsApp", time: "10:24 AM", message: "Hi, how much does the TRC cost?", unread: 2, active: true },
    { id: "2", name: "Guest_4892", channel: "Website", time: "09:15 AM", message: "I need an urgent consultation.", unread: 0, active: false },
    { id: "3", name: "TechCorp Ltd", channel: "Telegram", time: "Yesterday", message: "Thanks, we will sign the contract today.", unread: 0, active: false },
    { id: "4", name: "Oleg V.", channel: "Instagram", time: "Yesterday", message: "Do you help with student visas?", unread: 0, active: false }
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)", margin: "-var(--space-lg)" }}>
      
      {/* Header */}
      <div style={{ padding: "var(--space-lg) var(--space-lg) 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Omnichannel Inbox</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Reply to Website, WhatsApp, Telegram, and Instagram messages in one place.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="cpu" size={16} /> AI Bot Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="message-square" size={16} /> New Message</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, borderTop: "1px solid var(--border)", overflow: "hidden" }}>
        
        {/* Sidebar - Conversation List */}
        <div style={{ width: 320, background: "var(--panel)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)" }}>
            <button className="kc-btn kc-btn-secondary" style={{ flex: 1, justifyContent: "center" }}>Open</button>
            <button className="kc-btn kc-btn-ghost" style={{ flex: 1, justifyContent: "center", color: "var(--dim)" }}>Closed</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setActiveChat(conv)}
                style={{ 
                  padding: "var(--space-md)", 
                  borderBottom: "1px solid var(--border)", 
                  background: activeChat.id === conv.id ? "var(--panel-2)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  gap: "var(--space-md)"
                }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar name={conv.name} size={40} />
                  <div style={{ 
                    position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", 
                    background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" 
                  }}>
                    <Icon name={conv.channel === "WhatsApp" ? "message-circle" : conv.channel === "Website" ? "globe" : "send"} size={10} color="var(--color-primary)" />
                  </div>
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{conv.name}</span>
                    <span style={{ fontSize: "10px", color: "var(--dim)" }}>{conv.time}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--text-xs)", color: conv.unread > 0 ? "var(--fg)" : "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {conv.message}
                    </span>
                    {conv.unread > 0 && (
                      <div style={{ background: "var(--color-primary)", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10 }}>
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
          {/* Chat Header */}
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", background: "var(--panel)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
              <Avatar name={activeChat.name} size={40} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{activeChat.name}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Badge status="success" text="Online" /> via {activeChat.channel}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="kc-btn kc-btn-ghost"><Icon name="user" size={16} /> View Profile</button>
              <button className="kc-btn kc-btn-secondary"><Icon name="check" size={16} /> Resolve</button>
            </div>
          </div>

          {/* Chat History (Mock) */}
          <div style={{ flex: 1, padding: "var(--space-lg)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ alignSelf: "center", fontSize: "var(--text-xs)", color: "var(--dim)", background: "var(--panel)", padding: "4px 12px", borderRadius: 12 }}>
              Today
            </div>
            
            <div style={{ display: "flex", gap: "var(--space-sm)", maxWidth: "70%" }}>
              <Avatar name={activeChat.name} size={32} />
              <div style={{ background: "var(--panel)", padding: "var(--space-md)", borderRadius: "12px 12px 12px 0", fontSize: "var(--text-sm)" }}>
                {activeChat.message}
                <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 4, textAlign: "right" }}>{activeChat.time}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", maxWidth: "70%", alignSelf: "flex-end" }}>
              <div style={{ background: "var(--color-primary)", color: "white", padding: "var(--space-md)", borderRadius: "12px 12px 0 12px", fontSize: "var(--text-sm)" }}>
                Hello! We can definitely help with that. The cost depends on your current visa status. Could you provide a bit more detail?
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 4, textAlign: "right" }}>10:28 AM</div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div style={{ padding: "var(--space-md)", background: "var(--panel)", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "var(--space-sm)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "var(--space-sm) var(--space-md)" }}>
              <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="paperclip" size={20} color="var(--dim)" /></button>
              <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="smile" size={20} color="var(--dim)" /></button>
              <input type="text" placeholder={`Reply to ${activeChat.name}...`} style={{ flex: 1, background: "transparent", border: "none", color: "var(--fg)", outline: "none", fontSize: "var(--text-sm)" }} />
              <button className="kc-btn kc-btn-primary"><Icon name="send" size={16} /> Send</button>
            </div>
            <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 8, textAlign: "center" }}>
              Press Enter to send. Use / for saved replies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
