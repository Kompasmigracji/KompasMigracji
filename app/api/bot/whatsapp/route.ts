import { NextResponse } from 'next/server';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'iphoenix_secure_token';

// VERIFICATION ENDPOINT FOR META
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }
  return new NextResponse('Bad Request', { status: 400 });
}

// INCOMING MESSAGES ENDPOINT
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object) {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
        
        const phoneNumber = body.entry[0].changes[0].value.messages[0].from;
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

        console.log(`[WHATSAPP] Message from ${phoneNumber}: ${msgBody}`);

        // TODO: In production, send msgBody to OpenAI with our System Prompt
        // const aiResponse = await getOpenAIResponse(msgBody);
        const aiResponse = "Дякую за повідомлення! Я AI-асистент студії iPhoenix. Олександр зараз працює над проектом, але я передав йому вашу інформацію. Чим я можу ще допомогти?";

        // Send reply back to user
        if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID) {
          await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: phoneNumber,
              text: { body: aiResponse }
            })
          });
        } else {
          console.log(`[WHATSAPP MOCK REPLY] To: ${phoneNumber} | MSG: ${aiResponse}`);
        }
      }
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    } else {
      return new NextResponse('Not Found', { status: 404 });
    }
  } catch (err: any) {
    console.error('WhatsApp Webhook Error:', err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
