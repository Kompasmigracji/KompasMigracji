"use client";
/* iPhoenixCRM — LMS / Courses (edX style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function LMSPage() {
  const [courses] = useState([
    { id: "CRS-01", title: "Employee Onboarding 2026", type: "Internal", students: 12, completion: "85%", status: "published", instructor: "Alex" },
    { id: "CRS-02", title: "Visa Interview Preparation", type: "Public Paid", students: 430, completion: "42%", status: "published", instructor: "Maria" },
    { id: "CRS-03", title: "Advanced Sales Techniques", type: "Internal", students: 0, completion: "0%", status: "draft", instructor: "Alex" }
  ]);

  const columns = [
    { header: "Course Title", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="book-open" size={20} color="var(--dim)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.type}</div>
        </div>
      </div>
    )},
    { header: "Status", cell: (row) => <Badge status={row.status === "published" ? "success" : "default"} text={row.status.toUpperCase()} /> },
    { header: "Students", cell: (row) => <span style={{ fontWeight: 600 }}>{row.students.toLocaleString()}</span> },
    { header: "Avg Completion", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "var(--text-xs)" }}>{row.completion}</span>
        <div style={{ flex: 1, height: 6, background: "var(--panel-2)", borderRadius: 3, width: 60 }}>
          <div style={{ height: "100%", width: row.completion, background: "var(--color-primary)", borderRadius: 3 }}></div>
        </div>
      </div>
    )},
    { header: "Instructor", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.instructor} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.instructor}</span>
      </div>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="users" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Academy & LMS</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create online courses for clients and employee training.
          </p>
        </div>
        <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Create Course</button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
            <Icon name="book" size={24} />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Courses</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>2</div>
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in srgb, var(--color-success) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)" }}>
            <Icon name="users" size={24} />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Learners</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>442</div>
          </div>
        </div>
        <div className="kc-card" style={{ flex: 1, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in srgb, var(--color-warning) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-warning)" }}>
            <Icon name="award" size={24} />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Certificates Issued</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>128</div>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
}
