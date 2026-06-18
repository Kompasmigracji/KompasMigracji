/* KompasCRM — роли, права, навигация. Force Vercel rebuild. */

export const ROLE_LABEL = {
  admin: "Адміністратор",
  moderator: "Модератор",
  member: "Учасник профспілки",
};

/* Пункти меню. Кожен видно тільки вказаним ролям. */
export const NAV = [
  { href: "/admin",                 label: "Дашборд",             icon: "grid",     roles: ["admin", "moderator"] },
  { href: "/architect",             label: "LifeOS Architect",    icon: "cpu",      roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/members",         label: "Учасники профспілки",  icon: "users",    roles: ["admin", "moderator"], group: "Продажі та Клієнти" },
  { href: "/admin/leads",           label: "Ліди & Продажі",      icon: "target",   roles: ["admin", "moderator", "manager", "sales"], group: "Продажі та Клієнти" },
  { href: "/admin/deals",           label: "Угоди & Продажі",     icon: "briefcase",roles: ["admin", "moderator", "manager", "sales"], group: "Продажі та Клієнти" },
  { href: "/admin/leads-finder",    label: "Пошук Лідів B2B",      icon: "search",   roles: ["admin", "moderator", "manager", "sales"], group: "Продажі та Клієнти" },
  { href: "/admin/client-portal",   label: "Портал Клієнтів",      icon: "key",      roles: ["admin", "moderator", "manager"], group: "Продажі та Клієнти" },
  { href: "/admin/loyalty",         label: "Програма Лояльності",  icon: "award",    roles: ["admin", "moderator"], group: "Продажі та Клієнти" },
  { href: "/admin/playbooks",       label: "Скрипти Продажів",     icon: "book-open",roles: ["admin", "moderator", "manager", "sales"], group: "Продажі та Клієнти" },

  { href: "/admin/cases",           label: "Справи Клієнтів",     icon: "folder",   roles: ["admin", "moderator", "manager", "user"], group: "Справи та Юриспруденція" },
  { href: "/admin/enforcement",     label: "Виконавчі справи",    icon: "briefcase",roles: ["admin", "moderator", "manager", "lawyer"], group: "Справи та Юриспруденція" },
  { href: "/admin/work-permits",    label: "Дозволи на роботу",   icon: "file-text",roles: ["admin", "moderator", "manager"], group: "Справи та Юриспруденція" },
  { href: "/admin/litigation",      label: "Оскарження & Суди",   icon: "file",     roles: ["admin", "moderator", "manager", "lawyer"], group: "Справи та Юриспруденція" },
  { href: "/admin/contracts",       label: "Шаблони & Е-Підписи",  icon: "file-text",roles: ["admin", "moderator", "manager"], group: "Справи та Юриспруденція" },
  { href: "/admin/e-signatures",    label: "Електронні Підписи",    icon: "check-circle",roles: ["admin", "moderator", "manager"], group: "Справи та Юриспруденція" },
  { href: "/admin/doc-builder",     label: "Конструктор Док-ів",    icon: "file-text",roles: ["admin", "moderator", "manager"], group: "Справи та Юриспруденція" },

  { href: "/admin/emails",          label: "Пошта & Листування",  icon: "inbox",    roles: ["admin", "moderator", "manager", "sales", "lawyer"], group: "Комунікація та Маркетинг" },
  { href: "/admin/email-sequences", label: "Email Sequences",      icon: "mail",     roles: ["admin", "moderator", "manager"], group: "Комунікація та Маркетинг" },
  { href: "/admin/messengers",      label: "Чат Месенджерів (Omni)",icon: "message-square",roles: ["admin", "moderator", "manager"], group: "Комунікація та Маркетинг" },
  { href: "/admin/livechat",        label: "Живий Чат",            icon: "message-square",roles: ["admin", "moderator", "manager"], group: "Комунікація та Маркетинг" },
  { href: "/admin/broadcasts",      label: "Telegram Розсилки",     icon: "send",     roles: ["admin", "moderator", "manager"], group: "Комунікація та Маркетинг" },
  { href: "/admin/call-center",     label: "VoIP Колл-центр",      icon: "phone",    roles: ["admin", "moderator", "manager", "sales"], group: "Комунікація та Маркетинг" },
  { href: "/admin/marketing",       label: "Маркетинг & Email",   icon: "send",     roles: ["admin", "manager"], group: "Комунікація та Маркетинг" },
  { href: "/admin/forms",           label: "Форми & Опитування",   icon: "check-square",roles: ["admin", "moderator"], group: "Комунікація та Маркетинг" },

  { href: "/admin/reports",         label: "Звіти & Аналітика",   icon: "activity", roles: ["admin", "moderator", "manager"], group: "Фінанси та Аналітика" },
  { href: "/admin/accounting",      label: "Бухгалтерія & Зарплати",icon: "dollar-sign",roles: ["admin"], group: "Фінанси та Аналітика" },
  { href: "/admin/e-invoicing",     label: "E-Invoicing (KSeF)",   icon: "dollar-sign",roles: ["admin", "moderator", "manager"], group: "Фінанси та Аналітика" },
  { href: "/admin/expenses",        label: "Витрати & P&L",        icon: "pie-chart",roles: ["admin"], group: "Фінанси та Аналітика" },
  { href: "/admin/subscriptions",   label: "Підписки & MRR",       icon: "card",     roles: ["admin"], group: "Фінанси та Аналітика" },
  { href: "/admin/currencies",      label: "Валюти & Курси FX",    icon: "refresh-cw",roles: ["admin"], group: "Фінанси та Аналітика" },

  { href: "/admin/appointments",    label: "Записи & Календар",    icon: "clock",    roles: ["admin", "moderator", "manager"], group: "Операції та Логістика" },
  { href: "/admin/booking",         label: "Записи & Клієнти",     icon: "calendar", roles: ["admin", "moderator", "manager"], group: "Операції та Логістика" },
  { href: "/admin/insurance",       label: "Страхування & ZUS",   icon: "shield",   roles: ["admin", "moderator", "manager"], group: "Операції та Логістика" },
  { href: "/admin/housing",         label: "Житло & Хостели",      icon: "home",     roles: ["admin", "moderator", "manager"], group: "Операції та Логістика" },
  { href: "/admin/fleet",           label: "Логістика & Автопарк", icon: "truck",    roles: ["admin", "moderator", "manager"], group: "Операції та Логістика" },
  { href: "/admin/mailroom",        label: "Віртуальний Офіс & Пошта",icon: "mail",  roles: ["admin", "moderator", "manager"], group: "Операції та Логістика" },
  { href: "/admin/hr-leave",        label: "Кадри & PTO",          icon: "users",    roles: ["admin", "moderator"], group: "Операції та Логістика" },
  { href: "/admin/service-catalog", label: "Каталог Послуг",       icon: "briefcase",roles: ["admin", "manager"], group: "Операції та Логістика" },

  { href: "/admin/academy",         label: "Навчання & Академія",  icon: "award",    roles: ["admin", "moderator", "manager"], group: "Компанія та Розвиток" },
  { href: "/admin/knowledge-base",  label: "База Знань & Wiki",    icon: "book-open",roles: ["admin", "moderator", "manager"], group: "Компанія та Розвиток" },
  { href: "/admin/gamification",    label: "Гейміфікація & Змагання",icon: "award",   roles: ["admin", "moderator", "manager"], group: "Компанія та Розвиток" },
  { href: "/admin/partner-portal",  label: "B2B Портал Партнерів",  icon: "users",    roles: ["admin", "moderator", "manager"], group: "Компанія та Розвиток" },
  { href: "/admin/referrals",       label: "Реферали & Комісії",   icon: "target",   roles: ["admin", "moderator", "manager"], group: "Компанія та Розвиток" },

  { href: "/admin/copilot",         label: "ШІ Копілот",           icon: "cpu",      roles: ["admin", "moderator", "manager", "sales", "lawyer"], group: "ШІ та Інструменти" },
  { href: "/admin/ocr-scanner",     label: "OCR Сканування",       icon: "file-text",roles: ["admin", "moderator", "manager"], group: "ШІ та Інструменти" },
  { href: "/admin/workflows",       label: "Автоматизація WF",     icon: "git-merge",roles: ["admin"], group: "ШІ та Інструменти" },
  { href: "/admin/gov-integration", label: "Держ. Портали RPA",    icon: "shield",   roles: ["admin"], group: "ШІ та Інструменти" },

  { href: "/admin/manual",        label: "Інструкція CRM",       icon: "book-open", roles: ["admin", "moderator", "manager", "sales", "lawyer", "user"], group: "Система та Налаштування" },
  { href: "/admin/settings",        label: "Налаштування",        icon: "settings", roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/integrations",    label: "Інтеграції API",       icon: "key",      roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/api-hub",         label: "API & Webhooks",      icon: "key",      roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/custom-fields",   label: "Конструктор Полів",    icon: "settings", roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/data-import",     label: "Імпорт Даних",         icon: "upload",   roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/rodo",            label: "GDPR & RODO Контроль", icon: "shield",   roles: ["admin", "moderator"], group: "Система та Налаштування" },
  { href: "/admin/audit-log",       label: "Журнал Аудиту",        icon: "activity", roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/mobile-app",      label: "Мобільний Додаток",     icon: "settings", roles: ["admin"], group: "Система та Налаштування" },
  { href: "/admin/monitoring",      label: "Моніторинг Системи",  icon: "activity", roles: ["admin"], group: "Система та Налаштування" },
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
