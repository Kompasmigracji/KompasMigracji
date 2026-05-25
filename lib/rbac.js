/* KompasCMS — роли, права, навигация. */

export const ROLE_LABEL = {
  admin: "Администратор",
  moderator: "Модератор",
  member: "Участник профсоюза",
};

/* Пункты меню. Каждый виден только указанным ролям. */
export const NAV = [
  { href: "/admin",          label: "Дашборд",              icon: "grid",     roles: ["admin", "moderator"] },
  { href: "/admin/members",  label: "Участники профсоюза",  icon: "users",    roles: ["admin", "moderator"] },
  { href: "/admin/leads",    label: "Лиды",                 icon: "inbox",    roles: ["admin", "moderator"] },
  { href: "/admin/content",  label: "Контент сайта",        icon: "file",     roles: ["admin"] },
  { href: "/admin/me",       label: "Мой кабинет",          icon: "user",     roles: ["member"] },
  { href: "/admin/settings", label: "Настройки",            icon: "settings", roles: ["admin"] },
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
