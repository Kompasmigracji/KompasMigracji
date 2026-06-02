/* Кореневий layout — обов'язковий html+body для Next.js App Router.
   suppressHydrationWarning дозволяє [locale]/layout та admin/layout
   додавати lang= та className через React merging без гідрація-помилок. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.setAttribute('data-theme','dark')}catch(e){}` }} />
        {children}
      </body>
    </html>
  );
}
