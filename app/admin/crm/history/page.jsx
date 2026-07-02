"use client";
import React from "react";
import { ActionHistory } from "@/components/admin/ActionHistory";

export default function HistoryDemoPage() {
  return (
    <div style={{ padding: "40px", minHeight: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        <h1 style={{ color: "var(--text)", marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Історія дій (iPhoenixCRM)</h1>
        <ActionHistory />
      </div>
    </div>
  );
}
