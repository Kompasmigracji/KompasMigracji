'use client';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-navy text-white pt-14 pb-6 mt-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="logo" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-lg">Kompas Migracji</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{t('footer_about_text')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">{t('footer_services_col')}</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/test/pricing#legal" className="text-sm text-white/60 hover:text-white transition-colors no-underline">{t('footer_legal')}</Link></li>
              <li><Link href="/test/pricing#translations" className="text-sm text-white/60 hover:text-white transition-colors no-underline">{t('footer_documents')}</Link></li>
              <li><Link href="/test/pricing#legalization" className="text-sm text-white/60 hover:text-white transition-colors no-underline">{t('footer_support')}</Link></li>
              <li><Link href="/plans" className="text-sm text-white/60 hover:text-white transition-colors no-underline">📋 Subskrypcje miesięczne</Link></li>
              <li><Link href="/book" className="text-sm text-white/60 hover:text-white transition-colors no-underline">📅 Zapisz się na konsultację</Link></li>
              <li><Link href="/portal" className="text-sm text-white/60 hover:text-white transition-colors no-underline">🔑 Portal klienta — status sprawy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">{t('footer_contact_col')}</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="https://wa.me/48729271848" className="text-sm text-white/60 hover:text-white transition-colors no-underline">💬 WhatsApp: +48 729 271 848</a></li>
              <li><a href="https://t.me/kompasmigracji" target="_blank" rel="noreferrer" className="text-sm text-white/60 hover:text-white transition-colors no-underline">✈️ Telegram: @kompasmigracji</a></li>
              <li><a href="viber://chat?number=48729271848" className="text-sm text-white/60 hover:text-white transition-colors no-underline">📳 Viber: +48 729 271 848</a></li>
              <li><a href="mailto:info@kompasmigracji.com" className="text-sm text-white/60 hover:text-white transition-colors no-underline">📧 info@kompasmigracji.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 pb-6 mb-2">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-white/40">
            <span className="font-semibold text-white/60">DOMUS V Sp. z o.o.</span>
            <span>NIP: <span className="text-white/55">5223350030</span></span>
            <span>KRS: <span className="text-white/55">0001198474</span></span>
            <span>ul. Dzieci Warszawy 27c/49, 02-495 Warszawa</span>
            <span>Nr konta: <span className="text-white/55 font-mono tracking-wide">10 1050 1025 1000 0090 8594 6938</span></span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-white/40">{t('footer_copyright')}</span>
          <div className="flex gap-6">
            <Link href="/manual" className="text-xs text-white/40 hover:text-white transition-colors no-underline">{t('footer_manual') || 'Інструкція'}</Link>
            <Link href="/regulamin" className="text-xs text-white/40 hover:text-white transition-colors no-underline">{t('footer_terms')}</Link>
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white transition-colors no-underline">{t('footer_privacy')}</Link>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 text-center">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Designed &amp; Developed by{' '}
            <a
              href="mailto:iphoenixgsm@gmail.com"
              style={{ color: 'rgba(249,115,22,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(249,115,22,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(249,115,22,0.45)'; }}
            >
              iPhoenix®
            </a>
            {' '}·{' '}<span style={{ letterSpacing: '0.02em' }}>Alex Khrysto</span>{' '}· © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
