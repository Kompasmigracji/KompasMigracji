import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req) {
  try {
    // Attempt to fetch from Supabase if configured
    // const supabase = getSupabaseAdmin();
    // For now, return mock data for the masterpiece UI
    
    const mockPartners = [
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
      },
      {
        id: "p-2",
        name: "HomeRentals Warszawa",
        category: "Житло",
        description: "Агенція нерухомості. Оренда квартир без прихованих комісій та з договорами, що підходять для Карти Побиту.",
        logo_url: "https://ui-avatars.com/api/?name=Home+Rentals&background=F59E0B&color=fff&size=128",
        website_url: "https://example.com",
        rating: 4.7,
        verification_status: "Verified",
        offers: [
          { id: "o-3", title: "-50% на комісію агенції", discount_type: "Percentage", discount_value: 50, promo_code: "KOMPAS-HOME50" }
        ]
      },
      {
        id: "p-3",
        name: "PZU Insurance",
        category: "Страхування",
        description: "Медичне страхування для іноземців, що відповідає всім вимогам Уряду у Справах Іноземців.",
        logo_url: "https://ui-avatars.com/api/?name=PZU&background=10B981&color=fff&size=128",
        website_url: "https://example.com",
        rating: 4.8,
        verification_status: "Verified",
        offers: [
          { id: "o-4", title: "-10% на медичний поліс", discount_type: "Percentage", discount_value: 10, promo_code: "KOMPAS-PZU10" }
        ]
      },
      {
        id: "p-4",
        name: "EduLingua School",
        category: "Освіта",
        description: "Курси польської мови для отримання сертифікату B1 (необхідного для резидента/громадянства).",
        logo_url: "https://ui-avatars.com/api/?name=Edu+Lingua&background=8B5CF6&color=fff&size=128",
        website_url: "https://example.com",
        rating: 4.9,
        verification_status: "Verified",
        offers: [
          { id: "o-5", title: "1 місяць навчання безкоштовно", discount_type: "Fixed Amount", discount_value: 0, promo_code: "KOMPAS-EDU1M" }
        ]
      },
      {
        id: "p-5",
        name: "Przychodnia Medica",
        category: "Медицина",
        description: "Мережа приватних клінік. Швидкий доступ до спеціалістів та медичні огляди (badań medycyny pracy).",
        logo_url: "https://ui-avatars.com/api/?name=Medica&background=EF4444&color=fff&size=128",
        website_url: "https://example.com",
        rating: 4.6,
        verification_status: "Verified",
        offers: [
          { id: "o-6", title: "-15% на візит до профільного лікаря", discount_type: "Percentage", discount_value: 15, promo_code: "KOMPAS-MED15" }
        ]
      }
    ];

    return NextResponse.json({ partners: mockPartners }, { status: 200 });

  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
