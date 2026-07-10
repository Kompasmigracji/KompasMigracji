import { NextResponse } from 'next/server';
import { q } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, objectType, area, package: pkgName } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Insert lead into kompas_leads table
    // Assuming kompas_leads has fields: name, phone, email, source, notes, status, created_at
    const source = 'iPhoenix Architecture Landing';
    const notes = `Об'єкт: ${objectType}, Метраж: ${area || 'не вказано'} м², Пакет: ${pkgName}`;

    await q(`
      INSERT INTO kompas_leads (name, phone, source, notes, status)
      VALUES ($1, $2, $3, $4, 'New Request')
    `, [name, phone, source, notes]);

    // Add a notification for the CRM (if notifications table exists)
    try {
      await q(`
        INSERT INTO notifications (title, message, type)
        VALUES ($1, $2, 'info')
      `, ['Новий клієнт на Архітектуру!', `${name} (${phone}) хоче пакет ${pkgName}.`]);
    } catch (e) {
      // Ignore if notifications table doesn't exist
      console.log('Could not insert notification, probably table missing or schema differs.');
    }

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (error: any) {
    console.error('Error capturing architecture lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
