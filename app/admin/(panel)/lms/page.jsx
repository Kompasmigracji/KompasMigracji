"use client";
/* iPhoenixCRM — Learning Management System (edX style) */
import React, { useState } from "react";
import { Icon, Badge, EmptyState } from "@/components/admin/ui";

export default function LMSPage() {
  const [activeTab, setActiveTab] = useState("courses"); // courses, students

  const courses = [
    { id: "c_1", title: "CRM Onboarding Masterclass", modules: 5, students: 12, status: "published", progress: 100 },
    { id: "c_2", title: "Sales Negotiation Techniques", modules: 3, students: 8, status: "published", progress: 45 },
    { id: "c_3", title: "Advanced Legal Compliance 2026", modules: 0, students: 0, status: "draft", progress: 0 }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Academy & LMS</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create and manage training courses for your team and clients.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Course</button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid var(--border)", marginBottom: "var(--space-lg)" }}>
        <button 
          onClick={() => setActiveTab("courses")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "courses" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "courses" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "courses" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="book" size={16} /> My Courses
        </button>
        <button 
          onClick={() => setActiveTab("students")}
          style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: activeTab === "students" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "students" ? "var(--color-primary)" : "var(--dim)", fontWeight: activeTab === "students" ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="users" size={16} /> Student Progress
        </button>
      </div>

      {activeTab === "courses" && (
        <div className="kc-grid kc-grid-3">
          {courses.map(course => (
            <div key={course.id} className="kc-card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
              {/* Course Image Mock */}
              <div style={{ height: 120, background: "color-mix(in srgb, var(--color-primary) 20%, var(--bg))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="play-circle" size={48} color="color-mix(in srgb, var(--color-primary) 50%, transparent)" />
              </div>
              
              <div style={{ padding: "var(--space-md)", flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Badge status={course.status === "published" ? "success" : "dim"} text={course.status} />
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{course.modules} Modules</span>
                </div>
                
                <h3 className="kc-h3" style={{ fontSize: "var(--text-md)", margin: "8px 0" }}>{course.title}</h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--dim)", marginTop: "auto" }}>
                  <Icon name="users" size={14} /> {course.students} Enrolled
                </div>
              </div>

              <div style={{ padding: "var(--space-md)", borderTop: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)" }}>
                <button className="kc-btn kc-btn-ghost" style={{ flex: 1, justifyContent: "center" }}><Icon name="edit" size={16} /> Edit Curriculum</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "students" && (
        <div className="kc-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
            <h3 className="kc-h3" style={{ margin: 0 }}>Enrollment Analytics</h3>
            <input type="text" className="kc-input" placeholder="Search student..." />
          </div>
          <div style={{ textAlign: "center", padding: "var(--space-2xl)", color: "var(--dim)" }}>
            <Icon name="activity" size={48} color="var(--border)" style={{ marginBottom: "var(--space-md)" }} />
            <div>Detailed analytics will appear once students begin completing course modules.</div>
          </div>
        </div>
      )}
    </div>
  );
}
