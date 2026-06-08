"use client";
/* iPhoenixCRM — Training Academy (Lessonly / 360Learning style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function AcademyPage() {
  const [courses] = useState([
    { id: "CRS-01", title: "Sales Onboarding 101", category: "Sales", enrolled: 12, completed: 8, avgScore: "94%", status: "active" },
    { id: "CRS-02", title: "TRC Legal Framework 2026", category: "Legal & Compliance", enrolled: 45, completed: 45, avgScore: "88%", status: "active" },
    { id: "CRS-03", title: "How to use iPhoenixCRM", category: "Tools", enrolled: 156, completed: 150, avgScore: "99%", status: "active" },
    { id: "CRS-04", title: "Advanced Negotiation Tactics", category: "Sales", enrolled: 0, completed: 0, avgScore: "—", status: "draft" }
  ]);

  const columns = [
    { header: "Course Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, background: "var(--panel-2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="play-circle" size={20} color={row.status === "active" ? "var(--color-primary)" : "var(--dim)"} />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="info" text={row.category} /> },
    { header: "Enrolled", cell: (row) => <span style={{ fontWeight: 500 }}>{row.enrolled} staff</span> },
    { header: "Completion Rate", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: 120 }}>
        <div style={{ flex: 1, background: "var(--panel-2)", height: 6, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ 
            width: row.enrolled > 0 ? `${(row.completed / row.enrolled) * 100}%` : "0%", 
            height: "100%", 
            background: "var(--color-success)" 
          }}></div>
        </div>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>
          {row.enrolled > 0 ? Math.round((row.completed / row.enrolled) * 100) : 0}%
        </span>
      </div>
    )},
    { header: "Avg Test Score", cell: (row) => <span style={{ fontWeight: 600 }}>{row.avgScore}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "draft") color = "warning";
      if (row.status === "archived") color = "default";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-3" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="more-horizontal" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Training Academy (LMS)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Onboard new employees, create video lessons, and test their knowledge automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="award" size={16} /> Certificates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Course</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Courses</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>12</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Certificates Issued</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>240</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Staff in Training</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>8</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search courses by title or topic..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Category</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Learner Progress</button>
        </div>
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
}
