import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const lang = i18n.language?.slice(0, 2) || 'ua';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={Logo} alt="logo" className="w-9 h-9 spin-slow" />
          <span className="font-semibold text-navy text-lg tracking-tight">Kompas Migracji</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            ['#services', t('nav_services')],
            ['#process',  t('nav_process')],
            ['#pricing',  t('nav_pricing')],
            ['#contact',  t('nav_contact')],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors no-underline"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
            {['ua', 'pl', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-all uppercase ${
                  lang === l
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <a
            href="https://wa.me/48729271848"
            target="_blank"
            rel="noreferrer"
            className="gradient-btn text-white text-sm font-semibold px-4 py-2 rounded-lg no-underline hidden sm:inline-flex items-center gap-2"
          >
            {t('nav_cta')}
          </a>
        </div>
      </div>
    </header>
  );
}
