const fs = require('fs');
const path = require('path');
const dirs = ['order-lists', 'calls', 'publications', 'inventory', 'movements', 'categories', 'efficiency'];
const base = 'app/admin/crm';

dirs.forEach(d => {
  const p = path.join(base, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, {recursive: true});
  const content = `export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>${d}</h1>
      <p style={{ color: 'var(--dim)' }}>Module under construction.</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(p, 'page.jsx'), content);
});
