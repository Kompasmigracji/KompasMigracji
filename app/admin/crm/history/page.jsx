"use client";
import React from "react";
import { ActionHistory } from "@/components/admin/ActionHistory";

export default function HistoryDemoPage() {
  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] text-gray-800">
      <div className="bg-white/60 backdrop-blur-xl border-b border-black/10 px-8 py-5 flex items-center gap-4 sticky top-0 z-20">
        <h2 className="m-0 text-xl font-bold text-gray-900 tracking-tight">Історія дій</h2>
      </div>
      <div className="p-8 flex-1 flex justify-center">
        <div className="w-full max-w-2xl bg-white/60 backdrop-blur-md border border-black/10 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <ActionHistory />
        </div>
      </div>
    </div>
  );
}
