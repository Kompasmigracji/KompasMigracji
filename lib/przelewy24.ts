/* KompasCRM — Przelewy24 API helper.
   Документація: https://developers.przelewy24.pl/
   Використовується для генерації посилань на оплату. */
import crypto from "crypto";

const BASE_PROD    = "https://secure.przelewy24.pl";
const BASE_SANDBOX = "https://sandbox.przelewy24.pl";

interface P24Config {
  merchantId: number;
  apiKey: string;
  crc: string;
  base: string;
}

function getConfig(): P24Config {
  const merchantId = parseInt(process.env.P24_MERCHANT_ID ?? "", 10);
  const apiKey     = process.env.P24_API_KEY ?? "";
  const crc        = process.env.P24_CRC ?? "";
  const sandbox    = process.env.P24_SANDBOX === "true";

  if (!merchantId || !apiKey || !crc) {
    throw new Error(
      "Przelewy24 не налаштований — додайте P24_MERCHANT_ID, P24_API_KEY, P24_CRC у змінні середовища",
    );
  }
  return { merchantId, apiKey, crc, base: sandbox ? BASE_SANDBOX : BASE_PROD };
}

function basicAuth(merchantId: number, apiKey: string): string {
  return `Basic ${Buffer.from(`${merchantId}:${apiKey}`).toString("base64")}`;
}

export interface RegisterParams {
  sessionId: string;
  /** Сума в грошах: 1 PLN = 100 */
  amount: number;
  description: string;
  email: string;
  urlReturn: string;
  urlStatus: string;
  currency?: string;
  country?: string;
  language?: string;
}

export interface RegisterResult {
  token: string;
  paymentUrl: string;
  sessionId: string;
}

const P24_HOSTED_LANGUAGES = new Set(["pl", "en", "de"]);

/**
 * P24's hosted checkout page only ships pl/en/de UI chrome. The site itself
 * has 5 locales (uk/pl/en/ru/rom); any locale P24 doesn't support falls back
 * to pl rather than being forwarded as-is and rejected by the register call.
 */
export function toP24Language(lang?: string): string {
  const code = (lang ?? "").toLowerCase();
  return P24_HOSTED_LANGUAGES.has(code) ? code : "pl";
}

/** Повертає true, якщо задані реальні P24_MERCHANT_ID/P24_API_KEY/P24_CRC. */
export function isP24Configured(): boolean {
  const merchantId = parseInt(process.env.P24_MERCHANT_ID ?? "", 10);
  return !!(merchantId && process.env.P24_API_KEY && process.env.P24_CRC);
}

/**
 * Повертає true, якщо P24 не налаштований або увімкнений мок-режим.
 * Мок: P24_SANDBOX=mock  АБО  P24_MERCHANT_ID не задано.
 */
function isMockMode(): boolean {
  return (
    process.env.P24_SANDBOX === "mock" ||
    !process.env.P24_MERCHANT_ID ||
    process.env.P24_MERCHANT_ID === "0"
  );
}

/**
 * Реєструє нову транзакцію в P24 і повертає URL для оплати.
 * Клієнт відкриває paymentUrl і завершує оплату на сайті P24.
 * Якщо P24 не налаштований — використовує вбудований мок.
 */
export async function registerTransaction(
  params: RegisterParams,
): Promise<RegisterResult> {
  /* ── Мок-режим: без реального P24 ──────────────────────────────── */
  if (isMockMode()) {
    let appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    ).replace(/\/$/, "");

    /* Якщо URL без протоколу — додаємо https:// */
    if (appUrl && !appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
      appUrl = `https://${appUrl}`;
    }
    /* Fallback якщо змінна порожня або не задана */
    if (!appUrl) appUrl = "http://localhost:3000";

    /* Будуємо URL через рядки (не кидає, на відміну від new URL()) */
    const qs = new URLSearchParams({
      amount: String(params.amount),
      desc:   params.description,
      cur:    params.currency ?? "PLN",
    }).toString();

    const paymentUrl = `${appUrl}/payment/mock/${params.sessionId}?${qs}`;

    return {
      token:      `mock-${params.sessionId}`,
      paymentUrl,
      sessionId:  params.sessionId,
    };
  }

  /* ── Реальний P24 ───────────────────────────────────────────────── */
  const { merchantId, apiKey, crc, base } = getConfig();
  const currency = params.currency ?? "PLN";

  /* Підпис транзакції */
  const sign = crypto
    .createHash("sha384")
    .update(
      JSON.stringify({
        sessionId:  params.sessionId,
        merchantId,
        amount:     params.amount,
        currency,
        crc,
      }),
    )
    .digest("hex");

  const body = {
    merchantId,
    posId:       merchantId,
    sessionId:   params.sessionId,
    amount:      params.amount,
    currency,
    description: params.description,
    email:       params.email,
    country:     params.country  ?? "PL",
    language:    params.language ?? "uk",
    urlReturn:   params.urlReturn,
    urlStatus:   params.urlStatus,
    sign,
  };

  const res = await fetch(`${base}/api/v1/transaction/register`, {
    method: "POST",
    headers: {
      /* charset=UTF-8 обов'язковий: без нього P24 читає тіло як latin-1 і в
         панелі/листі клієнта опис виглядає як "Ð Ð°Ð·Ð¾Ð²Ð°..." замість
         "Разова довіреність" (підтверджено листом P24 від 07.08.2026). */
      "Content-Type": "application/json; charset=UTF-8",
      Authorization:  basicAuth(merchantId, apiKey),
    },
    body: JSON.stringify(body),
  });

  type P24Response = { data?: { token: string }; error?: string; errorCode?: number };
  const json = (await res.json()) as P24Response;

  if (!res.ok || !json.data?.token) {
    throw new Error(
      `P24 register failed (HTTP ${res.status}): ${JSON.stringify(json)}`,
    );
  }

  const token = json.data.token;
  return {
    token,
    paymentUrl: `${base}/trnRequest/${token}`,
    sessionId:  params.sessionId,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   Верифікація транзакції та діагностика доступу.

   До 07.08.2026 виклик verify жив прямо в app/api/payment-notify/route.ts
   зі своєю копією basicAuth і своїм рядком заголовків. Через це register і
   verify могли розійтися (і розійшлися: register слав Content-Type без
   charset, і опис приходив у P24 побитим). Тепер обидва виклики йдуть
   звідси й не можуть розсинхронізуватися.
   ──────────────────────────────────────────────────────────────────────── */

export interface VerifyParams {
  sessionId: string;
  orderId: number;
  /** Сума в грошах — має точно збігатися з зареєстрованою */
  amount: number;
  currency?: string;
}

export interface VerifyResult {
  ok: boolean;
  status: number;
  /** Тіло відповіді P24 як текст — потрапляє у kompas_payments.verify_error */
  body: string;
}

/**
 * PUT /api/v1/transaction/verify — підтверджує транзакцію в P24.
 *
 * ВАЖЛИВО: повертає результат, а не кидає. Виклик verify не має права
 * обвалити обробку нотифікації — гроші вже списані з клієнта, і платіж
 * мусить бути записаний у базу незалежно від того, що відповів P24.
 */
export async function verifyTransaction(params: VerifyParams): Promise<VerifyResult> {
  const { merchantId, apiKey, crc, base } = getConfig();
  const currency = params.currency ?? "PLN";

  /* Порядок ключів у JSON значущий: P24 хешує саме цей рядок. */
  const sign = crypto
    .createHash("sha384")
    .update(
      JSON.stringify({
        sessionId: params.sessionId,
        orderId:   params.orderId,
        amount:    params.amount,
        currency,
        crc,
      }),
    )
    .digest("hex");

  try {
    const res = await fetch(`${base}/api/v1/transaction/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization:  basicAuth(merchantId, apiKey),
      },
      body: JSON.stringify({
        merchantId,
        posId:     merchantId,
        sessionId: params.sessionId,
        amount:    params.amount,
        currency,
        orderId:   params.orderId,
        sign,
      }),
    });

    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return { ok: false, status: 0, body: `network error: ${(err as Error).message}` };
  }
}

export interface AccessDiagnosis {
  configured: boolean;
  environment: "production" | "sandbox" | "mock";
  merchantId: number | null;
  /** Останні 4 символи ключів — щоб звірити з панеллю P24, не світячи секрети */
  apiKeyTail: string | null;
  crcTail: string | null;
  testAccess: { ok: boolean; status: number; body: string } | null;
  hint: string;
}

/**
 * GET /api/v1/testAccess — єдиний спосіб відрізнити «ключі неправильні»
 * від «підпис неправильний», не витрачаючи реальну транзакцію.
 *
 * P24 віддає 401 {"error":"Incorrect authentication"} у двох різних випадках:
 *   а) posId/API-ключ не ті (або ключ від sandbox у продакшені й навпаки);
 *   б) IP, з якого йде виклик, не в білому списку «Adresy IP» у панелі P24.
 * Vercel має динамічні egress-IP, тому для (б) у полі має стояти `%`.
 * testAccess проходить обидві перевірки — якщо він 200, а verify 401,
 * причина не в доступі, а в тілі запиту.
 */
export async function diagnoseAccess(): Promise<AccessDiagnosis> {
  const merchantIdRaw = parseInt(process.env.P24_MERCHANT_ID ?? "", 10);
  const apiKey = process.env.P24_API_KEY ?? "";
  const crc    = process.env.P24_CRC ?? "";
  const sandbox = process.env.P24_SANDBOX === "true";

  const environment: AccessDiagnosis["environment"] = isMockMode()
    ? "mock"
    : sandbox
      ? "sandbox"
      : "production";

  const base: AccessDiagnosis = {
    configured:  isP24Configured(),
    environment,
    merchantId:  Number.isFinite(merchantIdRaw) ? merchantIdRaw : null,
    apiKeyTail:  apiKey ? `…${apiKey.slice(-4)}` : null,
    crcTail:     crc ? `…${crc.slice(-4)}` : null,
    testAccess:  null,
    hint:        "",
  };

  if (!base.configured) {
    base.hint = "P24_MERCHANT_ID / P24_API_KEY / P24_CRC не задані у змінних середовища.";
    return base;
  }

  const host = sandbox ? BASE_SANDBOX : BASE_PROD;
  try {
    const res = await fetch(`${host}/api/v1/testAccess`, {
      method: "GET",
      headers: { Authorization: basicAuth(merchantIdRaw, apiKey) },
    });
    const body = await res.text();
    base.testAccess = { ok: res.ok, status: res.status, body };

    if (res.status === 401) {
      base.hint =
        "401 на testAccess — доступ до API відхилено. Перевір у панелі P24 " +
        "(Moje dane → Konfiguracja → API): 1) чи POS ID збігається з P24_MERCHANT_ID; " +
        "2) чи P24_API_KEY — це «Klucz do API» саме цього середовища " +
        `(зараз ${environment}); 3) чи в полі «Adresy IP» стоїть % — Vercel ходить з динамічних IP.`;
    } else if (res.ok) {
      base.hint =
        "testAccess OK — ключі й IP приймаються. Якщо при цьому transaction/verify " +
        "віддає 401, справа не в доступі: звір P24_CRC (окремий для sandbox і продакшену) " +
        "і суму/orderId, які йдуть у підпис.";
    } else {
      base.hint = `testAccess повернув HTTP ${res.status}. Дивись тіло відповіді нижче.`;
    }
  } catch (err) {
    base.testAccess = { ok: false, status: 0, body: (err as Error).message };
    base.hint = "Не вдалося достукатися до P24 — мережева помилка.";
  }

  return base;
}

/* ─────────────────────────────────────────────────────────────────────────
   Перевірка автентичності нотифікації.

   Потрібна саме тому, що /api/payment-notify тепер записує платіж ПЕРШОЮ
   дією, до звернення до P24. Без цієї перевірки будь-хто, хто вгадає
   session_id, міг би POST-ом створити рядок у kompas_payments і підняти
   команду по тривозі. Раніше від цього захищав сам виклик verify (підробка
   його не проходила) — тепер захист має стояти раніше.

   Перевірка локальна: рахує SHA-384 від CRC-ключа, нікуди не ходить.
   Тому вона працює навіть тоді, коли API P24 віддає 401, і не може
   заблокувати запис реальної оплати через недоступність провайдера.
   ──────────────────────────────────────────────────────────────────────── */

/** Діапазони серверів P24 (розділ «Server IP addresses» офіційної специфікації). */
const P24_IP_RANGES = [
  "5.252.202.255", "5.252.202.254", "20.215.81.124",
  "193.178.213.", "91.220.177.", "20.215.183.", "134.112.88.",
];

/**
 * Чи схожа адреса на сервер P24. Це м'яка перевірка для логів, а НЕ підстава
 * відхилити нотифікацію: за Vercel стоїть проксі, x-forwarded-for можна
 * підмінити, а діапазони P24 час від часу змінює. Рішення ухвалює підпис.
 */
export function looksLikeP24Ip(ip: string | null): boolean {
  if (!ip) return false;
  const addr = ip.split(",")[0].trim();
  return P24_IP_RANGES.some((r) => (r.endsWith(".") ? addr.startsWith(r) : addr === r));
}

/**
 * Звіряє поле `sign` нотифікації з власним підрахунком.
 *
 * Порядок ключів заданий специфікацією і значущий — хешується сам рядок JSON:
 * {merchantId, posId, sessionId, amount, originAmount, currency, orderId,
 *  methodId, statement, crc}
 */
export function verifyNotificationSign(body: Record<string, unknown>): boolean {
  const { crc } = getConfig();
  const provided = String(body.sign ?? "");
  if (!provided) return false;

  const expected = crypto
    .createHash("sha384")
    .update(
      JSON.stringify({
        merchantId:   Number(body.merchantId),
        posId:        Number(body.posId),
        sessionId:    String(body.sessionId ?? ""),
        amount:       Number(body.amount),
        originAmount: Number(body.originAmount),
        currency:     String(body.currency ?? ""),
        orderId:      Number(body.orderId),
        methodId:     Number(body.methodId),
        statement:    String(body.statement ?? ""),
        crc,
      }),
    )
    .digest("hex");

  /* Порівняння сталого часу: підпис — секрет, і різниця в швидкості
     відповіді дозволяє підбирати його побайтово. */
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
