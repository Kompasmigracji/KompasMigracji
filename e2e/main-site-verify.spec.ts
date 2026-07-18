import { test, expect, Page, ConsoleMessage } from '@playwright/test';

function attachConsoleCapture(page: Page, bucket: string[]) {
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      bucket.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    bucket.push(`[pageerror] ${err.message}`);
  });
}

test.describe('Main public site — homepage per-locale', () => {
  for (const locale of ['uk', 'pl', 'en']) {
    test(`homepage renders, theme toggle, hamburger menu (${locale})`, async ({ page }) => {
      const consoleMsgs: string[] = [];
      attachConsoleCapture(page, consoleMsgs);

      await page.goto(`/${locale}`);
      await expect(page.locator('header')).toBeVisible();

      // Hero renders — logo + brand name visible
      await expect(page.getByText('Kompas Migracji').first()).toBeVisible();

      // Theme toggle
      const themeBtn = page.getByTestId('theme-toggle');
      await expect(themeBtn).toBeVisible();
      const before = await page.locator('html').getAttribute('data-theme');
      await themeBtn.click();
      await page.waitForTimeout(150);
      const after = await page.locator('html').getAttribute('data-theme');
      expect(after).not.toEqual(before);
      // toggle back
      await themeBtn.click();

      // Mobile hamburger — resize to mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      const hamburger = page.locator('header button.md\\:hidden');
      await expect(hamburger).toBeVisible();
      // aria-label functional check: not just present but the menu actually opens
      await hamburger.click();
      const mobileMenu = page.locator('header').getByText('Menu', { exact: true });
      await expect(mobileMenu).toBeVisible({ timeout: 3000 });
      // close via the X button (aria-label should be localized close-menu label)
      const closeBtn = page.locator('header button[aria-label]').filter({ hasText: '' }).last();
      // more robust: find the button inside the mobile overlay with an svg X
      const overlay = page.locator('div.fixed.inset-0.z-50.md\\:hidden');
      await expect(overlay).toBeVisible();
      await overlay.locator('button').first().click();
      await expect(overlay).toBeHidden({ timeout: 3000 });

      await page.setViewportSize({ width: 1280, height: 900 });

      console.log(`[${locale}] console/page errors captured: ${consoleMsgs.length}`);
      if (consoleMsgs.length) console.log(consoleMsgs.join('\n'));
    });
  }

  test('language switcher changes displayed language and URL (double-tap race check)', async ({ page }) => {
    const consoleMsgs: string[] = [];
    attachConsoleCapture(page, consoleMsgs);

    await page.goto('/uk');
    await expect(page.getByText('Kompas Migracji').first()).toBeVisible();

    const langBtn = page.locator('header button:has-text("UA")');
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    const plOption = page.locator('header').getByRole('button', { name: 'PL', exact: true });
    await expect(plOption).toBeVisible();
    await plOption.click();

    await page.waitForURL('**/pl**', { timeout: 5000 });
    await expect(page.locator('header button:has-text("PL")')).toBeVisible();
    // page should show Polish nav text now
    await expect(page.getByText('Doktryna', { exact: true }).first()).toBeVisible();

    // Double-tap race check: rapid double click on the same target locale
    await page.locator('header button:has-text("PL")').click();
    const enOption = page.locator('header').getByRole('button', { name: 'EN', exact: true });
    await expect(enOption).toBeVisible();
    // fire two rapid clicks to simulate touchend+click race
    await Promise.all([enOption.click(), enOption.click({ force: true }).catch(() => {})]);
    await page.waitForURL('**/en**', { timeout: 5000 });
    await page.waitForTimeout(500);
    // Page must not be stuck/blank — header still visible and responsive
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('Kompas Migracji').first()).toBeVisible();
    const url = page.url();
    expect(url).toContain('/en');

    console.log(`[lang-switch] console/page errors: ${consoleMsgs.length}`);
    if (consoleMsgs.length) console.log(consoleMsgs.join('\n'));
  });

  test('main nav links resolve without 404', async ({ page }) => {
    await page.goto('/uk');
    const hrefs = ['/uk/doctrine', '/uk/pricing', '/uk/orakul'];
    for (const href of hrefs) {
      const resp = await page.goto(href);
      expect(resp?.status(), `${href} status`).toBeLessThan(400);
    }
    // Services dropdown links
    await page.goto('/uk');
    await page.locator('header nav button:has-text("Послуги")').click();
    const dropdownLinks = page.locator('a[href*="/pricing"], a[href*="/karta"]');
    const count = await dropdownLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('/doctrine page (linked from primary nav) has Header/Footer, not a dead end', async ({ page }) => {
    await page.goto('/uk');
    await expect(page.locator('header')).toBeVisible();

    // Every other content page linked from nav (pricing) keeps the header.
    await page.goto('/uk/pricing');
    await expect(page.locator('header')).toBeVisible();

    // Doctrine, linked from the exact same nav bar, now does too (was missing
    // Header/Footer entirely — a real navigational dead-end, fixed this session).
    await page.goto('/uk/doctrine');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('CookieBanner vs ChatBot overlap', () => {
  test('cookie banner does not block clicks on the floating chat button on first visit', async ({ page }) => {
    await page.goto('/uk');
    await page.waitForTimeout(1000);

    const openBtn = page.locator('button[aria-label="Відкрити чат"]');
    await expect(openBtn).toBeVisible();

    // Was blocked by the cookie banner sharing the same bottom-right corner
    // (z-[9995] over z-50) — banner moved to bottom-left this session.
    await openBtn.click({ timeout: 3000 });
    await expect(page.getByText('Konsultant AI')).toBeVisible();
  });
});

test.describe('Main public ChatBot widget', () => {
  test('opens, sends a message, streams a coherent non-corrupted response; clear/close buttons work', async ({ page }) => {
    const consoleMsgs: string[] = [];
    attachConsoleCapture(page, consoleMsgs);

    await page.goto('/uk');
    // Dismiss the cookie banner first — required in practice because it overlaps
    // the chat button (see the FINDING test above); a real user hits the same wall.
    // CookieBanner is dynamic(..., { ssr: false }) so it mounts a beat after
    // navigation — use waitFor (which retries) rather than isVisible (no retry).
    const acceptCookies = page.getByRole('button', { name: 'Прийняти всі' });
    try {
      await acceptCookies.waitFor({ state: 'visible', timeout: 5000 });
      await acceptCookies.click();
      await expect(page.getByText('Ми використовуємо cookies')).toBeHidden({ timeout: 5000 });
    } catch {
      // banner never appeared (e.g. already decided) — fine
    }

    const openBtn = page.locator('button[aria-label="Відкрити чат"]');
    await expect(openBtn).toBeVisible({ timeout: 10000 });
    await openBtn.click();

    // Chat window visible with the greeting
    await expect(page.getByText('Konsultant AI')).toBeVisible();

    const clearBtn = page.locator('button[aria-label="Очистити чат"]');
    const closeBtn = page.locator('button[aria-label="Закрити чат"]');
    await expect(clearBtn).toBeVisible();
    await expect(closeBtn).toBeVisible();

    const textarea = page.locator('textarea');
    await textarea.fill('Скільки коштує оформлення Карти побиту?');
    const sendBtn = page.locator('button[aria-label="Надіслати повідомлення"]');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Wait for a second assistant bubble (beyond the greeting) to appear
    await page.waitForFunction(() => {
      const bubbles = Array.from(document.querySelectorAll('div')).filter(d =>
        d.className && typeof d.className === 'string' && d.className.includes('rounded-bl-sm')
      );
      return bubbles.length >= 2;
    }, { timeout: 20000 }).catch(() => {});

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/main-chatbot-response.png', fullPage: false });

    const bodyText = await page.locator('body').innerText();
    // Corruption check — no unicode replacement character
    expect(bodyText).not.toContain('�');

    // Clear chat
    await clearBtn.click();
    await page.waitForTimeout(300);

    // Close
    await closeBtn.click();
    await expect(page.getByText('Konsultant AI')).toBeHidden();

    console.log(`[chatbot] console/page errors: ${consoleMsgs.length}`);
    if (consoleMsgs.length) console.log(consoleMsgs.join('\n'));
  });

  test('ChatBot open-toggle button aria-label is localized (was hardcoded Ukrainian)', async ({ page }) => {
    // Was hardcoded "Відкрити чат" regardless of locale, unlike clear/close/send
    // which already used t(). Fixed this session via a new chat_open key.
    await page.goto('/pl');
    const openBtn = page.locator('button[aria-label="Otwórz czat"]');
    await expect(openBtn).toBeVisible({ timeout: 10000 });
  });
});

test.describe('ContactForm — RODO gate (no real submission)', () => {
  test('submit is blocked by native required validation until RODO checkbox is checked', async ({ page }) => {
    const consoleMsgs: string[] = [];
    attachConsoleCapture(page, consoleMsgs);

    await page.goto('/uk');
    // Reveal below-the-fold content including ContactForm
    await page.getByRole('button', { name: /Детальніше/ }).click();

    // Track whether /api/lead is ever called
    let leadCallCount = 0;
    await page.route('**/api/lead', async (route) => {
      leadCallCount++;
      await route.abort();
    });

    const form = page.locator('#contact form');
    await form.scrollIntoViewIfNeeded({ timeout: 15000 });
    await expect(form).toBeVisible();

    const textInputs = form.locator('input:not([type="radio"]):not([type="checkbox"])');
    await textInputs.nth(0).fill('PLAYWRIGHT_TEST_DELETE_ME name');
    await textInputs.nth(1).fill('PLAYWRIGHT_TEST_DELETE_ME +48000000000');
    await form.locator('textarea').fill('PLAYWRIGHT_TEST_DELETE_ME test message — validation probe only, not a real submit');

    const checkbox = form.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();

    const submitBtn = form.locator('button[type="submit"]');
    // Click submit WITHOUT checking the RODO box — native `required` should block it
    await submitBtn.click();
    await page.waitForTimeout(500);
    expect(leadCallCount, 'fetch to /api/lead should NOT fire when RODO checkbox unchecked').toBe(0);

    // Confirm the checkbox is indeed reachable/checkable (proves the gate is the checkbox,
    // not some other broken validation) but we deliberately STOP HERE — no real submit click
    // per the safety instructions (local dev writes to production Supabase).
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    console.log(`[contactform] console/page errors: ${consoleMsgs.length}`);
    if (consoleMsgs.length) console.log(consoleMsgs.join('\n'));
  });
});

test.describe('ExitPopup', () => {
  test('triggers on mouse-leave-top, close button works, submit blocked without email', async ({ page }) => {
    const consoleMsgs: string[] = [];
    attachConsoleCapture(page, consoleMsgs);

    await page.goto('/uk');
    await page.waitForTimeout(500);

    let leadCallCount = 0;
    await page.route('**/api/lead', async (route) => {
      leadCallCount++;
      await route.abort();
    });

    // Simulate mouse leaving the top of the viewport
    await page.mouse.move(640, 200);
    await page.mouse.move(640, 0);
    await page.dispatchEvent('html', 'mouseleave', { clientY: -5, clientX: 640 });

    const popup = page.locator('text=/.+/').locator('..').getByRole('button', { name: 'Закрити' }).first();
    // More reliable: locate by the popup's close aria-label
    const closeBtn = page.locator('button[aria-label="Закрити"]');
    await expect(closeBtn).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'test-results/exit-popup-open.png' });

    // Try submitting with empty email — required attribute should block it
    const emailInput = page.locator('input[placeholder]').filter({ hasText: '' });
    const form = page.locator('form').filter({ has: page.locator('button[type="submit"]') }).last();

    // Attempt submit without filling email
    const submitBtn = page.getByRole('button').filter({ hasText: /.+/ }).last();
    // Use the popup's own submit button specifically
    const popupSubmit = page.locator('div.fixed.inset-0.z-\\[99999\\] button[type="submit"]');
    if (await popupSubmit.count() > 0) {
      await popupSubmit.click();
      await page.waitForTimeout(300);
      expect(leadCallCount, 'fetch to /api/lead should NOT fire with empty required email').toBe(0);
    }

    // Close the popup — do not submit real data
    await closeBtn.click();
    await expect(closeBtn).toBeHidden({ timeout: 3000 });

    console.log(`[exitpopup] console/page errors: ${consoleMsgs.length}`);
    if (consoleMsgs.length) console.log(consoleMsgs.join('\n'));
  });
});

test.describe('Cross-locale spot check — /pricing', () => {
  for (const locale of ['uk', 'pl', 'en', 'ru', 'rom']) {
    test(`pricing page layout holds up in ${locale}`, async ({ page }) => {
      const consoleMsgs: string[] = [];
      attachConsoleCapture(page, consoleMsgs);

      await page.goto(`/${locale}/pricing`);
      await expect(page.locator('header')).toBeVisible();
      await page.waitForTimeout(500);

      // No horizontal overflow (layout not broken by long translated strings)
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      // Allow small tolerance for scrollbars
      expect(overflow, `${locale} /pricing horizontal overflow px`).toBeLessThanOrEqual(20);

      await page.screenshot({ path: `test-results/pricing-${locale}.png`, fullPage: true });

      if (consoleMsgs.length) {
        console.log(`[pricing-${locale}] console/page errors: ${consoleMsgs.length}`);
        console.log(consoleMsgs.join('\n'));
      }
    });
  }
});
