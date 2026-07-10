"use client";

import React, { useState } from "react";
import DualSidebarShell from "@/components/admin/DualSidebarShell";
import { Icon } from "@/components/admin/ui";
import { motion } from "framer-motion";

export default function AIPrompterPage() {
  const [form, setForm] = useState({
    spaceType: "Cafe",
    size: "40sqm",
    style: "Minimalist Loft",
    materials: "Concrete walls, warm oak wood, black metal accents",
    lighting: "Warm LED, natural sunlight",
    camera: "Wide angle, architectural interior photography, 8k, Unreal Engine 5 render",
    ratio: "--ar 16:9"
  });

  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const generated = `Architectural interior photography of a ${form.size} ${form.style} ${form.spaceType}, featuring ${form.materials}. Lighting: ${form.lighting}. ${form.camera} ${form.ratio} --v 6.0 --style raw`;
    setPrompt(generated);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DualSidebarShell>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
            AI Architect Prompter
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Генератор преміальних промптів для Midjourney / Stable Diffusion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <Icon name="sliders" /> Параметри Простору
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Тип</label>
                <input value={form.spaceType} onChange={e => setForm({...form, spaceType: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 outline-none dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Метраж</label>
                <input value={form.size} onChange={e => setForm({...form, size: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 outline-none dark:text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Стиль</label>
              <input value={form.style} onChange={e => setForm({...form, style: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 outline-none dark:text-white" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Матеріали</label>
              <textarea rows={2} value={form.materials} onChange={e => setForm({...form, materials: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 outline-none dark:text-white" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Освітлення</label>
              <input value={form.lighting} onChange={e => setForm({...form, lighting: e.target.value})} className="w-full mt-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 outline-none dark:text-white" />
            </div>

            <button 
              onClick={generatePrompt}
              className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <Icon name="cpu" /> Згенерувати Промпт
            </button>
          </div>

          <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl flex flex-col">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <Icon name="terminal" /> Результат
            </h3>
            
            <div className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 relative font-mono text-sm dark:text-green-400 text-gray-800 break-words whitespace-pre-wrap">
              {prompt || "Натисніть кнопку генерації, щоб отримати готовий промпт..."}
              
              {prompt && (
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Icon name={copied ? "check" : "copy"} size={16} className={copied ? "text-green-500" : "text-gray-500 dark:text-gray-400"} />
                </button>
              )}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-700 dark:text-purple-300">
              <p className="font-bold mb-1 flex items-center gap-2"><Icon name="info" size={14} /> Workflow</p>
              Скопіюйте цей текст у Discord бот Midjourney (через команду /imagine). Ви отримаєте 4 унікальних фотореалістичних варіанти за 60 секунд. Завантажте найкращі у Client Portal.
            </div>
          </div>
        </div>
      </div>
    </DualSidebarShell>
  );
}
