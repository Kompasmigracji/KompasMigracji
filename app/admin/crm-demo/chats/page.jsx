"use client";
import React, { useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";

const MOCK_CHATS = [
  { id: 1, name: "Олександр Рей", source: "viber", sourceIcon: "phone", sourceColor: "#a855f7", lastMessage: "Дякую", time: "16:21", unread: 0, status: "open" },
  { id: 2, name: "Valentyn D", source: "telegram", sourceIcon: "send", sourceColor: "#3b82f6", lastMessage: "Телеграм", time: "12:18", unread: 1, status: "open" },
  { id: 3, name: "Інна", source: "viber", sourceIcon: "phone", sourceColor: "#a855f7", lastMessage: "Скільки коштуватиме довідка?", time: "20:06", unread: 0, status: "open" },
  { id: 4, name: "Іван Борсук", source: "whatsapp", sourceIcon: "message-circle", sourceColor: "#22c55e", lastMessage: "Коли буде готово?", time: "19:40", unread: 2, status: "open" },
  { id: 5, name: "Юридична порада", source: "telegram", sourceIcon: "send", sourceColor: "#3b82f6", lastMessage: "Дякую за консультацію", time: "17:15", unread: 0, status: "open" },
  { id: 6, name: "Марія", source: "viber", sourceIcon: "phone", sourceColor: "#a855f7", lastMessage: "Фото", time: "14:22", unread: 0, status: "open" },
];

const MOCK_MESSAGES = [
  { id: 1, text: "Добрий день! Цікавить карта побиту.", time: "15:20", sender: "client" },
  { id: 2, text: "Доброго дня, Олександре! Для подачі на карту побиту нам потрібні такі документи:\n- Паспорт (всі сторінки)\n- Договір оренди\n- Підтвердження доходу", time: "15:25", sender: "manager", isSeen: true },
  { id: 3, text: "Зрозумів. А якщо я працюю через агенцію?", time: "15:30", sender: "client" },
  { id: 4, text: "Тоді потрібна умова з агенцією та Załącznik nr 1. Бажаєте записатись на детальну консультацію?", time: "15:45", sender: "manager", isSeen: true },
  { id: 5, text: "Так, давайте на завтра.", time: "16:00", sender: "client" },
  { id: 6, text: "Записав вас на 14:00. До зв'язку!", time: "16:05", sender: "manager", isSeen: true },
  { id: 7, text: "Дякую", time: "16:21", sender: "client" }
];

export default function ChatsDemoPage() {
  const [activeTab, setActiveTab] = useState("open");
  const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 32px)", margin: "-16px", background: "var(--bg)", overflow: "hidden" }}>
      
      {/* LEFT SIDEBAR: CHAT LIST */}
      <div style={{ 
        width: 320, 
        borderRight: "1px solid var(--border)", 
        display: "flex", 
        flexDirection: "column",
        background: "var(--panel)"
      }}>
        {/* Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontSize: 18, color: "var(--text)" }}>Чаты</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)" }}><Icon name="plus-circle" size={18} /></button>
              <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)" }}><Icon name="filter" size={18} /></button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", background: "var(--panel-2)", borderRadius: 6, padding: "6px 10px", gap: 8 }}>
            <Icon name="search" size={14} color="var(--dim)" />
            <input type="text" placeholder="Поиск" style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", width: "100%", fontSize: 13 }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          <button style={{ flex: 1, padding: "10px 0", background: "none", border: "none", borderBottom: activeTab === "open" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "open" ? "var(--color-primary)" : "var(--dim)", fontWeight: 600, fontSize: 12, cursor: "pointer" }} onClick={() => setActiveTab("open")}>Открытые <span style={{ background: "var(--color-primary)", color: "#fff", padding: "2px 6px", borderRadius: 10, fontSize: 10 }}>6</span></button>
          <button style={{ flex: 1, padding: "10px 0", background: "none", border: "none", borderBottom: activeTab === "closed" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "closed" ? "var(--text)" : "var(--dim)", fontWeight: 600, fontSize: 12, cursor: "pointer" }} onClick={() => setActiveTab("closed")}>Закрытые</button>
          <button style={{ flex: 1, padding: "10px 0", background: "none", border: "none", borderBottom: activeTab === "all" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "all" ? "var(--text)" : "var(--dim)", fontWeight: 600, fontSize: 12, cursor: "pointer" }} onClick={() => setActiveTab("all")}>Все</button>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {MOCK_CHATS.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              style={{ 
                padding: "12px 16px", 
                borderBottom: "1px solid var(--border)", 
                display: "flex", 
                gap: 12,
                cursor: "pointer",
                background: activeChat.id === chat.id ? "var(--panel-2)" : "transparent",
                transition: "background 0.2s"
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar name={chat.name} size={40} />
                <div style={{ position: "absolute", bottom: -2, right: -2, background: "var(--panel)", borderRadius: "50%", padding: 2 }}>
                  <Icon name={chat.sourceIcon} size={12} color={chat.sourceColor} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.name}</span>
                  <span style={{ fontSize: 11, color: "var(--dim)" }}>{chat.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span style={{ background: "var(--color-primary)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, marginLeft: 8 }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT WINDOW */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--panel-2)" }}>
        
        {/* Chat Header */}
        <div style={{ padding: "16px 24px", background: "var(--panel)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={activeChat.name} size={36} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{activeChat.name}</div>
              <div style={{ fontSize: 11, color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name={activeChat.sourceIcon} size={10} color={activeChat.sourceColor} />
                {activeChat.source === "telegram" ? "Telegram" : activeChat.source === "whatsapp" ? "WhatsApp" : "Viber"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)" }}><Icon name="paperclip" size={18} /></button>
            <button style={{ background: "var(--panel-2)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="x" size={14} /> Закрыть диалог
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <span style={{ background: "var(--panel)", padding: "4px 12px", borderRadius: 100, fontSize: 11, color: "var(--dim)", fontWeight: 600 }}>Сегодня</span>
          </div>

          {MOCK_MESSAGES.map(msg => {
            const isManager = msg.sender === "manager";
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isManager ? "flex-end" : "flex-start" }}>
                <div style={{ display: "flex", gap: 8, maxWidth: "70%", flexDirection: isManager ? "row-reverse" : "row" }}>
                  {!isManager && <Avatar name={activeChat.name} size={28} />}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isManager ? "flex-end" : "flex-start", gap: 4 }}>
                    <div style={{ 
                      background: isManager ? "var(--color-primary)" : "var(--panel)", 
                      color: isManager ? "#000" : "var(--text)", // Primary is gold, black text looks good
                      padding: "10px 14px", 
                      borderRadius: 16,
                      borderTopLeftRadius: !isManager ? 4 : 16,
                      borderTopRightRadius: isManager ? 4 : 16,
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: "pre-line",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
                      {msg.time}
                      {isManager && msg.isSeen && <Icon name="check" size={10} color="var(--color-primary)" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div style={{ padding: "16px 24px", background: "var(--panel)", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
            <textarea 
              placeholder="Введите сообщение..." 
              style={{ width: "100%", minHeight: 60, background: "transparent", border: "none", outline: "none", resize: "none", color: "var(--text)", fontSize: 13, fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, color: "var(--dim)" }}>
                <Icon name="paperclip" size={16} style={{ cursor: "pointer" }} />
                <Icon name="smile" size={16} style={{ cursor: "pointer" }} />
                <Icon name="mic" size={16} style={{ cursor: "pointer" }} />
              </div>
              <button style={{ background: "var(--color-primary)", color: "#000", border: "none", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="send" size={14} /> Відправити
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR: CONTACT INFO */}
      <div style={{ 
        width: 300, 
        borderLeft: "1px solid var(--border)", 
        background: "var(--panel)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Avatar name={activeChat.name} size={64} style={{ marginBottom: 12 }} />
          <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "var(--text)" }}>{activeChat.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--dim)", fontSize: 12, marginBottom: 16 }}>
            <Icon name={activeChat.sourceIcon} size={12} color={activeChat.sourceColor} />
            {activeChat.source === "telegram" ? "Telegram" : activeChat.source === "whatsapp" ? "WhatsApp" : "Viber"}
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 4 }}>Телефон</div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>+48 123 456 789</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 4 }}>Email</div>
              <button style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: 12, cursor: "pointer", padding: 0 }}>+ Добавить email</button>
            </div>
            
            <button style={{ width: "100%", background: "var(--panel-2)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
              Сохранить покупателя
            </button>
          </div>
        </div>

        <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 13, color: "var(--text)" }}>Заметки</h4>
            <button style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="plus" size={12} /> Добавить
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--dim)", fontStyle: "italic" }}>Нет заметок</p>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 13, color: "var(--text)" }}>Активные воронки</h4>
            <button style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: 12, cursor: "pointer" }}>
              <Icon name="plus" size={14} />
            </button>
          </div>
          
          {/* Active Funnel Card */}
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ background: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>В работе</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Чат з {activeChat.name}</span>
              </div>
              <Icon name="more-horizontal" size={14} color="var(--dim)" style={{ cursor: "pointer" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--dim)", marginBottom: 8 }}>
              <Icon name="clock" size={10} /> Сегодня 16:21
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>
              500,00 PLN
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
