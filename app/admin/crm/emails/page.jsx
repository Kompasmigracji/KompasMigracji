"use client";

import React, { useState, useEffect } from "react";
import DualSidebarShell from "@/components/admin/DualSidebarShell";
import { Icon } from "@/components/admin/ui";
import { motion } from "framer-motion";

export default function EmailOutreachPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [form, setForm] = useState({ name: '', subject: '', body: '', targetEmails: '' });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/emails/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/emails/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowNew(false);
        setForm({ name: '', subject: '', body: '', targetEmails: '' });
        fetchCampaigns();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <DualSidebarShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Email Outreach</h1>
            <p className="text-gray-500 dark:text-gray-400">Керування холодними розсилками для архітектурного сервісу.</p>
          </div>
          <button 
            onClick={() => setShowNew(true)}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Icon name="plus" size={18} /> Нова кампанія
          </button>
        </div>

        {showNew && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Створити Email Кампанію</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Назва кампанії</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none dark:text-white" placeholder="напр. Ресторани Варшава" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Тема листа (Subject)</label>
                <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none dark:text-white" placeholder="Оновлення дизайну вашого закладу" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Emails (через кому)</label>
                <textarea required value={form.targetEmails} onChange={e => setForm({...form, targetEmails: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none dark:text-white" placeholder="client1@mail.com, client2@mail.com" rows={3}></textarea>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Текст листа</label>
                <textarea required value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none dark:text-white" placeholder="Вітаю! Мене звати Олександр..." rows={6}></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium">Скасувати</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors">{loading ? 'Збереження...' : 'Запустити кампанію'}</button>
              </div>
            </form>
          </motion.div>
        )}

        {/* List of campaigns */}
        <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-black/5 dark:border-white/5 text-sm text-gray-500 dark:text-gray-400">
                <th className="p-4 font-semibold">Кампанія</th>
                <th className="p-4 font-semibold">Отримувачі</th>
                <th className="p-4 font-semibold">Статус</th>
                <th className="p-4 font-semibold">Дата</th>
              </tr>
            </thead>
            <tbody>
              {loading && campaigns.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Завантаження...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Немає жодної кампанії</td></tr>
              ) : (
                campaigns.map((camp, i) => (
                  <tr key={i} className="border-b border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 dark:text-white font-medium">{camp.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{camp.target_count}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-lg uppercase tracking-wider">{camp.status}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(camp.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DualSidebarShell>
  );
}
