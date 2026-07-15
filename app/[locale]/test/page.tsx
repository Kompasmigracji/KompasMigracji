import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: `KompasMigracji - Test (${locale.toUpperCase()})`,
    openGraph: {
      url: `https://kompasmigracji.com/${locale}/test`,
    },
  };
}

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScrollProgress from '@/components/ScrollProgress';
import StarField from '@/components/StarField';
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
const KompasAI = dynamic(() => import('@/components/KompasAI'), { ssr: false });
const ExitPopup = dynamic(() => import('@/components/ExitPopup'), { ssr: false });
const MobileCTABar = dynamic(() => import('@/components/MobileCTABar'), { ssr: false });

export default function TestPage() {
  return (
    <>
      <ScrollProgress />
      <ReturnVisitor />
      <StarField />
      <Header />
      <main>
        <Hero />
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
      </main>
      <Footer />
      <CookieBanner />
      <ChatBot />
      <KompasAI />
      <ExitPopup />
      <MobileCTABar />
    </>
  );
}
