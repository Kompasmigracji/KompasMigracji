/* Підпис нотифікації — єдине, що відділяє реальну оплату від підробленого
 * POST-а. Відколи /api/payment-notify пише платіж ПЕРШОЮ дією, ця перевірка
 * стала критичною: без неї будь-хто, хто вгадає session_id, створив би рядок
 * у kompas_payments і підняв команду по тривозі.
 *
 * Формула звірена з офіційною специфікацією P24 (TransactionStatus, поле sign):
 * SHA-384 від JSON у порядку merchantId, posId, sessionId, amount,
 * originAmount, currency, orderId, methodId, statement, crc. */
import crypto from "crypto";

const CRC = "a1b2c3d4e5f60718";

const NOTIFICATION = {
  merchantId:   12345,
  posId:        12345,
  sessionId:    "km-1786105369378-ob1cp1",
  amount:       25000,
  originAmount: 25000,
  currency:     "PLN",
  orderId:      987654321,
  methodId:     154,
  statement:    "abc123",
};

function signFor(payload: Record<string, unknown>, crc = CRC): string {
  return crypto
    .createHash("sha384")
    .update(
      JSON.stringify({
        merchantId:   Number(payload.merchantId),
        posId:        Number(payload.posId),
        sessionId:    String(payload.sessionId ?? ""),
        amount:       Number(payload.amount),
        originAmount: Number(payload.originAmount),
        currency:     String(payload.currency ?? ""),
        orderId:      Number(payload.orderId),
        methodId:     Number(payload.methodId),
        statement:    String(payload.statement ?? ""),
        crc,
      }),
    )
    .digest("hex");
}

describe("verifyNotificationSign", () => {
  let verifyNotificationSign: (body: Record<string, unknown>) => boolean;

  beforeEach(() => {
    process.env.P24_MERCHANT_ID = "12345";
    process.env.P24_API_KEY = "test-api-key";
    process.env.P24_CRC = CRC;
    process.env.P24_SANDBOX = "false";
    /* getConfig() читає env при кожному виклику, тож модуль можна тягнути
       після того, як змінні виставлені. */
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.isolateModules needs a synchronous require, not dynamic import()
      ({ verifyNotificationSign } = require("../przelewy24"));
    });
  });

  afterEach(() => {
    delete process.env.P24_MERCHANT_ID;
    delete process.env.P24_API_KEY;
    delete process.env.P24_CRC;
    delete process.env.P24_SANDBOX;
  });

  it("приймає нотифікацію з коректним підписом", () => {
    const body = { ...NOTIFICATION, sign: signFor(NOTIFICATION) };
    expect(verifyNotificationSign(body)).toBe(true);
  });

  it("відхиляє нотифікацію без підпису", () => {
    expect(verifyNotificationSign({ ...NOTIFICATION })).toBe(false);
  });

  it("відхиляє підпис, порахований на чужому CRC", () => {
    const body = { ...NOTIFICATION, sign: signFor(NOTIFICATION, "wrong-crc-key") };
    expect(verifyNotificationSign(body)).toBe(false);
  });

  it("відхиляє підміну суми при валідному підписі оригіналу", () => {
    /* Головний сценарій атаки: узяти справжню нотифікацію на 1 zł
       і дописати нулів. Підпис перестає збігатися. */
    const body = { ...NOTIFICATION, sign: signFor(NOTIFICATION), amount: 1 };
    expect(verifyNotificationSign(body)).toBe(false);
  });

  it("відхиляє підміну sessionId — оплата не може перескочити на чуже замовлення", () => {
    const body = { ...NOTIFICATION, sign: signFor(NOTIFICATION), sessionId: "km-someone-else" };
    expect(verifyNotificationSign(body)).toBe(false);
  });

  it("не падає на підписі іншої довжини", () => {
    /* timingSafeEqual кидає виняток на буферах різної довжини —
       перевірка довжини має стояти перед ним. */
    expect(verifyNotificationSign({ ...NOTIFICATION, sign: "short" })).toBe(false);
  });
});
