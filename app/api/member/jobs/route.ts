export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { q } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const jobs = await q("SELECT * FROM kompas_jobs_v2 WHERE status = 'active' ORDER BY created_at DESC");

    // If no jobs exist yet, return a mock job so the frontend isn't empty, 
    // but clearly mark it as an example.
    const displayJobs = jobs.length > 0 ? jobs : [
      {
        id: '00000000-0000-0000-0000-000000000001',
        title: 'Комплектувальник на склад (Приклад)',
        company_name: 'Logistics Pro',
        location: 'Познань, Польща',
        salary_range: '4500 - 6000 PLN',
        employment_type: 'Повна зайнятість',
        description: 'Приклад вакансії. Додайте справжні вакансії через CRM адмінку.',
        requirements: ['Досвід роботи зі сканером', 'Базове знання польської', 'Готовність до позмінної роботи'],
        ai_match_reasoning: 'Ваш профіль частково відповідає вимогам. Фізична витривалість є перевагою.',
        ai_match_score: 85,
        status: 'active'
      }
    ];

    return NextResponse.json({ jobs: displayJobs });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
