# Original User Request

## Initial Request — 2026-06-10T02:20:07+02:00

Add 21 new automation engine modules to KompasCRM, each performing a distinct, complex, and highly profitable management automation function.

Working directory: c:\Users\user\Documents\GitHub\KompasMigracji
Integrity mode: development

## Requirements

### R1. Registration of 21 New Active Modules
Add the following 21 inactive modules to the navigation menu (`NAV` array inside `lib/rbac.js`) so that they are active, authorized, and visible in the sidebar navigation for `admin` and `moderator` roles:
1. **Booking & Scheduling** (`/admin/booking`, icon: `clock`)
2. **Broadcast Campaigns** (`/admin/broadcasts`, icon: `send`)
3. **Call Center Dialer** (`/admin/call-center`, icon: `phone`)
4. **Client Portal Manager** (`/admin/client-portal`, icon: `users`)
5. **AI Copilot Console** (`/admin/copilot`, icon: `cpu`)
6. **Currencies & NBP Sync** (`/admin/currencies`, icon: `refresh`)
7. **CSV/Excel Data Import** (`/admin/data-import`, icon: `upload`)
8. **Bilingual Document Builder** (`/admin/doc-builder`, icon: `file-text`)
9. **E-Signatures Center** (`/admin/e-signatures`, icon: `edit`)
10. **Email Drip Sequences** (`/admin/email-sequences`, icon: `inbox`)
11. **Expenses & VAT Scanner** (`/admin/expenses`, icon: `cash`)
12. **Custom Forms Builder** (`/admin/forms`, icon: `layers`)
13. **Gov.pl API Gateway** (`/admin/gov-integration`, icon: `shield`)
14. **HR Leave Requests** (`/admin/hr-leave`, icon: `user`)
15. **Leads Scraper Finder** (`/admin/leads-finder`, icon: `search`)
16. **Live Chat Console** (`/admin/livechat`, icon: `message-square`)
17. **Loyalty & Cashback** (`/admin/loyalty`, icon: `award`)
18. **Automation Playbooks** (`/admin/playbooks`, icon: `clipboard`)
19. **Service Catalog Checkout** (`/admin/service-catalog`, icon: `grid`)
20. **Subscriptions billing** (`/admin/subscriptions`, icon: `card`)
21. **IFTTT Workflows Builder** (`/admin/workflows`, icon: `zap`)

### R2. Complete Implementation of Automation Engines
For each of the 21 modules, modernize the corresponding `page.jsx` file under `app/admin/(panel)/[module-name]/page.jsx`:
- Ensure all pages load cleanly without runtime or undefined variable reference errors.
- Ensure the UI conforms to the premium aesthetics, styling variables, and layout classes.
- Use core library UI components (`StatCard`, `ProgressBar`, `DataTable`, `EmptyState`, `SearchInput`) for user interaction and data display.
- Design realistic mock automation states (e.g. active queues, connection statuses, API response triggers, configuration forms) so they act as complete management engine mockups.

## Acceptance Criteria

### Technical Validation
- [ ] All 21 modules are declared in `lib/rbac.js` and successfully rendered in the sidebar.
- [ ] No `no-undef` errors exist in any of the 21 updated `page.jsx` files.
- [ ] Production build (`pnpm build`) completes successfully.

## Follow-up — 2026-06-10T00:40:24Z

The user has updated the goal for the 2-hour development cycle:
1. Ensure all 121 modules (including the 21 new ones) are visually complete and premium.
2. Incorportate a "live" AI Agent helper console, telemetry logs, or status logs inside every module page that represents the autonomous agent running that module. This makes each section feel "alive" and self-optimizing.
Please update the requirements and direct the agent team to implement these helper panels/logs consoles.

