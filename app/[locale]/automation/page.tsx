'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AutomationLanding() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'B2B Client', 
          phone, 
          service: 'Впровадження CRM / AI', 
          notes: 'Заявка зі сторінки автоматизації бізнесу' 
        })
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white selection:bg-blue-500/30">
        
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Програмний відділ «Компас Міграції»
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            style={{ lineHeight: 1.1 }}
          >
            Автоматизація <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              вашого бізнесу
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12"
          >
            Впровадження сучасних CRM-систем та технологій Штучного Інтелекту. <br className="hidden md:block"/>
            Ми зробимо вам навіть краще, ніж собі, і переведемо ваш бізнес з 20-го одразу в 22-є сторіччя.
          </motion.p>

          {/* 1-Click Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <h3 className="text-xl font-bold mb-2">Готові до трансформації?</h3>
            <p className="text-sm text-gray-400 mb-6">Залиште номер, і наш архітектор систем зв'яжеться з вами для аудиту.</p>
            
            {status === 'success' ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
                Заявку прийнято! Ми скоро зателефонуємо.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+48 123 456 789"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === 'loading' ? 'Відправка...' : 'Перейти в 22-є сторіччя (1 клік)'}
                </button>
                {status === 'error' && (
                  <p className="text-red-400 text-sm mt-2">Помилка. Спробуйте ще раз або напишіть нам.</p>
                )}
              </form>
            )}
          </motion.div>
        </section>

        {/* Services List */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Що ми пропонуємо?</h2>
            <p className="text-gray-400">Наш програмний відділ покриває всі потреби сучасного обліку.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Впровадження CRM", desc: "Створення єдиного простору для ваших менеджерів, автоматизація воронок продажу.", icon: "📊" },
              { title: "AI-Асистенти", desc: "Розумні боти, які відповідають клієнтам 24/7 та закривають угоди замість людей.", icon: "🤖" },
              { title: "Автоматизація обліку", desc: "Інтеграція платіжних систем, автоматична генерація чеків та документів.", icon: "⚡" },
              { title: "Синхронізація", desc: "Зв'язка Telegram, Viber, Facebook, Instagram та WhatsApp в одному вікні.", icon: "🔄" },
              { title: "Клієнтські портали", desc: "Особисті кабінети для ваших клієнтів з історією взаємодії та віджетами.", icon: "🌐" },
              { title: "Аналітика B2B", desc: "Дашборди з ключовими показниками бізнесу в реальному часі.", icon: "📈" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
