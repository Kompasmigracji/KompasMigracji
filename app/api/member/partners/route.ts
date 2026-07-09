import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    // Attempt to fetch from Supabase if configured
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    const { data, error } = await supabase.from('kompas_partners').select('*');
    if (error) {
      console.error('Supabase partners error:', error);
    }
    
    const dbPartners = data || [];
    
    // Merge DB partners with some mock offers since our DB doesn't have offers yet
    const mappedPartners = dbPartners.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        logo_url: p.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&color=fff&size=128`,
        website_url: "https://example.com",
        rating: p.rating || 4.5,
        verification_status: "Verified",
        offers: [
          { id: `o-${p.id}`, title: "-10% зі знижкою Kompas", discount_type: "Percentage", discount_value: 10, promo_code: "KOMPAS-10" }
        ]
    }));

    // If DB is empty, fallback to a dummy array
    if (mappedPartners.length === 0) {
       mappedPartners.push({
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
       });
    }

    return NextResponse.json({ partners: mappedPartners }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
