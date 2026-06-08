"use client";
/* iPhoenixCRM — Visual Workflow Builder */
import React, { useState, useEffect } from "react";
import { Icon, Spinner, EmptyState, Badge } from "@/components/admin/ui";

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFlow, setEditingFlow] = useState(null);

  // Mock initial load
  useEffect(() => {
    setTimeout(() => {
      setWorkflows([
        { id: "wf_1", name: "Welcome Email to New Leads", active: true, trigger: "On Lead Created", actions: 1 },
        { id: "wf_2", name: "Notify Admin of Large Deals", active: false, trigger: "On Deal Updated", actions: 2 }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const openEditor = (flow) => {
    setEditingFlow(flow || { id: "new", name: "New Workflow", active: true, nodes: [{ id: "n1", type: "trigger", label: "Select Trigger" }] });
  };

  if (editingFlow) {
    return (
      <div style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
        {/* Editor Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <button className="kc-btn kc-btn-ghost" onClick={() => setEditingFlow(null)} style={{ padding: 4 }}>
              <Icon name="back" size={20} />
            </button>
            <input 
              type="text" 
              className="kc-input" 
              value={editingFlow.name}
              onChange={(e) => setEditingFlow({...editingFlow, name: e.target.value})}
              style={{ fontSize: "var(--text-lg)", fontWeight: 600, border: "none", background: "transparent", padding: 0 }}
            />
            <Badge status={editingFlow.active ? "success" : "dim"} text={editingFlow.active ? "Active" : "Inactive"} />
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button className="kc-btn kc-btn-ghost" onClick={() => setEditingFlow({...editingFlow, active: !editingFlow.active})}>
              {editingFlow.active ? "Disable" : "Enable"}
            </button>
            <button className="kc-btn kc-btn-primary" onClick={() => setEditingFlow(null)}>
              <Icon name="check" size={16} /> Save Workflow
            </button>
          </div>
        </div>

        {/* Builder Canvas Mockup */}
        <div className="kc-card" style={{ flex: 1, background: "var(--panel-2)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border)" }}>
          <div style={{ position: "absolute", top: 16, left: 16, color: "var(--dim)", fontSize: "var(--text-xs)" }}>
            Canvas Mode
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-lg)" }}>
            {/* Trigger Node */}
            <div style={{ background: "var(--bg)", border: "2px solid var(--color-info)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)", width: 260, boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-info)", fontWeight: 600, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="zap" size={14} /> TRIGGER
              </div>
              <select className="kc-input" style={{ width: "100%", cursor: "pointer" }}>
                <option>When a Lead is created</option>
                <option>When a Deal is updated</option>
                <option>On Schedule (Cron)</option>
                <option>Manual Trigger</option>
              </select>
            </div>

            <div style={{ width: 2, height: 40, background: "var(--border)" }}></div>

            {/* Condition/Action Node */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)", width: 260, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="file" size={14} /> ACTION
              </div>
              <select className="kc-input" style={{ width: "100%", cursor: "pointer", marginBottom: 8 }}>
                <option>Send Email to Client</option>
                <option>Assign to Agent</option>
                <option>Create Task</option>
                <option>Webhook Request</option>
              </select>
              <button className="kc-btn kc-btn-ghost" style={{ width: "100%", fontSize: "var(--text-xs)", padding: 4 }}>
                <Icon name="settings" size={14} /> Configure Action
              </button>
            </div>

            <div style={{ width: 2, height: 40, background: "var(--border)" }}></div>

            {/* Add Node Button */}
            <button style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--dim)" }}>
              <Icon name="plus" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Automations & Workflows</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Build no-code automations to streamline your CRM processes.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary" onClick={() => openEditor(null)}>
          <Icon name="plus" size={16} /> Create Workflow
        </button>
      </div>

      <div className="kc-grid kc-grid-3">
        {loading ? <Spinner /> : workflows.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <EmptyState title="No automations yet" description="Create your first workflow to save time." icon="zap" />
          </div>
        ) : workflows.map(wf => (
          <div key={wf.id} className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 className="kc-h3" style={{ margin: 0, fontSize: "var(--text-md)" }}>{wf.name}</h3>
              <Badge status={wf.active ? "success" : "dim"} text={wf.active ? "Active" : "Off"} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--dim)" }}>
                <Icon name="zap" size={14} color="var(--color-info)" /> {wf.trigger}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--dim)" }}>
                <Icon name="file" size={14} color="var(--color-primary)" /> {wf.actions} Actions
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)", marginTop: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-ghost" style={{ flex: 1 }} onClick={() => openEditor(wf)}>
                <Icon name="edit" size={14} /> Edit
              </button>
              <button className="kc-btn kc-btn-ghost" style={{ padding: 8 }}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
