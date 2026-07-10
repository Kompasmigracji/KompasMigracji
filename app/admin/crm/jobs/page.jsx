"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, DollarSign, Clock, Users, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    salary_range: '',
    employment_type: 'Повна зайнятість',
    description: '',
    requirements: '', // comma separated initially
    ai_match_score: 85,
    is_active: true
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
          ai_match_score: 85, is_active: true
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Рекрутинг (Вакансії)</h1>
          <p className="text-zinc-400 mt-1">Управління вакансіями та відгуками мігрантів</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Скасувати' : 'Нова вакансія'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-medium text-white mb-4">Створення вакансії</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Назва посади</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Компанія</label>
              <input required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Локація</label>
              <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Зарплата (наприклад: 4000-5000 PLN)</label>
              <input required value={formData.salary_range} onChange={e => setFormData({...formData, salary_range: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Опис</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Вимоги (через кому)</label>
            <input required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" />
          </div>
          <button type="submit" className="w-full py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors">
            Зберегти та Опублікувати
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-zinc-500 py-10 text-center">Завантаження...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center text-zinc-400">
          Жодної вакансії ще не створено. Натисніть "Нова вакансія" вище.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between group hover:border-zinc-700 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium text-white">{job.title}</h3>
                  {job.is_active && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Активна</span>}
                </div>
                <p className="text-zinc-400 text-sm">{job.company_name}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3"/> {job.salary_range}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {job.employment_type}</span>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between border-t border-zinc-800 md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{job.applicationsCount || 0} відгуків</span>
                </div>
                <button onClick={() => handleDelete(job.id)} className="text-zinc-500 hover:text-red-400 mt-2 p-2 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
