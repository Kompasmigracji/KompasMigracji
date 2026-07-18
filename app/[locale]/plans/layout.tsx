import type { Metadata } from 'next';

// Mirrors the page's own locale ternary (pl/uk/ru have real copy; en and any
// other locale fall through to the English branch) rather than inventing
// translations the page itself doesn't have.
const SEO: Record<string, { title: string; description: string }> = {
  uk: {
    title: 'Тарифні плани | Kompas Migracji',
    description: 'Професійна допомога за ціною кави на день — щомісячні плани супроводу з юридичною, психологічною та практичною підтримкою мігрантів у Польщі та ЄС.',
  },
  pl: {
    title: 'Plany abonamentowe | Kompas Migracji',
    description: 'Profesjonalna pomoc w cenie kawy dziennie — miesięczne plany wsparcia prawnego, psychologicznego i praktycznego dla migrantów w Polsce i UE.',
  },
  ru: {
    title: 'Тарифные планы | Kompas Migracji',
    description: 'Профессиональная помощь по цене кофе в день — ежемесячные планы сопровождения с юридической, психологической и практической поддержкой мигрантов в Польше и ЕС.',
  },
  en: {
    title: 'Subscription Plans | Kompas Migracji',
    description: 'Professional support for the price of a daily coffee — monthly plans covering legal, psychological, and practical assistance for migrants in Poland and the EU.',
  },
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const s = SEO[locale] || SEO.en;
  const url = `https://kompasmigracji.com/${locale}/plans`;
  return {
    title: s.title,
    description: s.description,
    openGraph: { title: s.title, description: s.description, url, siteName: 'KompasMigracji', locale, type: 'website' },
  };
}

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
