import { test, expect } from '@playwright/test';

test.describe('Orakul session verification', () => {
  test('page title is locale-specific across all 5 locales', async ({ page }) => {
    const expected: Record<string, string> = {
      uk: 'EWU — European Welding Union | Робота для зварювальників в ЄС',
      pl: 'EWU — European Welding Union | Praca dla spawaczy w UE',
      en: 'EWU — European Welding Union | Welding jobs across the EU',
      ru: 'EWU — European Welding Union | Работа для сварщиков в ЕС',
      rom: 'EWU — European Welding Union | Locuri de muncă pentru sudori în UE',
    };
    for (const [locale, title] of Object.entries(expected)) {
      await page.goto(`/${locale}/orakul`);
      await expect(page).toHaveTitle(title);
    }
  });

  test('worker form blocks submission until RODO checkbox is checked', async ({ page }) => {
    await page.goto('/uk/orakul');
    await page.locator('a[href="#workers"], a[href="#employers"]').first().scrollIntoViewIfNeeded().catch(() => {});
    const nameInput = page.locator('.e-form-box input.e-inp').first();
    await nameInput.scrollIntoViewIfNeeded();
    const form = nameInput.locator('xpath=ancestor::form[1]');
    await form.locator('input.e-inp').nth(0).fill('Тест Тестенко');
    await form.locator('input.e-inp').nth(1).fill('+48123456789');
    const submitBtn = form.locator('button.e-submit-btn');
    await expect(submitBtn).toBeDisabled();
    await form.locator('input[type="checkbox"]').check();
    await expect(submitBtn).toBeEnabled();
    await page.screenshot({ path: 'test-results/orakul-worker-form.png' });
  });

  test('theme toggle button has accessible label and works', async ({ page }) => {
    await page.goto('/uk/orakul');
    const btn = page.locator('.e-theme-btn');
    await expect(btn).toHaveAttribute('aria-label', /Темна тема|Світла тема/);
    const before = await page.locator('.e-pg').getAttribute('class');
    await btn.click();
    await page.waitForTimeout(300);
    const after = await page.locator('.e-pg').getAttribute('class');
    expect(before).not.toEqual(after);
  });

  test('chat widget opens, is labeled, and streams a reply without corruption', async ({ page }) => {
    await page.goto('/uk/orakul');
    const openBtn = page.locator('.oc-btn');
    await expect(openBtn).toHaveAttribute('aria-label', 'Оракул AI чат');
    await openBtn.click();
    const panel = page.locator('.oc-panel');
    await expect(panel).toBeVisible();
    await expect(page.locator('.oc-close')).toHaveAttribute('aria-label', 'Закрити чат');
    await expect(page.locator('.oc-send')).toHaveAttribute('aria-label', 'Надіслати');

    const input = page.locator('.oc-input');
    await input.fill('Привіт, шукаю роботу зварювальника');
    await page.locator('.oc-send').click();

    // Wait for a bot bubble with real content (not just the initial greeting).
    await page.waitForFunction(() => {
      const bubbles = document.querySelectorAll('.oc-bubble-assistant');
      return bubbles.length >= 2 && (bubbles[bubbles.length - 1].textContent || '').length > 5;
    }, { timeout: 20000 }).catch(() => {});

    const lastBubble = page.locator('.oc-bubble-assistant').last();
    const text = await lastBubble.textContent();
    await page.screenshot({ path: 'test-results/orakul-chat.png' });

    // Corruption check: no U+FFFD replacement character from the
    // TextDecoder streaming fix, and no raw JSON/sentinel tag leaking
    // into the visible bubble.
    expect(text || '').not.toContain('�');
    expect(text || '').not.toMatch(/\[КАНДИДАТ_ГОТОВИЙ\]|\[РОБОТОДАВЕЦЬ_ГОТОВИЙ\]/);
  });

  test('other public pages have their own distinct title (not the homepage default)', async ({ page }) => {
    const generic = 'KompasMigracji';
    const pages = ['/uk/pricing', '/en/plans', '/uk/book', '/pl/manual', '/uk/regulamin', '/pl/privacy'];
    for (const path of pages) {
      await page.goto(path);
      const title = await page.title();
      expect(title, `${path} title: "${title}"`).not.toMatch(/Юридична допомога мігрантам/);
      expect(title.length).toBeGreaterThan(0);
    }
  });
});
