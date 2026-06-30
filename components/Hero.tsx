'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/lib/navigation';
import { motion } from 'framer-motion';

function TrustBadges() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-gray-100"
    >
      <span className="text-xs text-gray-400 font-medium mr-1">Довіряють нам:</span>
      {[
        { label: 'Przelewy24', icon: '🔐' },
        { label: 'SSL захист', icon: '🛡️' },
        { label: 'RODO/GDPR', icon: '📋' },
        { label: '10+ років досвіду', icon: '🏆' },
      ].map((b, i) => (
        <motion.span 
          key={i} 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 apple-glass rounded-full text-xs font-semibold text-gray-700 shadow-sm"
        >
          <span>{b.icon}</span>
          <span>{b.label}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}

function PanicStrip() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.02 }}
      className="mt-8 rounded-2xl apple-card border border-red-200/50 relative overflow-hidden p-5 group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/80 to-transparent pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <motion.span 
            animate={{ rotate: [0, 10, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            className="text-2xl"
          >
            🆘
          </motion.span>
          <div>
            <div className="font-bold text-red-700 text-sm">Термінова ситуація?</div>
            <div className="text-xs text-red-600">Депортація · Відмова · Суд · Криза</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:+48729271848"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white text-xs font-bold no-underline transition-all hover:scale-105 shadow-md"
            style={{ background: '#dc2626' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
            </svg>
            Зателефонувати
          </a>
          <a
            href="https://wa.me/48729271848?text=ТЕРМІНОВО+—+потребую+негайної+допомоги+в+міграційній+справі"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white text-xs font-bold no-underline transition-all hover:scale-105 shadow-md"
            style={{ background: '#25D366' }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const t = useTranslations();

  return (
    <section
      className="hero-section relative overflow-hidden bg-soft"
      style={{ paddingTop: 'calc(6rem + 80px)', paddingBottom: '120px' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent)', transform: 'translate(30%, -30%)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.08), transparent)', transform: 'translate(-30%, 30%)' }}
      />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 apple-glass rounded-full text-xs font-semibold text-primary mb-10 border border-primary/10">
            <span className="animate-pulse">✦</span>
            <span>{t('hero_badge')}</span>
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display font-semibold leading-[1.1] mb-8 tracking-tight"
          style={{ fontSize: 'clamp(40px, 6vw, 70px)', letterSpacing: '-0.5px' }}
        >
          <span className="text-navy">{t('hero_title').split(' ').slice(0, 3).join(' ')}</span>
          {' '}
          <em className="gradient-text not-italic font-medium">{t('hero_title').split(' ').slice(3).join(' ')}</em>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-gray-500 text-xl leading-relaxed mb-10 max-w-xl font-medium tracking-tight"
        >
          {t('hero_sub')}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            className="bg-union-blue text-white font-semibold px-8 py-4 rounded-full text-sm no-underline inline-flex items-center gap-2 shadow-[0_8px_20px_rgba(0,102,204,0.3)] transition-premium"
          >
            {t('cta_consult')}
          </motion.a>
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/videos"
              className="font-semibold px-8 py-4 rounded-full text-sm no-underline inline-flex items-center gap-2 border border-gray-200/50 text-gray-800 bg-white hover:bg-gray-50 shadow-sm transition-premium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              {t('videos_home_cta')}
            </Link>
          </motion.div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/48729271848?text=Потребую+допомоги+з+міграційним+питанням"
            target="_blank"
            rel="noreferrer"
            className="apple-glass text-navy font-semibold px-8 py-4 rounded-full text-sm no-underline inline-flex items-center gap-2 hover:border-primary hover:text-primary shadow-sm"
          >
            WhatsApp
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="viber://chat?number=48729271848"
            className="apple-glass border-purple-200/50 text-purple-700 font-semibold px-8 py-4 rounded-full text-sm no-underline inline-flex items-center gap-2 hover:border-purple-500 shadow-sm"
          >
            Viber
          </motion.a>
        </motion.div>

        <TrustBadges />
        <PanicStrip />
      </div>
    </section>
  );
}
