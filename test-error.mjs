import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/pl');
  
  // wait for nextjs error overlay
  try {
    await page.waitForSelector('nextjs-portal', { timeout: 10000 });
    const shadowHost = await page.$('nextjs-portal');
    const html = await page.evaluate(el => el.shadowRoot.innerHTML, shadowHost);
    console.log('Error overlay HTML:', html);
  } catch(e) {
    console.log('No error overlay found');
  }
  
  await browser.close();
})();
