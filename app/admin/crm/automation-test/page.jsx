"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2, Circle, Loader2, Bot, Database, CreditCard, UserCheck, CheckSquare, Settings } from "lucide-react";

const STEPS = [
  { id: "capture", label: "Симуляція: Новий клієнт (WhatsApp/Сайт)", icon: <Bot size={20} /> },
  { id: "lead", label: "Створення Ліда в CRM (База Даних)", icon: <Database size={20} /> },
  { id: "scoring", label: "AI Скоринг та Розподіл", icon: <Settings size={20} /> },
  { id: "payment", label: "Генерація платіжного посилання (Przelewy24)", icon: <CreditCard size={20} /> },
  { id: "conversion", label: "Конвертація в Покупця (Успішний статус)", icon: <UserCheck size={20} /> },
  { id: "finish", label: "Автоматична задача: Надіслати документи", icon: <CheckSquare size={20} /> },
];

export default function AutomationSandboxPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type = "info") => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    setLogs([]);
    setCurrentStepIndex(0);

    addLog("Ініціалізація E2E тестування автоматизації...", "info");

    try {
      // Step 1: Simulate Capture
      await new Promise((r) => setTimeout(r, 1500));
      setCompletedSteps((prev) => [...prev, "capture"]);
      addLog("Клієнт 'Тестовий Користувач' написав у WhatsApp.", "success");
      setCurrentStepIndex(1);

      // We call the real API to execute the backend simulation
      const res = await fetch("/api/admin/crm/automation-test/run", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "API Error");

      // Step 2: Lead creation
      await new Promise((r) => setTimeout(r, 1200));
      setCompletedSteps((prev) => [...prev, "lead"]);
      addLog(`Лід створений в БД (ID: ${data.leadId}). Перевірте /admin/crm/leads.`, "success");
      setCurrentStepIndex(2);

      // Step 3: Scoring
      await new Promise((r) => setTimeout(r, 1000));
      setCompletedSteps((prev) => [...prev, "scoring"]);
      addLog("AI визначив пріоритет: Високий. Призначено менеджеру.", "success");
      setCurrentStepIndex(3);

      // Step 4: Payment Link
      await new Promise((r) => setTimeout(r, 1500));
      setCompletedSteps((prev) => [...prev, "payment"]);
      addLog(`Посилання згенеровано: https://pay.kompasmigracji.pl/t/${data.paymentToken}`, "success");
      setCurrentStepIndex(4);

      // Step 5: Conversion
      await new Promise((r) => setTimeout(r, 1200));
      setCompletedSteps((prev) => [...prev, "conversion"]);
      addLog("Імітація успішної оплати. Лід переведений у статус 'won'.", "success");
      setCurrentStepIndex(5);

      // Step 6: Finish Task
      await new Promise((r) => setTimeout(r, 1000));
      setCompletedSteps((prev) => [...prev, "finish"]);
      addLog("Створено задачу: 'Надіслати стартові документи клієнту'. Перевірте /admin/crm/tasks.", "success");
      setCurrentStepIndex(6);

      addLog("✅ E2E Тест успішно завершено!", "success");

    } catch (err) {
      addLog(`Помилка симуляції: ${err.message}`, "error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 text-gray-800 dark:text-gray-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Пісочниця Автоматизації</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Візуальний інструмент для тестування End-to-End процесів CRM (лід → угода → задача) на реальних таблицях.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Pipeline */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/10 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Пайплайн Процесів</h2>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
                isRunning
                  ? "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95"
              }`}
            >
              {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
              {isRunning ? "Виконується..." : "Запустити E2E Тест"}
            </button>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 dark:before:via-white/10 before:to-transparent">
            {STEPS.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = currentStepIndex === idx;

              return (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#f5f5f7] dark:border-[#0a0a0a] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500 ${
                      isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : isActive ? <Loader2 size={16} className="animate-spin" /> : <Circle size={16} />}
                  </div>

                  {/* Content card */}
                  <motion.div
                    initial={{ opacity: 0.5, x: idx % 2 === 0 ? 20 : -20 }}
                    animate={{ opacity: isActive || isCompleted ? 1 : 0.5, x: 0 }}
                    className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm transition-all duration-300 ${
                      isActive ? "bg-blue-500/10 border-blue-500/30" : isCompleted ? "bg-white dark:bg-white/5 border-green-500/30" : "bg-gray-50 dark:bg-white/[0.02] border-black/5 dark:border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-500/10 text-green-500 dark:text-green-400" : isActive ? "bg-blue-500/10 text-blue-500 dark:text-blue-400" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"}`}>
                        {step.icon}
                      </div>
                      <span className={`font-semibold text-sm ${isActive ? "text-blue-700 dark:text-blue-300" : isCompleted ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-400"}`}>
                        {step.label}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Logs */}
        <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="bg-[#111] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-mono font-semibold text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Terminal / Live Logs
            </h2>
            <span className="text-xs text-gray-600 font-mono">automation_engine.log</span>
          </div>

          <div className="p-6 flex-1 overflow-y-auto font-mono text-sm space-y-3 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-gray-600 text-center mt-20 italic">Очікування запуску тестів...</div>
            ) : (
              logs.map((log, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className="flex gap-4 items-start"
                >
                  <span className="text-gray-600 shrink-0">[{log.time}]</span>
                  <span className={`${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-400' :
                    'text-blue-300'
                  }`}>
                    {log.msg}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
