/**
 * Замінює {{name}}, {{service}}, {{contact}} тощо у тілі шаблону.
 * Невідомі ключі залишає як є ({{key}}).
 */
export function renderTemplate(body, vars = {}) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return vars[key] !== undefined ? vars[key] : `{{${key}}}`;
  });
}

/** Витягує список плейсхолдерів із тексту шаблону. */
export function templateVars(body) {
  const found = new Set();
  for (const [, key] of body.matchAll(/\{\{(\w+)\}\}/g)) found.add(key);
  return [...found];
}
