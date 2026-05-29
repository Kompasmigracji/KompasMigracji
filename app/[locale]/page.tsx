import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PromoSection from '@/components/PromoSection';
import Team from '@/components/Team';
import Reviews from '@/components/Reviews';
import ServicesGrid from '@/components/ServicesGrid';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Blog from '@/components/Blog';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import ChatBot from '@/components/ChatBot';
import KompasAI from '@/components/KompasAI';
import PromoBanner from '@/components/PromoBanner';
import StarField from '@/components/StarField';
import SocialProof from '@/components/SocialProof';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ExitPopup from '@/components/ExitPopup';

export default function HomePage() {
  return (
    <>
      <StarField />
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <PromoSection />
        <Team />
        <Reviews />
        <ServicesGrid />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <Blog />
        <ContactForm />
      </main>
      <Footer />
      <CookieBanner />
      <ChatBot />
      <KompasAI />
      <PromoBanner />
      <WhatsAppFloat />
      <ExitPopup />
    </>
  );
}
