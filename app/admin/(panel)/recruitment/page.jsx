"use client";
/* KompasCRM — Recruitment & ATS (Workable / Lever style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState("candidates");
  const [candidates] = useState([]);
  
  const [jobs] = useState([
    { id: "job-1", title: "Senior Frontend Developer", company: "TechCorp Poland", status: "Active", applicants: 12, date: "2026-07-08" },
    { id: "job-2", title: "Project Manager", company: "BuildIt Sp. z o.o.", status: "Draft", applicants: 0, date: "2026-07-05" },
  ]);

  const candidateColumns = [
    { header: "Candidate", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Applied For", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.role}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}><Icon name="briefcase" size={12} /> {row.company}</div>
      </div>
    )},
    { header: "Pipeline Stage", cell: (row) => {
      let color = "info";
      if (row.stage === "Hired") color = "success";
      if (row.stage === "Interview") color = "warning";
      if (row.stage === "Offer Sent") color = "primary";
      return <Badge status={color} text={row.stage.toUpperCase()} />;
    }},
    { header: "Fit Score", cell: (row) => (
      <span style={{ fontWeight: 600, color: parseInt(row.score) > 90 ? "var(--color-success)" : parseInt(row.score) > 80 ? "var(--color-warning)" : "var(--fg)" }}>
        {row.score}
      </span>
    )},
    { header: "Last Active", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="file-text" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="message-square" size={16} /></button>
      </div>
    )}
  ];

  const jobColumns = [
    { header: "Job Title", cell: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.title}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
      </div>
    )},
    { header: "Company", cell: (row) => <span style={{ fontWeight: 500 }}>{row.company}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "Active" ? "success" : "warning"} text={row.status} />
    )},
    { header: "Applicants", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.applicants > 0 ? "var(--color-primary)" : "var(--dim)" }}>
        {row.applicants} candidates
      </span>
    )},
    { header: "Posted", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.date}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="trash" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Recruitment & ATS</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage job openings, track applicants, and seamlessly place clients in jobs.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="briefcase" size={16} /> New Job</button>
          <button className="kc-btn kc-btn-primary"><Icon name="user-plus" size={16} /> Add Candidate</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Candidates</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>342</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Interviews This Week</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>45</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Successfully Placed (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>82</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--panel-2)" }}>
          <button 
            onClick={() => setActiveTab("candidates")}
            style={{ 
              padding: "16px 24px", 
              background: "transparent", 
              border: "none", 
              borderBottom: activeTab === "candidates" ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === "candidates" ? "var(--fg)" : "var(--dim)",
              fontWeight: activeTab === "candidates" ? 600 : 500,
              cursor: "pointer"
            }}
          >
            Candidates & Applications
          </button>
          <button 
            onClick={() => setActiveTab("jobs")}
            style={{ 
              padding: "16px 24px", 
              background: "transparent", 
              border: "none", 
              borderBottom: activeTab === "jobs" ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === "jobs" ? "var(--fg)" : "var(--dim)",
              fontWeight: activeTab === "jobs" ? 600 : 500,
              cursor: "pointer"
            }}
          >
            Job Postings
          </button>
        </div>

        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder={`Search ${activeTab}...`} style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Filter</button>
          {activeTab === "candidates" && <button className="kc-btn kc-btn-secondary"><Icon name="trello" size={16} /> Kanban</button>}
        </div>
        
        <div style={{ flex: 1, overflow: "auto" }}>
          {activeTab === "candidates" ? (
            <DataTable columns={candidateColumns} data={candidates} />
          ) : (
            <DataTable columns={jobColumns} data={jobs} />
          )}
        </div>
      </div>
    </div>
  );
}
