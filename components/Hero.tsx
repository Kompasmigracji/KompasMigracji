'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations();

  return (
    <section className="relative w-full flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black dark:text-white mb-8" style={{ letterSpacing: '-0.02em' }}>
          {t('hero_title')}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-12">
          {t('hero_sub')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            {t('cta_consult')}
          </a>
          
          <a
            href="/test"
            className="bg-gray-100 text-black dark:bg-gray-800 dark:text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
          >
            {t('services_more') || 'Więcej'}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
