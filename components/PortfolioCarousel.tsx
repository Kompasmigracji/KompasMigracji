"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Minimalist Loft Cafe",
    category: "Комерція • 80 м²",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    color: "from-amber-500/20 to-transparent",
  },
  {
    id: 2,
    title: "Brutalist Apartment",
    category: "Квартира • 120 м²",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop",
    color: "from-zinc-500/20 to-transparent",
  },
  {
    id: 3,
    title: "Eco Retreat Villa",
    category: "Приватний будинок • 250 м²",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    color: "from-green-500/20 to-transparent",
  },
  {
    id: 4,
    title: "Neon Studio",
    category: "Креативний простір • 45 м²",
    image: "https://images.unsplash.com/photo-1598928506311-c95148c8ab1a?q=80&w=1200&auto=format&fit=crop",
    color: "from-purple-500/20 to-transparent",
  }
];

export default function PortfolioCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={containerRef} className="py-24 relative z-10 overflow-hidden bg-black">
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Останні <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Концепти</span>
          </h2>
          <p className="text-zinc-400 max-w-xl">
            Кожен простір — це вирішена задача. Ми створюємо візуальну ясність за лічені дні, щоб ви могли приймати правильні рішення.
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-wider group">
          Всі проекти 
          <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-400/10 transition-all">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>

      <div className="relative h-[600px] w-full flex items-center overflow-visible">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2" />

        <motion.div 
          style={{ x: xTransform }} 
          className="flex gap-8 px-6 md:px-12 w-[200vw]"
        >
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              className="relative w-[80vw] md:w-[600px] h-[500px] rounded-3xl overflow-hidden shrink-0 group cursor-pointer border border-white/5 bg-[#111]"
            >
              {/* Image with parallax-like zoom */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 opacity-80" />
              <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen`} />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.category}
                </div>
                <h3 className="text-3xl font-black text-white">{project.title}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
