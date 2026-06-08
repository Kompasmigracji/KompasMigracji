/* Layout группы (panel) — все вложенные страницы получают каркас CMS.
   Чтобы твои СТАРЫЕ страницы /admin тоже получили оформление CMS —
   перенеси их папки внутрь app/admin/(panel)/. URL не изменится. */
import "@/styles/kompascrm.css";
import Shell from "@/components/admin/Shell";

export const metadata = { title: "KompasCRM" };

export default function PanelLayout({ children }) {
  return <Shell>{children}</Shell>;
}
