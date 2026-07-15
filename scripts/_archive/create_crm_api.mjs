import fs from 'fs';
import path from 'path';

const endpoints = ['chats', 'funnels', 'orders', 'order-lists', 'buyers', 'calls', 'payments', 'products', 'publications', 'inventory', 'movements', 'categories', 'efficiency', 'dashboard'];
const base = path.join(process.cwd(), 'app/api/admin/crm');

endpoints.forEach(ep => {
  const p = path.join(base, ep);
  if (!fs.existsSync(p)) fs.mkdirSync(p, {recursive: true});
  const content = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [] });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
`;
  fs.writeFileSync(path.join(p, 'route.js'), content);
});
console.log('CRM API endpoints created.');
