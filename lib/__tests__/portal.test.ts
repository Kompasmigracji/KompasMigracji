/* Портал клієнта. Найважливіше тут — межа доступу.
 *
 * Портал не працював жодного дня: POST /api/portal/case робив
 * Number(body.leadId) при leads.id типу uuid, отримував NaN і завжди
 * відповідав 400. Тепер leadId — рядок, і саме тому потрібна перевірка
 * формату: рядок, на відміну від числа, підставляється в запит як завгодно.
 */
jest.mock("@/lib/db", () => ({ q: jest.fn(), one: jest.fn() }));

import { clientFacingPaymentStatus } from "../portal";

/* Та сама перевірка, що стоїть у POST /api/portal/case. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("перевірка leadId", () => {
  it("приймає справжній uuid", () => {
    expect(UUID_RE.test("5426a084-13c8-4b12-8c6c-5087bd489f97")).toBe(true);
  });

  it("відхиляє те, на чому ламався старий код", () => {
    /* Number('5426a084-…') = NaN — саме тому роут завжди віддавав 400. */
    expect(Number("5426a084-13c8-4b12-8c6c-5087bd489f97")).toBeNaN();
  });

  it("відхиляє спроби SQL-ін'єкції та підстановки", () => {
    for (const bad of [
      "' OR 1=1 --",
      "5426a084-13c8-4b12-8c6c-5087bd489f97'; DROP TABLE leads; --",
      "1",
      "",
      "null",
      "5426a084-13c8-4b12-8c6c-5087bd489f9",   // на символ коротший
      "5426a084_13c8_4b12_8c6c_5087bd489f97",  // підкреслення замість дефісів
    ]) {
      expect(UUID_RE.test(bad)).toBe(false);
    }
  });
});

describe("статус оплати для клієнта", () => {
  it("підтверджену оплату показує як оплачену", () => {
    expect(clientFacingPaymentStatus("paid")).toBe("paid");
  });

  it("непідтверджену провайдером показує як отриману, а не як несплачену", () => {
    /* Ключове рішення: verify_failed означає «гроші списані, але P24 нам
       цього не підтвердив». Це наша внутрішня проблема. Показати клієнту
       «не оплачено» означало б натякнути, що він не платив — і підштовхнути
       до другої оплати за ту саму послугу. */
    expect(clientFacingPaymentStatus("verify_failed")).toBe("received");
    expect(clientFacingPaymentStatus("pending")).toBe("received");
    expect(clientFacingPaymentStatus("notified")).toBe("received");
  });

  it("скасовану й повернену не видає за оплачені", () => {
    expect(clientFacingPaymentStatus("cancelled")).toBe("unpaid");
    expect(clientFacingPaymentStatus("failed")).toBe("unpaid");
    expect(clientFacingPaymentStatus("refunded")).toBe("unpaid");
  });

  it("невідомий статус не стає оплаченим за замовчуванням", () => {
    expect(clientFacingPaymentStatus("щось_нове")).toBe("unpaid");
  });
});
