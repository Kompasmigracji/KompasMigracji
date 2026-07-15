import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  try {
    // For now we get the first member to demonstrate Stage 1
    // In production, you would use getSupabase() with auth session
    const { data: profile, error } = await supabase
      .from('kompas_member_profiles')
      .select(`
        *,
        kompas_users!inner(full_name, email)
      `)
      .limit(1)
      .single();

    if (error || !profile) {
      // Return a 404 or a fallback mock if no member exists yet
      return NextResponse.json({
        name: "Анонім",
        role: "Гість",
        id: "KP-0000",
        status: "unverified",
        completion: 10,
        ai_summary: "Профіль не заповнено. Спробуйте оновити базу даних.",
        languages: [],
        documents: [],
        experience: [],
        education: []
      });
    }

    // Now fetch related data
    const [docs, exp, edu] = await Promise.all([
      supabase.from('kompas_member_documents').select('*').eq('user_id', profile.user_id),
      supabase.from('kompas_member_experience').select('*').eq('user_id', profile.user_id),
      supabase.from('kompas_member_education').select('*').eq('user_id', profile.user_id),
    ]);

    return NextResponse.json({
      name: profile.kompas_users?.full_name || "Невідомий користувач",
      role: profile.category === 'premium' ? 'Premium Учасник' : 'Стандартний Учасник',
      id: profile.member_no || `KP-ID-${profile.user_id}`,
      status: "verified",
      completion: profile.profile_completion || 20,
      ai_summary: profile.ai_summary || "Ваш AI-помічник готовий до роботи. Заповніть дані, щоб отримати персоналізовані поради.",
      languages: profile.language_skills || [],
      documents: (docs.data || []).map(d => ({
        id: d.id,
        type: d.doc_type,
        number: d.doc_number,
        expires: d.expires_at,
        verified: d.is_verified,
        expired: new Date(d.expires_at) < new Date()
      })),
      experience: (exp.data || []).map(e => ({
        id: e.id,
        title: e.title,
        company: e.company,
        start: e.start_date,
        end: e.end_date || 'Current',
        skills: e.skills || []
      })),
      education: (edu.data || []).map(e => ({
        id: e.id,
        institution: e.institution,
        degree: e.degree,
        year: e.end_date ? e.end_date.split('-')[0] : 'Теперішній час'
      }))
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
