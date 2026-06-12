"use client";
/* KompasCRM — AI Copilot & Assistant (ChatGPT style) */
import React, { useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";

export default function CopilotPage() {
  const [messages] = useState([]);

  const prompts = [
    "Draft an email to Elena",
    "Show my commission this month",
    "Find overdue invoices",
    "Summarize TRC law changes"
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      
      {/* Header */}
      <div style={{ padding: "var(--space-lg) var(--space-lg) 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cpu" size={24} color="white" />
          </div>
          <div>
            <h2 className="kc-h2" style={{ margin: 0 }}>Kompas AI Copilot</h2>
            <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
              Your intelligent assistant. Ask questions, generate emails, or analyze CRM data.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> AI Settings</button>
          <button className="kc-btn kc-btn-ghost"><Icon name="more-vertical" size={16} /></button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", borderTop: "1px solid var(--border)", position: "relative" }}>
        
        {/* Chat History */}
        <div style={{ flex: 1, padding: "var(--space-xl) var(--space-lg)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: "var(--space-md)", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              {msg.role === "assistant" ? (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="zap" size={18} color="white" />
                </div>
              ) : (
                <Avatar name="Admin User" size={36} />
              )}
              
              <div style={{ 
                background: msg.role === "user" ? "var(--color-primary)" : "var(--panel)", 
                color: msg.role === "user" ? "white" : "var(--fg)",
                padding: "var(--space-md)", 
                borderRadius: msg.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0", 
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                whiteSpace: "pre-wrap",
                boxShadow: "var(--shadow-sm)"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: "var(--space-lg)", background: "var(--panel)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Quick Prompts */}
            <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-md)", overflowX: "auto", paddingBottom: 4 }}>
              {prompts.map((p, i) => (
                <button key={i} style={{ 
                  background: "var(--panel-2)", border: "1px solid var(--border)", padding: "6px 12px", 
                  borderRadius: 16, fontSize: "var(--text-xs)", color: "var(--fg)", cursor: "pointer",
                  whiteSpace: "nowrap", transition: "all 0.2s"
                }} className="hover-border-primary">
                  {p}
                </button>
              ))}
            </div>

            <div style={{ 
              display: "flex", gap: "var(--space-sm)", background: "var(--bg)", 
              border: "2px solid var(--border)", borderRadius: 12, padding: "var(--space-sm) var(--space-md)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <button className="kc-btn kc-btn-ghost" style={{ padding: 4 }}><Icon name="paperclip" size={20} color="var(--dim)" /></button>
              <input type="text" placeholder="Ask AI to analyze data, write an email, or find a client..." style={{ flex: 1, background: "transparent", border: "none", color: "var(--fg)", outline: "none", fontSize: "var(--text-md)" }} />
              <button className="kc-btn kc-btn-primary" style={{ borderRadius: 8 }}><Icon name="arrow-up" size={18} /></button>
            </div>
            <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 8, textAlign: "center" }}>
              Kompas AI can make mistakes. Consider verifying important legal information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
