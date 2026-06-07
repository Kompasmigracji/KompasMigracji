import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local to get the same JWT_SECRET as Next.js dev server
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function cleanEnv(s: string | undefined): string {
  let r = s || '';
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join('').trim();
}

const jwtSecret = cleanEnv(process.env.JWT_SECRET);
const SECRET = new TextEncoder().encode(jwtSecret || 'dev-secret-change-me-in-production');

async function createMockToken() {
  return await new SignJWT({ role: 'admin', email: 'iphoenixgsm@gmail.com' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

test.describe('Agents Dashboard E2E', () => {
  test.beforeEach(async ({ context, page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // 1. Set the admin cookie so the next-intl/auth middleware passes through
    const token = await createMockToken();
    await context.addCookies([
      {
        name: 'kompascrm_session',
        value: token,
        url: 'http://localhost:3000',
      },
    ]);

    // 2. Mock API routes
    await page.route('**/api/agents/primus/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          agents: [
            { id: '1', name: 'UI/UX Polisher', role: 'ui_ux', status: 'idle', last_heartbeat: new Date().toISOString() },
            { id: '2', name: 'DevOps Agent', role: 'devops', status: 'busy', last_heartbeat: new Date().toISOString() },
          ],
        }),
      });
    });

    await page.route('**/api/agents/primus/dispatch', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route('**/api/god/command', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Command dispatched' }),
      });
    });
  });

  test('should render the GodCard and AgentCards correctly', async ({ page }) => {
    await page.goto('/admin/agents');
    console.log('E2E TEST URL AFTER GOTO:', page.url());

    // Wait for header to be visible
    await expect(page.locator('h1')).toContainText('Primus — Панель Агентов');

    // Check GodCard is visible
    await expect(page.locator('text=Grand Architect Oleksandr Khrysytodul')).toBeVisible();

    // Check both agents are rendered
    await expect(page.locator('text=UI/UX Polisher')).toBeVisible();
    await expect(page.locator('text=DevOps Agent')).toBeVisible();
  });

  test('should dispatch motivation when clicking Motivate button', async ({ page }) => {
    await page.goto('/admin/agents');

    let dispatchCalled = false;
    await page.route('**/api/agents/primus/dispatch', async (route) => {
      const payload = route.request().postDataJSON();
      expect(payload.type).toBe('motivate');
      dispatchCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Click motivate on first card
    const motivateBtn = page.locator('text=Мотивировать').first();
    await motivateBtn.click();

    expect(dispatchCalled).toBe(true);
  });

  test('should dispatch scaling command when clicking Scale button', async ({ page }) => {
    await page.goto('/admin/agents');

    let scaleCalled = false;
    await page.route('**/api/god/command', async (route) => {
      const payload = route.request().postDataJSON();
      expect(payload.command).toBe('scale');
      scaleCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Command dispatched' }),
      });
    });

    const scaleBtn = page.locator('text=Запустить масштабирование');
    await scaleBtn.click();

    expect(scaleCalled).toBe(true);
  });
});
