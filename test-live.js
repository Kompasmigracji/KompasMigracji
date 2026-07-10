const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]: ${error.message}`);
    console.log(error.stack);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[CONSOLE ERROR]: ${msg.text()}`);
    }
  });

  try {
    console.log("Navigating to https://kompasmigracji.com/pl...");
    await page.goto('https://kompasmigracji.com/pl', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
  } catch (e) {
    console.log("Goto error:", e);
  }
  
  await browser.close();
  console.log("Done.");
})();
