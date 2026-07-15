import { chromium, devices } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:3000/pl');
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync('client.html', html);
  await browser.close();
  console.log('Saved client.html');
})();
