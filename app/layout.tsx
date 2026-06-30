/* Кореневий layout — обов'язковий html+body для Next.js App Router.
   suppressHydrationWarning дозволяє [locale]/layout та admin/layout
   додавати lang= та className через React merging без гідрація-помилок. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/design-system/tokens.css" />
        <script dangerouslySetInnerHTML={{ __html: `
          // PostHog Mock Initialization
          window.posthog = { init: function(){}, capture: function(){} };
          // Sentry Mock Initialization
          window.Sentry = { init: function(){}, captureException: function(e){ console.error(e) } };
        `}} />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}` }} />
        {children}
      </body>
    </html>
  );
}
