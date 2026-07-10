'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import P24PaymentSteps from '@/components/P24PaymentSteps';
import PayModal, { PayService } from '@/components/PayModal';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import { Link } from '@/lib/navigation';

function PricingCard({ card, i, onSelect }: { card: any, i: number, onSelect: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative p-8 sm:p-10 flex flex-col rounded-[2.5rem] bg-white dark:bg-[#111] border overflow-hidden transition-transform duration-300 ${
        card.featured 
          ? 'border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] md:-translate-y-4 md:hover:-translate-y-6' 
          : 'border-black/10 dark:border-white/10 shadow-2xl md:hover:-translate-y-2'
      }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      {card.badge && (
        <span className="absolute top-6 right-8 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg" 
              style={{ background: card.oldAmount ? 'linear-gradient(135deg, #f97316, #dc2626)' : 'linear-gradient(135deg, #2563eb, #8b5cf6)' }}>
          {card.badge}
        </span>
      )}
      
      <div className="text-sm font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-4 relative z-10">{card.label}</div>
      <div className="mb-4 relative z-10 flex flex-wrap items-baseline gap-2">
        {card.oldAmount && (
          <span className="text-lg text-gray-500 line-through">{card.oldAmount} {card.currency}</span>
        )}
        <span className="font-display font-bold text-gray-900 dark:text-white tracking-tighter" style={{ fontSize: 'clamp(40px, 4vw, 56px)' }}>
          {card.amount}
        </span>
        {card.currency && <span className="text-2xl text-gray-500 font-medium">{card.currency}</span>}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 min-h-[40px] relative z-10">{card.desc}</p>
      
      <ul className="flex flex-col gap-4 mb-10 flex-grow relative z-10">
        {card.features.map((f: string, idx: number) => (
          <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500 dark:text-blue-400 shrink-0 mr-3 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      
      <button
        onClick={onSelect}
        className={`premium-btn w-full !py-4 text-sm ${
          card.featured
            ? 'premium-btn-primary'
            : ''
        }`}
      >
        {card.cta}
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  const t = useTranslations();
  const [contactOpen, setContactOpen] = useState<string | null>(null);
  const [payService,  setPayService]  = useState<PayService | null>(null);

  const cards = [
    {
      label: t('pricing_free_label'),
      amount: t('pricing_free_amount'),
      currency: null,
      desc: t('pricing_free_desc'),
      features: [t('pricing_free_f1'), t('pricing_free_f2')],
      cta: t('pricing_free_cta'),
      featured: false,
    },
    {
      label: t('pricing_consult_label'),
      amount: '150',
      currency: 'zł',
      badge: t('pricing_consult_badge'),
      desc: t('pricing_consult_desc'),
      features: [t('pricing_consult_f1'), t('pricing_consult_f2'), t('pricing_consult_f3')],
      cta: t('pricing_consult_cta'),
      featured: true,
      amountGrosze: 15000,
    },
    {
      label: t('pricing_hour_label'),
      amount: '450',
      currency: 'zł',
      badge: t('pricing_hour_badge'),
      desc: t('pricing_hour_desc'),
      features: [t('pricing_hour_f1'), t('pricing_hour_f2'), t('pricing_hour_f3')],
      cta: t('pricing_hour_order'),
      featured: false,
      amountGrosze: 45000,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 relative bg-[#fbfbfd] dark:bg-[#0a0a0a] text-gray-900 dark:text-white overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full pointer-events-none -translate-x-1/2 hidden sm:block" style={{ filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full pointer-events-none translate-x-1/2 hidden sm:block" style={{ filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('pricing_tag')}
          </div>
          <h2 className="font-display tracking-tight font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
            {t('pricing_title')}
          </h2>
        </motion.div>

        {/* Subscription Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 relative overflow-hidden rounded-[2rem] p-[1px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20" />
          <div className="relative bg-white dark:bg-[#111] rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-black/5 dark:border-white/10">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {t('pricing_sub_tag')}
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-lg leading-snug">{t('pricing_sub_desc')}</p>
            </div>
            <Link
              href="/test/plans"
              className="shrink-0 px-8 py-4 rounded-full text-sm font-bold text-gray-900 bg-white hover:bg-gray-50 border border-black/10 transition-all duration-300 no-underline shadow-sm"
            >
              {t('pricing_sub_cta')}
            </Link>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center mb-24">
          {cards.map((card, i) => (
            <PricingCard 
              key={i} 
              card={card} 
              i={i} 
              onSelect={() => {
                if (card.amountGrosze) {
                  setPayService({ name: card.label, amountGrosze: card.amountGrosze });
                } else {
                  setContactOpen(card.label);
                }
              }} 
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-black/10 dark:border-white/10 pt-16 mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">{t('p24_how_title')}</h3>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">{t('p24_how_subtitle')}</p>
          </div>
          <P24PaymentSteps />
        </motion.div>
      </div>

      {/* PayU Modal */}
      {payService && (
        <PayModal 
          service={payService} 
          onClose={() => setPayService(null)} 
        />
      )}

      {/* Free Consult Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative"
          >
            <button onClick={() => setContactOpen(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 dark:text-green-400 mb-6 mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h4 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{t('free_modal_title')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">{t('free_modal_desc')}</p>
            <a
              href={`https://wa.me/48729271848?text=Отримати+безкоштовну+консультацію`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setContactOpen(null)}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold py-3.5 px-6 rounded-full w-full hover:scale-105 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              WhatsApp
            </a>
          </motion.div>
        </div>
      )}
    </section>
  );
}
