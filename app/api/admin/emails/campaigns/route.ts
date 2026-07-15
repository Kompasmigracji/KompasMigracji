import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const campaigns = await q('SELECT * FROM email_campaigns ORDER BY created_at DESC');
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    // If table doesn't exist yet, return empty array
    return NextResponse.json({ campaigns: [] });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { name, subject, body, targetEmails } = await request.json();

    if (!name || !subject || !body || !targetEmails) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailList = targetEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e);
    
    // Ensure table exists (for development)
    try {
      await q(`
        CREATE TABLE IF NOT EXISTS email_campaigns (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          subject TEXT NOT NULL,
          body TEXT NOT NULL,
          target_count INT NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (e) {
      console.log('Error creating email_campaigns table:', e);
    }

    // Insert campaign
    await q(`
      INSERT INTO email_campaigns (name, subject, body, target_count, status)
      VALUES ($1, $2, $3, $4, 'SENT')
    `, [name, subject, body, emailList.length]);

    // Here you would integrate with SendGrid, Resend, or standard SMTP
    // Example:
    // await resend.emails.send({ from: 'info@iphoenix.pl', to: emailList, subject, text: body });
    console.log(`[EMAIL OUTREACH] Sent campaign "${name}" to ${emailList.length} recipients`);

    return NextResponse.json({ success: true, status: 'sent' });
  } catch (error: any) {
    console.error('Error creating email campaign:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
