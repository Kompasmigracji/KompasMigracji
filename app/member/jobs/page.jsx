"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Search, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function JobsDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/member/jobs');
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (appliedJobs.has(jobId)) return;
    
    setApplying(jobId);
    try {
      const response = await fetch('/api/member/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      
      const data = await response.json();
      if (data.success) {
        setAppliedJobs(prev => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });
      }
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setApplying(null);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">AI-Підбір Вакансій</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Ми проаналізували ваш цифровий профіль та знайшли позиції, які найбільше відповідають вашому досвіду та навичкам.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Пошук вакансій, компаній або навичок..." 
              className="w-full bg-[#111] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="whitespace-nowrap px-4 py-2 bg-white text-black rounded-xl font-medium text-sm">
              Усі рекомендації
            </button>
            <button className="whitespace-nowrap px-4 py-2 bg-[#111] border border-zinc-800 text-zinc-300 rounded-xl font-medium text-sm hover:bg-[#1a1a1a] transition-colors">
              Відгуки
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Аналізуємо ваш профіль...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {jobs.map((job) => {
                const isApplied = appliedJobs.has(job.id);
                const isApplying = applying === job.id;
                
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-white/5"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Job Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-xl font-semibold">{job.title}</h2>
                            <p className="text-zinc-400 mt-1">{job.company_name}</p>
                          </div>
                          
                          {/* AI Match Badge (Mobile Top Right) */}
                          <div className={`lg:hidden flex flex-col items-end px-3 py-1.5 rounded-lg border ${getScoreColor(job.ai_match_score)}`}>
                            <span className="text-xs font-medium uppercase tracking-wider opacity-80">AI Match</span>
                            <span className="text-lg font-bold">{job.ai_match_score}%</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            {job.salary_range}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {job.employment_type}
                          </div>
                        </div>

                        <p className="text-zinc-300 text-sm leading-relaxed">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-[#1a1a1a] border border-zinc-800 text-xs text-zinc-400">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Reasoning & Action */}
                      <div className="lg:w-72 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-6">
                        
                        {/* AI Match Badge (Desktop) */}
                        <div className={`hidden lg:flex flex-col items-center justify-center p-4 rounded-xl border ${getScoreColor(job.ai_match_score)}`}>
                          <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80 mb-1">Синергія Профілю</span>
                          <span className="text-3xl font-bold">{job.ai_match_score}%</span>
                        </div>

                        <div className="flex-1 bg-[#111] rounded-xl p-4 border border-zinc-800/50">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-zinc-500" />
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">AI Аналіз</span>
                          </div>
                          <p className="text-sm text-zinc-300">
                            {job.ai_match_reasoning}
                          </p>
                        </div>

                        <button 
                          onClick={() => handleApply(job.id)}
                          disabled={isApplied || isApplying}
                          className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                            isApplied 
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                              : 'bg-white text-black hover:bg-zinc-200'
                          }`}
                        >
                          {isApplying ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Відправляємо...
                            </>
                          ) : isApplied ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Відгук надіслано
                            </>
                          ) : (
                            <>
                              Відгук в 1 клік
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
