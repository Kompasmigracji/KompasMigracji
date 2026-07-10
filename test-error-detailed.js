const { chromium } = require('@playwright/test');

(async () => {
  console.log("Starting browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER ERROR] ${msg.text()}`);
    } else {
      console.log(`[BROWSER CONSOLE] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[PAGE UNHANDLED ERROR] ${error.message}`);
  });

  console.log("Navigating to http://localhost:3000/pl...");
  try {
    await page.goto('http://localhost:3000/pl', { waitUntil: 'networkidle' });
    console.log("Page loaded. Waiting for 3 seconds...");
    await page.waitForTimeout(3000);
    
    // Check if error boundary text is present
    const content = await page.content();
    if (content.includes("Ой, щось пішло не так!")) {
      console.log("[TEST] Found the error boundary text on the page!");
    } else {
      console.log("[TEST] Error boundary text NOT found.");
    }
  } catch (err) {
    console.log(`[NAVIGATION ERROR] ${err.message}`);
  }
  
  await browser.close();
  console.log("Done.");
})();
