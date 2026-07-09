import { KompasCoinsBadge } from '@/components/member/KompasCoinsBadge';

export default function MemberLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <KompasCoinsBadge />
      {children}
    </div>
  );
}
