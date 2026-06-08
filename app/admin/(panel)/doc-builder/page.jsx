"use client";
/* KompasCRM — Document Templates Builder (Generator) */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function DocBuilderPage() {
  const [templates] = useState([
    { id: "TPL-01", name: "Power of Attorney (Pełnomocnictwo)", category: "Legal Forms", generated: 1245, lastUpdated: "May 20, 2026", status: "active" },
    { id: "TPL-02", name: "B2C Service Contract (Umowa Zlecenia)", category: "Contracts", generated: 830, lastUpdated: "June 01, 2026", status: "active" },
    { id: "TPL-03", name: "B2B Legal Retainer Agreement", category: "Contracts", generated: 142, lastUpdated: "Yesterday", status: "draft" },
    { id: "TPL-04", name: "Urząd Application Form (Wniosek)", category: "Government", generated: 3500, lastUpdated: "Jan 10, 2026", status: "active" }
  ]);

  const [variables] = useState([
    "{{client.first_name}}", "{{client.last_name}}", "{{client.passport}}", "{{client.pesel}}", "{{client.address}}",
    "{{company.name}}", "{{company.nip}}", "{{date.today}}", "{{lawyer.name}}"
  ]);

  const columns = [
    { header: "Template Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={row.category === "Contracts" ? "briefcase" : row.category === "Government" ? "shield" : "file-text"} size={16} color="var(--color-primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.category}</div>
        </div>
      </div>
    )},
    { header: "Times Generated", cell: (row) => <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{row.generated.toLocaleString()}</span> },
    { header: "Last Updated", cell: (row) => <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>{row.lastUpdated}</span> },
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "active" ? "success" : "default"} text={row.status.toUpperCase()} />
    )},
    { header: "Actions", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>
          <Icon name="code" size={14} /> Edit Vars
        </button>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit-2" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Document Templates Builder</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Create dynamic PDF and Word templates using CRM variables (e.g., {"{{client.name}}"}).
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="book" size={16} /> Variables Guide</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> New Template</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-lg)", flexShrink: 0 }}>
        
        {/* Left: Stats & Lists */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div style={{ display: "flex", gap: "var(--space-md)" }}>
            <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Templates</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42</div>
            </div>
            <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Docs Generated (YTD)</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-success)" }}>18,450</div>
              <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: 4 }}>Saved approx. 900 hours!</div>
            </div>
          </div>
          
          <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
                <Icon name="search" size={16} color="var(--dim)" />
                <input type="text" placeholder="Search templates..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
              </div>
              <select className="kc-input" style={{ width: 160 }}>
                <option>All Categories</option>
                <option>Contracts</option>
                <option>Government</option>
                <option>Legal Forms</option>
              </select>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              <DataTable columns={columns} data={templates} />
            </div>
          </div>
        </div>

        {/* Right: Quick Builder Preview */}
        <div className="kc-card" style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column", borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)" }}>
            <Icon name="layout" size={16} color="var(--color-warning)" />
            <h3 style={{ margin: 0, fontSize: "13px" }}>Quick Builder Preview</h3>
          </div>
          
          <div style={{ padding: "16px", flex: 1, overflowY: "auto", background: "var(--bg)" }}>
            <div style={{ background: "white", color: "black", padding: "24px", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: "12px", fontFamily: "serif", lineHeight: 1.6 }}>
              <h2 style={{ textAlign: "center", marginBottom: 16, fontSize: "16px" }}>PEŁNOMOCNICTWO</h2>
              <p>
                Ja niżej podpisany(a) <span style={{ background: "#fef08a", padding: "2px 4px", borderRadius: 2 }}>{"{{client.first_name}}"}</span> <span style={{ background: "#fef08a", padding: "2px 4px", borderRadius: 2 }}>{"{{client.last_name}}"}</span>,
                legitymujący(a) się paszportem nr <span style={{ background: "#fef08a", padding: "2px 4px", borderRadius: 2 }}>{"{{client.passport}}"}</span>, zamieszkały(a) pod adresem <span style={{ background: "#fef08a", padding: "2px 4px", borderRadius: 2 }}>{"{{client.address}}"}</span>...
              </p>
              <br/>
              <p>upoważniam Pana/Panią <span style={{ background: "#bfdbfe", padding: "2px 4px", borderRadius: 2 }}>{"{{lawyer.name}}"}</span> do reprezentowania mnie przed Urzędem Wojewódzkim...</p>
            </div>

            <div style={{ marginTop: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--dim)", textTransform: "uppercase", marginBottom: 8 }}>Available Variables</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {variables.map(v => (
                  <div key={v} style={{ fontSize: "11px", background: "var(--panel-2)", padding: "4px 8px", borderRadius: 4, fontFamily: "monospace", border: "1px dashed var(--border)", cursor: "pointer" }}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
