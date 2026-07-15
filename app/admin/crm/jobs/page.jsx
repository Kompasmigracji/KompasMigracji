"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, DollarSign, Clock, Users, Trash2 } from 'lucide-react';
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    salary_range: '',
    employment_type: 'Повна зайнятість',
    description: '',
    requirements: '', // comma separated initially
    ai_match_score: 85,
    status: 'active'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/admin/crm/jobs');
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/crm/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.job) {
        setJobs([data.job, ...jobs]);
        setShowForm(false);
        setFormData({
          title: '', company_name: '', location: '', salary_range: '',
          employment_type: 'Повна зайнятість', description: '', requirements: '',
          ai_match_score: 85, status: 'active'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити цю вакансію?')) return;
    try {
      await fetch(`/api/admin/crm/jobs?id=${id}`, { method: 'DELETE' });
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const visibleJobs = jobs.filter(j => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (j.title || "").toLowerCase().includes(q) || (j.company_name || "").toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">

      {/* Top Header */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center gap-6 sticky top-0 z-20">
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Рекрутинг (Вакансії)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">Управління вакансіями та відгуками мігрантів</p>
        </div>

        <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 gap-3 max-w-[320px] ml-4 transition-colors focus-within:border-blue-500/50">
          <Search size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук вакансій..."
            className="bg-transparent border-none outline-none text-gray-800 dark:text-white w-full text-sm placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Скасувати' : 'Нова вакансія'}
        </button>
      </div>

      <div className="p-8 flex flex-col gap-6">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
            >
              <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                  <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white">Створення вакансії</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Назва посади</label>
                      <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Компанія</label>
                      <input required value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Локація</label>
                      <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Зарплата (наприклад: 4000-5000 PLN)</label>
                      <input required value={formData.salary_range} onChange={e => setFormData({ ...formData, salary_range: e.target.value })} className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Опис</label>
                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Вимоги (через кому)</label>
                    <input required value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} className="w-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                    Зберегти та Опублікувати
                  </button>
                </form>
              </SpotlightCard>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-gray-500 dark:text-gray-400 py-10 text-center">Завантаження...</div>
        ) : visibleJobs.length === 0 ? (
          <SpotlightCard className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-10 text-center text-gray-500 dark:text-gray-400">
            {jobs.length === 0 ? 'Жодної вакансії ще не створено. Натисніть "Нова вакансія" вище.' : 'Нічого не знайдено за вашим запитом.'}
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visibleJobs.map(job => (
              <SpotlightCard key={job.id} className="bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between group hover:border-black/20 dark:hover:border-white/20 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">{job.title}</h3>
                    {job.status === 'active' && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">Активна</span>}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm m-0">{job.company_name}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary_range}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.employment_type}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg text-sm font-bold">
                    <Users className="w-4 h-4" />
                    <span>{job.applicationsCount || 0} відгуків</span>
                  </div>
                  <button onClick={() => handleDelete(job.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 mt-2 p-2 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
