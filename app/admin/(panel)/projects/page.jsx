"use client";
/* iPhoenixCRM — Agile Project Management (Taiga style) */
import React, { useState } from "react";
import { Icon, Badge, Avatar } from "@/components/admin/ui";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("sprint"); // sprint, backlog

  const sprintTasks = [
    { id: "T-101", title: "Implement new payment gateway", status: "In Progress", points: 8, assignee: "Alex Admin", type: "feature" },
    { id: "T-102", title: "Fix layout shift on mobile devices", status: "Done", points: 3, assignee: "Maria Manager", type: "bug" },
    { id: "T-103", title: "Setup PostgreSQL replication", status: "To Do", points: 13, assignee: "System Bot", type: "infrastructure" }
  ];

  const backlogTasks = [
    { id: "T-104", title: "Migrate legacy users to new auth system", points: 21, type: "feature" },
    { id: "T-105", title: "Update email templates to new branding", points: 5, type: "enhancement" }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "feature": return "var(--color-primary)";
      case "bug": return "var(--color-danger)";
      case "infrastructure": return "var(--color-warning)";
      default: return "var(--color-info)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h2 className="kc-h2" style={{ margin: 0 }}>CRM Core V2.0</h2>
            <Badge status="success" text="Sprint 14 Active" />
          </div>
          <p style={{ color: "var(--dim)", margin: 0, fontSize: "var(--text-sm)" }}>
            Agile Dashboard: Sprint ends in 3 days. 11/24 points completed.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /> Project Settings</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New User Story</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("sprint")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "sprint" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "sprint" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "sprint" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="zap" size={16} /> Current Sprint
        </button>
        <button 
          onClick={() => setActiveTab("backlog")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "backlog" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "backlog" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "backlog" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="file" size={16} /> Product Backlog
        </button>
      </div>

      {activeTab === "sprint" && (
        <div style={{ flex: 1, display: "flex", gap: "var(--space-md)", overflowX: "auto", paddingBottom: "var(--space-md)" }}>
          {["To Do", "In Progress", "Code Review", "Done"].map(col => (
            <div key={col} style={{ width: 320, flexShrink: 0, background: "var(--panel-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", textTransform: "uppercase", color: "var(--dim)" }}>{col}</span>
                <span style={{ background: "var(--bg)", padding: "2px 8px", borderRadius: 100, fontSize: "var(--text-xs)" }}>
                  {sprintTasks.filter(t => t.status === col).length}
                </span>
              </div>
              
              <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", flex: 1, overflowY: "auto" }}>
                {sprintTasks.filter(t => t.status === col).map(task => (
                  <div key={task.id} className="kc-card" style={{ padding: "var(--space-sm)", cursor: "grab", borderLeft: `3px solid ${getTypeColor(task.type)}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontFamily: "monospace" }}>{task.id}</span>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <span style={{ fontSize: "var(--text-xs)", background: "var(--panel-2)", padding: "2px 6px", borderRadius: 4 }}>{task.points} pts</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 500, fontSize: "var(--text-sm)", lineHeight: 1.4, marginBottom: 12 }}>
                      {task.title}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "var(--text-xs)", color: getTypeColor(task.type), textTransform: "uppercase", fontWeight: 600 }}>{task.type}</span>
                      <Avatar name={task.assignee} size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "backlog" && (
        <div className="kc-card" style={{ flex: 1, overflowY: "auto", padding: 0 }}>
          <div style={{ padding: "var(--space-md)", background: "var(--panel-2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>Backlog Prioritization</span>
            <span style={{ color: "var(--dim)" }}>Total: 26 pts</span>
          </div>
          {backlogTasks.map(task => (
            <div key={task.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
              <Icon name="menu" size={16} color="var(--dim)" style={{ cursor: "grab" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: getTypeColor(task.type) }}></div>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)", fontFamily: "monospace" }}>{task.id}</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{task.title}</span>
              <span style={{ fontSize: "var(--text-xs)", background: "var(--panel-2)", padding: "4px 8px", borderRadius: 4 }}>{task.points} pts</span>
              <button className="kc-btn kc-btn-ghost"><Icon name="plus" size={16} /> Add to Sprint</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
