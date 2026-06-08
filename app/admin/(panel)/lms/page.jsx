"use client";
/* iPhoenixCRM — LMS & Employee Onboarding */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function LMSPage() {
  const [courses] = useState([
    { id: "CRS-01", title: "Sales Onboarding 101", category: "Onboarding", lessons: 12, enrolled: 8, completionRate: "94%", status: "published" },
    { id: "CRS-02", title: "Advanced Immigration Law", category: "Legal", lessons: 24, enrolled: 3, completionRate: "45%", status: "published" },
    { id: "CRS-03", title: "Using the CRM & Dialer", category: "Software", lessons: 5, enrolled: 15, completionRate: "100%", status: "published" },
    { id: "CRS-04", title: "B2B Relocation Sales Script", category: "Sales", lessons: 3, enrolled: 0, completionRate: "0%", status: "draft" }
  ]);

  const columns = [
    { header: "Course Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="book" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.lessons} lessons / modules</div>
        </div>
      </div>
    )},
    { header: "Category", cell: (row) => <Badge status="default" text={row.category} /> },
    { header: "Enrolled Staff", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="users" size={14} color="var(--dim)" />
        <span style={{ fontWeight: 500 }}>{row.enrolled}</span>
      </div>
    )},
    { header: "Avg Completion Rate", cell: (row) => (
      <div style={{ width: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 600, marginBottom: 4 }}>
          <span>{row.completionRate}</span>
        </div>
        <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ 
            width: row.completionRate, 
            height: "100%", 
            background: parseInt(row.completionRate) > 80 ? "var(--color-success)" : "var(--color-primary)" 
          }}></div>
        </div>
      </div>
    )},
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "published" ? "success" : "default"} text={row.status.toUpperCase()} />
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="play-circle" size={16} color="var(--color-primary)" /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>LMS & Internal Training</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Train your employees. Create courses, video tutorials, and quizzes to automate onboarding.
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
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>3</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Staff in Training</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>6</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Employees currently completing courses.</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Failed Quizzes (Last 7d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>2</div>
          <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Require manager review.</div>
        </div>
      </div>

      {/* Staff View / Course Player Preview */}
      <div className="kc-card" style={{ marginBottom: "var(--space-lg)", background: "rgba(139, 92, 246, 0.05)", border: "1px dashed var(--color-primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="eye" size={20} color="var(--color-primary)" />
            <span style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>What Your Staff Sees (Course Player Preview)</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <div style={{ width: 250, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: "var(--space-md)" }}>
            <div style={{ fontWeight: 700, marginBottom: "var(--space-md)" }}>Sales Onboarding 101</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--color-success)", fontWeight: 600 }}>
                <Icon name="check-circle" size={14} /> 1. Introduction to Kompas
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--color-success)", fontWeight: 600 }}>
                <Icon name="check-circle" size={14} /> 2. Our Services & Pricing
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--fg)", fontWeight: 600, background: "var(--panel-2)", padding: 8, borderRadius: 8 }}>
                <Icon name="play-circle" size={14} color="var(--color-primary)" /> 3. Handling Objections
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--dim)" }}>
                <Icon name="lock" size={14} /> 4. Final Quiz (Required)
              </div>
            </div>
          </div>

          <div style={{ flex: 1, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Icon name="play" size={48} color="rgba(255,255,255,0.8)" style={{ cursor: "pointer" }} />
              <div style={{ position: "absolute", bottom: 10, left: 10, color: "white", fontSize: "12px", background: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: 4 }}>14:22</div>
            </div>
            <div style={{ padding: "var(--space-md)" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>Lesson 3: Handling Objections ("It's too expensive")</h3>
              <p style={{ margin: 0, color: "var(--dim)", fontSize: "var(--text-sm)" }}>Watch this video to learn how to explain the value of our premium legal services compared to cheap competitors.</p>
              <div style={{ marginTop: "var(--space-md)", display: "flex", justifyContent: "flex-end" }}>
                <button className="kc-btn kc-btn-primary">Mark as Complete & Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search courses..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
        </div>
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
}
