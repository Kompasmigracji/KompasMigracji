import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

// Only load essential components
const Footer = dynamic(() => import('@/components/Footer'));
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const WhatsAppFloat = dynamic(() => import('@/components/WhatsAppFloat'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col justify-center bg-white text-black dark:bg-black dark:text-white">
        <Hero />
      </main>
      <Footer />
      <CookieBanner />
      <WhatsAppFloat />
    </>
  );
}
