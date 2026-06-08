"use client";
/* KompasCRM — Lead Routing & Auto-Assignment */
import React, { useState } from "react";
import { Icon, Badge, Avatar } from "@/components/admin/ui";

export default function LeadRoutingPage() {
  const [rules] = useState([
    { id: "R-01", name: "High-Value B2B Leads", condition: "Budget > €5000 AND Type = B2B", assignTo: ["Alex Jenkins", "You (Admin)"], method: "Round Robin", status: "active", priority: 1 },
    { id: "R-02", name: "Polish Speakers", condition: "Language = PL", assignTo: ["Maria Garcia"], method: "Direct Assign", status: "active", priority: 2 },
    { id: "R-03", name: "General Leads (Website)", condition: "Source = Website Form", assignTo: ["Oleg V.", "Anna S.", "Alex Jenkins"], method: "Round Robin (Load Balanced)", status: "active", priority: 3 },
    { id: "R-04", name: "Night Shift Auto-Responder", condition: "Time = 18:00 - 09:00", assignTo: ["AI Copilot Bot"], method: "Direct Assign", status: "paused", priority: 4 }
  ]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Lead Routing & Round Robin</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Automatically assign new leads to the right sales reps based on rules or distribute them equally.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Manage Teams</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Routing Rule</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Leads Routed (Today)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Rules</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>3</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Unassigned Leads (Catch-All)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>0</div>
        </div>
      </div>

      <div className="kc-card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: 0 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", background: "var(--panel-2)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>Routing Rules (Executed from top to bottom)</h3>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-md)" }}>
          {rules.map((rule, index) => (
            <div key={rule.id} style={{ 
              display: "flex", alignItems: "center", gap: "var(--space-md)", 
              padding: "var(--space-md)", border: "1px solid var(--border)", 
              borderRadius: 12, marginBottom: "var(--space-sm)", background: "var(--panel)" 
            }}>
              {/* Drag Handle */}
              <div style={{ cursor: "grab", color: "var(--dim)" }}>
                <Icon name="more-vertical" size={20} />
              </div>

              {/* Priority Badge */}
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--dim)" }}>
                {rule.priority}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{rule.name}</span>
                  <Badge status={rule.status === "active" ? "success" : "default"} text={rule.status.toUpperCase()} />
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="filter" size={14} /> IF {rule.condition}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name={rule.method.includes("Round Robin") ? "refresh-cw" : "corner-down-right"} size={12} /> {rule.method}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {rule.assignTo.map((person, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg)", border: "1px solid var(--border)", padding: "2px 8px 2px 2px", borderRadius: 16, fontSize: "var(--text-xs)", fontWeight: 500 }}>
                      <Avatar name={person.includes("AI") ? "AI" : person} size={20} />
                      {person}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
              </div>
            </div>
          ))}

          {/* Fallback Rule */}
          <div style={{ 
            display: "flex", alignItems: "center", gap: "var(--space-md)", 
            padding: "var(--space-md)", border: "1px dashed var(--color-warning)", 
            borderRadius: 12, marginTop: "var(--space-md)", background: "rgba(245, 158, 11, 0.05)" 
          }}>
            <div style={{ width: 24 }}></div> {/* spacer */}
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-warning)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              *
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "var(--text-md)", color: "var(--color-warning)" }}>Default Fallback Rule (Catch-All)</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>IF no other rules match</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", marginBottom: 4 }}>ASSIGN TO</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg)", border: "1px solid var(--border)", padding: "2px 8px 2px 2px", borderRadius: 16, fontSize: "var(--text-xs)", fontWeight: 500, width: "fit-content" }}>
                <Avatar name="Admin" size={20} /> You (Admin)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
