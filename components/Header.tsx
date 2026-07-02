'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/lib/navigation';
import { useTheme } from '@/lib/ThemeContext';
import type { Locale } from '@/i18n';
import AIAssistantIntake from '@/components/AIAssistantIntake';

const PHONE = '+48 729 271 848';
const WA_LINK = 'https://wa.me/48729271848';
const TG_LINK = 'https://t.me/kompasmigracji';
const VB_LINK = 'viber://chat?number=48729271848';

const LANG_LABELS: Record<string, string> = { uk: 'UA', pl: 'PL', en: 'EN', ru: 'RU' };

function TgIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>;
}
function WaIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}
function VbIcon() {
  return <svg viewBox="0 0 512 512" fill="currentColor" width="16" height="16"><path d="M436.9 330.1c-13.8-9.4-29.2-14.7-45.7-14.7-16.7 0-32.3 5.4-46.3 14.8l-15.6 10.5c-4.9 3.3-11.4 3-16.1-.7-42.8-33.8-79.6-70.6-113.3-113.3-3.7-4.7-4-11.3-.7-16.1l10.5-15.6c9.4-14 14.8-29.6 14.8-46.3 0-16.5-5.3-31.9-14.7-45.7L181.7 65.4c-12-8.1-26.1-12.4-40.8-12.4-17.7 0-34.6 6.5-47.5 18.2C59.9 101.4 48 152 48 206.1c0 148.6 105.4 257.9 257.9 257.9 54.1 0 104.7-11.9 134.9-45.4 11.7-12.9 18.2-29.8 18.2-47.5 0-14.7-4.3-28.8-12.4-40.8l-9.7-14.2zM277.5 186.2c-5.8 0-10.5-4.7-10.5-10.5 0-29.5-24-53.5-53.5-53.5-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5c41.1 0 74.5 33.4 74.5 74.5 0 5.8-4.7 10.5-10.5 10.5zm49.1 0c-5.8 0-10.5-4.7-10.5-10.5 0-56.5-46-102.5-102.5-102.5-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5c68.1 0 123.5 55.4 123.5 123.5 0 5.8-4.7 10.5-10.5 10.5zm47.2 0c-5.8 0-10.5-4.7-10.5-10.5 0-82.5-67.2-149.7-149.7-149.7-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5c94.1 0 170.7 76.6 170.7 170.7 0 5.8-4.7 10.5-10.5 10.5z"/></svg>;
}

const SOCIAL = [
  { href: TG_LINK, icon: <TgIcon />, label: 'Telegram' },
  { href: WA_LINK, icon: <WaIcon />, label: 'WhatsApp' },
  { href: VB_LINK, icon: <VbIcon />, label: 'Viber' },
];

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={dark ? 'Світла тема' : 'Темна тема'}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: dark ? 'rgba(255,255,255,0.1)' : '#f3f4f6', border: `1.5px solid ${dark ? 'rgba(255,255,255,0.18)' : '#e5e7eb'}`, cursor: 'pointer', transition: 'all 0.3s ease' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.18)' : '#e5e7eb'; }}
    >
      {dark
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      }
    </button>
  );
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

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
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-premium ${scrolled ? 'apple-glass border-b border-transparent shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[62px] gap-3">

        <Link href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <Image src="/logo.svg" alt="logo" width={32} height={32} className="w-8 h-8 spin-slow" />
          <span className="font-bold text-navy text-base tracking-tight hidden sm:block">Kompas Migracji</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setDropOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('nav_services')}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform .2s', transform: dropOpen ? 'rotate(180deg)' : 'none' }}>
                <polyline points="2 4 6 8 10 4" />
              </svg>
            </button>
            {dropOpen && (
              <div style={{ top: 'calc(100% + 6px)', minWidth: 320 }} className="absolute left-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {SERVICES.filter(s => !s.accent).map((s, i) => (
                    <a key={i} href={s.href} onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm no-underline text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
                      <span style={{ lineHeight: 1.3 }}>{s.label}</span>
                    </a>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 2px' }}>
                  {SERVICES.filter(s => s.accent).map((s, i) => (
                    <a key={i} href={s.href} onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold no-underline text-primary hover:bg-orange-50 rounded-lg transition-colors">
                      <span>{s.icon}</span>{s.label}
                    </a>
                  ))}
                  <a href="/test/pricing" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold no-underline text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors ml-auto">
                    {t('nav_pricelist')} →
                  </a>
                </div>
              </div>
            )}
          </div>


          <Link
            href="/test/pricing"
            className="px-3.5 py-1.5 text-sm font-bold text-white gradient-btn no-underline rounded-full transition-all hover:opacity-90 hover:scale-105 whitespace-nowrap"
            style={{ boxShadow: '0 2px 12px -2px rgba(5,150,105,.4)' }}
          >
            {t('nav_pricelist')}
          </Link>

        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">

          <div className="hidden sm:flex items-center gap-1.5">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="social-circle-btn">{s.icon}</a>
            ))}
          </div>

          <ThemeToggle />

          <div className="flex items-center gap-0.5 p-1 rounded-full" style={{ background: 'rgba(0,0,0,0.04)', border: '1.5px solid rgba(0,0,0,0.07)' }}>
            {['uk', 'pl', 'en', 'ru'].map((l) => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className="px-2.5 py-0.5 text-xs font-bold rounded-full transition-all uppercase tracking-wide"
                style={locale === l
                  ? { background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', color: 'white', boxShadow: '0 1px 8px rgba(29,78,216,.35)' }
                  : { color: '#9ca3af' }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          <button className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(v => !v)} aria-label="Меню">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-1">{t('nav_services')}</div>
          {SERVICES.map((s, i) => (
            <a key={i} href={s.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm no-underline ${s.accent ? 'text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
              <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
              {s.label}
            </a>
          ))}
          <div className="my-1 border-t border-gray-100" />
          {[['#process', t('nav_process')], ['/test/pricing', t('nav_pricing')], ['#contact', t('nav_contact')]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 no-underline">{label}</a>
          ))}
          <Link
            href="/test/pricing"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 rounded-full text-sm font-bold text-white gradient-btn text-center no-underline mt-1"
            style={{ boxShadow: '0 2px 12px -2px rgba(5,150,105,.4)' }}
          >
            {t('nav_pricelist')}
          </Link>
          <div className="mt-3 flex items-center gap-2 px-3">
            <a href="tel:+48729271848" className="text-sm font-semibold text-navy no-underline">{PHONE}</a>
            <div className="flex gap-2 ml-auto">
              {SOCIAL.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-circle-btn" aria-label={s.label}>{s.icon}</a>)}
            </div>
          </div>
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-transparent animate-fade-in-up">
            <AIAssistantIntake asModal={true} onClose={() => setShowAIModal(false)} />
          </div>
        </div>
      )}

      <style>{`
        .social-circle-btn { display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;border:1.5px solid #d1d5db;color:#6b7280;transition:all .2s;text-decoration:none; }
        .social-circle-btn:hover { border-color:#f97316;color:#f97316;background:#fff7ed; }
      `}</style>
    </header>
  );
}
