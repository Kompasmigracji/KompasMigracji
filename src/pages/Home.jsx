import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import Pricing from '../components/Pricing';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import ChatBot from '../components/ChatBot';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />
      <main>
        <Hero />
        <ServicesGrid />
        <HowItWorks />
        <Pricing />
        <FAQ />

        <section id="contact" className="py-24 bg-soft">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                {t('contact_tag')}
              </div>
              <h2 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                {t('contact_title')}
              </h2>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
      <ChatBot />
    </div>
  );
}
