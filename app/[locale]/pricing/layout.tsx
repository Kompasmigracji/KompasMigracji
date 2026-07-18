import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const title = `${t('pricing_hero_h1')} | Kompas Migracji`;
  const description = t('pricing_hero_sub');
  const url = `https://kompasmigracji.com/${locale}/pricing`;

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: 'KompasMigracji', locale, type: 'website' },
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
