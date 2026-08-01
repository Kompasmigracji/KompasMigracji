import { Inter } from "next/font/google";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata = {
  title: {
    default: "Kompas Migracji — Юридична допомога мігрантам",
    template: "%s | Kompas Migracji"
  },
  description: "Юридична, психологічна та практична допомога мігрантам у Польщі та ЄС. Domus V.",
  keywords: ["мігранти", "Польща", "карта побуту", "робота в Польщі", "легалізація", "Kompas Migracji"],
  authors: [{ name: "DOMUS V Sp. z o.o." }],
  creator: "DOMUS V Sp. z o.o.",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://kompasmigracji.com",
    title: "Kompas Migracji — Юридична допомога мігрантам",
    description: "Юридична, психологічна та практична допомога мігрантам у Польщі та ЄС.",
    siteName: "Kompas Migracji"
  },
  twitter: {
    card: "summary_large_image",
    title: "Kompas Migracji — Юридична допомога мігрантам",
    description: "Юридична, психологічна та практична допомога мігрантам у Польщі та ЄС."
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-v2.svg", type: "image/svg+xml" },
      { url: "/favicon-v2.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/* Кореневий layout — обов'язковий html+body для Next.js App Router.
   suppressHydrationWarning дозволяє [locale]/layout та admin/layout
   додавати lang= та className через React merging без гідрація-помилок. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}else{document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark');}` }} />
        
        {/* JSON-LD Structured Data for SEO — describes the organization, no unverifiable ratings/offers */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          "name": "Kompas Migracji",
          "legalName": "DOMUS V Sp. z o.o.",
          "url": "https://kompasmigracji.com",
          "logo": "https://kompasmigracji.com/logo.svg",
          "image": "https://kompasmigracji.com/logo.svg",
          "telephone": "+48729271848",
          "email": "info@kompasmigracji.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "ul. Dzieci Warszawy 27c/49",
            "postalCode": "02-495",
            "addressLocality": "Warszawa",
            "addressCountry": "PL"
          },
          "areaServed": "PL",
          "knowsLanguage": ["uk", "pl", "en", "ru"]
        })}} />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
