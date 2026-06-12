"use client";
/* KompasCRM — E-Signatures & Digital Contracts */
import React, { useState } from "react";
import { Icon, Avatar, Badge, DataTable } from "@/components/admin/ui";

export default function ESignaturesPage() {
  const [documents] = useState([]);

  const columns = [
    { header: "Document Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="file-text" size={16} color={row.status === "signed" ? "var(--color-success)" : "var(--color-primary)"} />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id} • {row.type}</div>
        </div>
      </div>
    )},
    { header: "Signer (Client)", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={row.client.substring(0,2).toUpperCase()} size={24} />
        <span style={{ fontSize: "var(--text-sm)" }}>{row.client}</span>
      </div>
    )},
    { header: "Sent On", cell: (row) => <span style={{ fontSize: "var(--text-sm)" }}>{row.sentDate}</span> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "pending") color = "warning";
      if (row.status === "expired") color = "danger";
      return <Badge status={color} text={row.status.toUpperCase()} />;
    }},
    { header: "Sender", cell: (row) => <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.owner}</span> },
    { header: "", cell: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        {row.status === "pending" && (
          <button className="kc-btn kc-btn-ghost" title="Resend Reminder"><Icon name="bell" size={16} /></button>
        )}
        {row.status === "signed" && (
          <button className="kc-btn kc-btn-ghost" title="Download Signed PDF"><Icon name="download" size={16} color="var(--color-success)" /></button>
        )}
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>E-Signatures</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Send contracts via SMS/Email. Clients sign directly on their phones.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="file" size={16} /> Templates</button>
          <button className="kc-btn kc-btn-primary"><Icon name="send" size={16} /> Send for Signature</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", height: 250 }}>
        
        {/* Left: Stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "4px solid var(--color-success)" }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Successfully Signed (MTD)</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>42</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check-circle" size={24} color="var(--color-success)" />
            </div>
          </div>
          <div className="kc-card" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "4px solid var(--color-warning)" }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Awaiting Client Signature</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>8</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="clock" size={24} color="var(--color-warning)" />
            </div>
          </div>
        </div>

        {/* Right: Mobile Phone Simulation */}
        <div className="kc-card" style={{ width: 400, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: "#000", border: "4px solid #333", borderRadius: 24, position: "relative" }}>
          <div style={{ height: 20, width: 120, background: "#333", position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, zIndex: 10 }}></div>
          
          <div style={{ background: "var(--bg)", flex: 1, margin: 4, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "30px 16px 16px", borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Icon name="compass" size={24} color="var(--color-primary)" /></div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: "14px" }}>KompasMigracji Document</div>
              <div style={{ textAlign: "center", fontSize: "10px", color: "var(--dim)" }}>Please sign below to proceed.</div>
            </div>
            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ height: 60, background: "var(--panel-2)", borderRadius: 4, marginBottom: 16, padding: 8, fontSize: "8px", color: "var(--dim)" }}>
                [Legal Text Preview]<br/>
                I hereby grant Power of Attorney to KompasMigracji representatives to submit documents on my behalf to the Voivodeship Office...
              </div>
              <div style={{ fontSize: "10px", fontWeight: 600, marginBottom: 8 }}>Draw your signature:</div>
              <div style={{ height: 80, border: "2px dashed var(--color-primary)", borderRadius: 8, position: "relative", background: "rgba(59, 130, 246, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Simulated signature path */}
                <svg width="100%" height="100%" viewBox="0 0 200 80" style={{ position: "absolute", top: 0, left: 0 }}>
                  <path d="M 20 60 Q 40 10, 60 50 T 90 40 T 120 60 T 150 20" fill="transparent" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", bottom: 4, right: 8, fontSize: "8px", color: "var(--dim)" }}>Ivan Petrov</div>
              </div>
              <button className="kc-btn kc-btn-primary" style={{ width: "100%", marginTop: "auto" }}>Sign & Submit</button>
            </div>
          </div>
        </div>

      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by document name or client..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <select className="kc-input" style={{ width: 150 }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Signed</option>
          </select>
        </div>
        <DataTable columns={columns} data={documents} />
      </div>
    </div>
  );
}
