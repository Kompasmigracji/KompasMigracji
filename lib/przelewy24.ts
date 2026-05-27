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

/**
 * Реєструє нову транзакцію в P24 і повертає URL для оплати.
 * Клієнт відкриває paymentUrl і завершує оплату на сайті P24.
 */
export async function registerTransaction(
  params: RegisterParams,
): Promise<RegisterResult> {
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
      "Content-Type": "application/json",
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
