"use client";
/* iPhoenixCRM — Gamification & Sales Leaderboard */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function LeaderboardPage() {
  const [agents] = useState([
    { rank: 1, name: "Maria Garcia", role: "Senior Sales", points: 8450, dealsWon: 24, callsMade: 342, trend: "up" },
    { rank: 2, name: "Alex Jenkins", role: "Account Executive", points: 7200, dealsWon: 18, callsMade: 410, trend: "down" },
    { rank: 3, name: "Oleg V.", role: "Sales Rep", points: 5120, dealsWon: 12, callsMade: 280, trend: "up" },
    { rank: 4, name: "Anna Schmidt", role: "Junior Sales", points: 3400, dealsWon: 8, callsMade: 520, trend: "up" }
  ]);

  const [achievements] = useState([
    { id: 1, agent: "Maria Garcia", badge: "Deal Closer", desc: "Closed 5 deals in one day", time: "2 hours ago", icon: "zap", color: "var(--color-warning)" },
    { id: 2, agent: "Alex Jenkins", badge: "Phone Master", desc: "Made 100 calls this week", time: "Yesterday", icon: "phone", color: "var(--color-primary)" },
    { id: 3, name: "Oleg V.", badge: "Fast Responder", desc: "Replied to 10 leads in < 5 mins", time: "2 days ago", icon: "clock", color: "var(--color-success)" }
  ]);

  const columns = [
    { header: "Rank", cell: (row) => (
      <div style={{ fontSize: "18px", fontWeight: 700, color: row.rank === 1 ? "var(--color-warning)" : row.rank === 2 ? "#94a3b8" : row.rank === 3 ? "#b45309" : "var(--dim)" }}>
        #{row.rank} {row.rank === 1 && <Icon name="award" size={16} />}
      </div>
    )},
    { header: "Sales Rep", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <Avatar name={row.name.substring(0,2).toUpperCase()} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.role}</div>
        </div>
      </div>
    )},
    { header: "Total Points", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-success)" }}>{row.points.toLocaleString()}</span>
        <Icon name={row.trend === "up" ? "trending-up" : "trending-down"} size={16} color={row.trend === "up" ? "var(--color-success)" : "var(--color-danger)"} />
      </div>
    )},
    { header: "Deals Won", cell: (row) => <span style={{ fontWeight: 600 }}>{row.dealsWon}</span> },
    { header: "Calls Made", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.callsMade}</span> },
    { header: "Level", cell: (row) => {
      let level = "Gold";
      if (row.points < 5000) level = "Silver";
      if (row.points < 4000) level = "Bronze";
      return <Badge status={level === "Gold" ? "warning" : "default"} text={level} />;
    }}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Sales Leaderboard & Gamification</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Motivate your team with points, badges, and healthy competition.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="settings" size={16} /> Points Rules</button>
          <select className="kc-input" defaultValue="june2026">
            <option value="june2026">June 2026</option>
            <option value="may2026">May 2026</option>
            <option value="alltime">All Time</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        
        {/* The Podium */}
        <div className="kc-card" style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "40px 20px 0", background: "linear-gradient(180deg, var(--bg) 0%, rgba(245, 158, 11, 0.05) 100%)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-sm)", width: "100%", justifyContent: "center", height: 200 }}>
            
            {/* Rank 2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
              <Avatar name="AJ" size={48} style={{ border: "3px solid #94a3b8", marginBottom: 8 }} />
              <div style={{ fontWeight: 600, fontSize: "14px", textAlign: "center" }}>Alex Jenkins</div>
              <div style={{ fontSize: "12px", color: "var(--color-success)", fontWeight: 700, marginBottom: 8 }}>7,200 pts</div>
              <div style={{ width: "100%", height: 100, background: "linear-gradient(180deg, #94a3b8 0%, #cbd5e1 100%)", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "center", paddingTop: 8 }}>
                <span style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>2</span>
              </div>
            </div>

            {/* Rank 1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 140 }}>
              <Icon name="award" size={32} color="var(--color-warning)" style={{ marginBottom: 4 }} />
              <Avatar name="MG" size={64} style={{ border: "4px solid var(--color-warning)", marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: "16px", textAlign: "center" }}>Maria Garcia</div>
              <div style={{ fontSize: "14px", color: "var(--color-success)", fontWeight: 700, marginBottom: 8 }}>8,450 pts</div>
              <div style={{ width: "100%", height: 140, background: "linear-gradient(180deg, var(--color-warning) 0%, #fcd34d 100%)", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "center", paddingTop: 8 }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "white" }}>1</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
              <Avatar name="OV" size={48} style={{ border: "3px solid #b45309", marginBottom: 8 }} />
              <div style={{ fontWeight: 600, fontSize: "14px", textAlign: "center" }}>Oleg V.</div>
              <div style={{ fontSize: "12px", color: "var(--color-success)", fontWeight: 700, marginBottom: 8 }}>5,120 pts</div>
              <div style={{ width: "100%", height: 80, background: "linear-gradient(180deg, #b45309 0%, #d97706 100%)", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "center", paddingTop: 8 }}>
                <span style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>3</span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="kc-card" style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="bell" size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: "14px" }}>Live Achievements</h3>
          </div>
          <div style={{ flex: 1, padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)", overflowY: "auto" }}>
            {achievements.map(ach => (
              <div key={ach.id} style={{ display: "flex", gap: "var(--space-sm)", background: "var(--panel-2)", padding: "12px", borderRadius: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: `color-mix(in srgb, ${ach.color} 15%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={ach.icon} size={16} color={ach.color} />
                </div>
                <div>
                  <div style={{ fontSize: "13px" }}><strong>{ach.agent || ach.name}</strong> earned the <strong>{ach.badge}</strong> badge!</div>
                  <div style={{ fontSize: "11px", color: "var(--dim)", marginTop: 2 }}>{ach.desc}</div>
                  <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>{ach.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <DataTable columns={columns} data={agents} />
      </div>
    </div>
  );
}
