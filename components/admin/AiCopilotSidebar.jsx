"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./ui";

export default function AiCopilotSidebar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привіт! Я твій AI-помічник в iPhoenixCRM. Чим можу допомогти сьогодні?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    const userMsg = input;
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let reply = "Зрозумів. Шукаю інформацію...";
      if (userMsg.toLowerCase().includes("підсумуй")) {
        reply = "Короткий підсумок: Клієнт цікавиться пакетом 'Стандарт', але чекає на знижку. Рекомендую запропонувати 10% дисконт, якщо він сплатить сьогодні.";
      } else if (userMsg.toLowerCase().includes("статистика")) {
        reply = "За сьогодні у вас 12 нових лідів, 3 успішні угоди на загальну суму 4,500 zł.";
      } else {
        reply = "Я проаналізував твій запит. Для детальнішої дії мені потрібен доступ до конкретної картки клієнта.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[380px] bg-white/95 dark:bg-[#111]/95 backdrop-blur-3xl border-l border-black/10 dark:border-white/10 z-[100] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                <div className="w-full h-full bg-white dark:bg-[#111] rounded-full flex items-center justify-center">
                  <Icon name="cpu" size={20} className="text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white m-0">AI Copilot</h3>
                <p className="text-xs text-blue-500 font-semibold m-0">Online</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="x" size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-sm shadow-md" 
                    : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-black/5 dark:border-white/5"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-black/50 rounded-full p-1 border border-black/10 dark:border-white/10 focus-within:border-blue-500 transition-colors">
              <input 
                type="text" 
                placeholder="Запитай щось у AI..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="arrow-up" size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
