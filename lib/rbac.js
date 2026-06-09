/* KompasCRM — роли, права, навигация. Force Vercel rebuild. */

export const ROLE_LABEL = {
  admin: "Адміністратор",
  moderator: "Модератор",
  member: "Учасник профспілки",
};

/* Пункти меню. Кожен видно тільки вказаним ролям. */
export const NAV = [
  { href: "/admin",                 label: "Дашборд",             icon: "grid",     roles: ["admin", "moderator"] },
  { href: "/admin/members",         label: "Учасники профспілки",  icon: "users",    roles: ["admin", "moderator"] },
  { href: "/admin/leads",           label: "Ліди & Продажі",      icon: "target",   roles: ["admin", "moderator", "manager", "sales"] },
  { href: "/admin/deals",           label: "Угоди & Продажі",     icon: "briefcase",roles: ["admin", "moderator", "manager", "sales"] },
  { href: "/admin/cases",           label: "Справи Клієнтів",     icon: "folder",   roles: ["admin", "moderator", "manager", "user"] },
  { href: "/admin/reports",         label: "Звіти & Аналітика",   icon: "activity", roles: ["admin", "moderator", "manager"] },
  { href: "/admin/emails",          label: "Пошта & Листування",  icon: "inbox",    roles: ["admin", "moderator", "manager", "sales", "lawyer"] },
  { href: "/admin/work-permits",    label: "Дозволи на роботу",   icon: "file-text",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/appointments",    label: "Записи & Календар",    icon: "clock",    roles: ["admin", "moderator", "manager"] },
  { href: "/admin/contracts",       label: "Шаблони & Е-Підписи",  icon: "file-text",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/litigation",      label: "Оскарження & Суди",   icon: "file",     roles: ["admin", "moderator", "manager", "lawyer"] },
  { href: "/admin/insurance",       label: "Страхування & ZUS",   icon: "shield",   roles: ["admin", "moderator", "manager"] },
  { href: "/admin/housing",         label: "Житло & Хостели",      icon: "home",     roles: ["admin", "moderator", "manager"] },
  { href: "/admin/fleet",           label: "Логістика & Автопарк", icon: "truck",    roles: ["admin", "moderator", "manager"] },
  { href: "/admin/mailroom",        label: "Віртуальний Офіс & Пошта",icon: "mail",  roles: ["admin", "moderator", "manager"] },
  { href: "/admin/academy",         label: "Навчання & Академія",  icon: "award",    roles: ["admin", "moderator", "manager"] },
  { href: "/admin/messengers",      label: "Чат Месенджерів (Omni)",icon: "message-square",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/e-invoicing",     label: "E-Invoicing (KSeF)",   icon: "dollar-sign",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/ocr-scanner",     label: "OCR Сканування",       icon: "file-text",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/partner-portal",  label: "B2B Портал Партнерів",  icon: "users",    roles: ["admin", "moderator", "manager"] },
  { href: "/admin/referrals",       label: "Реферали & Комісії",   icon: "target",   roles: ["admin", "moderator", "manager"] },
  { href: "/admin/gamification",    label: "Гейміфікація & Змагання",icon: "award",   roles: ["admin", "moderator", "manager"] },
  { href: "/admin/knowledge-base",  label: "База Знань & Wiki",    icon: "book-open",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/accounting",      label: "Бухгалтерія & Зарплати",icon: "dollar-sign",roles: ["admin"] },
  { href: "/admin/marketing",       label: "Маркетинг & Email",   icon: "send",     roles: ["admin", "manager"] },
  { href: "/admin/integrations",    label: "Інтеграції API",       icon: "key",      roles: ["admin"] },
  { href: "/admin/custom-fields",   label: "Конструктор Полів",    icon: "settings", roles: ["admin"] },
  { href: "/admin/api-hub",         label: "API & Webhooks",      icon: "key",      roles: ["admin"] },
  { href: "/admin/rodo",            label: "GDPR & RODO Контроль", icon: "shield",   roles: ["admin", "moderator"] },
  { href: "/admin/audit-log",       label: "Журнал Аудиту",        icon: "activity", roles: ["admin"] },
  { href: "/admin/mobile-app",      label: "Мобільний Додаток",     icon: "settings", roles: ["admin"] },
  { href: "/admin/monitoring",      label: "Моніторинг Системи",  icon: "activity", roles: ["admin"] },
  { href: "/admin/settings",        label: "Налаштування",        icon: "settings", roles: ["admin"] },
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
