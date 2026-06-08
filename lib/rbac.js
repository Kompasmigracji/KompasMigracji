/* KompasCRM — роли, права, навигация. */

export const ROLE_LABEL = {
  admin: "Адміністратор",
  moderator: "Модератор",
  member: "Учасник профспілки",
};

/* Пункти меню. Кожен видно тільки вказаним ролям. */
export const NAV = [
  { href: "/admin",              label: "Дашборд",             icon: "grid",     roles: ["admin", "moderator"] },
  { href: "/admin/members",      label: "Учасники профспiлки", icon: "users",    roles: ["admin", "moderator"] },
  { href: "/admin/leads",        label: "Лiди",                icon: "inbox",    roles: ["admin", "moderator"] },
  { href: "/admin/cases",        label: "Понаглення",           icon: "alert",    roles: ["admin", "moderator"] },
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
