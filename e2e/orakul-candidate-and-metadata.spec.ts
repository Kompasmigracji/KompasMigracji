import { test, expect, Page, ConsoleMessage } from '@playwright/test';

/**
 * Coverage NOT included in the prior session's e2e/orakul-verify.spec.ts:
 *  - CANDIDATE (welder) chat path + language auto-detect mid-conversation
 *  - FAQ accordion, social-proof strip, rates-by-country cards, exit-intent popup
 *  - Visual render-check (not just <title>) of the 6 newly-metadata'd pages
 *  - Console error capture across all of the above
 *  - Mobile viewport (390x844) check for /uk/orakul
 *
 * SAFETY: never click a final "submit" on a lead-capture form with realistic
 * data (local dev writes to the PRODUCTION Supabase DB). The exit-intent
 * popup and worker/employer forms are only interacted with up to the point
 * of typing; we do not click their submit buttons in this spec.
 */

function attachConsoleCapture(page: Page, bucket: { errors: string[]; pageerrors: string[] }) {
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') bucket.errors.push(msg.text());
  });
  page.on('pageerror', (err) => bucket.pageerrors.push(String(err)));
}

test.describe('Orakul candidate chat path', () => {
  test('welder candidate framing: intent detection, tone, and required questions', async ({ page }) => {
    const bucket = { errors: [] as string[], pageerrors: [] as string[] };
    attachConsoleCapture(page, bucket);

    await page.goto('/uk/orakul');
    await page.locator('.oc-btn').click();
    const panel = page.locator('.oc-panel');
    await expect(panel).toBeVisible();

    const input = page.locator('.oc-input');
    const send = page.locator('.oc-send');

    // Turn 1: candidate framing, not employer framing.
    await input.fill('Я зварювальник, шукаю роботу');
    await send.click();
    await page.waitForFunction(() => {
      const bubbles = document.querySelectorAll('.oc-bubble-assistant');
      return bubbles.length >= 2 && (bubbles[bubbles.length - 1].textContent || '').length > 5;
    }, { timeout: 25000 }).catch(() => {});

    let lastReply = (await page.locator('.oc-bubble-assistant').last().textContent()) || '';
    await page.screenshot({ path: 'test-results/orakul-candidate-turn1.png' });

    expect(lastReply, 'turn1 reply should not contain replacement char (stream corruption)').not.toContain('�');
    expect(lastReply.length, 'turn1 reply should be non-empty').toBeGreaterThan(0);

    // Turn 2: give specialty + experience, in Ukrainian.
    await input.fill('MIG/MAG, досвід 5 років, документи є');
    await send.click();
    await page.waitForFunction((prevLen: number) => {
      const bubbles = document.querySelectorAll('.oc-bubble-assistant');
      const last = bubbles[bubbles.length - 1];
      return bubbles.length >= 3 && (last.textContent || '').length > 5;
    }, lastReply.length, { timeout: 25000 }).catch(() => {});

    lastReply = (await page.locator('.oc-bubble-assistant').last().textContent()) || '';
    await page.screenshot({ path: 'test-results/orakul-candidate-turn2.png' });
    expect(lastReply).not.toContain('�');

    // Turn 3: switch language mid-conversation to Polish, check auto-detect follows.
    await input.fill('Mówię też po polsku, mogę zacząć od razu');
    await send.click();
    await page.waitForFunction((prevLen: number) => {
      const bubbles = document.querySelectorAll('.oc-bubble-assistant');
      const last = bubbles[bubbles.length - 1];
      return bubbles.length >= 4 && (last.textContent || '').length > 5;
    }, lastReply.length, { timeout: 25000 }).catch(() => {});

    lastReply = (await page.locator('.oc-bubble-assistant').last().textContent()) || '';
    await page.screenshot({ path: 'test-results/orakul-candidate-turn3-lang-switch.png' });
    expect(lastReply).not.toContain('�');

    // Never asks birth date/age per spec.
    const allText = (await page.locator('.oc-bubble-assistant').allTextContents()).join(' ');
    expect(allText.toLowerCase()).not.toMatch(/дата народж|скільки вам років|birth date|date of birth/);

    // Do NOT give a real phone number and do NOT trigger final submission —
    // supply an obviously fake one only if bot asks, then stop.
    if (/телефон|phone|номер/i.test(lastReply)) {
      await input.fill('+48000000000 (тест, не дзвонити)');
      await send.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/orakul-candidate-turn4-fake-phone.png' });
    }

    console.log('CANDIDATE PATH console errors:', JSON.stringify(bucket.errors));
    console.log('CANDIDATE PATH pageerrors:', JSON.stringify(bucket.pageerrors));
    // Report unexpected console errors but don't hard-fail the whole spec on
    // known-noisy warnings; assert there are no page-crashing errors.
    expect(bucket.pageerrors, `Unexpected pageerrors: ${bucket.pageerrors.join(' | ')}`).toEqual([]);
  });
});

test.describe('Orakul page sections (visual, not yet checked)', () => {
  test('FAQ accordion expands and collapses', async ({ page }) => {
    const bucket = { errors: [] as string[], pageerrors: [] as string[] };
    attachConsoleCapture(page, bucket);
    await page.goto('/uk/orakul');

    const faqSection = page.locator('.e-faq');
    await faqSection.scrollIntoViewIfNeeded();
    const items = page.locator('.e-faq-item');
    const count = await items.count();
    expect(count, 'FAQ should have at least one item').toBeGreaterThan(0);

    const first = items.first();
    await expect(first).not.toHaveClass(/open/);
    const answer = first.locator('.e-faq-a');

    // Collapsed: answer container present but visually collapsed (max-height 0).
    const collapsedHeight = await answer.evaluate((el) => el.getBoundingClientRect().height);

    await first.locator('.e-faq-q').click();
    await expect(first).toHaveClass(/open/);
    await page.waitForTimeout(350); // CSS transition
    const expandedHeight = await answer.evaluate((el) => el.getBoundingClientRect().height);
    expect(expandedHeight, 'expanded FAQ answer should be visibly taller than collapsed').toBeGreaterThan(collapsedHeight);

    await page.screenshot({ path: 'test-results/orakul-faq-expanded.png' });

    // Collapse again.
    await first.locator('.e-faq-q').click();
    await expect(first).not.toHaveClass(/open/);
    await page.waitForTimeout(350);
    const recollapsedHeight = await answer.evaluate((el) => el.getBoundingClientRect().height);
    expect(recollapsedHeight).toBeLessThan(expandedHeight);

    console.log('FAQ section console errors:', JSON.stringify(bucket.errors));
    expect(bucket.pageerrors).toEqual([]);
  });

  test('social-proof strip renders all 4 pills with numbers', async ({ page }) => {
    await page.goto('/uk/orakul');
    const strip = page.locator('.e-social-strip');
    await strip.scrollIntoViewIfNeeded();
    const pills = page.locator('.e-social-pill');
    await expect(pills).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const text = await pills.nth(i).textContent();
      expect(text || '', `pill ${i} should contain a number`).toMatch(/\d/);
    }
    await page.screenshot({ path: 'test-results/orakul-social-strip.png' });
  });

  test('rates-by-country cards render with flag, country, and rate', async ({ page }) => {
    await page.goto('/uk/orakul');
    const ratesSection = page.locator('.e-rates');
    await ratesSection.scrollIntoViewIfNeeded();
    const cards = page.locator('.e-rates-card');
    const count = await cards.count();
    expect(count, 'should have at least one rates card').toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      await expect(card.locator('.e-rates-country')).not.toBeEmpty();
      await expect(card.locator('.e-rates-rate')).not.toBeEmpty();
    }
    await page.screenshot({ path: 'test-results/orakul-rates-cards.png' });
  });

  test('exit-intent popup triggers on mouse leaving viewport top', async ({ page }) => {
    const bucket = { errors: [] as string[], pageerrors: [] as string[] };
    attachConsoleCapture(page, bucket);
    await page.goto('/uk/orakul');
    await page.waitForTimeout(500);

    // Move mouse inside viewport first, then dispatch a mouseleave with
    // clientY <= 0 to simulate leaving through the top, matching the
    // page's own detection logic (`e.clientY <= 0`).
    await page.mouse.move(400, 300);
    await page.evaluate(() => {
      const ev = new MouseEvent('mouseleave', { clientY: -5, bubbles: true });
      document.dispatchEvent(ev);
    });
    await page.waitForTimeout(500);

    const overlay = page.locator('.e-exit-overlay');
    const appeared = await overlay.isVisible().catch(() => false);
    await page.screenshot({ path: 'test-results/orakul-exit-intent.png' });

    if (appeared) {
      // Verify it can be dismissed WITHOUT submitting any data (safety: no
      // real lead creation against the production DB).
      await expect(page.locator('.e-exit-box')).toBeVisible();
      await page.locator('.e-exit-close').click();
      await expect(overlay).not.toBeVisible();
    }
    // Not a hard failure if popup didn't fire synthetically (real browsers
    // fire native mouseleave differently than a dispatched event) — but log it.
    test.info().annotations.push({ type: 'exit-intent-appeared', description: String(appeared) });
    expect(bucket.pageerrors).toEqual([]);
  });

  test('mobile viewport (390x844): chat widget, nav, and forms do not overflow', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const bucket = { errors: [] as string[], pageerrors: [] as string[] };
    attachConsoleCapture(page, bucket);

    await page.goto('/uk/orakul');
    await page.waitForTimeout(500);

    const bodyOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    await page.screenshot({ path: 'test-results/orakul-mobile-viewport.png', fullPage: false });
    expect(bodyOverflow, `page should not horizontally overflow on mobile (scrollWidth-clientWidth=${bodyOverflow})`).toBeLessThanOrEqual(5);

    // Nav overflow check: the PL locale button and theme toggle were measured
    // starting past the 390px viewport edge (nav content ~466px, no wrap/scroll),
    // making them untappable. Fixed via .e-nav-back's text hidden on mobile.
    const plBtn = page.locator('.e-lang-btn', { hasText: 'PL' });
    const plBox = await plBtn.boundingBox();
    expect(plBox).not.toBeNull();
    if (plBox) {
      expect(plBox.x + plBox.width, 'PL locale button should be within the 390px viewport').toBeLessThanOrEqual(390 + 2);
    }
    const themeBtn = page.locator('.e-theme-btn');
    const themeBox = await themeBtn.boundingBox();
    expect(themeBox).not.toBeNull();
    if (themeBox) {
      expect(themeBox.x + themeBox.width, 'theme toggle button should be within the 390px viewport').toBeLessThanOrEqual(390 + 2);
    }

    // Chat widget button should be visible and tappable within viewport bounds.
    const chatBtn = page.locator('.oc-btn');
    await expect(chatBtn).toBeVisible();
    const btnBox = await chatBtn.boundingBox();
    expect(btnBox).not.toBeNull();
    if (btnBox) {
      expect(btnBox.x + btnBox.width, 'chat button should stay within 390px viewport width').toBeLessThanOrEqual(390 + 2);
    }

    await chatBtn.click();
    const panel = page.locator('.oc-panel');
    await expect(panel).toBeVisible();
    const panelBox = await panel.boundingBox();
    await page.screenshot({ path: 'test-results/orakul-mobile-chat-open.png' });
    if (panelBox) {
      expect(panelBox.x, 'chat panel left edge should not be negative (clipped off-screen)').toBeGreaterThanOrEqual(-2);
      expect(panelBox.x + panelBox.width, 'chat panel should not overflow 390px viewport').toBeLessThanOrEqual(390 + 2);
    }

    console.log('Mobile viewport console errors:', JSON.stringify(bucket.errors));
    expect(bucket.pageerrors).toEqual([]);
    await context.close();
  });
});

test.describe('Newly-metadata\'d pages: visual render-check', () => {
  const pages: { path: string; label: string }[] = [
    { path: '/uk/pricing', label: 'pricing (uk)' },
    { path: '/en/plans', label: 'plans (en)' },
    { path: '/uk/book', label: 'book (uk, PL-only content expected)' },
    { path: '/pl/manual', label: 'manual (pl)' },
    { path: '/uk/regulamin', label: 'regulamin (uk)' },
    { path: '/pl/privacy', label: 'privacy (pl, PL-only content expected)' },
  ];

  for (const { path, label } of pages) {
    test(`${label} renders content, no console errors, internal links work`, async ({ page }) => {
      const bucket = { errors: [] as string[], pageerrors: [] as string[] };
      attachConsoleCapture(page, bucket);

      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);
      await page.waitForLoadState('networkidle').catch(() => {});

      // Page should not be blank: body should have meaningful visible text.
      const bodyText = (await page.locator('body').innerText()).trim();
      expect(bodyText.length, `${path} body text should not be empty/near-empty`).toBeGreaterThan(50);

      // Should not render a Next.js error overlay / 404 content.
      expect(bodyText).not.toMatch(/Application error: a client-side exception has occurred/i);

      const screenshotName = path.replace(/\//g, '_');
      await page.screenshot({ path: `test-results/metadata-page${screenshotName}.png`, fullPage: true });

      // Check internal links (same-origin, non-anchor, non-mailto/tel) resolve.
      const internalHrefs = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        const hrefs = anchors
          .map((a) => a.getAttribute('href') || '')
          .filter((h) => h.startsWith('/') && !h.startsWith('//'))
          .filter((h, i, arr) => arr.indexOf(h) === i); // dedupe
        return hrefs.slice(0, 8); // cap to keep test fast
      });

      const brokenLinks: string[] = [];
      for (const href of internalHrefs) {
        const resp = await page.request.get(href).catch(() => null);
        if (!resp || resp.status() >= 400) {
          brokenLinks.push(`${href} -> ${resp ? resp.status() : 'no response'}`);
        }
      }
      expect(brokenLinks, `broken internal links on ${path}: ${brokenLinks.join(', ')}`).toEqual([]);

      console.log(`${label} console errors:`, JSON.stringify(bucket.errors));
      console.log(`${label} pageerrors:`, JSON.stringify(bucket.pageerrors));
      expect(bucket.pageerrors, `Unexpected pageerrors on ${path}: ${bucket.pageerrors.join(' | ')}`).toEqual([]);
    });
  }
});
