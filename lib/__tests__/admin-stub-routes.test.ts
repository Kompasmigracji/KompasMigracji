/* Список сторінок-макетів мусить збігатися з дійсністю.
 *
 * Сенс тесту — не в самому списку, а в тому, щоб він не збрехав. Дві
 * протилежні небезпеки:
 *
 *   • сторінку під'єднали до даних, а з ADMIN_STUB_ROUTES не прибрали —
 *     користувач бачить попередження над реальними даними і перестає йому
 *     вірити;
 *   • додали нову сторінку-макет і в список не внесли — порожня таблиця
 *     знову виглядає як «записів немає».
 *
 * Другий випадок уже стався з /admin/orders: сторінка показувала нуль
 * оплачених замовлень у той час, коли клієнт заплатив 250 zł.
 */
import fs from "fs";
import path from "path";
import { ADMIN_STUB_ROUTES, isStubRoute } from "../admin-stub-routes";

const PANEL_DIR = path.join(process.cwd(), "app", "admin", "(panel)");

/** Маршрути, сторінки яких не роблять жодного виклику fetch(). */
function actualStubRoutes(): string[] {
  const out: string[] = [];
  for (const dir of fs.readdirSync(PANEL_DIR)) {
    const full = path.join(PANEL_DIR, dir);
    if (!fs.statSync(full).isDirectory()) continue;

    const page = ["page.jsx", "page.tsx"]
      .map((f) => path.join(full, f))
      .find((f) => fs.existsSync(f));
    if (!page) continue;

    if (!fs.readFileSync(page, "utf8").includes("fetch(")) {
      out.push(`/admin/${dir}`);
    }
  }
  return out.sort();
}

describe("ADMIN_STUB_ROUTES", () => {
  it("не позначає макетом сторінку, яка вже ходить у сервер", () => {
    const actual = new Set(actualStubRoutes());
    const wronglyFlagged = [...ADMIN_STUB_ROUTES].filter((r) => !actual.has(r));
    expect(wronglyFlagged).toEqual([]);
  });

  it("не пропускає жодного макета", () => {
    const missing = actualStubRoutes().filter((r) => !ADMIN_STUB_ROUTES.has(r));
    expect(missing).toEqual([]);
  });

  it("сторінки, які вже під'єднані, попередження не отримують", () => {
    /* Ці три доведені робочими в цій же гілці. */
    expect(isStubRoute("/admin/orders")).toBe(false);
    expect(isStubRoute("/admin/client-portal")).toBe(false);
    expect(isStubRoute("/admin/leads")).toBe(false);
  });

  it("витримує кінцевий слеш", () => {
    const [first] = [...ADMIN_STUB_ROUTES];
    expect(isStubRoute(`${first}/`)).toBe(true);
  });
});
