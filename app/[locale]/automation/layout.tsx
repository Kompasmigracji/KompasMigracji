import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Автоматизація бізнесу | Компас Міграції',
  description: 'Впровадження CRM систем та ШІ. Ми зробимо вам навіть краще, ніж собі, і переведемо ваш бізнес з 20-го одразу в 22-є сторіччя!',
};

export default function AutomationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
