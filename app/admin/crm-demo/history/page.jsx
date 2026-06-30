"use client";
import React from "react";
import { ActionHistory } from "@/components/admin/ActionHistory";

export default function HistoryDemoPage() {
  return (
    <div style={{ padding: "40px", background: "#334155", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        <h1 style={{ color: "#fff", marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Демо: История действий карточки</h1>
        <ActionHistory />
      </div>
    </div>
  );
}
