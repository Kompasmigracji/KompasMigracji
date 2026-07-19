/* CRM screenshot harness: авторизується як admin і знімає сторінки /admin/*.
   Використання:
     node scripts/crm-shot.mjs /admin /admin/leads ...     — скриншоти вказаних сторінок
   Опції:
     --theme=light|dark|both   (default: both)
     --out=DIR                 (default: .crm-shots)
     --width=N                 (default: 1440)
   Виводить console-помилки сторінки та статуси /api/* запитів. */
import { chromium } from '@playwright/test';
import { SignJWT } from 'jose';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function cleanEnv(s) {
  let r = s || '';
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join('').trim();
}

const args = process.argv.slice(2);
const pages = args.filter((a) => !a.startsWith('--'));
const opt = (name, def) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
};
const themes = opt('theme', 'both') === 'both' ? ['light', 'dark'] : [opt('theme', 'both')];
const outDir = path.resolve(opt('out', '.crm-shots'));
const width = Number(opt('width', '1440'));
const height = Number(opt('height', '900'));

if (pages.length === 0) {
  console.error('Usage: node scripts/crm-shot.mjs /admin [/admin/leads ...] [--theme=light|dark|both]');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const SECRET = new TextEncoder().encode(cleanEnv(process.env.JWT_SECRET) || 'dev-secret-change-me-in-production');
const token = await new SignJWT({ role: 'admin', email: 'iphoenixgsm@gmail.com', name: 'Admin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(SECRET);

const browser = await chromium.launch();

for (const theme of themes) {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addCookies([{ name: 'kompascrm_session', value: token, url: 'http://localhost:3000' }]);
  await context.addInitScript((t) => {
    localStorage.setItem('kc-theme', t);   // тема KompasCRM (/admin/(panel))
    localStorage.setItem('theme', t);      // тема сайту/iPhoenixCRM (/admin/crm)
    localStorage.setItem('kc-lang', 'uk');
  }, theme);

  const page = await context.newPage();
  page.on('pageerror', (err) => console.log(`  [pageerror] ${String(err).slice(0, 300)}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`  [console.error] ${msg.text().slice(0, 300)}`);
  });
  page.on('response', (res) => {
    if (res.url().includes('/api/') && res.status() >= 400) {
      console.log(`  [api ${res.status()}] ${res.url().replace('http://localhost:3000', '')}`);
    }
  });

  for (const p of pages) {
    const slug = p.replace(/\//g, '_').replace(/^_/, '') || 'root';
    process.stdout.write(`[${theme}] ${p}\n`);
    try {
      await page.goto(`http://localhost:3000${p}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(1200);
      const file = path.join(outDir, `${slug}--${theme}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`  saved ${path.relative(process.cwd(), file)}`);
    } catch (e) {
      console.log(`  FAILED: ${String(e).slice(0, 200)}`);
    }
  }
  await context.close();
}

await browser.close();
