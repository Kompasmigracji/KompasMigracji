import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 12']
  });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000/');
    await new Promise(r => setTimeout(r, 3000));
    console.log('Test finished');
  } catch (e) {
    console.error('Script error:', e);
  } finally {
    await browser.close();
  }
})();
