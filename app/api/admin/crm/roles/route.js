import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { NAV } from '@/lib/rbac';

const ROLE_META = {
  admin: { label: "Адміністратор", color: "blue" },
  moderator: { label: "Модератор", color: "purple" },
  manager: { label: "Менеджер", color: "sky" },
  sales: { label: "Продажі", color: "emerald" },
  lawyer: { label: "Юрист", color: "amber" },
  user: { label: "Користувач", color: "gray" },
  member: { label: "Учасник профспілки", color: "fuchsia" },
};

export async function GET() {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const counts = await q('SELECT role, COUNT(*)::int AS count FROM kompas_users GROUP BY role');
    const countMap = {};
    counts.forEach(r => { countMap[r.role] = r.count; });

    const roles = Object.keys(ROLE_META).map(role => ({
      role,
      name: ROLE_META[role].label,
      color: ROLE_META[role].color,
      users: countMap[role] || 0,
      rights: NAV.filter(n => n.roles.includes(role)).length,
    }));

    return NextResponse.json({ data: roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
