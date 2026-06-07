// Notification adapters
// Primary: email via SendGrid REST API (no CJS import issues)
// Fallback: Slack webhook

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SendGrid API key not configured – email not sent');
    return false;
  }

  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: 'no-reply@kompasmigracji.com', name: 'KompasMigracji Primus' },
    subject,
    content: [{ type: 'text/html', value: html }],
  };

  try {
    const res = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('SendGrid error', res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send email', error);
    return false;
  }
}

export async function sendSlackWebhook(url: string, payload: any): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    console.error('Slack webhook error', e);
    return false;
  }
}
