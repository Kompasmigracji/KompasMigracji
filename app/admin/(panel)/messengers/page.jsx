"use client";
/* iPhoenixCRM — Omnichannel Messenger Integration (WhatsApp, Telegram, Viber) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function MessengersPage() {
  const [activeTab, setActiveTab] = useState("chat"); // chat, channels, rules
  const [selectedChat, setSelectedChat] = useState(0);
  const [chatMessage, setChatMessage] = useState("");

  const [channels, setChannels] = useState([
    { id: 1, name: "Telegram Bot", identifier: "@KompasMigracjiBot", status: "connected", msgCount: 342, lastSync: "Just now" },
    { id: 2, name: "WhatsApp Business API", identifier: "+48 500 123 456", status: "connected", msgCount: 1205, lastSync: "1 min ago" },
    { id: 3, name: "Viber Public Account", identifier: "Kompas Migracji", status: "disconnected", msgCount: 0, lastSync: "2 days ago" }
  ]);

  const [chats, setChats] = useState([
    {
      id: 0,
      client: "Dmytro Kovalenko",
      channel: "telegram",
      avatar: "DK",
      unread: true,
      lastMsg: "Добрий день! Які терміни отримання карти побиту по возз'єднанню сім'ї?",
      time: "10:32 AM",
      messages: [
        { sender: "client", text: "Вітаю! Мене звуть Дмитро.", time: "10:30 AM" },
        { sender: "bot", text: "Добрий день! Чим ми можемо допомогти вам сьогодні?", time: "10:31 AM" },
        { sender: "client", text: "Які терміни отримання карти побиту по возз'єднанню сім'ї?", time: "10:32 AM" }
      ]
    },
    {
      id: 1,
      client: "Anna Nowak",
      channel: "whatsapp",
      avatar: "AN",
      unread: false,
      lastMsg: "I sent the passport translation. Please verify.",
      time: "09:15 AM",
      messages: [
        { sender: "client", text: "Hello, here is the translated document.", time: "09:12 AM" },
        { sender: "agent", text: "Thank you Anna, let me check it right away.", time: "09:14 AM" },
        { sender: "client", text: "I sent the passport translation. Please verify.", time: "09:15 AM" }
      ]
    },
    {
      id: 2,
      client: "Ivan Petrov",
      channel: "telegram",
      avatar: "IP",
      unread: false,
      lastMsg: "Дякую за інформацію!",
      time: "Yesterday",
      messages: [
        { sender: "client", text: "Коли буде готова децизія?", time: "May 20" },
        { sender: "agent", text: "Ми очікуємо децизію в середині червня.", time: "May 20" },
        { sender: "client", text: "Дякую за інформацію!", time: "Yesterday" }
      ]
    }
  ]);

  const [rules] = useState([
    { id: 1, trigger: "First Incoming Message", action: "Send Welcome Auto-Reply", status: "active" },
    { id: 2, trigger: "Out of Office Hours", action: "Send Offline Message", status: "active" },
    { id: 3, trigger: "Keyword 'Price' or 'Cennik'", action: "Forward to Sales Team", status: "active" },
    { id: 4, trigger: "Keyword 'Status' or 'Sprawa'", action: "Check status using RPA Bot", status: "inactive" }
  ]);

  function handleSendMessage() {
    if (!chatMessage.trim()) return;
    const updatedChats = [...chats];
    updatedChats[selectedChat].messages.push({
      sender: "agent",
      text: chatMessage,
      time: "Just now"
    });
    updatedChats[selectedChat].lastMsg = chatMessage;
    updatedChats[selectedChat].time = "Just now";
    setChats(updatedChats);
    setChatMessage("");

    // Simulate auto-reply
    setTimeout(() => {
      const replyChats = [...updatedChats];
      replyChats[selectedChat].messages.push({
        sender: "client",
        text: "Дякую за оперативну відповідь! 👍",
        time: "Just now"
      });
      replyChats[selectedChat].lastMsg = "Дякую за оперативну відповідь! 👍";
      setChats(replyChats);
    }, 1500);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Title block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Messenger Integration</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Connect customer channels (WhatsApp, Telegram, Viber) and chat with clients in a unified inbox.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => setActiveTab("channels")}>
          <Icon name="plus" size={16} /> Connect Channel
        </button>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("chat")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "chat" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "chat" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "chat" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="message-circle" size={16} /> Unified Inbox
        </button>
        <button 
          onClick={() => setActiveTab("channels")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "channels" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "channels" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "channels" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="link" size={16} /> Channels
        </button>
        <button 
          onClick={() => setActiveTab("rules")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "rules" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "rules" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "rules" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="zap" size={16} /> Auto-Responder Rules
        </button>
      </div>

      {/* Tabs content */}
      {activeTab === "chat" && (
        <div style={{ display: "flex", gap: "var(--space-md)", flex: 1, minHeight: 0 }}>
          
          {/* Chat List Left */}
          <div className="kc-card" style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>
              <input type="text" placeholder="Search chats..." className="kc-input" style={{ width: "100%" }} />
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {chats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChat(chat.id)}
                  style={{
                    padding: "12px", display: "flex", gap: 12, cursor: "pointer",
                    borderBottom: "1px solid var(--border)",
                    background: selectedChat === chat.id ? "var(--panel-2)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Avatar name={chat.avatar} size={36} />
                    <div style={{
                      position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%",
                      background: chat.channel === "telegram" ? "#229ED9" : "#25D366",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Icon name={chat.channel === "telegram" ? "send" : "phone"} size={10} color="white" />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: chat.unread ? 700 : 500, fontSize: "14px" }}>{chat.client}</span>
                      <span style={{ fontSize: "11px", color: "var(--dim)" }}>{chat.time}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: chat.unread ? "var(--fg)" : "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {chat.lastMsg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Center */}
          <div className="kc-card" style={{ flex: 2, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={chats[selectedChat].avatar} size={32} />
                <div>
                  <div style={{ fontWeight: 600 }}>{chats[selectedChat].client}</div>
                  <div style={{ fontSize: "11px", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#25D366" }}></span>
                    Online ({chats[selectedChat].channel})
                  </div>
                </div>
              </div>
              <Badge status="info" text={`ID: #${chats[selectedChat].id}`} />
            </div>

            {/* Messages body */}
            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: "var(--panel-2)" }}>
              {chats[selectedChat].messages.map((m, idx) => (
                <div key={idx} style={{
                  alignSelf: m.sender === "client" ? "flex-start" : "flex-end",
                  maxWidth: "70%", display: "flex", flexDirection: "column"
                }}>
                  <div style={{
                    padding: "8px 12px", borderRadius: "12px",
                    background: m.sender === "client" ? "var(--bg)" : "var(--color-primary)",
                    color: m.sender === "client" ? "var(--fg)" : "white",
                    fontSize: "var(--text-sm)",
                    border: m.sender === "client" ? "1px solid var(--border)" : "none"
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--dim)", alignSelf: m.sender === "client" ? "flex-start" : "flex-end", marginTop: 2 }}>
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input footer */}
            <div style={{ padding: "12px", borderTop: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)" }}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="kc-input" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                style={{ flex: 1 }}
              />
              <button className="kc-btn kc-btn-primary" onClick={handleSendMessage}>
                <Icon name="send" size={16} /> Send
              </button>
            </div>

          </div>

        </div>
      )}

      {activeTab === "channels" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {channels.map((chan) => (
            <div key={chan.id} className="kc-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: chan.name.includes("Telegram") ? "rgba(34, 158, 217, 0.1)" : chan.name.includes("WhatsApp") ? "rgba(37, 211, 102, 0.1)" : "rgba(115, 9, 218, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon name={chan.name.includes("Telegram") ? "send" : chan.name.includes("WhatsApp") ? "phone" : "hash"} size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{chan.name}</h3>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{chan.identifier}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>{chan.msgCount} messages</div>
                  <div style={{ fontSize: "11px", color: "var(--dim)" }}>Sync: {chan.lastSync}</div>
                </div>
                <Badge status={chan.status === "connected" ? "success" : "danger"} text={chan.status.toUpperCase()} />
                <button className="kc-btn kc-btn-secondary" style={{ padding: "6px 12px" }}>
                  {chan.status === "connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "rules" && (
        <div className="kc-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="kc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Trigger Event</th>
                <th style={{ padding: "12px" }}>Action</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{rule.trigger}</td>
                  <td style={{ padding: "12px" }}>{rule.action}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge status={rule.status === "active" ? "success" : "default"} text={rule.status.toUpperCase()} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button className="kc-btn kc-btn-ghost" style={{ fontSize: "12px", padding: "4px 8px" }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
