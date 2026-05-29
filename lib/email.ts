// F13: Email notification system via Resend API
// Usage: import { sendEmail, welcomeEmail, caseUpdateEmail } from "@/lib/email"
// Requires: RESEND_API_KEY env var; FROM_EMAIL optional (default noreply@kompasmigracji.com)

import { q } from "@/lib/db";

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.FROM_EMAIL || "KompasMigracji <noreply@kompasmigracji.com>";
const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  template?: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!RESEND_KEY) {
    console.log("[email] RESEND_API_KEY not configured — skipping:", { to, subject });
    return { ok: false, error: "no_api_key" };
  }

  let status = "sent";
  let errMsg: string | undefined;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) {
      status = "failed";
      errMsg = data?.message || String(res.status);
    }
    // Log non-blocking
    q(
      "INSERT INTO kompas_email_log (recipient, subject, template, status, error) VALUES ($1,$2,$3,$4,$5)",
      [to, subject, template || null, status, errMsg || null],
    ).catch(() => {});
    return res.ok ? { ok: true, id: data?.id } : { ok: false, error: errMsg };
  } catch (err: any) {
    q(
      "INSERT INTO kompas_email_log (recipient, subject, template, status, error) VALUES ($1,$2,$3,$4,$5)",
      [to, subject, template || null, "failed", err.message],
    ).catch(() => {});
    return { ok: false, error: err.message };
  }
}

// ── HTML Templates ────────────────────────────────────────────────────────────

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kompas Migracji</title></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background:#D8232A;padding:24px;text-align:center;">
  <div style="font-size:28px;margin-bottom:6px;">&#x1F9ED;</div>
  <div style="color:#fff;font-size:20px;font-weight:700;letter-spacing:0.5px;">Kompas Migracji</div>
  <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">Profesjonalna pomoc dla migrantow</div>
</td></tr>
<tr><td style="padding:28px 32px;">${content}</td></tr>
<tr><td style="background:#F9FAFB;padding:20px 32px;text-align:center;font-size:12px;color:#9CA3AF;border-top:1px solid #E5E7EB;">
  Kompas Migracji sp. z o.o. &middot; kontakt: <a href="mailto:kontakt@kompasmigracji.com" style="color:#D8232A;">kontakt@kompasmigracji.com</a><br>
  <a href="${SITE}" style="color:#D8232A;">kompasmigracji.com</a> &middot; WhatsApp: +48 729 271 848
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// F14: Welcome email after lead creation
export function welcomeEmailHtml(name: string): string {
  return baseLayout(`
<h2 style="margin:0 0 16px;font-size:20px;color:#111;">Czesc, ${name}! &#x1F44B;</h2>
<p style="margin:0 0 16px;line-height:1.7;color:#374151;">
  Dziekujemy za kontakt z <strong>Kompas Migracji</strong>. Twoje zgloszenie zostalo
  przyjete i nasz konsultant skontaktuje sie z Toba w ciagu <strong>24 godzin</strong>.
</p>
<div style="background:#FFF7ED;border:1px solid #FDE68A;border-radius:8px;padding:16px;margin:0 0 24px;">
  <div style="font-weight:600;color:#92400E;margin-bottom:8px;">&#x1F4CB; Co dalej?</div>
  <ul style="margin:0;padding-left:20px;line-height:1.8;color:#78350F;">
    <li>Przygotuj swoje dokumenty tozsamosci</li>
    <li>Sprawdz status sprawy: <a href="${SITE}/portal" style="color:#D8232A;">${SITE}/portal</a></li>
    <li>Napisz do nas na WhatsApp: +48 729 271 848</li>
  </ul>
</div>
<div style="text-align:center;margin:0 0 8px;">
  <a href="https://wa.me/48729271848?text=Dzien+dobry!+Zglaszam+sie+w+sprawie+mojej+aplikacji."
    style="display:inline-block;padding:13px 28px;background:#25D366;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px;">
    &#x1F4AC; Napisz na WhatsApp
  </a>
</div>
<p style="text-align:center;margin:16px 0 0;font-size:12px;color:#9CA3AF;">
  Lub zadzwon: <a href="tel:+48729271848" style="color:#D8232A;">+48 729 271 848</a>
</p>`);
}

// F15: Case status update email
export function caseUpdateEmailHtml(name: string, status: string, notes?: string): string {
  const labels: Record<string, string> = {
    new: "Nowe zgloszenie",
    in_progress: "W trakcie realizacji",
    closed: "Zakonczone",
    converted: "Zakonczone sukcesem &#x1F389;",
  };
  const icons: Record<string, string> = {
    new: "&#x1F4CB;",
    in_progress: "&#x2699;&#xFE0F;",
    closed: "&#x2705;",
    converted: "&#x1F389;",
  };
  const statusLabel = labels[status] || status;
  const icon = icons[status] || "&#x1F4CB;";

  return baseLayout(`
<h2 style="margin:0 0 8px;font-size:20px;color:#111;">Aktualizacja Twojej sprawy</h2>
<p style="margin:0 0 20px;color:#6B7280;font-size:14px;">Czesc, <strong>${name}</strong>!</p>
<div style="background:#F0FDF4;border:2px solid #10B981;border-radius:10px;padding:20px;text-align:center;margin:0 0 20px;">
  <div style="font-size:32px;margin-bottom:8px;">${icon}</div>
  <div style="font-size:18px;font-weight:700;color:#065F46;">${statusLabel}</div>
</div>
${notes ? `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px;margin:0 0 20px;">
  <div style="font-weight:600;color:#92400E;margin-bottom:6px;">&#x1F4AC; Wiadomosc od konsultanta:</div>
  <div style="color:#78350F;line-height:1.6;">${notes}</div>
</div>` : ""}
<div style="text-align:center;">
  <a href="${SITE}/portal"
    style="display:inline-block;padding:13px 28px;background:#D8232A;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px;">
    Sprawdz status sprawy &#x2192;
  </a>
</div>`);
}

// F17: Subscription invoice email
export function invoiceEmailHtml(
  name: string,
  plan: string,
  amount: number,
  invoiceId: string,
  periodEnd: string,
): string {
  return baseLayout(`
<h2 style="margin:0 0 16px;font-size:20px;color:#111;">Potwierdzenie subskrypcji</h2>
<p style="margin:0 0 20px;color:#374151;line-height:1.7;">
  Dziekujemy, <strong>${name}</strong>! Twoja subskrypcja <strong>${plan}</strong>
  zostala aktywowana.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin:0 0 20px;">
  <tr style="background:#F9FAFB;">
    <td style="padding:10px 16px;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;">Plan</td>
    <td style="padding:10px 16px;font-size:13px;font-weight:600;text-align:right;">${plan}</td>
  </tr>
  <tr>
    <td style="padding:10px 16px;font-size:12px;color:#6B7280;">Kwota</td>
    <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#D8232A;text-align:right;">${amount} PLN / mies.</td>
  </tr>
  <tr style="background:#F9FAFB;">
    <td style="padding:10px 16px;font-size:12px;color:#6B7280;">Nastepne odnowienie</td>
    <td style="padding:10px 16px;font-size:13px;text-align:right;">${periodEnd}</td>
  </tr>
  <tr>
    <td style="padding:10px 16px;font-size:12px;color:#6B7280;">Nr faktury</td>
    <td style="padding:10px 16px;font-size:13px;font-family:monospace;text-align:right;">${invoiceId}</td>
  </tr>
</table>
<div style="text-align:center;">
  <a href="${SITE}/portal"
    style="display:inline-block;padding:13px 28px;background:#D8232A;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px;">
    Przejdz do portalu &#x2192;
  </a>
</div>`);
}

// NPS survey invitation email
export function npsSurveyEmailHtml(name: string, token: string): string {
  const surveyUrl = `${SITE}/nps/${token}`;
  return baseLayout(`
<h2 style="margin:0 0 16px;font-size:20px;color:#111;">Jak oceniasz nasza pomoc?</h2>
<p style="margin:0 0 16px;line-height:1.7;color:#374151;">
  Czesc, <strong>${name}</strong>! Twoja sprawa zostala zamknieta.
  Bedziemy wdzieczni za opinie — zajmie to tylko 30 sekund.
</p>
<div style="text-align:center;margin:24px 0;">
  <a href="${surveyUrl}"
    style="display:inline-block;padding:14px 32px;background:#D8232A;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;font-size:16px;">
    &#x2B50; Ocen nasze uslugi
  </a>
</div>
<p style="text-align:center;font-size:12px;color:#9CA3AF;">
  Lub skopiuj link: <a href="${surveyUrl}" style="color:#D8232A;">${surveyUrl}</a>
</p>`);
}
