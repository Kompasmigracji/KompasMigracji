import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata = {
  title: {
    default: "Kompas Migracji & iPhoenix Architecture",
    template: "%s | Kompas Migracji"
  },
  description: "Цифрова екосистема для мігрантів у Польщі. Легалізація, пошук роботи, нерухомість та преміальна архітектура від iPhoenix.",
  keywords: ["мігранти", "Польща", "карта побуту", "робота в Польщі", "архітектура", "дизайн інтер'єру", "ревіталізація", "iPhoenix", "Kompas Migracji"],
  authors: [{ name: "Oleksandr Khrystodul" }],
  creator: "iPhoenix",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://kompasmigracji.pl",
    title: "Kompas Migracji & iPhoenix",
    description: "Найшвидший шлях до легального життя та красивого простору у Польщі.",
    siteName: "Kompas Migracji"
  },
  twitter: {
    card: "summary_large_image",
    title: "Kompas Migracji & iPhoenix Architecture",
    description: "Цифрова екосистема для мігрантів у Польщі та преміальний архітектурний сервіс.",
    creator: "@iphoenix"
  },
  manifest: "/manifest.json",
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
        <script dangerouslySetInnerHTML={{ __html: `
          // PostHog Mock Initialization
          window.posthog = { init: function(){}, capture: function(){} };
          // Sentry Mock Initialization
          window.Sentry = { init: function(){}, captureException: function(e){ console.error(e) } };
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}else{document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark');}` }} />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
