/* Layout для /admin/* — вкладається в кореневий layout (app/layout.tsx).
   Не потрібен власний html/body — кореневий вже надає їх. */
import AdminIntlProvider from './AdminIntlProvider';

export const metadata = { title: "KompasCRM · Enterprise Solution" };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  return (
    <AdminIntlProvider>
      {children}
    </AdminIntlProvider>
  );
}
