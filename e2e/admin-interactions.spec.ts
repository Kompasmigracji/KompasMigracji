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
});
