import type { Metadata } from 'next';

// The page itself (app/[locale]/book/page.tsx) has no locale branching —
// it renders the same Polish copy regardless of URL locale. Metadata matches
// that reality rather than promising a translation the page doesn't have.
const title = 'Zarezerwuj spotkanie z ekspertem | Kompas Migracji';
const description = 'Bezpłatna pierwsza konsultacja — 30-minutowe spotkanie online z naszym specjalistą ds. migracji. Bez opłat, bez zobowiązań.';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const url = `https://kompasmigracji.com/${locale}/book`;
  return {
    title,
    description,
    openGraph: { title, description, url, siteName: 'KompasMigracji', locale, type: 'website' },
  };
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
