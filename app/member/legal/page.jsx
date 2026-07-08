"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MemberLegalPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/legal")
      .then((res) => res.json())
      .then((data) => {
        setCases(data.cases || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Агент Легалізації</h1>
        <p className="text-white/60">
          Ваш персональний міграційний помічник. Слідкуйте за статусом своїх справ, поданих документів та термінами віз.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-white/50">Завантаження справ...</div>
      ) : cases.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-medium text-white mb-2">Немає активних справ</h2>
          <p className="text-white/60 mb-4">У вас поки що немає поданих справ на легалізацію.</p>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 transition-all">
            Звернутись до юриста
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((legalCase, idx) => (
            <motion.div
              key={legalCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Highlight bar at top */}
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ 
                  background: legalCase.progress === 100 ? "var(--color-success)" : 
                              legalCase.progress < 50 ? "var(--color-warning)" : "var(--color-primary)"
                }}
              />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      legalCase.status === "Decyzja pozytywna" ? "bg-emerald-500/20 text-emerald-300" :
                      legalCase.status === "W toku" ? "bg-blue-500/20 text-blue-300" :
                      "bg-white/10 text-white/70"
                    }`}>
                      {legalCase.status}
                    </span>
                    <span className="text-xs text-white/40">ID: {legalCase.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{legalCase.case_type}</h2>
                  <p className="text-sm text-white/50 mt-1">
                    Подано: {legalCase.submission_date} • Орієнтовна децизія: {legalCase.expected_decision_date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{legalCase.progress}%</div>
                  <div className="text-xs text-white/50 uppercase font-semibold">Прогрес</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${legalCase.progress}%`,
                    background: legalCase.progress === 100 ? "var(--color-success)" : "var(--color-primary)"
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Steps Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Етапи справи</h3>
                  <div className="space-y-4">
                    {legalCase.steps.map((step, i) => (
                      <div key={step.id} className="flex gap-4 relative">
                        {i !== legalCase.steps.length - 1 && (
                          <div className="absolute left-2.5 top-6 bottom-[-16px] w-px bg-white/10" />
                        )}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 ${
                          step.step_status === "Completed" ? "bg-emerald-500" :
                          step.step_status === "In Progress" ? "bg-blue-500 ring-4 ring-blue-500/20" :
                          "bg-white/10"
                        }`}>
                          {step.step_status === "Completed" && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${
                            step.step_status === "Completed" ? "text-white" :
                            step.step_status === "In Progress" ? "text-blue-300" :
                            "text-white/40"
                          }`}>
                            {step.step_name}
                          </div>
                          {step.step_date && (
                            <div className="text-xs text-white/40">{step.step_date}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Docs & AI Warnings */}
                <div className="space-y-4">
                  {legalCase.ai_warning && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-orange-400 mb-1">AI-Асистент попереджає</h4>
                          <p className="text-xs text-white/70 leading-relaxed">
                            {legalCase.ai_warning}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {legalCase.missing_documents && legalCase.missing_documents.length > 0 && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Потрібно донести</h4>
                      <ul className="space-y-2">
                        {legalCase.missing_documents.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                      <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                        Завантажити скани
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
