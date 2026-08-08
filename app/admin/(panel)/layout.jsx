/* Layout группы (panel) — все вложенные страницы получают каркас CMS.
   Чтобы твои СТАРЫЕ страницы /admin тоже получили оформление CMS —
   перенеси их папки внутрь app/admin/(panel)/. URL не изменится. */
import "@/styles/kompascrm.css";
import Shell from "@/components/admin/Shell";
import StubNotice from "@/components/admin/StubNotice";

export const metadata = { title: "KompasCRM" };

export default function PanelLayout({ children }) {
  return (
    <Shell>
      {/* Смуга з'являється лише на маршрутах із lib/admin-stub-routes.ts —
          сторінках, які ще не роблять жодного запиту до сервера. Одна точка
          замість 87 правок; нову сторінку неможливо забути позначити. */}
      <StubNotice />
      {children}
    </Shell>
  );
}
