"use client";
/* KompasCRM — Gamification & Sales Leaderboards */
import React, { useState } from "react";
import { Icon, Avatar, Badge } from "@/components/admin/ui";

export default function GamificationPage() {
  const [leaderboard] = useState([
    { id: 1, name: "Alex Jenkins", role: "Senior Sales", points: 14500, deals: 24, revenue: "€42,000", trend: "up", avatar: "AJ" },
    { id: 2, name: "Maria Garcia", role: "Sales Exec", points: 12200, deals: 18, revenue: "€31,500", trend: "up", avatar: "MG" },
    { id: 3, name: "You (Admin)", role: "Director", points: 9800, deals: 12, revenue: "€18,000", trend: "same", avatar: "A" },
    { id: 4, name: "Oleg V.", role: "Junior Sales", points: 6400, deals: 8, revenue: "€9,200", trend: "down", avatar: "OV" },
    { id: 5, name: "Anna S.", role: "Consultant", points: 4100, deals: 5, revenue: "€4,500", trend: "down", avatar: "AS" }
  ]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Sales Gamification</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Turn sales and closing deals into a competition. Track XP, levels, and achievements.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> XP Rules</button>
          <button className="kc-btn kc-btn-primary"><Icon name="award" size={16} /> Create Challenge</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden", paddingBottom: "var(--space-lg)" }}>
        
        {/* Leaderboard */}
        <div className="kc-card" style={{ flex: 2, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid var(--border)", background: "var(--panel-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <Icon name="trending-up" size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>Top Performers (June 2026)</h3>
            </div>
            <select className="kc-input" style={{ width: 150 }}>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>All Time</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-md)" }}>
            {leaderboard.map((user, index) => (
              <div key={user.id} style={{ 
                display: "flex", alignItems: "center", gap: "var(--space-md)", 
                padding: "var(--space-md)", 
                background: index === 0 ? "rgba(234, 179, 8, 0.1)" : "var(--panel)",
                border: index === 0 ? "1px solid rgba(234, 179, 8, 0.5)" : "1px solid var(--border)",
                borderRadius: 12, marginBottom: "var(--space-sm)",
                position: "relative"
              }}>
                <div style={{ width: 30, fontSize: 20, fontWeight: 800, color: index === 0 ? "#eab308" : index === 1 ? "#94a3b8" : index === 2 ? "#b45309" : "var(--dim)", textAlign: "center" }}>
                  #{index + 1}
                </div>
                
                <Avatar name={user.avatar} size={48} />
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-md)", display: "flex", alignItems: "center", gap: 8 }}>
                    {user.name}
                    {index === 0 && <Icon name="star" size={16} color="#eab308" fill="#eab308" />}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{user.role}</div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Revenue</div>
                    <div style={{ fontWeight: 600 }}>{user.revenue}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Deals</div>
                    <div style={{ fontWeight: 600 }}>{user.deals}</div>
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

        {/* Your Profile & Achievements */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* Player Card */}
          <div className="kc-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 80, background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)" }}></div>
            
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--panel)", border: "4px solid var(--bg)", marginTop: 40, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700 }}>
              A
            </div>
            <h3 style={{ margin: "var(--space-sm) 0 4px 0", fontSize: "var(--text-lg)" }}>You (Admin)</h3>
            <div style={{ color: "var(--dim)", fontSize: "var(--text-sm)" }}>Level 14 • Deal Maker</div>

            <div style={{ width: "100%", marginTop: "var(--space-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 8 }}>
                <span>XP: 9,800</span>
                <span>Next Level: 10,000</span>
              </div>
              <div style={{ height: 8, background: "var(--panel-2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "98%", height: "100%", background: "var(--color-primary)" }}></div>
              </div>
            </div>
          </div>

          {/* Active Challenge */}
          <div className="kc-card" style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", color: "white", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <div>
                <Badge status="warning" text="ACTIVE CHALLENGE" />
                <h3 style={{ margin: "var(--space-sm) 0 4px 0" }}>The July Sprint</h3>
                <div style={{ fontSize: "var(--text-xs)", opacity: 0.7 }}>Close 10 B2B deals this month.</div>
              </div>
              <Icon name="target" size={32} color="#f59e0b" />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "70%", height: "100%", background: "#f59e0b" }}></div>
              </div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>7 / 10</div>
            </div>
            <div style={{ fontSize: "10px", marginTop: 8, opacity: 0.5, textAlign: "right" }}>Ends in 4 days</div>
          </div>

          {/* Recent Achievements */}
          <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: "0 0 var(--space-md) 0", fontSize: "var(--text-md)" }}>Achievements</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(16, 185, 129, 0.1)", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: 1 }}>
                <Icon name="zap" size={24} color="#10b981" />
              </div>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245, 158, 11, 0.1)", border: "2px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: 1 }}>
                <Icon name="award" size={24} color="#f59e0b" />
              </div>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--panel-2)", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: 0.5, filter: "grayscale(1)" }}>
                <Icon name="dollar-sign" size={24} color="var(--dim)" />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: "var(--space-md)", textAlign: "center" }}>
              Unlock "Rainmaker" by generating €50k revenue in one week.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
