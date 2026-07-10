import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { sendInitialMessage } from '@/lib/whatsapp';

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

    const result = await q(`
      INSERT INTO kompas_leads (name, phone, source, notes, status)
      VALUES ($1, $2, $3, $4, 'New Request')
      RETURNING id
    `, [name, phone, source, notes]);
    const newLeadId = result[0]?.id || null;

    // Add a notification for the CRM
    try {
      await q(`
        INSERT INTO notifications (title, message, type)
        VALUES ($1, $2, 'info')
      `, ['Новий клієнт на Архітектуру!', `${name} (${phone}) хоче пакет ${pkgName}.`]);
    } catch (e) {
      console.log('Could not insert notification, probably table missing or schema differs.');
    }

    // Trigger AI Assistant outreach via WhatsApp
    try {
      const welcomeMsg = `Вітаю, ${name}! Я AI-асистент Олександра (iPhoenix Architecture). Отримали ваш запит на пакет ${pkgName} для об'єкта (${objectType}). Підкажіть, чи є у вас обмірний план або креслення БТІ? Це допоможе нам швидше розпочати роботу.`;
      
      await sendInitialMessage(phone, "hello_architecture");
      console.log(`[WHATSAPP MOCK] Triggered outbound message for ${name} at ${phone}`);
    } catch (e) {
      console.log('WhatsApp Bot outreach failed:', e);
    }

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (error: any) {
    console.error('Error capturing architecture lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
