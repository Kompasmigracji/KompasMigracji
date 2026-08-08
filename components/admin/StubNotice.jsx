"use client";
/* Попередження на сторінках, які ще не під'єднані до даних.
 *
 * Сторінка-макет виглядає точно як робоча: та сама верстка, ті самі
 * заголовки таблиць, той самий порожній стан. Різниця лише в тому, що вона
 * нічого не питає в сервера — і без цієї смуги відрізнити неможливо.
 *
 * Ставиться в layout групи (panel), а не в кожну зі сторінок: одна точка
 * замість 87 правок, і нову сторінку неможливо забути позначити — досить
 * додати маршрут у lib/admin-stub-routes.ts.
 */
import { usePathname } from "next/navigation";
import { isStubRoute } from "@/lib/admin-stub-routes";

export default function StubNotice() {
  const pathname = usePathname();
  if (!pathname || !isStubRoute(pathname)) return null;

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 16px",
        marginBottom: "var(--space-md)",
        borderRadius: 8,
        background: "#FFFBEB",
        border: "1px solid #FDE68A",
        color: "#78350F",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden>⚠️</span>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
        <strong>Цей розділ ще не під&apos;єднаний до даних.</strong>{" "}
        Те, що ви бачите нижче — оформлення майбутньої сторінки, а не стан справ
        у системі. Порожня таблиця тут означає «сторінка ще не питає сервер»,
        а <em>не</em> «записів немає».
      </div>
    </div>
  );
}
