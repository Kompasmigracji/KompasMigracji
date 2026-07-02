import fs from 'fs';
import path from 'path';

const dummyData = {
  buyers: [{ id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', status: 'Active' }, { id: 2, name: 'Alice Smith', email: 'alice@example.com', phone: '+9876543210', status: 'Lead' }],
  chats: [{ id: 1, user: 'John Doe', lastMessage: 'Hello, I need help', time: '10:00 AM' }],
  funnels: [{ id: 1, stage: 'New', count: 5 }, { id: 2, stage: 'In Progress', count: 2 }],
  orders: [{ id: 1, buyer: 'John Doe', total: 150, status: 'Completed' }],
  'order-lists': [{ id: 1, name: 'Pending Orders', count: 12 }],
  calls: [{ id: 1, from: '+1234567890', duration: '5m', time: '11:00 AM' }],
  payments: [{ id: 1, amount: 150, date: '2023-10-01', status: 'Success' }],
  products: [{ id: 1, name: 'Consultation', price: 100, stock: 10 }],
  publications: [{ id: 1, title: 'Summer Promo', status: 'Published' }],
  inventory: [{ id: 1, item: 'Consultation', quantity: 10 }],
  movements: [{ id: 1, type: 'Sale', item: 'Consultation', qty: 1 }],
  categories: [{ id: 1, name: 'Services' }],
  efficiency: [{ metric: 'Conversion', value: '4.5%' }],
  dashboard: [{ metric: 'Total Revenue', value: '$1000' }]
};

const base = path.join(process.cwd(), 'app/api/admin/crm');

Object.keys(dummyData).forEach(ep => {
  const p = path.join(base, ep);
  const content = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: ${JSON.stringify(dummyData[ep], null, 2)} });
}
export async function POST(req) {
  const body = await req.json();
  return NextResponse.json({ ok: true, data: body });
}
`;
  fs.writeFileSync(path.join(p, 'route.js'), content);
});
console.log('CRM API endpoints updated with dummy data.');
