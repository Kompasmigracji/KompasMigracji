"use client";
/* KompasCRM — Relocation Housing & Property Management */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function HousingPage() {
  const [properties] = useState([
    { id: "PROP-01", address: "ul. Wolska 45, Warsaw", type: "Dormitory", capacity: 45, occupied: 42, rent: "€250/bed", status: "near_capacity" },
    { id: "PROP-02", address: "ul. Długa 12, Krakow", type: "Apartment", capacity: 4, occupied: 4, rent: "€1,200/mo", status: "full" },
    { id: "PROP-03", address: "ul. Piotrkowska 88, Lodz", type: "Dormitory", capacity: 60, occupied: 15, rent: "€200/bed", status: "available" },
    { id: "PROP-04", address: "ul. Złota 9, Warsaw", type: "Apartment", capacity: 2, occupied: 0, rent: "€1,500/mo", status: "vacant" }
  ]);

  const columns = [
    { header: "Address / Property", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="home" size={16} color="var(--dim)" />
        <div>
          <div style={{ fontWeight: 600 }}>{row.address}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.id}</div>
        </div>
      </div>
    )},
    { header: "Type", cell: (row) => <Badge status="info" text={row.type} /> },
    { header: "Status", cell: (row) => {
      let color = "success";
      if (row.status === "full") color = "danger";
      if (row.status === "near_capacity") color = "warning";
      if (row.status === "vacant") color = "default";
      return <Badge status={color} text={row.status.toUpperCase().replace("_", " ")} />;
    }},
    { header: "Occupancy", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.occupied >= row.capacity ? "var(--color-danger)" : "var(--fg)" }}>
        {row.occupied} / {row.capacity}
      </span>
    )},
    { header: "Price", cell: (row) => <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{row.rent}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="users" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="settings" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Relocation & Housing</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage dormitories, assign beds to migrants, and track rent payments.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="map-pin" size={16} /> Map View</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Add Property</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Total Properties</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>14</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Available Beds</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>50</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Monthly Rent Collection</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>€18,400</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search by address, city, or property ID..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="filter" size={16} /> Filter Vacant</button>
        </div>
        <DataTable columns={columns} data={properties} />
      </div>
    </div>
  );
}
