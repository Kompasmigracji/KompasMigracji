"use client";
/* KompasCRM — Fleet Management & Logistics (Samsara style) */
import React, { useState } from "react";
import { Icon, Badge, DataTable, Avatar } from "@/components/admin/ui";

export default function FleetPage() {
  const [trips] = useState([
    { id: "TRP-2026-42", route: "Kyiv ➔ Warsaw", driver: "Oleh Melnyk", vehicle: "Mercedes Sprinter (KA 1234)", passengers: 8, status: "en_route", border: "Krakivets" },
    { id: "TRP-2026-43", route: "Lviv ➔ Krakow", driver: "Andriy Boyko", vehicle: "VW Crafter (BC 4321)", passengers: 6, status: "at_border", border: "Shehyni" },
    { id: "TRP-2026-44", route: "Warsaw ➔ Kyiv", driver: "Serhiy Tkach", vehicle: "Mercedes Sprinter (KA 5566)", passengers: 2, status: "completed", border: "Dorohusk" },
    { id: "TRP-2026-45", route: "Odesa ➔ Poznan", driver: "Unassigned", vehicle: "TBD", passengers: 4, status: "scheduled", border: "TBD" }
  ]);

  const columns = [
    { header: "Trip ID", cell: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <Icon name="truck" size={16} color="var(--dim)" />
        <span style={{ fontWeight: 600 }}>{row.id}</span>
      </div>
    )},
    { header: "Route", cell: (row) => <span style={{ fontWeight: 500 }}>{row.route}</span> },
    { header: "Status", cell: (row) => {
      let color = "info";
      if (row.status === "completed") color = "success";
      if (row.status === "at_border") color = "warning";
      if (row.status === "scheduled") color = "default";
      if (row.status === "en_route") color = "primary";
      return <Badge status={color} text={row.status.replace("_", " ").toUpperCase()} />;
    }},
    { header: "Driver & Vehicle", cell: (row) => (
      row.driver === "Unassigned" ? (
        <span style={{ color: "var(--dim)" }}>Unassigned</span>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={row.driver} size={24} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "var(--text-sm)" }}>{row.driver}</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>{row.vehicle}</span>
          </div>
        </div>
      )
    )},
    { header: "Passengers", cell: (row) => (
      <span style={{ fontWeight: 600, color: row.passengers >= 8 ? "var(--color-warning)" : "var(--fg)" }}>
        {row.passengers}
      </span>
    )},
    { header: "Border Crossing", cell: (row) => <span style={{ color: "var(--dim)" }}><Icon name="flag" size={12} /> {row.border}</span> },
    { header: "", cell: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="kc-btn kc-btn-ghost"><Icon name="users" size={16} /></button>
        <button className="kc-btn kc-btn-ghost"><Icon name="map" size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Fleet & Transport</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Manage vehicles, drivers, cross-border trips, and passenger manifests.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="navigation" size={16} /> Live GPS Map</button>
          <button className="kc-btn kc-btn-primary"><Icon name="plus" size={16} /> Schedule Trip</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-primary)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Active Trips</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>2</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-warning)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Vehicles at Border</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)", color: "var(--color-warning)" }}>1</div>
        </div>
        <div className="kc-card" style={{ flex: 1, borderTop: "3px solid var(--color-success)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", textTransform: "uppercase", fontWeight: 600 }}>Passengers Moved (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: "var(--space-xs)" }}>412</div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
        <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel-2)", padding: "8px 12px", borderRadius: 8, flex: 1 }}>
            <Icon name="search" size={16} color="var(--dim)" />
            <input type="text" placeholder="Search trips, drivers, plates, or routes..." style={{ background: "transparent", border: "none", color: "var(--fg)", width: "100%", outline: "none", fontSize: "var(--text-sm)" }} />
          </div>
          <button className="kc-btn kc-btn-secondary"><Icon name="truck" size={16} /> Vehicles</button>
          <button className="kc-btn kc-btn-secondary"><Icon name="users" size={16} /> Drivers</button>
        </div>
        <DataTable columns={columns} data={trips} />
      </div>
    </div>
  );
}
