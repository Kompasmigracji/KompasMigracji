'use client';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative bg-[#fbfbfd] dark:bg-[#050505] text-gray-900 dark:text-white pt-24 pb-12 mt-0 overflow-hidden border-t border-black/5 dark:border-white/5">
      {/* Glows */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center p-2 backdrop-blur-xl shadow-sm group-hover:scale-105 transition-transform duration-500">
                <Image src="/logo.svg" alt="logo" width={32} height={32} className="w-full h-full object-contain group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Kompas Migracji</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mb-8">{t('footer_about_text')}</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:scale-110 active:scale-95 hover:shadow-blue-500/20 hover:shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
              </a>
              <a href="https://t.me/kompasmigracji" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:scale-110 active:scale-95 hover:shadow-blue-500/20 hover:shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-900 dark:text-white">{t('footer_services_col')}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/test/pricing#legal" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors scale-75 group-hover:scale-100"/>{t('footer_legal')}</Link></li>
              <li><Link href="/test/pricing#translations" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors scale-75 group-hover:scale-100"/>{t('footer_documents')}</Link></li>
              <li><Link href="/test/pricing#legalization" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors scale-75 group-hover:scale-100"/>{t('footer_support')}</Link></li>
              <li><Link href="/test/plans" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors scale-75 group-hover:scale-100"/>Subskrypcje miesięczne</Link></li>
              <li><Link href="/test/book" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors scale-75 group-hover:scale-100"/>Zapisz się na konsultację</Link></li>
              <li><Link href="/portal" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors scale-75 group-hover:scale-100"/>Portal klienta</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-900 dark:text-white">{t('footer_contact_col')}</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="https://wa.me/48729271848" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all no-underline flex items-center gap-3"><span className="text-green-500 text-lg group-hover:scale-110 transition-transform">💬</span> +48 729 271 848</a></li>
              <li><a href="https://t.me/kompasmigracji" target="_blank" rel="noreferrer" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all no-underline flex items-center gap-3"><span className="text-blue-500 text-lg group-hover:scale-110 transition-transform">✈️</span> @kompasmigracji</a></li>
              <li><a href="viber://chat?number=48729271848" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all no-underline flex items-center gap-3"><span className="text-purple-500 text-lg group-hover:scale-110 transition-transform">📳</span> +48 729 271 848</a></li>
              <li><a href="mailto:info@kompasmigracji.com" className="group text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all no-underline flex items-center gap-3"><span className="text-orange-500 text-lg group-hover:scale-110 transition-transform">📧</span> info@kompasmigracji.com</a></li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] backdrop-blur-xl border border-black/5 dark:border-white/10 mb-8 transition-colors hover:border-black/10 dark:hover:border-white/20">
          <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white tracking-wide">DOMUS V Sp. z o.o.</span>
            <span>NIP: <span className="font-medium text-gray-800 dark:text-gray-300">5223350030</span></span>
            <span>KRS: <span className="font-medium text-gray-800 dark:text-gray-300">0001198474</span></span>
            <span>ul. Dzieci Warszawy 27c/49, 02-495 Warszawa</span>
            <span className="flex-1 text-right">Nr konta: <span className="text-gray-800 dark:text-gray-300 font-mono tracking-wide font-medium bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md ml-1">10 1050 1025 1000 0090 8594 6938</span></span>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('footer_copyright')}</span>
          <div className="flex gap-6">
            <Link href="/manual" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors no-underline">{t('footer_manual') || 'Інструкція'}</Link>
            <Link href="/regulamin" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors no-underline">{t('footer_terms')}</Link>
            <Link href="/privacy" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors no-underline">{t('footer_privacy')}</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-center">
          <span className="text-xs text-gray-500 font-medium">
            Designed &amp; Developed by{' '}
            <a
              href="mailto:iphoenixgsm@gmail.com"
              className="text-orange-500/80 hover:text-orange-500 font-bold tracking-wide no-underline transition-colors"
            >
              iPhoenix®
            </a>
            {' '}·{' '}<span className="tracking-wide">Alex Khrysto</span>{' '}· © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
