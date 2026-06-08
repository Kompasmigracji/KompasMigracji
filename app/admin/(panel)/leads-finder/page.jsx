"use client";
/* iPhoenixCRM — Lead Finder & B2B Scraping (Apollo.io style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function LeadFinderPage() {
  const [leads] = useState([
    { id: "LDF-001", name: "Janusz Kowalski", title: "HR Director", company: "Zabka Polska", industry: "Retail", email: "j.kowal@zabka.pl", phone: "+48 500***", status: "unlocked" },
    { id: "LDF-002", name: "Michał Nowak", title: "CEO", company: "BudMax Sp. z o.o.", industry: "Construction", email: "m.nowak@budmax...", phone: "Unlock", status: "locked" },
    { id: "LDF-003", name: "Anna Lewandowska", title: "Recruitment Lead", company: "Amazon Fulfillment", industry: "Logistics", email: "anna.l@amazon.pl", phone: "+48 601***", status: "unlocked" },
    { id: "LDF-004", name: "Piotr Zieliński", title: "Factory Manager", company: "LG Energy Solution", industry: "Manufacturing", email: "piotr.z@lg...", phone: "Unlock", status: "locked" }
  ]);

  const columns = [
    { header: "Contact", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.title}</div>
        </div>
      </div>
    )},
    { header: "Company", cell: (row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.company}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="briefcase" size={10} /> {row.industry}
        </div>
      </div>
    )},
    { header: "Email Address", cell: (row) => (
      <span style={{ color: row.status === "locked" ? "var(--dim)" : "var(--color-primary)", filter: row.status === "locked" ? "blur(3px)" : "none", userSelect: row.status === "locked" ? "none" : "auto" }}>
        {row.email}
      </span>
    )},
    { header: "Phone Number", cell: (row) => (
      row.status === "locked" ? (
        <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}>
          <Icon name="unlock" size={12} /> Unlock
        </button>
      ) : (
        <span style={{ fontWeight: 500 }}>{row.phone}</span>
      )
    )},
    { header: "Data Status", cell: (row) => {
      let color = "success";
      if (row.status === "locked") color = "warning";
      return <Badge status={color} text={row.status === "unlocked" ? "VERIFIED" : "HIDDEN"} />;
    }},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-secondary" style={{ padding: "6px 12px" }}>
          <Icon name="plus" size={14} /> Add to CRM
        </button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Lead Finder (B2B Database)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Search over 10 million Polish companies, find decision-makers, and extract verified emails.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="database" size={16} /> Saved Lists</button>
          <button className="kc-btn kc-btn-primary"><Icon name="search" size={16} /> Advanced Search</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Credits Remaining</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>942</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Leads Added to CRM</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>156</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Bounce Rate (Emails)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>1.2%</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1 }}>
        {/* Left: Filters Sidebar */}
        <div className="kc-card" style={{ width: 250, padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", margin: 0 }}>Search Filters</h3>
          
          <div>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>Job Title</label>
            <input className="kc-input" placeholder="e.g. CEO, HR, Founder" style={{ width: "100%", marginTop: 4 }} defaultValue="HR, Recruitment" />
          </div>
          
          <div>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>Industry</label>
            <select className="kc-input" style={{ width: "100%", marginTop: 4 }}>
              <option>All Industries</option>
              <option>Logistics & Transport</option>
              <option selected>Manufacturing & Construction</option>
              <option>Retail & E-commerce</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>Location</label>
            <input className="kc-input" placeholder="e.g. Warsaw, Poland" style={{ width: "100%", marginTop: 4 }} defaultValue="Poland" />
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--dim)", fontWeight: 600 }}>Company Size</label>
            <select className="kc-input" style={{ width: "100%", marginTop: 4 }}>
              <option>Any</option>
              <option>50 - 200 Employees</option>
              <option selected>200+ Employees</option>
            </select>
          </div>

          <button className="kc-btn kc-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}>
            <Icon name="search" size={14} /> Find Leads
          </button>
        </div>

        {/* Right: Results Table */}
        <div className="kc-card" style={{ flex: 1, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
            <div style={{ fontWeight: 600 }}>4 Results Found</div>
            <div style={{ flex: 1 }}></div>
            <button className="kc-btn kc-btn-secondary"><Icon name="check-square" size={16} /> Select All</button>
            <button className="kc-btn kc-btn-primary"><Icon name="users" size={16} /> Save to Sequence</button>
          </div>
          <DataTable columns={columns} data={leads} />
        </div>
      </div>
    </div>
  );
}
