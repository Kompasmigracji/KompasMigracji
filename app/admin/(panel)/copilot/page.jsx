"use client";
/* KompasCRM — AI Copilot & Assistant (Harvard Level Design) */
import React, { useState, useEffect } from "react";
import { Icon, Avatar } from "@/components/admin/ui";

export default function CopilotPage() {
  const [messages, setMessages] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);

  // Add dummy messages on mount to show off the design
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        text: "Вітаю! Я Kompas AI Copilot. Готовий проаналізувати ваші міграційні справи, скласти ідеальний лист клієнту або знайти важливі дані. Як я можу допомогти вам сьогодні?"
      },
      {
        id: 2,
        role: "user",
        text: "Склади звіт по продажах за цей місяць та порівняй з минулим."
      },
      {
        id: 3,
        role: "assistant",
        text: "Аналізую дані...\n\n📈 Звіт готовий:\nВаші продажі цього місяця зросли на **15%** порівняно з минулим. Найкращі показники у секторі 'Робочі візи'.\n\nБажаєте, я підготую детальний графік для презентації?"
      }
    ]);
  }, []);

  const prompts = [
    "Draft an email to Elena",
    "Show my commission this month",
    "Find overdue invoices",
    "Summarize TRC law changes"
  ];

  return (
    <div className="copilot-container">
      {/* Dynamic CSS injected directly for self-contained component magic */}
      <style dangerouslySetInnerHTML={{__html: `
        .copilot-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: #0d1117;
          color: var(--text);
          font-family: var(--font-body);
        }

        /* Animated Deep Space Background */
        .copilot-container::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 80% 20%, rgba(217, 158, 84, 0.05) 0%, transparent 30%),
                      radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
          animation: bgRotate 30s infinite linear;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes bgRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Glassmorphism Utilities */
        .glass-panel {
          background: rgba(22, 27, 34, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-glass {
          background: rgba(13, 17, 23, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          z-index: 10;
        }

        .input-area-glass {
          background: rgba(22, 27, 34, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 10;
        }

        /* AI Icon Glow */
        .ai-icon-container {
          background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
          position: relative;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
          animation: pulseGlow 3s infinite alternate;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
          100% { box-shadow: 0 0 25px rgba(217, 158, 84, 0.5); }
        }

        /* Message Animations */
        .msg-enter {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Prompt Buttons */
        .prompt-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--dim);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: var(--text-xs);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .prompt-btn:hover {
          background: rgba(217, 158, 84, 0.1);
          border-color: rgba(217, 158, 84, 0.5);
          color: var(--brass);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(217, 158, 84, 0.15);
        }

        /* Input Field Glow */
        .input-wrapper {
          display: flex;
          gap: var(--space-sm);
          background: rgba(13, 17, 23, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: var(--space-sm) var(--space-md);
          transition: all 0.3s ease;
        }
        .input-wrapper.focused {
          border-color: rgba(139, 92, 246, 0.6);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(139, 92, 246, 0.1);
          background: rgba(13, 17, 23, 0.8);
        }

        .send-btn {
          background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
          border: none;
          color: white;
          border-radius: 10px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
        }

        /* Scrollbar styling for webkit */
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />

      {/* Header */}
      <div className="header-glass" style={{ padding: "var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div className="ai-icon-container" style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cpu" size={24} color="white" />
          </div>
          <div>
            <h2 className="kc-h2" style={{ margin: 0, background: "linear-gradient(90deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Kompas AI Copilot
            </h2>
            <p style={{ color: "var(--dim)", marginTop: 2, fontSize: "var(--text-sm)" }}>
              Your intelligent assistant. Ask questions, generate emails, or analyze CRM data.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Icon name="settings" size={16} /> <span style={{ marginLeft: 6 }}>AI Settings</span>
          </button>
          <button className="kc-btn kc-btn-ghost" style={{ color: "var(--dim)" }}><Icon name="more-vertical" size={16} /></button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1, overflow: "hidden" }}>
        
        {/* Chat History */}
        <div className="chat-scroll" style={{ flex: 1, padding: "var(--space-2xl) var(--space-lg)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-xl)", maxWidth: 850, margin: "0 auto", width: "100%" }}>
          {messages.map((msg, index) => (
            <div key={msg.id} className="msg-enter" style={{ display: "flex", gap: "var(--space-lg)", flexDirection: msg.role === "user" ? "row-reverse" : "row", animationDelay: `${index * 0.15}s` }}>
              {msg.role === "assistant" ? (
                <div className="ai-icon-container" style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="zap" size={20} color="white" />
                </div>
              ) : (
                <div style={{ flexShrink: 0, boxShadow: "0 0 10px rgba(0,0,0,0.5)", borderRadius: "50%" }}>
                   <Avatar name="Admin User" size={40} />
                </div>
              )}
              
              <div className={msg.role === "assistant" ? "glass-panel" : ""} style={{ 
                background: msg.role === "user" ? "linear-gradient(135deg, var(--color-primary), #b4803a)" : "", 
                color: msg.role === "user" ? "white" : "var(--text)",
                padding: "var(--space-lg)", 
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", 
                fontSize: "var(--text-md)",
                lineHeight: 1.6,
                border: msg.role === "user" ? "none" : "",
                whiteSpace: "pre-wrap",
                boxShadow: msg.role === "user" ? "0 4px 15px rgba(217, 158, 84, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.2)",
                maxWidth: "85%"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {/* Spacer for bottom */}
          <div style={{ height: 20 }}></div>
        </div>

        {/* Input Area */}
        <div className="input-area-glass" style={{ padding: "var(--space-xl) var(--space-lg) var(--space-lg)" }}>
          <div style={{ maxWidth: 850, margin: "0 auto" }}>
            {/* Quick Prompts */}
            <div className="chat-scroll" style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", overflowX: "auto", paddingBottom: 8 }}>
              {prompts.map((p, i) => (
                <button key={i} className="prompt-btn">
                  {p}
                </button>
              ))}
            </div>

            <div className={`input-wrapper ${inputFocused ? 'focused' : ''}`}>
              <button className="kc-btn kc-btn-ghost" style={{ padding: 8, borderRadius: "50%", color: "var(--dim)" }}>
                <Icon name="paperclip" size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Ask AI to analyze data, write an email, or find a client..." 
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{ flex: 1, background: "transparent", border: "none", color: "var(--text)", outline: "none", fontSize: "var(--text-md)" }} 
              />
              <button className="send-btn">
                <Icon name="arrow-up" size={20} />
              </button>
            </div>
            <div style={{ fontSize: "11px", color: "var(--faint)", marginTop: 12, textAlign: "center", letterSpacing: "0.5px" }}>
              Kompas AI can make mistakes. Consider verifying important legal information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
