import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// Выносим мок-данные в отдельную константу для чистоты и легкого управления
const MOCK_PARTNERS = [
  {
    id: "p-1",
    name: "Lex Secure Poland",
    category: "Юриспруденція",
    description: "Перевірена юридична фірма, що спеціалізується на міграційному праві, апеляціях та дозволах на проживання.",
    logo_url: "https://ui-avatars.com/api/?name=Lex+Secure&background=0D8ABC&color=fff&size=128",
    website_url: "https://example.com",
    rating: 4.9,
    verification_status: "Verified",
    offers: [
      { id: "o-1", title: "-20% на консультацію адвоката", discount_type: "Percentage", discount_value: 20, promo_code: "KOMPAS-LEX-20" },
      { id: "o-2", title: "Безкоштовний аудит документів", discount_type: "Free Tier", discount_value: 0, promo_code: "KOMPAS-AUDIT" }
    ]
  }
];

/**
 * GET /api/member/partners
 * Fetches a list of partners.
 *
 * В будущем можно добавить параметры запроса для пагинации, фильтрации и сортировки:
 * @param {URLSearchParams} request.url.searchParams - e.g., ?page=1&limit=10&category=legal
 */
export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase client not initialized. Falling back to mock data.');
      // В случае отсутствия Supabase, возвращаем мок-данные, чтобы фронтенд не падал.
      return NextResponse.json({ partners: MOCK_PARTNERS });
    }

    const { data: dbPartners, error } = await supabase
      .from('kompas_partners')
      .select('*');

    if (error) {
      console.error('Supabase error fetching partners:', error.message);
      // Не прерываем работу, если БД недоступна, а отдаем мок-данные.
      // В продакшене можно вернуть ошибку 503 Service Unavailable.
      return NextResponse.json({ 
        partners: MOCK_PARTNERS, 
        warning: 'Database is currently unavailable. Serving mock data.' 
      });
    }

    // Если база данных пуста, используем мок-данные.
    if (!dbPartners || dbPartners.length === 0) {
      return NextResponse.json({ partners: MOCK_PARTNERS });
    }

    // Обогащаем данные из БД. В будущем логику предложений (offers) стоит перенести в БД.
    const mappedPartners = dbPartners.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      logo_url: p.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&color=fff&size=128`,
      website_url: p.website_url || "https://example.com", // Предполагаем, что URL может быть в БД
      rating: p.rating || 4.5,
      verification_status: p.verification_status || "Verified",
      // Мок-данные для предложений, пока их нет в БД
      offers: [
        { id: `o-${p.id}-1`, title: "-10% зі знижкою Kompas", discount_type: "Percentage", discount_value: 10, promo_code: `KOMPAS-${p.id}` }
      ]
    }));

    return NextResponse.json({ partners: mappedPartners });

  } catch (error: any) {
    console.error("Critical error in GET /api/member/partners:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
