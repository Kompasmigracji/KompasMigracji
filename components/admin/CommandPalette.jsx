"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "./ui";
import { useTheme } from "@/lib/ThemeContext";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { id: "chats", icon: "message-circle", label: "Перейти до чатів", action: () => router.push("/admin/crm/chats") },
    { id: "funnels", icon: "trello", label: "Воронки продажів", action: () => router.push("/admin/crm/funnels") },
    { id: "orders", icon: "shopping-bag", label: "Замовлення", action: () => router.push("/admin/crm/orders") },
    { id: "theme", icon: theme === "dark" ? "sun" : "moon", label: `Увімкнути ${theme === "dark" ? "світлу" : "темну"} тему`, action: () => setTheme(theme === "dark" ? "light" : "dark") },
    { id: "home", icon: "home", label: "На головну сайту", action: () => window.location.href = "/" },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-black/10 dark:border-white/10">
            <Icon name="search" size={20} className="text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Що ви шукаєте? (Команди, клієнти...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white p-4 placeholder-gray-400"
            />
            <span className="text-xs font-bold text-gray-400 bg-black/5 dark:bg-white/5 px-2 py-1 rounded">ESC</span>
          </div>

          {/* Results */}
          <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Нічого не знайдено</div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 tracking-wider">КОМАНДИ</div>
                {filtered.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => { item.action(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200 transition-colors text-left focus:bg-blue-500/10 focus:outline-none"
                  >
                    <Icon name={item.icon} size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
