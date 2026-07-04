'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileCTABar() {
  const t = useTranslations();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 150);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-[9980] bg-[#f5f5f7]/95 backdrop-blur-2xl border-t border-black/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-3 h-16 sm:h-20">
            <a
              href="tel:+48729271848"
              className="group flex flex-col items-center justify-center gap-1 no-underline text-gray-500 active:bg-white/60 transition-colors relative"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-blue-500 opacity-0 group-active:opacity-100 transition-opacity" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-active:scale-95 transition-transform group-active:text-blue-400">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
              </svg>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider group-active:text-blue-400 transition-colors">{t('mob_call')}</span>
            </a>

            <a
              href="https://wa.me/48729271848?text=Потребую+допомоги+з+міграційним+питанням"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1 no-underline text-gray-900 active:scale-95 transition-all relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #128C7E, #25D366)' }}
            >
              <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_infinite]" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 drop-shadow-md">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              <span className="relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-wider drop-shadow-md">WhatsApp</span>
            </a>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center justify-center gap-1 bg-transparent border-0 cursor-pointer active:bg-white/60 transition-colors relative"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-orange-500 opacity-0 group-active:opacity-100 transition-opacity" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 group-active:scale-95 transition-transform group-active:text-orange-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-500 group-active:text-orange-400 transition-colors">{t('mob_form')}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
