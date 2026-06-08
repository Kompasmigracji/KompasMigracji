/* Layout для /admin/* — вкладається в кореневий layout (app/layout.tsx).
   Не потрібен власний html/body — кореневий вже надає їх. */
export const metadata = { title: "iPhoenixCRM · Enterprise Solution" };

export default function AdminLayout({ children }) {
  return <>{children}</>;
}
