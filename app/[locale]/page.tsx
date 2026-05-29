import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SituationQuiz from '@/components/SituationQuiz';
import PromoSection from '@/components/PromoSection';
import Team from '@/components/Team';
import Reviews from '@/components/Reviews';
import ServicesGrid from '@/components/ServicesGrid';
import HowItWorks from '@/components/HowItWorks';
import FirstSteps from '@/components/FirstSteps';
import Pricing from '@/components/Pricing';
import GuaranteeSection from '@/components/GuaranteeSection';
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
import MobileCTABar from '@/components/MobileCTABar';
import ScrollProgress from '@/components/ScrollProgress';
import ReturnVisitor from '@/components/ReturnVisitor';

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <ReturnVisitor />
      <StarField />
      <Header />
      <main>
        <Hero />
        <SituationQuiz />
        <PromoSection />
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
      <PromoBanner />
      <WhatsAppFloat />
      <ExitPopup />
      <MobileCTABar />
    </>
  );
}
