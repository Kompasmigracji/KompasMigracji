"use client";
/* iPhoenixCRM — Gamification & Loyalty (Zurmo style) */
import React, { useState } from "react";
import { Icon, Avatar } from "@/components/admin/ui";

export default function GamificationPage() {
  const [leaderboard] = useState([
    { rank: 1, name: "Alex Jenkins", points: 14500, level: 42, title: "Sales Ninja", avatar: "AJ", trend: "up" },
    { rank: 2, name: "Maria Garcia", points: 12200, level: 38, title: "Support Hero", avatar: "MG", trend: "up" },
    { rank: 3, name: "David O.", points: 9800, level: 31, title: "Deal Maker", avatar: "DO", trend: "down" }
  ]);

  const [badges] = useState([
    { id: 1, name: "First Blood", desc: "Closed your first deal", icon: "crosshair", earned: true },
    { id: 2, name: "Speed Demon", desc: "Resolved a ticket in under 5 mins", icon: "zap", earned: true },
    { id: 3, name: "Century Club", desc: "Close 100 deals", icon: "award", earned: false, progress: 85 },
    { id: 4, name: "Night Owl", desc: "Work past midnight", icon: "moon", earned: false, progress: 0 }
  ]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Team Gamification</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Motivate your team with points, levels, and achievements.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)" }}>
        
        {/* Left Column: Leaderboard */}
        <div style={{ flex: 1 }}>
          <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="trending-up" size={18} color="var(--color-primary)" /> Top Performers (This Month)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {leaderboard.map(user => (
              <div key={user.rank} className="kc-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: user.rank === 1 ? "var(--color-warning)" : "var(--dim)", width: 30, textAlign: "center" }}>
                  #{user.rank}
                </div>
                <Avatar name={user.avatar} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{user.name}</div>
                  <div style={{ color: "var(--dim)", fontSize: "var(--text-xs)" }}>Level {user.level} · {user.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--color-primary)" }}>{user.points.toLocaleString()} pts</div>
                  <div style={{ fontSize: "var(--text-xs)", color: user.trend === "up" ? "var(--color-success)" : "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                    <Icon name={user.trend === "up" ? "arrow-up" : "arrow-down"} size={12} />
                    {user.trend === "up" ? "+1,200 this week" : "-300 this week"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Badges */}
        <div style={{ flex: 1 }}>
          <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="award" size={18} color="var(--color-warning)" /> Available Achievements
          </h3>
          <div className="kc-grid kc-grid-2">
            {badges.map(badge => (
              <div key={badge.id} className="kc-card" style={{ textAlign: "center", opacity: badge.earned ? 1 : 0.6 }}>
                <div style={{ width: 64, height: 64, margin: "0 auto var(--space-md)", borderRadius: "50%", background: badge.earned ? "var(--color-warning)" : "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", color: badge.earned ? "#fff" : "var(--dim)" }}>
                  <Icon name={badge.icon} size={32} />
                </div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{badge.name}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: badge.earned ? 0 : "var(--space-sm)", lineHeight: 1.4 }}>{badge.desc}</div>
                
                {!badge.earned && badge.progress !== undefined && (
                  <div style={{ width: "100%", height: 6, background: "var(--panel-2)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ width: `${badge.progress}%`, height: "100%", background: "var(--color-primary)", borderRadius: 100 }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
