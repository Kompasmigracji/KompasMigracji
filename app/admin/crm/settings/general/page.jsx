"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

export default function GeneralSettingsPage() {
  const [form, setForm] = useState({ company_name: "", country: "", timezone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/crm/settings')
      .then(r => r.json())
      .then(j => {
        if (j.data) setForm({ company_name: j.data.company_name || "", country: j.data.country || "", timezone: j.data.timezone || "" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/crm/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
        <span>Налаштування</span>
        <Icon name="chevron-right" size={14} className="text-gray-400 dark:text-gray-600" />
        <span className="text-gray-900 dark:text-white">Основні</span>
      </div>

      {/* Main Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
        <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10 relative z-10">Завантаження...</div>
          ) : (
            <div className="flex flex-col gap-8 relative z-10">

              {/* Row: Название компании */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-black/5 dark:border-white/5 pb-8">
                <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-700 dark:text-gray-300 pt-3">
                  <span className="text-red-500 mr-1">*</span> Назва компанії
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    Назва компанії використовується при генерації документів
                  </div>
                </div>
              </div>

              {/* Row: Страна */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-black/5 dark:border-white/5 pb-8">
                <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-700 dark:text-gray-300 pt-3">
                  <span className="text-red-500 mr-1">*</span> Країна
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    Використовується для визначення телефонного коду за замовчуванням
                  </div>
                </div>
              </div>

              {/* Row: Часовой пояс */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 pb-4">
                <div className="w-full md:w-64 shrink-0 text-sm font-bold text-gray-700 dark:text-gray-300 pt-3">
                  <span className="text-red-500 mr-1">*</span> Часовий пояс
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    Використовується для відображення всіх дат у системі
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end items-center gap-4">
                {saved && (
                  <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
                    <Icon name="check" size={16} /> Збережено
                  </motion.span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 ${saving ? 'opacity-70' : 'hover:bg-blue-600 hover:scale-[1.02]'}`}
                >
                  <Icon name="check-circle" size={16} /> {saving ? 'Збереження...' : 'Зберегти зміни'}
                </button>
              </div>

            </div>
          )}
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
