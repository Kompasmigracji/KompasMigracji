import fs from 'fs';

const s = fs.readFileSync('server.html', 'utf8').split('\n');
const c = fs.readFileSync('client.html', 'utf8').split('\n');

let diffs = 0;
for (let i = 0; i < Math.max(s.length, c.length); i++) {
  const sl = s[i] ? s[i].trim() : '';
  const cl = c[i] ? c[i].trim() : '';
  
  // ignore script tags and nextjs specific injected stuff
  if (sl.includes('<script') || cl.includes('<script')) continue;
  if (sl.includes('data-theme') || cl.includes('data-theme')) continue;
  
  if (sl !== cl) {
    console.log(`Mismatch at line ${i+1}:`);
    console.log(`Server: ${sl}`);
    console.log(`Client: ${cl}`);
    console.log('------------------');
    diffs++;
    if (diffs > 15) break;
  }
}
if (diffs === 0) console.log('No differences found!');
