/* Оплата в діалозі з ботом. Головне, що тут перевіряється — ціна ніколи не
 * приходить від клієнта.
 *
 * callback_data кнопки несе лише serviceId; суму бот бере з
 * lib/pricing-catalog.ts. Це той самий захист, який уже закритий для
 * /api/payment комітом 947ebed0 (де клієнт міг підмінити amount і купити
 * послугу за 1 zł), і в боті він не має бути слабшим — інакше дірку просто
 * перенесли б у Telegram. */
/* lib/db.js — ESM і jest його не трансформує, а bot-payments тягне його на
   рівні модуля заради startBotPayment. Тут перевіряються чисті функції, тож
   мокаємо важкі залежності — той самий патерн, що в payment-route.test.ts. */
jest.mock("@/lib/db", () => ({ q: jest.fn(), one: jest.fn() }));
jest.mock("@/lib/przelewy24", () => ({
  registerTransaction: jest.fn(),
  isP24Configured: () => true,
}));

import { BOT_SERVICES, serviceName, formatPln, buildServicesKeyboard } from "../bot-payments";
import { getServicePrice } from "../pricing-catalog";

describe("каталог послуг бота", () => {
  it("кожна послуга з меню має ціну в серверному каталозі", () => {
    for (const id of BOT_SERVICES) {
      expect(getServicePrice(id)).not.toBeNull();
    }
  });

  it("кожна послуга має людську назву, а не свій же id", () => {
    for (const id of BOT_SERVICES) {
      const name = serviceName(id);
      expect(name).not.toBe(id);
      expect(name.length).toBeGreaterThan(3);
    }
  });

  it("невідомий serviceId не отримує ціни", () => {
    expect(getServicePrice("psvc_nonexistent")).toBeNull();
    expect(getServicePrice("")).toBeNull();
  });

  it("не дає підставити ціну через прототип Object", () => {
    /* getServicePrice використовує hasOwnProperty саме тому: без нього
       serviceId='constructor' або 'toString' повернув би функцію. */
    expect(getServicePrice("constructor")).toBeNull();
    expect(getServicePrice("toString")).toBeNull();
    expect(getServicePrice("__proto__")).toBeNull();
  });
});

describe("клавіатура оплати", () => {
  it("у callback_data немає суми — тільки serviceId", () => {
    const { inline_keyboard } = buildServicesKeyboard();
    for (const row of inline_keyboard) {
      for (const btn of row) {
        expect(btn.callback_data).toMatch(/^pay_/);
        /* Якби сума колись потрапила в callback_data, її можна було б
           підмінити на боці клієнта — Telegram шле її як є. */
        expect(btn.callback_data).not.toMatch(/\d{3,}/);
      }
    }
  });

  it("показує ціну в тексті кнопки, і вона збігається з каталогом", () => {
    const { inline_keyboard } = buildServicesKeyboard();
    for (const row of inline_keyboard) {
      for (const btn of row) {
        const id = btn.callback_data.slice(4);
        const price = getServicePrice(id);
        if (price !== null) {
          expect(btn.text).toContain(formatPln(price));
        }
      }
    }
  });

  it("останнім пунктом веде на повний прайс", () => {
    const { inline_keyboard } = buildServicesKeyboard();
    const last = inline_keyboard[inline_keyboard.length - 1][0];
    expect(last.callback_data).toBe("pay_full_price");
  });
});

describe("formatPln", () => {
  it("переводить гроші в злоті з двома знаками", () => {
    expect(formatPln(25000)).toBe("250.00 zł");
    expect(formatPln(2500)).toBe("25.00 zł");
    expect(formatPln(1)).toBe("0.01 zł");
  });
});
