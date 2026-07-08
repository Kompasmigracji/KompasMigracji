import { chromium, devices } from 'playwright';

async function test(url, isMobile) {
  const browser = await chromium.launch();
  const context = await browser.newContext(isMobile ? devices['iPhone 12'] : {});
  const page = await context.newPage();
  
  let hasError = false;
  const prefix = isMobile ? 'MOBILE' : 'DESKTOP';
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      if (msg.type() === 'error' && msg.text().includes('load resource')) return;
      if (msg.type() === 'error') hasError = true;
      console.error(`${prefix} CONSOLE ${msg.type().toUpperCase()}:`, msg.text());
    }
  });
  
  page.on('pageerror', err => {
    hasError = true;
    console.error(`${prefix} PAGE ERROR:`, err.message);
  });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // wait a bit for hydration to settle
    await page.waitForTimeout(2000);
  } catch(e) {
    console.error(`${prefix} NAVIGATION ERROR:`, e.message);
    hasError = true;
  }
  
  await browser.close();
  return hasError;
}

(async () => {
  console.log('Testing Mobile...');
  const m1 = await test('http://localhost:3000/pl', true);
  console.log('Mobile has error:', m1);
  
  console.log('Testing Desktop...');
  const d1 = await test('http://localhost:3000/pl', false);
  console.log('Desktop has error:', d1);
  
  if (m1 || d1) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
