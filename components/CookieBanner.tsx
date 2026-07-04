'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/lib/useCookieConsent';
import { motion, AnimatePresence } from 'framer-motion';

function Toggle({ on, onChange }: { on: boolean; onChange: ((v: boolean) => void) | null }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      disabled={!onChange}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-300 ${
        onChange ? 'cursor-pointer' : 'cursor-default opacity-60'
      } ${on ? 'bg-blue-600' : 'bg-white/80'}`}
    >
      <span 
        className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
          on ? 'left-[22px]' : 'left-[2px]'
        }`} 
      />
    </button>
  );
}

export default function CookieBanner() {
  const { decided, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);

  if (decided) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9995] flex justify-center sm:justify-end pointer-events-none"
      >
        <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-3xl border border-black/10 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] pointer-events-auto">
          
          <div className="flex gap-4 items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-black/5">
              <span className="text-2xl animate-[spin_10s_linear_infinite]">🍪</span>
            </div>
            <div>
              <p className="m-0 font-display font-bold text-base text-gray-900 leading-tight mb-1">
                Ми використовуємо cookies
              </p>
              <p className="m-0 text-xs text-gray-500 leading-relaxed">
                Необхідні cookies завжди активні. Аналітичні допомагають нам стати краще.{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 no-underline hover:underline transition-colors">
                  Політика конфіденційності
                </Link>
              </p>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="py-3 flex flex-col gap-2 border-t border-black/10 mt-2">
                  <div className="flex items-center justify-between rounded-xl p-3 bg-white/60 border border-black/5">
                    <div>
                      <p className="m-0 text-sm font-semibold text-gray-900">Необхідні</p>
                      <p className="m-0 mt-0.5 text-[11px] text-gray-500">Мова, тема, сесія — завжди активні</p>
                    </div>
                    <Toggle on={true} onChange={null} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl p-3 bg-white/60 border border-black/5">
                    <div>
                      <p className="m-0 text-sm font-semibold text-gray-900">Аналітичні</p>
                      <p className="m-0 mt-0.5 text-[11px] text-gray-500">Допомагають покращувати сервіс</p>
                    </div>
                    <Toggle on={analyticsOn} onChange={setAnalyticsOn} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-2 mt-2 pt-4 border-t border-black/10">
            <button 
              onClick={acceptAll} 
              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.3)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">Прийняти всі</span>
            </button>
            
            {open && (
              <button 
                onClick={() => saveCustom({ analytics: analyticsOn })} 
                className="px-4 py-2.5 rounded-full bg-white/80 hover:bg-white/20 text-gray-900 font-semibold text-sm transition-all active:scale-95"
              >
                Зберегти
              </button>
            )}

            <button 
              onClick={() => setOpen(!open)} 
              className="px-4 py-2.5 rounded-full border border-black/10 hover:bg-white/60 text-gray-700 font-medium text-sm transition-all active:scale-95"
            >
              {open ? 'Сховати' : 'Налаштувати'}
            </button>
          </div>
          
          {!open && (
             <div className="text-center mt-3">
               <button onClick={rejectAll} className="text-xs text-gray-500 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer">
                 Продовжити без прийняття
               </button>
             </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
