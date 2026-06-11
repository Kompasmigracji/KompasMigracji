import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale });
  
  return {
    title: t('seo_karta_title'),
    description: t('seo_karta_desc'),
    openGraph: {
      title: t('seo_karta_title'),
      description: t('seo_karta_desc'),
      url: `https://kompasmigracji.com/${locale}/karta`,
    },
  };
}

export default function KartaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
