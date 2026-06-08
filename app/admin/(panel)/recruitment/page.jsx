"use client";
/* KompasCRM — Recruitment & ATS (Workable / Lever style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function RecruitmentPage() {
  const [candidates] = useState([
    { id: "C-901", name: "Ihor Petrenko", role: "Forklift Operator", company: "Logex Warehouse", stage: "Interview", date: "Today", score: "85%" },
    { id: "C-902", name: "Oksana Koval", role: "Packer / Sorter", company: "Amazon Fulfillment", stage: "Hired", date: "Yesterday", score: "92%" },
    { id: "C-903", name: "Andriy Shevchuk", role: "CNC Operator", company: "MetalWorks Sp. z o.o.", stage: "Screening", date: "2 days ago", score: "78%" },
    { id: "C-904", name: "Dmytro Boyko", role: "Construction Worker", company: "BuildBud", stage: "Offer Sent", date: "May 25", score: "95%" }
  ]);

  const columns = [
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
          <button className="kc-btn kc-btn-secondary"><Icon name="briefcase" size={16} /> Job Openings</button>
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

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search candidates by name, skills, or job title..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Stage</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="trello" size={16} /> Kanban Board</button>
        </div>
        <DataTable columns={columns} data={candidates} />
      </div>
    </div>
  );
}
