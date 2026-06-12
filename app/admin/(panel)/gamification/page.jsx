"use client";
/* KompasCRM — Gamification & Sales Leaderboards */
import React, { useState, useEffect } from "react";
import { Icon, Avatar, Badge, ProgressBar } from "@/components/admin/ui";

export default function GamificationPage() {
  const [leaderboard] = useState([]);

  const [activeTab, setActiveTab] = useState("leaderboard");

  // AI Gamification logs
  const [gameLogs, setGameLogs] = useState([]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-045 recalculated leaderboard rank coordinates for all sales personnel." },
      { type: "agent", text: "Agent-079 processed badge award: 'Deal Maker' assigned to Maria Garcia." },
      { type: "coordinator", text: "Coordinator [Agent-C14] resolved weekly XP sync conflict with core sales DB." },
      { type: "system", text: "President digital key verified on gamification ledger index." },
      { type: "agent", text: "Agent-162 unlocked 'Double XP Weekend' trigger configuration automatically." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setGameLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Гейміфікація & Змагання</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Мотивація команди через рівні, досвід (XP), атестації та автоматичні досягнення.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Правила XP</button>
          <button className="kc-btn kc-btn-primary"><Icon name="award" size={16} /> Створити Челендж</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", overflowX: "auto" }}>
        <button onClick={() => setActiveTab("leaderboard")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "leaderboard" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "leaderboard" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
          }}>
          <Icon name="award" size={16} /> Таблиця лідерів
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
          }}>
          <Icon name="cpu" size={16} /> AI Gamification Logs
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === "leaderboard" && (
          <div style={{ display: "flex", gap: "var(--space-lg)", flexWrap: "wrap" }}>
            {/* Leaderboard Table */}
            <div className="kc-card" style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", minWidth: 320 }}>
              <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid var(--border)", background: "var(--panel-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                  <Icon name="activity" size={20} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: "var(--text-md)", color: "var(--text)" }}>Кращі продавці (Червень 2026)</h3>
                </div>
              </div>

              <div style={{ padding: "var(--space-md) var(--space-lg)" }}>
                {leaderboard.map((user, index) => (
                  <div key={user.id} style={{ 
                    display: "flex", alignItems: "center", gap: "var(--space-md)", 
                    padding: "var(--space-md)", 
                    background: index === 0 ? "var(--brass-bg)" : "var(--panel)",
                    border: index === 0 ? "1px solid var(--color-primary)" : "1px solid var(--border)",
                    borderRadius: 12, marginBottom: "var(--space-sm)",
                    position: "relative",
                    flexWrap: "wrap"
                  }}>
                    <div style={{ width: 30, fontSize: 20, fontWeight: 800, color: index === 0 ? "var(--color-primary)" : index === 1 ? "var(--dim)" : index === 2 ? "var(--color-warning)" : "var(--faint)", textAlign: "center" }}>
                      #{index + 1}
                    </div>
                    
                    <Avatar name={user.name} size={44} />
                    
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-md)", display: "flex", alignItems: "center", gap: 8, color: "var(--text)" }}>
                        {user.name}
                        {index === 0 && <Icon name="award" size={16} color="var(--color-primary)" fill={true} />}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{user.role}</div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-lg)", alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Угоди</div>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>{user.deals}</div>
                      </div>
                      <div style={{ textAlign: "right", width: 80 }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 700 }}>XP</div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: "var(--color-primary)" }}>{user.points}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile & Achievements */}
            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "var(--space-md)", minWidth: 280 }}>
              {/* Player Card */}
              <div className="kc-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 80, background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)", opacity: 0.15 }}></div>
                
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--panel-2)", border: "4px solid var(--panel)", marginTop: 40, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "var(--color-primary)" }}>
                  A
                </div>
                <h3 style={{ margin: "var(--space-sm) 0 4px 0", fontSize: "var(--text-lg)", color: "var(--text)", fontWeight: 600 }}>Адміністратор (Ви)</h3>
                <div style={{ color: "var(--dim)", fontSize: "var(--text-sm)" }}>Рівень 14 • Гуру продажів</div>

                <div style={{ width: "100%", marginTop: "var(--space-lg)" }}>
                  <ProgressBar progress={9800} max={10000} label="Досвід (XP)" color="var(--color-primary)" />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>
                    <span>9,800 XP</span>
                    <span>10,000 XP для Рівня 15</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: "var(--text-md)", color: "var(--text)" }}>Останні нагороди</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)", marginTop: 8 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", border: "2px solid var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center" }} title="Швидкий Старт">
                    <Icon name="zap" size={24} color="var(--color-success)" />
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(217, 158, 84, 0.1)", border: "2px solid var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }} title="Супер закривач">
                    <Icon name="award" size={24} color="var(--color-primary)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ background: "#0d1117", border: "1px solid var(--border)", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи верифікації ігрових досягнень</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 350, overflowY: "auto" }}>
              {gameLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "#8b949e" }}>[{log.time}]</span>{" "}
                    <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
