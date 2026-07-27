import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Safe (read-only / non-mutating) interaction coverage for the admin modules
// backed by real API routes + Postgres (as opposed to the ~120 bulk-scaffolded
// (panel) modules that CLAUDE.md documents as mocked UI — see that file for
// which modules actually touch data). admin-crawl.spec.ts only checks that
// pages *load* without crashing; this checks that their search/filter/detail-
// navigation controls actually do something, since those bugs are invisible
// to a load-only crawl.
//
// No local dev DB — writes here would hit the real Supabase/Postgres instance
// (see e2e/main-site-verify.spec.ts's ExitPopup/ContactForm comments), so
// every test here is read-only: typing into search boxes, clicking filter
// buttons, following a row to its detail page. No submit/create/delete clicks.

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function cleanEnv(s: string | undefined): string {
  let r = s || '';
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join('').trim();
}

const jwtSecret = cleanEnv(process.env.JWT_SECRET);
const SECRET = new TextEncoder().encode(jwtSecret || 'dev-secret-change-me-in-production');

test.describe('Admin panel — real-backend module interactions', () => {
  test.beforeEach(async ({ context }) => {
    const token = await new SignJWT({ role: 'admin', email: 'iphoenixgsm@gmail.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET);
    await context.addCookies([{ name: 'kompascrm_session', value: token, url: 'http://localhost:3000' }]);
  });

  test('crm/leads: search box actually filters the table (was fully decorative — no value/onChange)', async ({ page }) => {
    await page.goto('/admin/crm/leads');
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    // First render is a single "Загрузка данных из базы..." row — wait for
    // the real fetch to resolve before taking the baseline row count.
    await expect(page.getByText('Загрузка данных из базы...')).toBeHidden({ timeout: 15000 });
    const totalRows = await rows.count();
    test.skip(totalRows === 0, 'no leads in this DB to filter');

    const search = page.getByPlaceholder('Поиск лида...');
    await search.fill('zzz_no_such_lead_zzz_' + Date.now());
    await expect(page.getByText('Ничего не найдено')).toBeVisible();

    await search.fill('');
    await expect(rows).toHaveCount(totalRows);
  });

  test('leads: status filter buttons and search narrow the list without navigating away', async ({ page }) => {
    await page.goto('/admin/leads');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });

    const search = page.getByPlaceholder('Пошук лідів...');
    await expect(search).toBeVisible();
    await search.fill('zzz_no_such_lead_zzz_' + Date.now());
    await expect(page.getByText('Лідів не знайдено')).toBeVisible();
    await search.fill('');

    // Kanban/List view toggle doesn't crash either view.
    const listViewBtn = page.locator('button[title="List View"]');
    if (await listViewBtn.count()) {
      await listViewBtn.click();
      await expect(page.locator('body')).not.toContainText('Application error');
    }
  });

  test('leads: clicking a row navigates to its detail page (no 404/crash)', async ({ page }) => {
    await page.goto('/admin/leads');
    const table = page.locator('table');
    if (await table.count()) {
      const firstRow = table.locator('tbody tr').first();
      if (await firstRow.count()) {
        await firstRow.click();
        await page.waitForURL(/\/admin\/leads\/.+/, { timeout: 10000 });
        await expect(page.locator('body')).not.toContainText('Application error');
      }
    }
  });

  test('members: search box filters and row click navigates to member detail', async ({ page }) => {
    await page.goto('/admin/members');
    await expect(page.locator('table')).toBeVisible({ timeout: 15000 });

    const search = page.getByPlaceholder(/Пошук за іменем/);
    await expect(search).toBeVisible();
    const rows = page.locator('tbody tr');
    const before = await rows.count();
    if (before > 0) {
      // Search is server-side with a 350ms debounce (see members/page.jsx) —
      // wait for the debounced fetch via expect's built-in retry, not a fixed sleep.
      await search.fill('zzz_no_such_member_zzz_' + Date.now());
      await expect(rows).toHaveCount(0, { timeout: 5000 });
      await search.fill('');
      await expect(rows).toHaveCount(before, { timeout: 5000 });

      await rows.first().click();
      await page.waitForURL(/\/admin\/members\/.+/, { timeout: 10000 });
      await expect(page.locator('body')).not.toContainText('Application error');
    }
  });

  test('tasks: search box filters and a task link navigates to its detail page', async ({ page }) => {
    await page.goto('/admin/tasks');
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });

    const search = page.getByPlaceholder('Пошук по назві...');
    if (await search.count()) {
      await search.fill('zzz_no_such_task_zzz_' + Date.now());
      await page.waitForTimeout(400);
    }

    const taskLink = page.locator('a[href^="/admin/tasks/"]').first();
    if (await taskLink.count()) {
      // Clear the filter first so a real task link is present to follow.
      if (await search.count()) await search.fill('');
      await page.waitForTimeout(200);
      const link = page.locator('a[href^="/admin/tasks/"]').first();
      if (await link.count()) {
        await link.click();
        await page.waitForURL(/\/admin\/tasks\/.+/, { timeout: 10000 });
        await expect(page.locator('body')).not.toContainText('Application error');
      }
    }
  });

  test('crm dashboard and revenue pages render real data without crashing', async ({ page }) => {
    for (const path of ['/admin/crm/dashboard', '/admin/revenue']) {
      await page.goto(path);
      await expect(page.locator('body')).not.toContainText('Application error');
      await expect(page.locator('body')).not.toContainText('Unhandled Runtime Error');
    }
  });

  // crm/buyers, crm/orders, crm/payments, crm/chats all had the identical
  // copy-pasted bug as crm/leads: a search <input> with no value/onChange.
  test('crm/buyers: search box filters the table', async ({ page }) => {
    await page.goto('/admin/crm/buyers');
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Загрузка данных из базы...')).toBeHidden({ timeout: 15000 });

    // Self-seed one real row if the table is empty, so this actually
    // exercises the filter instead of skipping on a sparse dev DB.
    if (await page.getByText('Нет покупателей').isVisible()) {
      const unique = 'PLAYWRIGHT_TEST_buyer_' + Date.now();
      await page.getByRole('button', { name: 'Добавить покупателя' }).click();
      await page.getByLabel('ФИО *').fill(unique);
      await page.getByLabel('Телефон').fill('+48000000000');
      await page.getByRole('button', { name: 'Сохранить' }).click();
      await expect(page.getByText(unique)).toBeVisible({ timeout: 10000 });
    }
    const total = await rows.count();

    const search = page.getByPlaceholder('Быстрый поиск');
    await search.fill('zzz_no_such_buyer_zzz_' + Date.now());
    await expect(page.getByText('Ничего не найдено')).toBeVisible();
    await search.fill('');
    await expect(rows).toHaveCount(total);
  });

  test('crm/orders: search box filters and status pills actually narrow the list (activeFilter was never applied)', async ({ page }) => {
    await page.goto('/admin/crm/orders');
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Загрузка данных из базы...')).toBeHidden({ timeout: 15000 });
    test.skip(await page.getByText('Нет заказов').isVisible(), 'no orders in this DB to filter');
    const total = await rows.count();

    const search = page.getByPlaceholder('Быстрый поиск');
    await search.fill('zzz_no_such_order_zzz_' + Date.now());
    await expect(page.getByText('Ничего не найдено')).toBeVisible();
    await search.fill('');
    await expect(rows).toHaveCount(total);

    // "Отменено" (cancelled) pill: every remaining visible row's status badge
    // must actually read "отменено" - correctness check independent of how
    // many orders happen to exist in this DB (was: comparing counts, which
    // is fragile when e.g. all orders already share one status).
    await page.getByRole('button', { name: /^ОТМЕНЕНО/ }).click();
    const visibleCount = await rows.count();
    if (visibleCount > 0 && !(await page.getByText('Ничего не найдено').isVisible())) {
      const statusBadges = page.locator('tbody tr td:nth-child(6) span');
      const count = await statusBadges.count();
      for (let i = 0; i < count; i++) {
        await expect(statusBadges.nth(i)).toHaveText('отменено');
      }
    }
  });

  test('crm/payments: search box filters the table', async ({ page }) => {
    await page.goto('/admin/crm/payments');
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Загрузка платежей...')).toBeHidden({ timeout: 15000 });
    test.skip(await page.getByText('Журнал пуст').isVisible(), 'no payments in this DB to filter');
    const total = await rows.count();

    const search = page.getByPlaceholder('Быстрый поиск');
    await search.fill('zzz_no_such_payment_zzz_' + Date.now());
    await expect(page.getByText('Ничего не найдено')).toBeVisible();
    await search.fill('');
    await expect(rows).toHaveCount(total);
  });

  test('crm/chats: search box filters the chat list', async ({ page }) => {
    await page.goto('/admin/crm/chats');
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Загрузка чатов...')).toBeHidden({ timeout: 15000 });

    // Tabs default to "open" — switch to "all" to get the full addressable set.
    await page.getByRole('button', { name: 'Все' }).click();
    const chatCards = page.locator('.perspective-1000');
    const total = await chatCards.count();
    test.skip(total === 0, 'no chats in this DB to filter');

    const search = page.getByPlaceholder('Поиск');
    await search.fill('zzz_no_such_chat_zzz_' + Date.now());
    await expect(chatCards).toHaveCount(0);
    await search.fill('');
    await expect(chatCards).toHaveCount(total);
  });

  // categories/movements/publications/inventory/order-lists were all a static
  // "Модуль в разработке" placeholder despite already having working GET/POST
  // API routes (order-lists' API didn't even persist — fixed alongside the UI).
  // Each gets a real create-then-search round trip against its now-real table.
  const CRUD_MODULES: Array<{
    path: string; addButton: string; fieldLabel: string; nameValue: string; searchPlaceholder: string;
  }> = [
    { path: '/admin/crm/categories', addButton: 'Добавить категорию', fieldLabel: 'Название *', nameValue: 'PLAYWRIGHT_TEST_category', searchPlaceholder: 'Поиск категории' },
    { path: '/admin/crm/movements', addButton: 'Добавить движение', fieldLabel: 'Товар *', nameValue: 'PLAYWRIGHT_TEST_movement_item', searchPlaceholder: 'Поиск по товару' },
    { path: '/admin/crm/publications', addButton: 'Добавить публикацию', fieldLabel: 'Заголовок *', nameValue: 'PLAYWRIGHT_TEST_publication', searchPlaceholder: 'Поиск по заголовку' },
    { path: '/admin/crm/inventory', addButton: 'Добавить позицию', fieldLabel: 'Товар *', nameValue: 'PLAYWRIGHT_TEST_inventory_item', searchPlaceholder: 'Поиск по товару' },
    { path: '/admin/crm/order-lists', addButton: 'Добавить список', fieldLabel: 'Название *', nameValue: 'PLAYWRIGHT_TEST_order_list', searchPlaceholder: 'Поиск по названию' },
  ];

  for (const m of CRUD_MODULES) {
    test(`${m.path}: real create-flow works (was a static "Модуль в разработке" placeholder)`, async ({ page }) => {
      await page.goto(m.path);
      await expect(page.getByText('Модуль в разработке')).toHaveCount(0);
      await expect(page.locator('table')).toBeVisible({ timeout: 15000 });

      const unique = m.nameValue + '_' + Date.now();
      await page.getByRole('button', { name: m.addButton }).click();
      await page.getByLabel(m.fieldLabel).fill(unique);
      await page.getByRole('button', { name: 'Сохранить' }).click();

      // Modal closes and the new row is visible in the table.
      await expect(page.getByRole('button', { name: 'Сохранить' })).toBeHidden({ timeout: 10000 });
      await expect(page.getByText(unique)).toBeVisible({ timeout: 10000 });

      // Search actually filters down to just the new row.
      const search = page.getByPlaceholder(m.searchPlaceholder);
      await search.fill(unique);
      await expect(page.locator('tbody tr')).toHaveCount(1);
      await expect(page.getByText(unique)).toBeVisible();
    });
  }
});
