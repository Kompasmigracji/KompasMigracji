"use client";
/* iPhoenixCRM — Internal Team Chat (Zulip/Slack style) */
import React, { useState, useEffect } from "react";
import { Icon, Avatar, Badge, EmptyState } from "@/components/admin/ui";

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const channels = [
    { id: "general", name: "general", unread: 0 },
    { id: "sales", name: "sales-team", unread: 3 },
    { id: "support", name: "customer-support", unread: 0 },
    { id: "announcements", name: "announcements", unread: 1 }
  ];

  const directMessages = [
    { id: "dm_1", name: "Alex Admin", online: true },
    { id: "dm_2", name: "Maria Manager", online: true },
    { id: "dm_3", name: "System Bot", online: true }
  ];

  useEffect(() => {
    // Mock loading messages for active channel
    setMessages([
      { id: 1, user: "System Bot", time: "09:00 AM", text: "Daily backup completed successfully.", type: "system" },
      { id: 2, user: "Alex Admin", time: "10:15 AM", text: "Hey team, don't forget the product sync at 2 PM.", type: "user" },
      { id: 3, user: "Maria Manager", time: "10:18 AM", text: "I'll be there! Has anyone checked the new leads from yesterday's campaign?", type: "user" },
      { id: 4, user: "Alex Admin", time: "10:20 AM", text: "Yes, I assigned them to the sales channel. We got 12 new qualified leads.", type: "user" }
    ]);
  }, [activeChannel]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      user: "You", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      text: input, 
      type: "user" 
    }]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 120px)", gap: "var(--space-md)", background: "var(--bg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: "var(--panel-2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>Team Chat</div>
          <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="plus" size={16} /></button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-sm) 0" }}>
          {/* Channels */}
          <div style={{ padding: "0 var(--space-md)", fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8, marginTop: 8 }}>Channels</div>
          {channels.map(ch => (
            <div 
              key={ch.id} 
              onClick={() => setActiveChannel(ch.id)}
              style={{ 
                padding: "8px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                background: activeChannel === ch.id ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "transparent",
                color: activeChannel === ch.id ? "var(--color-primary)" : "var(--text)",
                fontWeight: activeChannel === ch.id ? 600 : 400
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--dim)", fontSize: 16 }}>#</span> {ch.name}
              </div>
              {ch.unread > 0 && <Badge status="danger" text={ch.unread} />}
            </div>
          ))}

          {/* Direct Messages */}
          <div style={{ padding: "0 var(--space-md)", fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8, marginTop: 24 }}>Direct Messages</div>
          {directMessages.map(dm => (
            <div 
              key={dm.id} 
              onClick={() => setActiveChannel(dm.id)}
              style={{ 
                padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                background: activeChannel === dm.id ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "transparent",
                color: activeChannel === dm.id ? "var(--color-primary)" : "var(--text)",
                fontWeight: activeChannel === dm.id ? 600 : 400
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar name={dm.name} size={24} />
                {dm.online && <div style={{ position: "absolute", bottom: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", border: "2px solid var(--panel-2)" }}></div>}
              </div>
              <div style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dm.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Chat Header */}
        <div style={{ padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--dim)", fontSize: 20 }}>#</span>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>
              {channels.find(c => c.id === activeChannel)?.name || directMessages.find(d => d.id === activeChannel)?.name}
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button className="kc-btn kc-btn-ghost" style={{ padding: 6 }}><Icon name="search" size={18} /></button>
            <button className="kc-btn kc-btn-ghost" style={{ padding: 6 }}><Icon name="user" size={18} /></button>
          </div>
        </div>

        {/* Messages List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {messages.map((msg, i) => {
            const isSystem = msg.type === "system";
            const isMe = msg.user === "You";
            const showAvatar = i === 0 || messages[i-1].user !== msg.user;

            if (isSystem) {
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "center", margin: "var(--space-md) 0" }}>
                  <div style={{ background: "var(--panel-2)", padding: "4px 12px", borderRadius: 100, fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="settings" size={12} /> {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} style={{ display: "flex", gap: "var(--space-md)", marginTop: showAvatar ? "var(--space-md)" : 0 }}>
                <div style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                  {showAvatar && <Avatar name={msg.user} size={36} />}
                </div>
                <div style={{ flex: 1 }}>
                  {showAvatar && (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{msg.user}</span>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{msg.time}</span>
                    </div>
                  )}
                  <div style={{ lineHeight: 1.5, color: "var(--text)" }}>{msg.text}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div style={{ padding: "var(--space-md)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "var(--space-xs)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
            <button type="button" className="kc-btn kc-btn-ghost" style={{ padding: 8 }}><Icon name="plus" size={20} /></button>
            <input 
              type="text" 
              className="kc-input" 
              placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name || "user"}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, border: "none", background: "transparent", padding: 0, fontSize: "var(--text-md)" }}
            />
            <button type="submit" className="kc-btn kc-btn-primary" disabled={!input.trim()} style={{ borderRadius: "var(--radius-md)" }}>
              <Icon name="send" size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
