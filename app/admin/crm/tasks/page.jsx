"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/admin/ui";
import SpotlightCard from "@/components/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

const COLUMNS = [
  { id: "todo", label: "Нові завдання", color: "bg-blue-500" },
  { id: "in_progress", label: "В роботі", color: "bg-orange-500" },
  { id: "review", label: "На перевірці", color: "bg-purple-500" },
  { id: "done", label: "Завершено", color: "bg-green-500" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "normal" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateStage = async (id, newStage) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, stage: newStage } : t));
    try {
      await fetch(`/api/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ title: "", description: "", priority: "normal" });
        fetchTasks();
      } else {
        const err = await res.json();
        alert(err.error || "Помилка");
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-300">
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white tracking-tight">Завдання (Kanban)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">Управління завданнями та пріоритетами команди</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Icon name="plus" size={16} /> Нове завдання
        </button>
      </div>

      <div className="p-8 flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">Завантаження завдань...</div>
        ) : (
          <div className="flex gap-6 h-full overflow-x-auto pb-4">
            {COLUMNS.map(col => {
              const colTasks = tasks.filter(t => (t.stage || "todo") === col.id);
              return (
                <div key={col.id} className="min-w-[300px] w-[300px] flex flex-col bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shrink-0">
                  <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                      {col.label}
                    </div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                    {colTasks.length === 0 ? (
                      <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-8">Порожньо</div>
                    ) : colTasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -2 }}
                        className="bg-white dark:bg-[#161616] p-4 rounded-xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-all group relative"
                      >
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{task.title}</h3>
                        {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{task.description}</p>}
                        <div className="flex justify-between items-center text-xs">
                          <span className={`px-2 py-1 rounded-md font-medium ${
                            task.priority === 'urgent' || task.priority === 'high' ? 'bg-red-500/10 text-red-500 dark:text-red-400' :
                            task.priority === 'normal' ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400' :
                            'bg-gray-500/10 text-gray-500 dark:text-gray-400'
                          }`}>
                            {task.priority || 'normal'}
                          </span>
                          {task.assignee_name && (
                            <span className="text-gray-400 dark:text-gray-500 truncate max-w-[100px]" title={task.assignee_name}>{task.assignee_name}</span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {COLUMNS.map(c => c.id !== col.id && (
                            <button
                              key={c.id}
                              onClick={() => updateStage(task.id, c.id)}
                              className="flex-1 py-1.5 rounded-md flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors"
                              title={`Перемістити в «${c.label}»`}
                            >
                              <Icon name={c.id === 'done' ? 'check' : c.id === 'review' ? 'eye' : c.id === 'in_progress' ? 'play' : 'list'} size={12} />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-8 rounded-2xl w-[420px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="m-0 mb-6 text-gray-900 dark:text-white font-bold text-xl relative z-10">Нове завдання</h3>

              <form onSubmit={handleCreate} className="flex flex-col gap-4 relative z-10">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Назва *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Опис</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 block uppercase tracking-wider">Пріоритет</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-colors">
                    <option value="low">Низький</option>
                    <option value="normal">Звичайний</option>
                    <option value="high">Високий</option>
                    <option value="urgent">Терміновий</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold transition-colors">Скасувати</button>
                  <button type="submit" disabled={saving} className={`px-5 py-2.5 rounded-xl border-none bg-blue-500 text-white font-bold transition-all ${saving ? 'opacity-70' : 'hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>{saving ? 'Створення...' : 'Створити'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
