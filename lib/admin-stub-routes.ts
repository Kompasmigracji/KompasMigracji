/* lib/admin-stub-routes.ts — сторінки панелі, які ще не під'єднані до даних.
 *
 * Згенеровано перевіркою: сторінка потрапляє сюди, якщо у ній немає жодного
 * виклику fetch(). Таких 87 зі 117.
 *
 * Навіщо цей список. Сторінка-макет виглядає точно як робоча: та сама
 * верстка, ті самі заголовки таблиць, той самий порожній стан. Різниця лише
 * в тому, що вона нічого не питає в сервера. Менеджер, який відкриває
 * /admin/commissions і бачить порожню таблицю, робить висновок «комісій
 * немає» — хоча сторінка про них навіть не запитувала.
 *
 * Це вже коштувало реальних грошей: /admin/orders була такою самою
 * сторінкою і показувала нуль оплачених замовлень у той час, коли клієнт
 * заплатив 250 zł. Порожньо на екрані й порожньо в базі — не одне й те саме,
 * і система зобов'язана показувати різницю.
 *
 * Прибирати сторінку зі списку слід у тому ж коміті, у якому вона отримує
 * справжній запит до сервера.
 */
export const ADMIN_STUB_ROUTES: ReadonlySet<string> = new Set([
  "/admin/accounting",
  "/admin/affiliates",
  "/admin/ai-training",
  "/admin/analytics",
  "/admin/api-hub",
  "/admin/api-keys",
  "/admin/assets",
  "/admin/audit-log",
  "/admin/booking",
  "/admin/branches",
  "/admin/call-center",
  "/admin/calls",
  "/admin/campaigns",
  "/admin/chat",
  "/admin/cms",
  "/admin/commissions",
  "/admin/copilot",
  "/admin/currencies",
  "/admin/custom-fields",
  "/admin/customer-success",
  "/admin/data-import",
  "/admin/data-room",
  "/admin/doc-builder",
  "/admin/documents",
  "/admin/e-invoicing",
  "/admin/e-signatures",
  "/admin/email-sequences",
  "/admin/events",
  "/admin/expenses",
  "/admin/extensions",
  "/admin/feedback",
  "/admin/fleet",
  "/admin/forms",
  "/admin/franchise",
  "/admin/gamification",
  "/admin/goals",
  "/admin/gov-integration",
  "/admin/help-center",
  "/admin/housing",
  "/admin/hr",
  "/admin/hr-leave",
  "/admin/initiatives",
  "/admin/insurance",
  "/admin/integrations",
  "/admin/inventory",
  "/admin/invoices",
  "/admin/issues",
  "/admin/knowledge",
  "/admin/knowledge-base",
  "/admin/lead-routing",
  "/admin/leaderboard",
  "/admin/leads-finder",
  "/admin/legal",
  "/admin/livechat",
  "/admin/lms",
  "/admin/localization",
  "/admin/loyalty",
  "/admin/mailroom",
  "/admin/manual",
  "/admin/marketing",
  "/admin/messengers",
  "/admin/mobile-app",
  "/admin/monitoring",
  "/admin/ocr",
  "/admin/ocr-scanner",
  "/admin/partner-portal",
  "/admin/partners",
  "/admin/permissions",
  "/admin/playbooks",
  "/admin/products",
  "/admin/projects",
  "/admin/recruitment",
  "/admin/relationships",
  "/admin/reviews",
  "/admin/secure-links",
  "/admin/service-catalog",
  "/admin/sla",
  "/admin/social",
  "/admin/subscriptions",
  "/admin/team-chat",
  "/admin/tickets",
  "/admin/time-tracking",
  "/admin/timesheets",
  "/admin/transcripts",
  "/admin/translations",
  "/admin/wiki",
  "/admin/workflows",
]);

/** Чи є маршрут ще не під'єднаним макетом. */
export function isStubRoute(pathname: string): boolean {
  return ADMIN_STUB_ROUTES.has(pathname.replace(/\/$/, ""));
}
