"use client";
/* KompasCRM — Omnichannel Messenger Integration (WhatsApp, Telegram, Viber) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar, SearchInput } from "@/components/admin/ui";

export default function MessengersPage() {
  const [activeTab, setActiveTab] = useState("chat"); // chat, channels, rules
  const [selectedChatId, setSelectedChatId] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [channels, setChannels] = useState([]);

  const [chats, setChats] = useState([]);

  const [rules] = useState([]);

  const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

  function handleSendMessage() {
    if (!chatMessage.trim()) return;

    setChats(prevChats => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex(c => c.id === selectedChatId);
      if (chatIndex !== -1) {
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          unread: false,
          lastMsg: chatMessage,
          time: "Just now",
          messages: [
            ...updatedChats[chatIndex].messages,
            { sender: "agent", text: chatMessage, time: "Just now" }
          ]
        };
      }
      return updatedChats;
    });

    setChatMessage("");

    // Simulate auto-reply securely targeting the same chat ID
    const currentTargetId = selectedChatId;
    setTimeout(() => {
      setChats(prevChats => {
        const replyChats = [...prevChats];
        const targetIndex = replyChats.findIndex(c => c.id === currentTargetId);
        if (targetIndex !== -1) {
          replyChats[targetIndex] = {
            ...replyChats[targetIndex],
            lastMsg: "Дякую за оперативну відповідь! 👍",
            time: "Just now",
            messages: [
              ...replyChats[targetIndex].messages,
              { sender: "client", text: "Дякую за оперативну відповідь! 👍", time: "Just now" }
            ]
          };
        }
        return replyChats;
      });
    }, 1500);
  }

  const filteredChats = chats.filter(chat =>
    chat.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ruleColumns = [
    { header: "Trigger Event", cell: (row) => <span style={{ fontWeight: 600 }}>{row.trigger}</span> },
    { header: "Action", cell: (row) => <span>{row.action}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "active" ? "green" : "dim"} text={row.status.toUpperCase()} />
    )},
    { header: "Actions", cell: (row) => (
      <button className="kc-btn kc-btn-ghost" style={{ fontSize: "12px", padding: "4px 8px" }}>Edit</button>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Title block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)", flexWrap: "wrap", gap: "var(--space-md)" }}>
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
      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-sm)", overflowX: "auto" }}>
        <button 
          onClick={() => setActiveTab("chat")}
          style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: activeTab === "chat" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "chat" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "chat" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
        >
          <Icon name="inbox" size={16} /> Unified Inbox
        </button>
        <button 
          onClick={() => setActiveTab("channels")}
          style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: activeTab === "channels" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "channels" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "channels" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
        >
          <Icon name="link" size={16} /> Channels
        </button>
        <button 
          onClick={() => setActiveTab("rules")}
          style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: activeTab === "rules" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "rules" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "rules" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
        >
          <Icon name="zap" size={16} /> Auto-Responder Rules
        </button>
      </div>

      {/* Tabs content */}
      {activeTab === "chat" && (
        <div style={{ display: "flex", gap: "var(--space-md)", flex: 1, flexWrap: "wrap", minHeight: 500 }}>
          
          {/* Chat List Left */}
          <div className="kc-card" style={{ flex: "1 1 320px", padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", height: "600px" }}>
            <div style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>
              <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search chats..." />
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredChats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChatId(chat.id)}
                  style={{
                    padding: "16px var(--space-md)", display: "flex", gap: 12, cursor: "pointer",
                    borderBottom: "1px solid var(--border)",
                    background: selectedChatId === chat.id ? "var(--panel-2)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Avatar name={chat.client} size={40} />
                    <div style={{
                      position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: "50%",
                      background: chat.channel === "telegram" ? "#229ED9" : "#25D366",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid var(--panel)"
                    }}>
                      <Icon name={chat.channel === "telegram" ? "send" : "phone"} size={10} color="white" fill={chat.channel === "telegram"} />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                      <span style={{ fontWeight: chat.unread ? 700 : 500, fontSize: "14px", color: "var(--text)" }}>{chat.client}</span>
                      <span style={{ fontSize: "11px", color: "var(--dim)" }}>{chat.time}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: chat.unread ? "var(--text)" : "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {chat.lastMsg}
                    </div>
                  </div>
                </div>
              ))}
              {filteredChats.length === 0 && (
                <div style={{ padding: "var(--space-lg)", textAlign: "center", color: "var(--dim)" }}>
                  No active chats found.
                </div>
              )}
            </div>
          </div>

          {/* Active Chat Center */}
          <div className="kc-card" style={{ flex: "2 1 450px", padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", height: "600px" }}>
            {/* Header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={activeChat.client} size={36} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{activeChat.client}</div>
                  <div style={{ fontSize: "11px", color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#25D366" }}></span>
                    Online ({activeChat.channel.toUpperCase()})
                  </div>
                </div>
              </div>
              <Badge status="info" text={`ID: #${activeChat.id}`} />
            </div>

            {/* Messages body */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, background: "var(--bg)" }}>
              {activeChat.messages.map((m, idx) => (
                <div key={idx} style={{
                  alignSelf: m.sender === "client" ? "flex-start" : "flex-end",
                  maxWidth: "70%", display: "flex", flexDirection: "column"
                }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: "14px",
                    background: m.sender === "client" ? "var(--panel)" : "var(--color-primary)",
                    color: m.sender === "client" ? "var(--text)" : "var(--bg)",
                    fontSize: "var(--text-sm)",
                    border: m.sender === "client" ? "1px solid var(--border)" : "none",
                    fontWeight: m.sender === "client" ? 400 : 500,
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--dim)", alignSelf: m.sender === "client" ? "flex-start" : "flex-end", marginTop: 4 }}>
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)", alignItems: "center", background: "var(--panel)" }}>
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
            <div key={chan.id} className="kc-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)", transition: "all var(--transition-normal)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: chan.name.includes("Telegram") ? "rgba(34, 158, 217, 0.1)" : chan.name.includes("WhatsApp") ? "rgba(37, 211, 102, 0.1)" : "rgba(115, 9, 218, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon name={chan.name.includes("Telegram") ? "send" : chan.name.includes("WhatsApp") ? "phone" : "layers"} size={24} color="var(--color-primary)" fill={chan.name.includes("Telegram")} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>{chan.name}</h3>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{chan.identifier}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{chan.msgCount} messages</div>
                  <div style={{ fontSize: "11px", color: "var(--dim)" }}>Sync: {chan.lastSync}</div>
                </div>
                <Badge status={chan.status === "connected" ? "green" : "red"} text={chan.status.toUpperCase()} />
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
          <DataTable columns={ruleColumns} data={rules} />
        </div>
      )}
    </div>
  );
}
