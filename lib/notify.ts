import sgMail from '@sendgrid/mail';

// Initialize SendGrid (API key should be set in env var SENDGRID_API_KEY)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured – email not sent');
    return false;
  }
  const msg = {
    to,
    from: 'no-reply@kompasmigracji.com', // verified sender
    subject,
    html,
  };
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Failed to send email', error);
    return false;
  }
}

// Slack webhook placeholder (can be expanded later)
export async function sendSlackWebhook(url: string, payload: any) {
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
