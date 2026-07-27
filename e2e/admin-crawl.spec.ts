import { test, expect, Page } from '@playwright/test';
import { SignJWT } from 'jose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Full read-only crawl of every app/admin page — regenerate the path list with:
//   find app/admin -type f \( -name "page.jsx" -o -name "page.tsx" -o -name "page.js" \) \
//     | sed -E 's#^app##; s#/\(panel\)##; s#/page\.(jsx|tsx|js)$##' | sed -E 's#^$#/admin#' | sort
// /admin/login and /admin/setup are excluded (unauthenticated / first-run flows,
// not part of the authenticated panel). Dynamic [id] routes use a real row id
// fetched from the DB so the page actually renders its detail view.

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function cleanEnv(s: string | undefined): string {
  let r = s || '';
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join('').trim();
}

const jwtSecret = cleanEnv(process.env.JWT_SECRET);
const SECRET = new TextEncoder().encode(jwtSecret || 'dev-secret-change-me-in-production');

async function adminCookie() {
  const token = await new SignJWT({ role: 'admin', email: 'iphoenixgsm@gmail.com' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
  return { name: 'kompascrm_session', value: token, url: 'http://localhost:3000' };
}

const ADMIN_PAGES: string[] = [
  '/admin', '/admin/2fa', '/admin/academy', '/admin/accounting', '/admin/affiliates',
  '/admin/agents', '/admin/ai-training', '/admin/analytics', '/admin/api-hub', '/admin/api-keys',
  '/admin/appointments', '/admin/assets', '/admin/audit', '/admin/audit-log', '/admin/automations',
  '/admin/automations/builder', '/admin/booking', '/admin/branches', '/admin/broadcasts',
  '/admin/call-center', '/admin/calls', '/admin/campaigns', '/admin/cases', '/admin/chat',
  '/admin/client-portal', '/admin/cms', '/admin/commissions', '/admin/content', '/admin/contracts',
  '/admin/copilot', '/admin/crm', '/admin/crm/ai-automations', '/admin/crm/ai-prompter',
  '/admin/crm/automation-test', '/admin/crm/bot-conversations', '/admin/crm/buyers', '/admin/crm/calls',
  '/admin/crm/categories', '/admin/crm/chats', '/admin/crm/dashboard', '/admin/crm/deals',
  '/admin/crm/efficiency', '/admin/crm/emails', '/admin/crm/ewu-candidates', '/admin/crm/funnels',
  '/admin/crm/history', '/admin/crm/inventory', '/admin/crm/jobs', '/admin/crm/leads',
  '/admin/crm/movements', '/admin/crm/order-lists', '/admin/crm/orders', '/admin/crm/payments',
  '/admin/crm/products', '/admin/crm/publications', '/admin/crm/reports', '/admin/crm/settings',
  '/admin/crm/settings/additional', '/admin/crm/settings/communications', '/admin/crm/settings/finances',
  '/admin/crm/settings/funnels', '/admin/crm/settings/general', '/admin/crm/settings/orders',
  '/admin/crm/settings/products', '/admin/crm/settings/roles', '/admin/crm/settings/sources',
  '/admin/crm/settings/users', '/admin/crm/tasks', '/admin/currencies', '/admin/custom-fields',
  '/admin/customer-success', '/admin/data-import', '/admin/data-room', '/admin/deals',
  '/admin/doc-builder', '/admin/documents', '/admin/e-invoicing', '/admin/e-signatures',
  '/admin/email-sequences', '/admin/emails', '/admin/enforcement', '/admin/events', '/admin/expenses',
  '/admin/extensions', '/admin/feedback', '/admin/finance', '/admin/fleet', '/admin/forms',
  '/admin/franchise', '/admin/gamification', '/admin/gdpr', '/admin/goals', '/admin/gov-integration',
  '/admin/help-center', '/admin/housing', '/admin/hr', '/admin/hr-leave', '/admin/initiatives',
  '/admin/insurance', '/admin/integrations', '/admin/inventory', '/admin/invoices', '/admin/issues',
  '/admin/knowledge', '/admin/knowledge-base', '/admin/lead-routing', '/admin/leaderboard',
  '/admin/leads', '/admin/leads-finder', '/admin/leads/ec951a0f-7493-46c2-9779-7b2b20c358de',
  '/admin/legal', '/admin/litigation', '/admin/livechat', '/admin/lms', '/admin/localization',
  '/admin/loyalty', '/admin/mailroom', '/admin/manual', '/admin/marketing', '/admin/me',
  '/admin/members', '/admin/members/931', '/admin/messengers', '/admin/mobile-app', '/admin/monitoring',
  '/admin/ocr', '/admin/ocr-scanner', '/admin/orders', '/admin/partner-portal', '/admin/partners',
  '/admin/permissions', '/admin/playbooks', '/admin/products', '/admin/projects', '/admin/recruitment',
  '/admin/referrals', '/admin/relationships', '/admin/reports', '/admin/revenue', '/admin/reviews',
  '/admin/rodo', '/admin/secure-links', '/admin/service-catalog', '/admin/settings', '/admin/sla',
  '/admin/social', '/admin/subscriptions', '/admin/tasks', '/admin/tasks/15', '/admin/team-chat',
  '/admin/templates', '/admin/tickets', '/admin/time-tracking', '/admin/timesheets',
  '/admin/transcripts', '/admin/translations', '/admin/wiki', '/admin/work-permits', '/admin/workers',
  '/admin/workers/932', '/admin/workflows',
];

// Split into fixed-size batches so Playwright's worker pool crawls them in parallel
// instead of one giant serial test (Next dev compiles each route on first hit).
function batch<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
const BATCHES = batch(ADMIN_PAGES, 14);

const IGNORABLE_CONSOLE = [
  /logo\.svg.*received null/i, // known dev-server image-optimizer cold-start noise
];

test.describe('Admin panel — full read-only crawl', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([await adminCookie()]);
  });

  for (let i = 0; i < BATCHES.length; i++) {
    const pages = BATCHES[i];
    test(`batch ${i + 1}/${BATCHES.length}: ${pages[0]} .. ${pages[pages.length - 1]}`, async ({ page }) => {
      test.setTimeout(180_000);

      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !IGNORABLE_CONSOLE.some((re) => re.test(msg.text()))) {
          consoleErrors.push(msg.text());
        }
      });

      for (const path of pages) {
        pageErrors.length = 0;
        consoleErrors.length = 0;

        let resp;
        try {
          resp = await page.goto(path, { waitUntil: 'networkidle', timeout: 30_000 });
        } catch (e) {
          expect.soft(false, `${path}: navigation failed — ${(e as Error).message}`).toBeTruthy();
          continue;
        }

        expect.soft(resp?.status() ?? 0, `${path}: HTTP status`).toBeLessThan(400);

        // Next.js dev error overlay / React error boundary crash markers.
        const bodyText = await page.locator('body').innerText().catch(() => '');
        const crashed = /Application error|Unhandled Runtime Error|This page could not be found/i.test(bodyText)
          && resp?.status() !== 404; // real 404s already caught by status check above
        expect.soft(crashed, `${path}: rendered a crash/error-boundary page`).toBeFalsy();

        expect.soft(pageErrors, `${path}: uncaught pageerror(s)`).toEqual([]);
        if (consoleErrors.length) {
          console.log(`[admin-crawl] ${path} console errors:\n  ${consoleErrors.join('\n  ')}`);
        }
      }
    });
  }
});
