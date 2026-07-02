import fs from 'fs';
import path from 'path';

const files = [
  {file: 'buyers/page.jsx', ep: 'buyers', setter: 'setBuyers'},
  {file: 'chats/page.jsx', ep: 'chats', setter: 'setChats'},
  {file: 'orders/page.jsx', ep: 'orders', setter: 'setOrders'},
  {file: 'funnels/page.jsx', ep: 'funnels', setter: 'setFunnels'},
  {file: 'payments/page.jsx', ep: 'payments', setter: 'setPayments'},
  {file: 'products/page.jsx', ep: 'products', setter: 'setProducts'}
];

files.forEach(item => {
  const f = path.join(process.cwd(), 'app/admin/crm', item.file);
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    const fetchLogic = `
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/crm/${item.ep}');
        const json = await res.json();
        ${item.setter}(json.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
`;
    // Regex cleanup
    content = content.replace(/const fetch[a-zA-Z]+ = async \(\) => \{.*?\n\s+if \(\!error && data\) \{\n\s+set[a-zA-Z]+\(data\);\n\s+\}\n\s+setLoading\(false\);\n\s+\};/s, '');
    content = content.replace(/fetch[a-zA-Z]+\(\);/s, '');
    content = content.replace(/useEffect\(\(\) => \{/, `useEffect(() => {${fetchLogic}`);
    content = content.replace(/, \[supabase\]\)/g, ', [])');
    fs.writeFileSync(f, content);
  }
});
console.log('Fetch logic injected.');
