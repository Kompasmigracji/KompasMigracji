"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Image as ImageIcon, Download, FileText, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarField from '@/components/StarField';

export default function ClientProjectTracker({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  
  useEffect(() => {
    // In production, fetch project data from /api/portal/project/[id]
    // Mocking for now to demonstrate the Wow-factor
    setTimeout(() => {
      setProject({
        id: params.id,
        clientName: "Oleksandr",
        projectName: "Loft Cafe Warsaw",
        package: "Pro Sprint ($2500)",
        status: "CONCEPT", // 'ANALYSIS', 'CONCEPT', 'RENDER', 'DONE'
        daysLeft: 2,
        moodboards: [
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop"
        ]
      });
    }, 1500);
  }, [params.id]);

  const stages = [
    { id: 'ANALYSIS', label: 'Аналіз Простору', desc: 'Збір даних та заміри', icon: FileText },
    { id: 'CONCEPT', label: 'Концепт & Планування', desc: 'Створення варіантів', icon: ImageIcon },
    { id: 'RENDER', label: '3D Візуалізація', desc: 'Фотореалістичні рендери', icon: Download },
  ];

  const getStageStatus = (stageId: string) => {
    if (!project) return 'pending';
    const states = ['ANALYSIS', 'CONCEPT', 'RENDER', 'DONE'];
    const currentIdx = states.indexOf(project.status);
    const stageIdx = states.indexOf(stageId);
    
    if (stageIdx < currentIdx) return 'completed';
    if (stageIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <>
      <StarField />
      <Header />
      <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-bold text-sm tracking-widest uppercase mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Client Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Project Tracker
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Спостерігайте за магією створення вашого простору в реальному часі.
            </p>
          </motion.div>

          {!project ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sidebar Info */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-6">
                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 rounded-3xl shadow-2xl">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Деталі Проекту</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Назва</div>
                      <div className="font-bold dark:text-white text-lg">{project.projectName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Пакет</div>
                      <div className="font-bold text-blue-500 text-lg">{project.package}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Залишилось часу</div>
                      <div className="font-black text-2xl dark:text-white flex items-center gap-2">
                        <Clock className="text-orange-500" /> {project.daysLeft} дні
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Timeline */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-8">
                
                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                  
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Етапи Спринту</h3>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500/20 before:to-transparent">
                    {stages.map((stage, idx) => {
                      const status = getStageStatus(stage.id);
                      const IconBox = stage.icon;
                      
                      return (
                        <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(0,0,0,0.1)] z-10 transition-colors duration-500 ${
                            status === 'completed' ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' :
                            status === 'active' ? 'bg-black dark:bg-white border-blue-500 text-white dark:text-black shadow-[0_0_30px_rgba(59,130,246,0.4)] animate-pulse' :
                            'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-400'
                          }`}>
                            {status === 'completed' ? <CheckCircle size={24} /> : <IconBox size={20} />}
                          </div>
                          
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm transition-transform hover:-translate-y-1">
                            <div className={`flex items-center justify-between mb-1 ${status === 'active' ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>
                              <h4 className="font-bold text-lg">{stage.label}</h4>
                              <span className="text-xs font-bold uppercase tracking-wider opacity-60">{status}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stage.desc}</p>
                            
                            {status === 'active' && stage.id === 'CONCEPT' && (
                              <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Мудборди готові до перегляду:</p>
                                <div className="flex gap-2">
                                  {project.moodboards.map((img: string, i: number) => (
                                    <div key={i} className="w-16 h-16 rounded-lg bg-cover bg-center border border-white/20 cursor-pointer hover:scale-110 transition-transform shadow-md" style={{ backgroundImage: `url(${img})` }} />
                                  ))}
                                </div>
                                <button className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg hover:bg-blue-600 transition-colors">
                                  Затвердити концепт
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
