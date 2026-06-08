"use client";
/* KompasCRM — Mobile App Builder & White-Label Portal */
import React, { useState, useEffect } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState("branding");
  const [activeMenuTab, setActiveMenuTab] = useState("branding");

  // AI Mobile App Sync Logs
  const [mobileLogs, setMobileLogs] = useState([
    { time: "14:35:10", type: "system", message: "President signed production build release tag: v2.1.2-mobile." },
    { time: "14:32:00", type: "coordinator", message: "Mobile Coordinator [Agent-C15] validated offline index db schemas." },
    { time: "14:28:15", type: "agent", message: "Asset Compiler Agent-004 generated responsive web manifestations and sizes." },
    { time: "14:20:00", type: "system", message: "KompasCRM Mobile Sync Network online (175 automated agents handling device caches)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-059 compressed client portal avatar icon sprites to 18kb." },
      { type: "agent", text: "Agent-108 synced remote database modifications to local device IndexedDB structure." },
      { type: "coordinator", text: "Coordinator [Agent-C03] checked iOS Safari orientation compatibility flags." },
      { type: "system", text: "President digital key verified on cloud notification dispatch service." },
      { type: "agent", text: "Agent-171 optimized secure token exchange API endpoints for low-bandwidth cellular connections." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setMobileLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      
      {/* Header */}
      <div style={{ padding: "var(--space-lg) var(--space-lg) 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Конструктор Мобільного Додатка (PWA)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Кастомізація клієнтського порталу. Клієнти зможуть встановити його на свій телефон прямо з браузера як PWA.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="grid" size={16} /> Попередній перегляд</button>
          <button className="kc-btn kc-btn-primary"><Icon name="settings" size={16} /> Опублікувати зміни</button>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "var(--space-md)", padding: "0 var(--space-lg)" }}>
        <button onClick={() => setActiveTab("branding")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "branding" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "branding" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="settings" size={16} /> Налаштування та Брендінг
        </button>
        <button onClick={() => setActiveTab("logs")} 
          style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: activeTab === "logs" ? "2px solid var(--color-primary)" : "2px solid transparent",
            color: activeTab === "logs" ? "var(--color-primary)" : "var(--dim)",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
          }}>
          <Icon name="cpu" size={16} /> AI Mobile Sync Logs
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {activeTab === "branding" && (
          <>
            {/* Settings Sidebar */}
            <div style={{ width: 400, background: "var(--panel)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              {/* Menu Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                <button 
                  onClick={() => setActiveMenuTab("branding")}
                  style={{ flex: 1, padding: "var(--space-md)", background: activeMenuTab === "branding" ? "var(--bg)" : "transparent", border: "none", borderBottom: activeMenuTab === "branding" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeMenuTab === "branding" ? "var(--color-primary)" : "var(--fg)", fontWeight: 600, cursor: "pointer" }}
                >
                  Брендінг
                </button>
                <button 
                  onClick={() => setActiveMenuTab("navigation")}
                  style={{ flex: 1, padding: "var(--space-md)", background: activeMenuTab === "navigation" ? "var(--bg)" : "transparent", border: "none", borderBottom: activeMenuTab === "navigation" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeMenuTab === "navigation" ? "var(--color-primary)" : "var(--fg)", fontWeight: 600, cursor: "pointer" }}
                >
                  Навігація
                </button>
              </div>

              <div style={{ padding: "var(--space-lg)", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                
                {activeMenuTab === "branding" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>Назва Додатка</label>
                      <input type="text" className="kc-input" defaultValue="Kompas Portal" />
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>Назва, що відображатиметься під іконкою на екрані телефону.</div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>Логотип Додатка</label>
                      <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #111, #333)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="compass" size={32} color="white" />
                        </div>
                        <button className="kc-btn kc-btn-secondary">Змінити іконку</button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>Основний колір бренду</label>
                      <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8b5cf6", border: "1px solid var(--border)" }}></div>
                        <input type="text" className="kc-input" defaultValue="#8b5cf6" style={{ flex: 1 }} />
                      </div>
                    </div>
                  </>
                )}

                {activeMenuTab === "navigation" && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600 }}>Нижня панель вкладок</label>
                      <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px" }}><Icon name="plus" size={14} /> Додати</button>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", background: "var(--bg)", padding: "var(--space-sm)", borderRadius: 8, border: "1px solid var(--border)" }}>
                        <Icon name="menu" size={16} color="var(--dim)" />
                        <Icon name="home" size={16} color="var(--color-primary)" />
                        <input type="text" className="kc-input" defaultValue="Головна" style={{ flex: 1, height: 28 }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", background: "var(--bg)", padding: "var(--space-sm)", borderRadius: 8, border: "1px solid var(--border)" }}>
                        <Icon name="menu" size={16} color="var(--dim)" />
                        <Icon name="file-text" size={16} color="var(--fg)" />
                        <input type="text" className="kc-input" defaultValue="Документи" style={{ flex: 1, height: 28 }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Live Preview Area */}
            <div style={{ flex: 1, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {/* iPhone Mockup */}
              <div style={{ width: 300, height: 500, background: "#fff", borderRadius: 40, border: "8px solid #222", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                
                {/* Notch */}
                <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 90, height: 20, background: "#000", borderRadius: 10, zIndex: 10 }}></div>
                
                {/* App Header */}
                <div style={{ padding: "36px 16px 12px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="compass" size={12} color="white" />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Kompas</span>
                    </div>
                  </div>
                </div>

                {/* App Body */}
                <div style={{ flex: 1, background: "#f8fafc", padding: 16, overflowY: "auto" }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Вітаємо,</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Анна Смирнова</div>

                  <div style={{ background: "#8b5cf6", borderRadius: 12, padding: 12, color: "white", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, opacity: 0.9 }}>Наступний запис</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Консультація по карті побиту</div>
                  </div>
                </div>

                {/* Bottom Tab Bar */}
                <div style={{ height: 50, background: "white", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 4 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#8b5cf6" }}>
                    <Icon name="home" size={18} color="#8b5cf6" />
                    <span style={{ fontSize: 8 }}>Головна</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94a3b8" }}>
                    <Icon name="file-text" size={18} color="#94a3b8" />
                    <span style={{ fontSize: 8 }}>Документи</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "logs" && (
          <div className="kc-card" style={{ flex: 1, background: "#06090e", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "var(--space-md)", margin: "var(--space-lg)" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи синхронізації мобільних пристроїв</h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: 8, maxHeight: 350, overflowY: "auto" }}>
              {mobileLogs.map((log, index) => {
                let color = "#8b949e";
                if (log.type === "coordinator") color = "#58a6ff";
                if (log.type === "system") color = "#56d364";
                return (
                  <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                    <span style={{ color: "var(--dim)" }}>[{log.time}]</span>{" "}
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
