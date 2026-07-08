"use client";
/* KompasCRM — Partner Marketplace Management */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState("partners");

  const [partners] = useState([
    { id: "p-1", name: "Lex Secure Poland", category: "Юриспруденція", rating: 4.9, status: "Verified", offers: 2 },
    { id: "p-2", name: "HomeRentals Warszawa", category: "Житло", rating: 4.7, status: "Verified", offers: 1 },
    { id: "p-3", name: "Language Master", category: "Освіта", rating: 4.2, status: "Pending", offers: 0 }
  ]);

  const [offers] = useState([
    { id: "o-1", title: "-20% на консультацію", partner: "Lex Secure Poland", type: "Percentage", code: "KOMPAS-LEX-20", status: "Active" },
    { id: "o-2", title: "Безкоштовний аудит", partner: "Lex Secure Poland", type: "Free Tier", code: "KOMPAS-AUDIT", status: "Active" },
    { id: "o-3", title: "-50% комісії", partner: "HomeRentals Warszawa", type: "Percentage", code: "KOMPAS-HOME50", status: "Active" }
  ]);

  const partnerColumns = [
    { header: "Partner Name", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Avatar name={row.name} size={32} />
        <div style={{ fontWeight: 600 }}>{row.name}</div>
      </div>
    )},
    { header: "Category", cell: (row) => <span style={{ fontWeight: 500 }}>{row.category}</span> },
    { header: "Rating", cell: (row) => (
      <span style={{ color: "var(--color-warning)", fontWeight: 600 }}>★ {row.rating}</span>
    )},
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "Verified" ? "success" : "warning"} text={row.status.toUpperCase()} />
    )},
    { header: "Active Offers", cell: (row) => (
      <span style={{ fontWeight: 600 }}>{row.offers}</span>
    )},
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="edit" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="trash" size={16} /></button>
      </div>
    )}
  ];

  const offerColumns = [
    { header: "Offer Title", cell: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span> },
    { header: "Partner", cell: (row) => <span style={{ fontWeight: 500 }}>{row.partner}</span> },
    { header: "Type", cell: (row) => <span style={{ color: "var(--dim)" }}>{row.type}</span> },
    { header: "Promo Code", cell: (row) => (
      <code style={{ background: "var(--panel-2)", padding: "4px 8px", borderRadius: 4, fontFamily: "monospace", fontSize: "12px", color: "var(--color-primary)" }}>
        {row.code}
      </code>
    )},
    { header: "Status", cell: (row) => (
      <Badge status={row.status === "Active" ? "success" : "default"} text={row.status.toUpperCase()} />
    )},
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
          <h2 className="kc-h2" style={{ margin: 0 }}>Partners & Marketplace</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage verified partners, discounts, and exclusive offers for union members.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="tag" size={16} /> New Offer</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Partner</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Verified Partners</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>24</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Offers</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>56</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Codes Redeemed (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>1,204</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--panel-2)" }}>
          <button 
            onClick={() => setActiveTab("partners")}
            style={{ 
              padding: "16px 24px", 
              background: "transparent", 
              border: "none", 
              borderBottom: activeTab === "partners" ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === "partners" ? "var(--fg)" : "var(--dim)",
              fontWeight: activeTab === "partners" ? 600 : 500,
              cursor: "pointer"
            }}
          >
            Partners Directory
          </button>
          <button 
            onClick={() => setActiveTab("offers")}
            style={{ 
              padding: "16px 24px", 
              background: "transparent", 
              border: "none", 
              borderBottom: activeTab === "offers" ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === "offers" ? "var(--fg)" : "var(--dim)",
              fontWeight: activeTab === "offers" ? 600 : 500,
              cursor: "pointer"
            }}
          >
            Offers & Discounts
          </button>
        </div>

        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder={`Search ${activeTab}...`} style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Filter</button>
        </div>
        
        <div style={{ flex: 1, overflow: "auto" }}>
          {activeTab === "partners" ? (
            <DataTable columns={partnerColumns} data={partners} />
          ) : (
            <DataTable columns={offerColumns} data={offers} />
          )}
        </div>
      </div>
    </div>
  );
}
