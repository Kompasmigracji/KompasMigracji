import type { Metadata } from 'next';

// Only exists in uk/pl (matches the page's own defaultLangFor logic).
const SEO: Record<'uk' | 'pl', { title: string; description: string }> = {
  uk: {
    title: 'Правила Компасу Міграції | Kompas Migracji',
    description: 'Правила магазину — Компас Міграції. Набирає чинності з дня публікації на сайті kompasmigracji.com.',
  },
  pl: {
    title: 'Regulamin Kompas Migracji | Kompas Migracji',
    description: 'Regulamin sklepu — Kompas Migracji. Obowiązuje od dnia publikacji na stronie kompasmigracji.com.',
  },
};

function defaultLangFor(locale: string): 'uk' | 'pl' {
  return locale === 'pl' || locale === 'en' || locale === 'rom' ? 'pl' : 'uk';
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const lang = defaultLangFor(locale);
  const s = SEO[lang];
  const url = `https://kompasmigracji.com/${locale}/regulamin`;
  return {
    title: s.title,
    description: s.description,
    openGraph: { title: s.title, description: s.description, url, siteName: 'KompasMigracji', locale, type: 'website' },
  };
}

export default function RegulaminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
