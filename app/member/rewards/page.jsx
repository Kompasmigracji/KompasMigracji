"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star, Shield, Lock, ChevronRight, TrendingUp, Sparkles, Coins, Gift } from 'lucide-react';
import Link from 'next/link';

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "Перший Крок",
    description: "Заповнено базовий профіль",
    icon: Star,
    progress: 100,
    reward: 100,
    locked: false,
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    title: "Легальний Статус",
    description: "Завантажено карту побиту або візу",
    icon: Shield,
    progress: 100,
    reward: 500,
    locked: false,
    color: "from-emerald-500 to-teal-400"
  },
  {
    id: 3,
    title: "Кар'єрист",
    description: "Подано 5 відгуків на вакансії",
    icon: TrendingUp,
    progress: 60,
    reward: 200,
    locked: false,
    color: "from-amber-500 to-orange-400"
  },
  {
    id: 4,
    title: "Амбасадор",
    description: "Запрошено 3 друзів у Kompas",
    icon: Award,
    progress: 0,
    reward: 1000,
    locked: true,
    color: "from-purple-500 to-pink-400"
  }
];

const REWARDS = [
  {
    title: "Преміум Консультація",
    desc: "45-хвилинна зустріч з юристом",
    cost: 1500,
    icon: Sparkles,
  },
  {
    title: "Топ Резюме",
    desc: "Виділення профілю для роботодавців на тиждень",
    cost: 500,
    icon: Zap,
  },
  {
    title: "Знижка на страхування",
    desc: "-20% на річний поліс PZU",
    cost: 800,
    icon: Gift,
  }
];

export default function RewardsPage() {
  const [balance, setBalance] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRewards() {
      try {
        const res = await fetch('/api/member/rewards');
        const json = await res.json();
        if (json.success) {
          setBalance(json.data.balance);
          // For simplicity, we just merge the icon objects on the client side since we can't serialize React Components
          const fetchedAchievements = json.data.achievements.map(a => {
            const icons = { Star, Shield, TrendingUp, Award };
            return { ...a, icon: icons[a.iconName] || Star };
          });
          setAchievements(fetchedAchievements);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRewards();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header section with Balance */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Мої Досягнення
            </h1>
            <p className="text-zinc-400 text-lg">
              Заробляйте Kompas Coins та обмінюйте їх на реальні переваги.
            </p>
          </div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none" />
            <div className="bg-yellow-500/20 p-4 rounded-2xl">
              <Coins className="w-10 h-10 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider mb-1">Поточний Баланс</p>
              <div className="text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
                {balance} <span className="text-xl text-yellow-500">KC</span>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Achievements Grid */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Місії & Значки</h2>
              <span className="text-sm text-zinc-500">2 з 12 виконано</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative p-6 rounded-3xl border transition-all duration-300 ${item.locked ? 'bg-[#0a0a0a] border-white/5 opacity-60' : 'bg-[#111] border-white/10 hover:border-white/20 hover:bg-[#151515]'}`}
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.locked ? 'from-zinc-800 to-zinc-900' : item.color}`}>
                        {item.locked ? <Lock className="w-5 h-5 text-zinc-500" /> : <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1 border border-white/5">
                        <Coins className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-500">+{item.reward}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-zinc-400 mb-6">{item.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className={item.progress === 100 ? 'text-emerald-400' : 'text-zinc-500'}>
                            {item.progress === 100 ? 'Виконано' : 'В процесі'}
                          </span>
                          <span className="text-zinc-400">{item.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full bg-gradient-to-r ${item.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Shop/Rewards */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Магазин Винагород</h2>
            
            <div className="space-y-4">
              {REWARDS.map((reward, idx) => {
                const Icon = reward.icon;
                const canAfford = balance >= reward.cost;
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-3xl bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 leading-tight">{reward.title}</h4>
                        <p className="text-xs text-zinc-500 leading-snug">{reward.desc}</p>
                      </div>
                    </div>
                    
                    <button 
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        canAfford 
                          ? 'bg-white text-black hover:bg-zinc-200' 
                          : 'bg-white/5 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Обміняти за {reward.cost} KC</span>
                      {canAfford && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-8 p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Штучний Інтелект Вчиться</h4>
              <p className="text-sm text-blue-200/70">
                Що більше ви заповнюєте профіль, то краще наш AI розуміє ваші потреби та шукає ідеальні пропозиції роботи.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
