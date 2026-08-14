const { chromium } = require('playwright');
const jwt = require('jose');
const path = require('path');
const OUT = 'C:\\Users\\user\\AppData\\Local\\Temp\\claude\\c--Users-user-Documents-GitHub-KompasMigracji\\eaf025ef-bc42-4f88-a7b4-5b468b8ae6db\\scratchpad';

async function makeToken() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me-in-production');
  return await new jwt.SignJWT({ role: 'admin', email: 'iphoenixgsm@gmail.com' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);
}

(async () => {
  const browser = await chromium.launch();
  const results = {};

  // --- 1. Public site: header hamburger + theme toggle at mobile width (regression check for 2xl:hidden) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('http://localhost:3000/uk', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(800);
    const hamburgerVisible = await page.locator('header button.2xl\\:hidden').isVisible().catch(() => false);
    await page.locator('header button.2xl\\:hidden').click();
    await page.waitForTimeout(500);
    const menuVisible = await page.locator('header').getByText('Menu', { exact: true }).isVisible().catch(() => false);
    results.publicHamburger = { hamburgerVisible, menuVisible, errs };
    await page.screenshot({ path: path.join(OUT, 'verify-mobile-menu.png') });
    await ctx.close();
  }

  // --- 2. Admin CRM: CommandPalette theme toggle (the actual bug fix) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await ctx.newPage();
    const token = await makeToken();
    await ctx.addCookies([{ name: 'kompascrm_session', value: token, domain: 'localhost', path: '/' }]);
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('http://localhost:3000/admin/crm/dashboard', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1200);
    const beforeTheme = await page.locator('html').getAttribute('data-theme');
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, 'verify-command-palette.png') });
    const themeAction = page.getByText(/Увімкнути (світлу|темну) тему/);
    const themeActionVisible = await themeAction.isVisible().catch(() => false);
    if (themeActionVisible) {
      await themeAction.click();
      await page.waitForTimeout(400);
    }
    const afterTheme = await page.locator('html').getAttribute('data-theme');
    results.commandPalette = { beforeTheme, afterTheme, themeActionVisible, errs, changed: beforeTheme !== afterTheme };
    await ctx.close();
  }

  // --- 3. Admin panel NAV: confirm new entries render + StubNotice shows for gdpr/finance ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
    const page = await ctx.newPage();
    const token = await makeToken();
    await ctx.addCookies([{ name: 'kompascrm_session', value: token, domain: 'localhost', path: '/' }]);
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('http://localhost:3000/admin', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1000);
    const navChecks = {};
    for (const label of ['Дошка Завдань', 'Співробітники', 'Журнал Дій (Audit)', 'Двофакторна Автентифікація', 'Дохід & Виручка', 'Автоматизації', 'Контент Порталу', 'Шаблони Повідомлень']) {
      navChecks[label] = await page.getByText(label, { exact: true }).isVisible().catch(() => false);
    }
    results.navEntries = { navChecks, errs };
    await page.screenshot({ path: path.join(OUT, 'verify-nav-sidebar.png'), fullPage: true });

    // visit /admin/gdpr and /admin/finance directly, confirm StubNotice appears
    for (const route of ['gdpr', 'finance', 'tasks', 'workers', 'audit', '2fa']) {
      const p2 = await ctx.newPage();
      const rerrs = [];
      p2.on('pageerror', e => rerrs.push(e.message));
      await p2.goto(`http://localhost:3000/admin/${route}`, { waitUntil: 'load', timeout: 60000 });
      await p2.waitForTimeout(800);
      const stubVisible = await p2.getByText(/демо|mock|заглушк|stub/i).first().isVisible().catch(() => false);
      results[`route_${route}`] = { pageErrors: rerrs, stubNoticeLikelyVisible: stubVisible };
      await p2.close();
    }
    await ctx.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
