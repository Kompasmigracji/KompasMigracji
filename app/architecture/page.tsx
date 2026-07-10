"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Image as ImageIcon, Ruler, Building2, Star, Send } from 'lucide-react';
import PortfolioCarousel from '@/components/PortfolioCarousel';

export default function ArchitectureServicePage() {
  const [form, setForm] = useState({ name: '', phone: '', objectType: 'Квартира', area: '', package: 'Pro' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/architecture/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('success');
        
        // Find price
        const priceMap: Record<string, number> = { 'Starter': 1500, 'Pro': 2500, 'Premium': 4500 };
        const price = priceMap[form.package] || 2500;
        
        // Initiate Stripe Checkout
        const stripeRes = await fetch('/api/stripe/checkout-architecture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            packageId: form.package, 
            packageName: form.package, 
            price 
          })
        });
        
        const stripeData = await stripeRes.json();
        if (stripeData.url) {
          window.location.href = stripeData.url;
        }
      }
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  const packages = [
    {
      id: 'Starter',
      name: 'Starter Concept',
      price: '$1,500',
      description: 'Ідеально для маленьких комерційних просторів та швидкого старту.',
      features: ['Аналіз простору', 'Базовий концепт-план', '1 фотореалістична візуалізація', 'Термін: 3 дні'],
      recommended: false
    },
    {
      id: 'Pro',
      name: 'Pro Vision',
      price: '$2,500',
      description: 'Оптимальний вибір для квартир та приватних будинків середньої площі.',
      features: ['Детальний аналіз та обміри', 'Концепт-план + 2 варіанти планування', '3 фотореалістичні візуалізації', 'Коротка технічна консультація', 'Термін: 5 днів'],
      recommended: true
    },
    {
      id: 'Premium',
      name: 'Premium Revitalization',
      price: '$4,500',
      description: 'Повний пакет концептів для ревіталізації та великих об\'єктів.',
      features: ['Глибокий архітектурний аудит', 'Розширені варіанти планувань', '5+ візуалізацій простору', 'Детальна технічна консультація', 'Підбір базових матеріалів', 'Термін: 10 днів'],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-400" />
          <span className="font-semibold text-lg tracking-wide">iPhoenix Architecture</span>
        </div>
        <a href="#booking" className="px-6 py-2 bg-white text-black rounded-full font-medium text-sm hover:scale-105 transition-transform">
          Замовити концепт
        </a>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8">
            <Star className="w-4 h-4" /> Продаємо результат, а не час
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Ясність та краса вашого простору за <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">3 дні</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Перестаньте чекати місяцями на класичні проєкти. Ми формуємо ідею, створюємо концепт-план та показуємо візуалізацію вашого майбутнього дому або бізнесу блискавично.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#booking" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
              Обрати пакет <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#process" className="w-full sm:w-auto px-8 py-4 bg-[#111] border border-zinc-800 text-white rounded-2xl font-bold text-lg hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2">
              Як це працює
            </a>
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-6 md:px-12 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наш швидкий процес</h2>
            <p className="text-zinc-400">Від ідеї до візуальної ясності без довгого муку.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Ruler, title: 'День 1: Аналіз', desc: 'Вивчаємо ваш простір, метрику та побажання. Розуміємо потенціал об\'єкта.' },
              { icon: Zap, title: 'День 2: Концепт', desc: 'Створюємо швидкий та ергономічний концепт-план. Вирішуємо архітектурну задачу.' },
              { icon: ImageIcon, title: 'День 3: Візуалізація', desc: 'Рендеримо фотореалістичні зображення, щоб ви побачили фінальний результат.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#111] border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Carousel */}
      <PortfolioCarousel />

      {/* Pricing Section */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готові пакети рішень</h2>
            <p className="text-zinc-400">Прозорі ціни. Жодних прихованих платежів за "додаткові години".</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {packages.map((pkg, i) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-[#111] border ${pkg.recommended ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'border-zinc-800'} rounded-3xl p-8 flex flex-col`}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    Рекомендовано
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-black mb-4">{pkg.price}</div>
                <p className="text-zinc-400 text-sm mb-8 h-10">{pkg.description}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    setForm({...form, package: pkg.id});
                    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    pkg.recommended 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  Обрати {pkg.id}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-20 px-6 md:px-12 relative z-10 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto bg-[#111] border border-zinc-800 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Почати трансформацію простору</h2>
            <p className="text-zinc-400">Заповніть коротку форму, і наш AI-асистент зв'яжеться з вами для уточнення деталей.</p>
          </div>

          {status === 'success' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Заявку прийнято!</h3>
              <p className="text-zinc-400">Ми зв'яжемося з вами найближчим часом для початку роботи.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Ваше ім'я</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Олександр" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Номер телефону / Telegram</label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="+48..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Тип об'єкта</label>
                  <select value={form.objectType} onChange={e => setForm({...form, objectType: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                    <option>Приватний будинок</option>
                    <option>Квартира / Апартаменти</option>
                    <option>Комерційний простір</option>
                    <option>Інше</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Метраж (м²)</label>
                  <input value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="напр. 65" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Обраний пакет</label>
                <div className="flex gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                  {packages.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({...form, package: p.id})}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.package === p.id ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                      {p.id}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 mt-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? 'Відправка...' : (
                  <>Відправити запит <Send className="w-5 h-5" /></>
                )}
              </button>

              {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Сталася помилка при відправці. Спробуйте ще раз.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-white/5 relative z-10">
        &copy; 2026 iPhoenix Architecture. Всі права захищено. Створено з прицілом на 5090 64GB.
      </footer>
    </div>
  );
}
