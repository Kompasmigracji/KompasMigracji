'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/lib/useCookieConsent';
import { useTheme } from '@/lib/ThemeContext';

const ORANGE = '#f97316';

function Toggle({ on, onChange }: { on: boolean; onChange: ((v: boolean) => void) | null }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      disabled={!onChange}
      className={`relative w-10 h-[22px] rounded-full shrink-0 transition-colors duration-250 ${onChange ? 'cursor-pointer' : 'cursor-default'} ${on ? 'bg-orange-500' : 'bg-white/15 border-none'}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-250 shadow-md ${on ? 'left-[21px]' : 'left-[3px]'}`} />
    </button>
  );
}

export default function CookieBanner() {
  const { decided, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);

  if (decided) return null;

  const bg     = dark ? 'rgba(10, 18, 36, 0.97)' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';
  const text   = dark ? '#dde4f0' : '#1a1a2e';
  const muted  = dark ? '#7a8ba8' : '#6b7280';
  const card   = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 z-[9995] pointer-events-none">
      <div className={`max-w-[480px] w-full mx-auto rounded-2xl p-5 pb-[18px] pointer-events-auto shadow-2xl backdrop-blur-md ${dark ? 'bg-[#0a1224]/97 border border-white/10' : 'bg-white border border-gray-200'}`}>
        <div className="flex gap-2.5 items-start mb-2.5">
          <span className="text-[20px] leading-none">🍪</span>
          <div>
            <p className={`m-0 font-bold text-sm leading-tight ${dark ? 'text-[#dde4f0]' : 'text-[#1a1a2e]'}`}>Ми використовуємо файли cookie</p>
            <p className={`mt-1 text-xs leading-relaxed ${dark ? 'text-[#7a8ba8]' : 'text-gray-500'}`}>
              Необхідні cookies завжди активні. Аналітичні допомагають покращувати сервіс.{' '}
              <Link href="/privacy" className="text-orange-500 no-underline hover:underline">Політика конфіденційності</Link>
            </p>
          </div>
        </div>

        {open && (
          <div className="my-3 flex flex-col gap-2">
            <div className={`flex items-center justify-between rounded-xl p-2.5 px-3.5 border ${dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <p className={`m-0 text-[13px] font-semibold ${dark ? 'text-[#dde4f0]' : 'text-[#1a1a2e]'}`}>Необхідні</p>
                <p className={`mt-0.5 text-[11px] ${dark ? 'text-[#7a8ba8]' : 'text-gray-500'}`}>Мова, тема, сесія — завжди активні</p>
              </div>
              <Toggle on={true} onChange={null} />
            </div>
            <div className={`flex items-center justify-between rounded-xl p-2.5 px-3.5 border ${dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <p className={`m-0 text-[13px] font-semibold ${dark ? 'text-[#dde4f0]' : 'text-[#1a1a2e]'}`}>Аналітичні</p>
                <p className={`mt-0.5 text-[11px] ${dark ? 'text-[#7a8ba8]' : 'text-gray-500'}`}>Vercel Analytics — статистика відвідувань</p>
              </div>
              <Toggle on={analyticsOn} onChange={setAnalyticsOn} />
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap mt-3.5">
          <button onClick={acceptAll} className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl border-none bg-orange-500 text-white font-bold text-[13px] cursor-pointer">Прийняти всі</button>
          <button onClick={() => setOpen(o => !o)} className={`px-3.5 py-2.5 rounded-xl border bg-transparent font-semibold text-[13px] cursor-pointer ${dark ? 'border-white/10 text-[#7a8ba8]' : 'border-gray-200 text-gray-500'}`}>{open ? 'Сховати' : 'Налаштувати'}</button>
          {open && <button onClick={() => saveCustom({ analytics: analyticsOn })} className={`px-3.5 py-2.5 rounded-xl border bg-transparent font-semibold text-[13px] cursor-pointer ${dark ? 'border-white/10 text-[#dde4f0]' : 'border-gray-200 text-[#1a1a2e]'}`}>Зберегти</button>}
          <button onClick={rejectAll} className={`px-3.5 py-2.5 rounded-xl border-none bg-transparent font-medium text-[12px] cursor-pointer ${dark ? 'text-[#7a8ba8]' : 'text-gray-500'}`}>Відхилити</button>
        </div>
      </div>
    </div>
  );
}
