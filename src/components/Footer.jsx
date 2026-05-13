import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/logo.svg';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-navy text-white pt-14 pb-6 mt-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={Logo} alt="logo" className="w-9 h-9" />
              <span className="font-semibold text-lg">Kompas Migracji</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{t('footer_about_text')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              {t('footer_services_col')}
            </h4>
            <ul className="flex flex-col gap-2">
              <li><span className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors">{t('footer_legal')}</span></li>
              <li><span className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors">{t('footer_documents')}</span></li>
              <li><span className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors">{t('footer_support')}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">
              {t('footer_contact_col')}
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="https://wa.me/48729271848" className="text-sm text-white/60 hover:text-white transition-colors no-underline">
                  📱 WhatsApp: +48 729 271 848
                </a>
              </li>
              <li>
                <a href="mailto:info@kompasmigracji.com" className="text-sm text-white/60 hover:text-white transition-colors no-underline">
                  📧 info@kompasmigracji.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-white/40">{t('footer_copyright')}</span>
          <div className="flex gap-6">
            <Link to="/regulamin" className="text-xs text-white/40 hover:text-white transition-colors no-underline">
              {t('footer_terms')}
            </Link>
            <Link to="/privacy" className="text-xs text-white/40 hover:text-white transition-colors no-underline">
              {t('footer_privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
