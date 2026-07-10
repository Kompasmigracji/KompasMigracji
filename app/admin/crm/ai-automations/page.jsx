"use client";

import React, { useState } from "react";
import DualSidebarShell from "@/components/admin/DualSidebarShell";
import { Icon } from "@/components/admin/ui";
import { motion } from "framer-motion";

export default function AIAutomationsPage() {
  const [systemPrompt, setSystemPrompt] = useState("Ти - висококласний AI-помічник Олександра, засновника архітектурної студії iPhoenix. Твоя мета - тепло привітати клієнта, розказати про 3-денний спринт і запропонувати обрати зручний час для зідзвону. Спілкуйся українською мовою, дуже преміально, лаконічно, без зайвих емодзі.");
  const [isConnected, setIsConnected] = useState(true);
  
  const mockLogs = [
    {
      id: 1,
      time: "10:42 AM",
      client: "Максим (Квартира 80 кв.м)",
      messages: [
        { role: "bot", text: "Вітаю, Максиме! Я AI-асистент Олександра. Ми отримали вашу заявку на пакет Pro Vision. Готові перетворити ваші 80 кв.м на шедевр за 3 дні. Коли вам зручно провести короткий бриф-зідзвон?" },
        { role: "user", text: "Привіт. Давайте завтра о 14:00." },
        { role: "bot", text: "Чудово. Забронював для вас час на завтра, 14:00. Олександр зв'яжеться з вами. Гарного дня!" }
      ],
      status: "Closed (Call Scheduled)"
    },
    {
      id: 2,
      time: "09:15 AM",
      client: "Олена (Кав'ярня)",
      messages: [
        { role: "bot", text: "Вітаю, Олено! Я AI-асистент студії iPhoenix. Бачу вашу заявку на концепт кав'ярні. Чи є у вас вже мудборди або референси того, що вам подобається?" },
        { role: "user", text: "Так, маю кілька картинок з Pinterest. Куди скинути?" },
        { role: "bot", text: "Можете надіслати їх прямо сюди у WhatsApp. Я передам їх Олександру для підготовки першого концепту." }
      ],
      status: "Active (Waiting for files)"
    }
  ];

  return (
    <DualSidebarShell>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-6 rounded-3xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              <Icon name="cpu" size={28} className="text-blue-400" />
              AI Autonomous Agent
            </h1>
            <p className="text-blue-200/80 text-sm max-w-xl">
              Ваш цифровий клон, який миттєво підхоплює лідів через WhatsApp, прогріває їх і закриває на дзвінки чи оплати, поки ви малюєте архітектуру.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">WhatsApp Status</span>
              <span className={`text-sm font-bold flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isConnected ? 'Connected & Active' : 'Disconnected'}
              </span>
            </div>
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className="ml-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon name="power" size={18} className={isConnected ? "text-green-400" : "text-gray-400"} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Model Settings */}
            <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2">
                <Icon name="settings" /> AI Core Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Model</label>
                  <select className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none dark:text-white appearance-none">
                    <option>GPT-4o (Optimized)</option>
                    <option>Claude 3.5 Sonnet</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    System Prompt
                    <button className="text-blue-500 hover:text-blue-400 text-xs">Reset to default</button>
                  </label>
                  <textarea 
                    rows={8} 
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 outline-none dark:text-white text-sm leading-relaxed" 
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ця інструкція визначає "характер" і манеру спілкування вашого бота.
                  </p>
                </div>

                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

          </div>

          {/* Logs Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                  <Icon name="message-square" /> Live Conversations
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Listening to Webhooks
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                {mockLogs.map((log) => (
                  <div key={log.id} className="border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 dark:bg-black/40 px-4 py-3 flex items-center justify-between border-b border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                          <Icon name="phone" size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-sm dark:text-white">{log.client}</div>
                          <div className="text-xs text-gray-500">{log.time}</div>
                        </div>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-md ${log.status.includes('Active') ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'}`}>
                        {log.status}
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3 bg-white dark:bg-[#111]">
                      {log.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            msg.role === 'bot' 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-800/50 rounded-tl-sm' 
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tr-sm'
                          }`}>
                            {msg.role === 'bot' && <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500/70 mb-1">AI Assistant</div>}
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </DualSidebarShell>
  );
}
