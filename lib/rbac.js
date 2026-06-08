/* KompasCRM — роли, права, навигация. */

export const ROLE_LABEL = {
  admin: "Адміністратор",
  moderator: "Модератор",
  member: "Учасник профспілки",
};

/* Пункти меню. Кожен видно тільки вказаним ролям. */
export const NAV = [
  { href: "/admin",              label: "Дашборд",             icon: "grid",     roles: ["admin", "moderator"] },
  { href: "/admin/analytics",    label: "Аналітика & Звіти",   icon: "pie-chart",roles: ["admin", "manager"] },
  { href: "/admin/social",       label: "Соцмережі & SMM",     icon: "instagram",roles: ["admin", "manager"] },
  { href: "/admin/goals",        label: "Цілі & OKR",          icon: "target",   roles: ["admin", "manager"] },
  { href: "/admin/assets",       label: "Майно та IT-техніка", icon: "laptop",   roles: ["admin", "manager"] },
  { href: "/admin/expenses",     label: "Витрати & Чеки",      icon: "credit-card",roles: ["admin", "manager"] },
  { href: "/admin/fleet",        label: "Автопарк & Рейси",    icon: "truck",    roles: ["admin", "manager", "driver"] },
  { href: "/admin/legal",        label: "Юридичні Справи",     icon: "briefcase",roles: ["admin", "manager", "lawyer"] },
  { href: "/admin/recruitment",  label: "Рекрутинг & Найм",    icon: "briefcase",roles: ["admin", "manager"] },
  { href: "/admin/housing",      label: "Житло & Оренда",      icon: "home",     roles: ["admin", "manager"] },
  { href: "/admin/transcripts",  label: "AI Аналіз Дзвінків",  icon: "mic",      roles: ["admin", "manager"] },
  { href: "/admin/invoices",     label: "Рахунки & Оплата",    icon: "dollar-sign", roles: ["admin", "manager"] },
  { href: "/admin/monitoring",   label: "Статус Системи",      icon: "activity", roles: ["admin", "developer"] },
  { href: "/admin/cms",          label: "Сайт & Блог (CMS)",   icon: "layout",   roles: ["admin", "manager", "editor"] },
  { href: "/admin/partners",     label: "Партнери & Афіліати", icon: "link",     roles: ["admin", "manager"] },
  { href: "/admin/marketing",    label: "Маркетинг & Email",   icon: "mail",     roles: ["admin", "manager"] },
  { href: "/admin/hr",           label: "Команда & HR",        icon: "users",    roles: ["admin", "manager"] },
  { href: "/admin/ai-training",  label: "Навчання ШІ",         icon: "cpu",      roles: ["admin", "manager"] },
  { href: "/admin/members",      label: "Учасники профспiлки", icon: "users",    roles: ["admin", "moderator"] },
  { href: "/admin/tasks",          label: "Задачі & Проекти",    icon: "check",    roles: ["admin", "manager", "user"] },
  { href: "/admin/issues",         label: "Баг-трекер",          icon: "alert-triangle", roles: ["admin", "developer", "manager"] },
  { href: "/admin/lms",            label: "Академія & Курси",    icon: "book-open",roles: ["admin", "manager"] },
  { href: "/admin/inventory",      label: "Товари & Склад",      icon: "box",      roles: ["admin", "manager"] },
  { href: "/admin/documents",      label: "Документи & Підписи", icon: "file-text",roles: ["admin", "manager", "user"] },
  { href: "/admin/forms",          label: "Форми & Опитування",  icon: "layout",   roles: ["admin", "manager"] },
  { href: "/admin/tickets",        label: "Служба Підтримки",    icon: "message-square", roles: ["admin", "manager"] },
  { href: "/admin/knowledge-base", label: "База Знань & FAQ",    icon: "book-open", roles: ["admin", "manager", "user"] },
  { href: "/admin/calls",          label: "Кол-центр",           icon: "phone",    roles: ["admin", "manager", "user"] },
  { href: "/admin/gamification",   label: "Гейміфікація",        icon: "award",    roles: ["admin", "manager", "user"] },
  { href: "/admin/cases",          label: "Справи клієнтів",     icon: "folder",   roles: ["admin", "manager", "user"] },
  { href: "/admin/workers",      label: "Канбан",              icon: "clipboard", roles: ["admin", "moderator"] },
  { href: "/admin/templates",    label: "Шаблони",             icon: "layers",   roles: ["admin", "moderator"] },
  { href: "/admin/broadcasts",     label: "Розсилки",            icon: "send",       roles: ["admin"] },
  { href: "/admin/referrals",      label: "Реферали",            icon: "link",       roles: ["admin"] },
  { href: "/admin/revenue",        label: "Доходи & MRR",        icon: "cash",       roles: ["admin"] },
  { href: "/admin/subscriptions",  label: "Підписки",            icon: "refresh",    roles: ["admin"] },
  { href: "/admin/appointments",   label: "Записи",              icon: "briefcase",  roles: ["admin", "moderator"] },
  { href: "/admin/content",        label: "Контент сайту",       icon: "file",       roles: ["admin"] },
  { href: "/admin/me",             label: "Мiй кабiнет",         icon: "user",     roles: ["member"] },
  { href: "/admin/emails",         label: "Пошта (Inbox)",       icon: "inbox",    roles: ["admin", "moderator"] },
  { href: "/admin/chat",           label: "Внутрішній Чат",      icon: "user",     roles: ["admin", "moderator"] },
  { href: "/admin/projects",       label: "Agile Проекти",       icon: "clipboard",roles: ["admin", "moderator"] },
  { href: "/admin/products",       label: "Товари & Склад",      icon: "briefcase",roles: ["admin", "moderator"] },
  { href: "/admin/orders",         label: "Замовлення",          icon: "cash",     roles: ["admin", "moderator"] },
  { href: "/admin/lms",            label: "Академія (LMS)",      icon: "book",     roles: ["admin", "moderator"] },
  { href: "/admin/knowledge",      label: "База Знань & AI",     icon: "target",   roles: ["admin", "moderator"] },
  { href: "/admin/secure-links",   label: "Захищені Посилання",  icon: "link",     roles: ["admin"] },
  { href: "/admin/extensions",     label: "Плагіни (Marketplace)",icon: "grid",     roles: ["admin"] },
  { href: "/admin/api-keys",       label: "API & Webhooks",      icon: "key",      roles: ["admin"] },
  { href: "/admin/initiatives",    label: "Соціальні Проекти",   icon: "heart",    roles: ["admin", "moderator"] },
  { href: "/admin/automations",    label: "Автоматизація ⚡",     icon: "zap",      roles: ["admin"] },
  { href: "/admin/monitoring",     label: "Моніторинг",          icon: "alert",    roles: ["admin"] },
  { href: "/admin/audit",          label: "Журнал Аудиту",       icon: "file",     roles: ["admin"] },
  { href: "/admin/settings",       label: "Налаштування",        icon: "settings", roles: ["admin"] },
];

export function navFor(role) {
  return NAV.filter((n) => n.roles.includes(role));
}

const PERMS = {
  "members.write": ["admin", "moderator"],
  "members.delete": ["admin"],
  "leads.write": ["admin", "moderator"],
  "content.write": ["admin"],
  "settings": ["admin"],
};

export function can(role, action) {
  return (PERMS[action] || []).includes(role);
}
