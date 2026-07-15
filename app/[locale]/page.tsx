'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScrollProgress from '@/components/ScrollProgress';
import StarField from '@/components/StarField';
import CosmicSpiral from '@/components/CosmicSpiral';
import VideosShowcase from '@/components/VideosShowcase';

// Components below the fold (lazy loaded)
const SituationQuiz = dynamic(() => import('@/components/SituationQuiz'));
const Team = dynamic(() => import('@/components/Team'));
const Reviews = dynamic(() => import('@/components/Reviews'));
const SocialProof = dynamic(() => import('@/components/SocialProof'));
const ServicesGrid = dynamic(() => import('@/components/ServicesGrid'));
const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const FirstSteps = dynamic(() => import('@/components/FirstSteps'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const GuaranteeSection = dynamic(() => import('@/components/GuaranteeSection'));
const FAQ = dynamic(() => import('@/components/FAQ'));
const Blog = dynamic(() => import('@/components/Blog'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));
const Footer = dynamic(() => import('@/components/Footer'));

// Widgets (lazy loaded, no SSR for some to avoid hydration issues and improve TTI)
const ReturnVisitor = dynamic(() => import('@/components/ReturnVisitor'), { ssr: false });
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false });
const ExitPopup = dynamic(() => import('@/components/ExitPopup'), { ssr: false });
const MobileCTABar = dynamic(() => import('@/components/MobileCTABar'), { ssr: false });

export default function HomePage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <ScrollProgress />
      <ReturnVisitor />
      <div className="relative">
        <StarField />
        <CosmicSpiral />
        <Header />
        <main className="relative z-10">
          <Hero onShowMore={() => setShowMore(true)} />
        {showMore && (
          <>
            <VideosShowcase />
            <SituationQuiz />
            <Team />
            <Reviews />
            <SocialProof />
            <ServicesGrid />
            <HowItWorks />
            <FirstSteps />
            <Pricing />
            <GuaranteeSection />
            <FAQ />
            <Blog />
            <ContactForm />
          </>
        )}
        </main>
      </div>
      <Footer />
      <CookieBanner />
      <ChatBot />
      <ExitPopup />
      <MobileCTABar />
    </>
  );
}
