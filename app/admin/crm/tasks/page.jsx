"use client";

import React, { useState, useEffect } from "react";
import DualSidebarShell from "@/components/admin/DualSidebarShell";
import { Icon } from "@/components/admin/ui";
import { motion } from "framer-motion";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateStatus = async (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { id: "TODO", label: "До виконання", color: "bg-blue-500" },
    { id: "IN_PROGRESS", label: "В роботі", color: "bg-orange-500" },
    { id: "DONE", label: "Виконано", color: "bg-green-500" }
  ];

  return (
    <DualSidebarShell>
      <div className="flex flex-col h-full gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Задачі (Kanban)</h1>
            <p className="text-gray-500 dark:text-gray-400">Управління пріоритетами Архітектурної Сервісної Машини.</p>
          </div>
          <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Icon name="plus" size={18} /> Нова задача
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Завантаження задач...</div>
        ) : (
          <div className="flex gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
            {columns.map(col => (
              <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col bg-gray-50/50 dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl">
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold dark:text-white">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    {col.label}
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md">
                    {tasks.filter(t => t.status === col.id || (col.id === 'TODO' && !t.status)).length}
                  </span>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                  {tasks.filter(t => t.status === col.id || (col.id === 'TODO' && !t.status)).map(task => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group relative"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{task.title}</h3>
                      {task.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>}
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-1 rounded-md font-medium ${
                          task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' :
                          task.priority === 'MEDIUM' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {task.priority || 'LOW'}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {columns.map(c => c.id !== col.id && (
                            <button 
                              key={c.id} 
                              onClick={() => updateStatus(task.id, c.id)}
                              className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300"
                              title={`Перемістити в ${c.label}`}
                            >
                              <Icon name={c.id === 'DONE' ? 'check' : c.id === 'IN_PROGRESS' ? 'play' : 'list'} size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DualSidebarShell>
  );
}
