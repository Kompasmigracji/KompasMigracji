import type { Metadata } from 'next';

const SEO: Record<string, { title: string; description: string }> = {
  uk: {
    title: 'EWU — European Welding Union | Робота для зварювальників в ЄС',
    description: 'Офіційне працевлаштування зварювальників у Польщі та ЄС: легальні контракти, житло, супровід. Роботодавцям — перевірені майстри без простоїв.',
  },
  pl: {
    title: 'EWU — European Welding Union | Praca dla spawaczy w UE',
    description: 'Legalne zatrudnienie spawaczy w Polsce i UE: umowy, zakwaterowanie, opieka koordynatora. Dla pracodawców — sprawdzeni fachowcy bez przestojów.',
  },
  en: {
    title: 'EWU — European Welding Union | Welding jobs across the EU',
    description: 'Official employment for welders in Poland and the EU: legal contracts, accommodation, full support. For employers — vetted welders, zero downtime.',
  },
  ru: {
    title: 'EWU — European Welding Union | Работа для сварщиков в ЕС',
    description: 'Официальное трудоустройство сварщиков в Польше и ЕС: легальные контракты, жильё, сопровождение. Работодателям — проверенные мастера без простоев.',
  },
  rom: {
    title: 'EWU — European Welding Union | Locuri de muncă pentru sudori în UE',
    description: 'Angajare oficială a sudorilor în Polonia și UE: contracte legale, cazare, asistență completă. Pentru angajatori — meșteri verificați, fără întreruperi.',
  },
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const s = SEO[locale] || SEO.uk;
  const url = `https://kompasmigracji.com/${locale}/orakul`;
  const image = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=85';

  return {
    title: s.title,
    description: s.description,
    openGraph: {
      title: s.title,
      description: s.description,
      url,
      siteName: 'European Welding Union',
      locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: s.title,
      description: s.description,
      images: [image],
    },
  };
}

export default function OrakulLayout({ children }: { children: React.ReactNode }) {
  return children;
}
