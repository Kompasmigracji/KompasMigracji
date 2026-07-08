import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3001/uk...');
  await page.goto('http://localhost:3001/uk');
  
  console.log('Waiting 15 seconds to catch delayed errors...');
  await page.waitForTimeout(15000);
  
  await browser.close();
  console.log('Done.');
})();
