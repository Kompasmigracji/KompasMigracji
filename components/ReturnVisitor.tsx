'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'km_visited';
const STORAGE_DATE = 'km_visit_date';

export default function ReturnVisitor() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY);
    const lastDate = localStorage.getItem(STORAGE_DATE);
    const today = new Date().toDateString();

    if (visited && lastDate !== today) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }

    localStorage.setItem(STORAGE_KEY, '1');
    localStorage.setItem(STORAGE_DATE, today);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[99990] w-[95%] max-w-lg rounded-2xl bg-white/90 backdrop-blur-2xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-black/5">
              <span className="text-xl animate-[wave_2s_infinite_transform-origin-bottom-right]">👋</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 mb-0.5">З поверненням!</div>
              <div className="text-xs text-gray-500">Ваша справа ще актуальна — ми готові допомогти.</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-center">
            <a
              href="https://wa.me/48729271848?text=Повертаюся+до+питання+міграційної+допомоги"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold no-underline px-5 py-2.5 rounded-full text-gray-900 hover:scale-105 transition-transform flex items-center gap-2 relative overflow-hidden group"
              style={{ background: '#25D366' }}
            >
              <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              <span className="relative z-10">WhatsApp</span>
            </a>
            <button
              onClick={() => setShow(false)}
              className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 border border-black/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              aria-label="Закрити"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
