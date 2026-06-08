/* KompasCRM — роли, права, навигация. */

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
  { href: "/admin/cases",           label: "Справи Клієнтів",     icon: "folder",   roles: ["admin", "moderator", "manager", "user"] },
  { href: "/admin/work-permits",    label: "Дозволи на роботу",   icon: "file-text",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/litigation",      label: "Оскарження & Суди",   icon: "file",     roles: ["admin", "moderator", "manager", "lawyer"] },
  { href: "/admin/insurance",       label: "Страхування & ZUS",   icon: "shield",   roles: ["admin", "moderator", "manager"] },
  { href: "/admin/mailroom",        label: "Віртуальний Офіс & Пошта",icon: "mail",  roles: ["admin", "moderator", "manager"] },
  { href: "/admin/messengers",      label: "Чат Месенджерів (Omni)",icon: "message-square",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/accounting",      label: "Бухгалтерія & Зарплати",icon: "dollar-sign",roles: ["admin"] },
  { href: "/admin/marketing",       label: "Маркетинг & Email",   icon: "send",     roles: ["admin", "manager"] },
  { href: "/admin/api-hub",         label: "API & Webhooks",      icon: "key",      roles: ["admin"] },
  { href: "/admin/rodo",            label: "GDPR & RODO Контроль", icon: "shield",   roles: ["admin", "moderator"] },
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
