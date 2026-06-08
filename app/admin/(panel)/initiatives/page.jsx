"use client";
/* iPhoenixCRM — Initiatives & Services Directory (Ship style) */
import React, { useState } from "react";
import { Icon, Badge, Avatar } from "@/components/admin/ui";

export default function InitiativesPage() {
  const [initiatives] = useState([
    { id: "init_1", name: "Student Housing Support", category: "Social Welfare", status: "active", budget: "$15,000", participants: 12, progress: 65, desc: "Providing emergency housing stipends for university students in need." },
    { id: "init_2", name: "Free Legal Aid Clinic", category: "Pro Bono", status: "planning", budget: "$5,000", participants: 4, progress: 10, desc: "Weekly free consultation sessions for low-income migrant workers." },
    { id: "init_3", name: "Winter Clothing Drive", category: "Charity", status: "completed", budget: "$2,000", participants: 25, progress: 100, desc: "Collected and distributed 500+ winter coats to shelters." }
  ]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Initiatives & Services</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage strategic initiatives, pro bono projects, and community services.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Initiative</button>
      </div>

      <div className="kc-grid kc-grid-3">
        {initiatives.map(init => (
          <div key={init.id} className="kc-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
              <Badge 
                status={init.status === "active" ? "success" : init.status === "completed" ? "info" : "warning"} 
                text={init.status} 
              />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase" }}>{init.category}</span>
            </div>

            <h3 className="kc-h3" style={{ fontSize: "var(--text-md)", marginBottom: "var(--space-xs)" }}>{init.name}</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--dim)", lineHeight: 1.5, flex: 1, marginBottom: "var(--space-md)" }}>
              {init.desc}
            </p>

            <div style={{ marginBottom: "var(--space-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 4 }}>
                <span>Goal Progress</span>
                <span>{init.progress}%</span>
              </div>
              <div style={{ width: "100%", height: 6, background: "var(--panel-2)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ width: `${init.progress}%`, height: "100%", background: "var(--color-primary)", borderRadius: 100 }}></div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-sm)" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Budget/Funding</span>
                <span style={{ fontWeight: 600 }}>{init.budget}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex" }}>
                  <Avatar name="A" size={24} style={{ border: "2px solid var(--bg)" }} />
                  <Avatar name="B" size={24} style={{ border: "2px solid var(--bg)", marginLeft: -8 }} />
                  <Avatar name="C" size={24} style={{ border: "2px solid var(--bg)", marginLeft: -8 }} />
                </div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginLeft: 4 }}>+{init.participants - 3}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
