/* HTML-обёртка для всего /admin/* (страница входа + CMS-панель).
   Изолирована от [locale]-раскладки сайта — своя html+body. */
export const metadata = { title: "KompasCMS · Kompas Migracji" };

export default function AdminLayout({ children }) {
  return (
    <html lang="uk">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
