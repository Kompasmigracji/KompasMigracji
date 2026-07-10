'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/lib/navigation';
import { useTheme } from '@/lib/ThemeContext';
import type { Locale } from '@/i18n';
import AIAssistantIntake from '@/components/AIAssistantIntake';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitch from '@/components/ThemeSwitch';

const PHONE = '+48 729 271 848';
const WA_LINK = 'https://wa.me/48729271848';
const TG_LINK = 'https://t.me/kompasmigracji';
const VB_LINK = 'viber://chat?number=48729271848';

const LANG_LABELS: Record<string, string> = { uk: 'UA', pl: 'PL', en: 'EN', ru: 'RU', rom: 'RM' };

function TgIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>;
}
function WaIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}
function VbIcon() {
  return <svg viewBox="0 0 512 512" fill="currentColor" width="16" height="16"><path d="M436.9 330.1c-13.8-9.4-29.2-14.7-45.7-14.7-16.7 0-32.3 5.4-46.3 14.8l-15.6 10.5c-4.9 3.3-11.4 3-16.1-.7-42.8-33.8-79.6-70.6-113.3-113.3-3.7-4.7-4-11.3-.7-16.1l10.5-15.6c9.4-14 14.8-29.6 14.8-46.3 0-16.5-5.3-31.9-14.7-45.7L181.7 65.4c-12-8.1-26.1-12.4-40.8-12.4-17.7 0-34.6 6.5-47.5 18.2C59.9 101.4 48 152 48 206.1c0 148.6 105.4 257.9 257.9 257.9 54.1 0 104.7-11.9 134.9-45.4 11.7-12.9 18.2-29.8 18.2-47.5 0-14.7-4.3-28.8-12.4-40.8l-9.7-14.2zM277.5 186.2c-5.8 0-10.5-4.7-10.5-10.5 0-29.5-24-53.5-53.5-53.5-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5c41.1 0 74.5 33.4 74.5 74.5 0 5.8-4.7 10.5-10.5 10.5zm49.1 0c-5.8 0-10.5-4.7-10.5-10.5 0-56.5-46-102.5-102.5-102.5-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5c68.1 0 123.5 55.4 123.5 123.5 0 5.8-4.7 10.5-10.5 10.5zm47.2 0c-5.8 0-10.5-4.7-10.5-10.5 0-82.5-67.2-149.7-149.7-149.7-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5c94.1 0 170.7 76.6 170.7 170.7 0 5.8-4.7 10.5-10.5 10.5z"/></svg>;
}

const SOCIAL = [
  { href: TG_LINK, icon: <TgIcon />, label: 'Telegram', color: 'hover:text-blue-400' },
  { href: WA_LINK, icon: <WaIcon />, label: 'WhatsApp', color: 'hover:text-green-500' },
  { href: VB_LINK, icon: <VbIcon />, label: 'Viber', color: 'hover:text-purple-500' },
];

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const locale = useLocale();
  const [langOpen, setLangOpen] = useState(false);

  const [activeLang, setActiveLang] = useState(locale.toUpperCase());
  const dropRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const SERVICES = [
    { label: t('pcat_legalization'), href: '/test/pricing#legalization', icon: '🏠' },
    { label: t('pcat_notary'),       href: '/test/pricing#notary',       icon: '✍️' },
    { label: t('pcat_legal'),        href: '/test/pricing#legal',        icon: '⚖️' },
    { label: t('pcat_marriage'),     href: '/test/pricing#marriage',     icon: '💍' },
    { label: t('pcat_translations'), href: '/test/pricing#translations', icon: '📄' },
    { label: t('pcat_bureaucracy'),  href: '/test/pricing#bureaucracy',  icon: '📋' },
    { label: t('pcat_free'),         href: '/test/pricing#free',         icon: '🎁' },
    { label: t('nav_svc_express'),   href: '/test/karta',                icon: '⚡', accent: true },
  ];

  const changeLang = (lng: string) => {
    router.replace(pathname, { locale: lng as Locale });
    setLangOpen(false);
  };

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'pt-4' : 'pt-0'}`}>
      <div className={`mx-auto transition-all duration-500 ${scrolled ? 'max-w-5xl px-4' : 'max-w-7xl px-0'}`}>
        <div className={`relative flex items-center justify-between h-[72px] transition-all duration-500 ${
          scrolled 
            ? 'px-6 rounded-full bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]' 
            : 'px-6 bg-transparent'
        }`}>

          <Link href="/" className="flex items-center gap-3 no-underline flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 shadow-sm">
              <Image src="/logo.svg" alt="logo" width={32} height={32} className="w-full h-full object-contain spin-slow" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-lg tracking-tight hidden sm:block">Kompas Migracji</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className={`premium-btn !border-transparent !bg-transparent !shadow-none transition-transform duration-300 hover:scale-105 active:scale-95 ${dropOpen ? '!bg-black/5 dark:!bg-white/10' : 'hover:!bg-black/5 dark:hover:!bg-white/10'}`}
              >
                {t('nav_services')}
                <svg className={`w-4 h-4 transition-transform duration-300 ${dropOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                    className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[320px] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                  >
                    <div className="p-3 grid grid-cols-1 gap-1">
                      {SERVICES.map((s, i) => (
                        <Link
                          key={i} href={s.href} onClick={() => setDropOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group no-underline hover:scale-[1.02] active:scale-[0.98] ${
                            s.accent 
                              ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 hover:bg-blue-500/20' 
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{s.icon}</span>
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/doctrine" className="premium-btn !border-transparent !bg-transparent hover:!bg-black/5 dark:hover:!bg-white/10 !shadow-none no-underline transition-transform duration-300 hover:scale-105 active:scale-95">
              {{ uk: 'Доктрина', ru: 'Доктрина', pl: 'Doktryna', en: 'Doctrine', rom: 'Doctrină' }[locale] || 'Доктрина'}
            </Link>
            <Link href="/test/pricing" className="premium-btn !border-transparent !bg-transparent hover:!bg-black/5 dark:hover:!bg-white/10 !shadow-none no-underline transition-transform duration-300 hover:scale-105 active:scale-95">{t('nav_pricing')}</Link>
            <Link href="/admin/crm" className="premium-btn !border-transparent !bg-transparent hover:!bg-black/5 dark:hover:!bg-white/10 !shadow-none no-underline transition-transform duration-300 hover:scale-105 active:scale-95">iPhoenixCRM</Link>
            <button 
              onClick={() => setShowAIModal(true)}
              className="premium-btn overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold">Kompas AI</span>
            </button>
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-1 mr-2 bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full px-2 py-1">
              {SOCIAL.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" title={s.label} className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 ${s.color}`}>
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/20 transition-all"
                >
                  {LANG_LABELS[locale] || 'PL'}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[calc(100%+0.5rem)] right-0 w-32 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-2 shadow-2xl origin-top-right"
                    >
                      {Object.entries(LANG_LABELS).map(([code, label]) => (
                        <button
                          key={code} 
                          onClick={() => changeLang(code)}
                          className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border-none cursor-pointer ${locale === code ? 'bg-blue-500/10 text-blue-500' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white/60 border border-black/10 text-gray-900" onClick={() => setMobileOpen(true)}>
              <span className="w-5 h-0.5 bg-current rounded-full" />
              <span className="w-5 h-0.5 bg-current rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { delay: 0.1 } }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#fbfbfd]/95 dark:bg-[#111111]/95 backdrop-blur-3xl flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-black/10 dark:border-white/10">
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-gray-900 dark:text-white transition-transform duration-300 hover:rotate-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <motion.div 
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
              }}
              className="flex-1 overflow-y-auto px-6 py-8"
            >
              <div className="flex flex-col gap-2">
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <Link href="/" onClick={() => setMobileOpen(false)} className="block text-2xl font-display font-semibold text-gray-900 dark:text-white no-underline py-2">
                    {{ uk: 'Головна', ru: 'Главная', pl: 'Główna', en: 'Home', rom: 'Acasă' }[locale] || 'Головна'}
                  </Link>
                </motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="h-px bg-black/5 dark:bg-white/10 my-4" />
                
                <motion.span variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">{t('nav_services')}</motion.span>
                {SERVICES.map((s, i) => (
                  <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                    <Link href={s.href} onClick={() => setMobileOpen(false)} className={`block text-lg font-medium py-2 no-underline flex items-center gap-3 transition-transform active:scale-95 ${s.accent ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span className="text-xl">{s.icon}</span> {s.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="h-px bg-black/5 dark:bg-white/10 my-4" />
                
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <Link href="/doctrine" onClick={() => setMobileOpen(false)} className="block text-xl font-medium text-gray-700 dark:text-gray-300 py-2 no-underline active:scale-95 transition-transform">
                    {{ uk: 'Доктрина', ru: 'Доктрина', pl: 'Doktryna', en: 'Doctrine', rom: 'Doctrină' }[locale] || 'Доктрина'}
                  </Link>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <Link href="/test/pricing" onClick={() => setMobileOpen(false)} className="block text-xl font-medium text-gray-700 dark:text-gray-300 py-2 no-underline active:scale-95 transition-transform">{t('nav_pricing')}</Link>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <Link href="/admin/crm" onClick={() => setMobileOpen(false)} className="block text-xl font-medium text-gray-700 dark:text-gray-300 py-2 no-underline active:scale-95 transition-transform">iPhoenixCRM</Link>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <button 
                    onClick={() => { setShowAIModal(true); setMobileOpen(false); }}
                    className="block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 py-2 text-left mt-4 active:scale-95 transition-transform"
                  >
                    Kompas AI
                  </button>
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 border-t border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#1a1a1a]/50"
            >
              <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="flex items-center justify-center w-full py-4 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold mb-4 active:scale-95 transition-transform">{PHONE}</a>
              <div className="flex justify-center gap-4">
                {SOCIAL.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 active:scale-95 transition-transform hover:scale-110">
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl bg-transparent"
            >
              <AIAssistantIntake asModal={true} onClose={() => setShowAIModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
