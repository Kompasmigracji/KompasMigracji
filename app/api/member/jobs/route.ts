import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Since we don't have user authentication fully wired up in this mockup API, we'll fetch mock jobs
    // In a real scenario, we would:
    // 1. Get current user ID
    // 2. Fetch their kompas_member_profile
    // 3. Fetch active kompas_jobs
    // 4. Calculate AI Match for each job based on the profile
    
    // For now, let's return some mock jobs
    const mockJobs = [
      {
        id: 'job-1',
        title: 'Senior Frontend Developer',
        company_name: 'TechCorp Poland',
        location: 'Warsaw / Remote',
        salary_range: '18,000 - 25,000 PLN (B2B)',
        employment_type: 'B2B',
        description: 'We are looking for a Senior React/Next.js developer to join our core product team.',
        requirements: ['React', 'Next.js', 'TypeScript', 'English B2', 'Polish A2'],
        ai_match_score: 95,
        ai_match_reasoning: 'Ваш досвід з React та Next.js ідеально підходить. Рівень англійської також відповідає вимогам.'
      },
      {
        id: 'job-2',
        title: 'Project Manager',
        company_name: 'BuildIt Sp. z o.o.',
        location: 'Kraków',
        salary_range: '12,000 - 16,000 PLN',
        employment_type: 'Umowa o pracę',
        description: 'Manage IT projects and coordinate teams in a fast-paced environment.',
        requirements: ['Scrum', 'Jira', 'English C1', 'Polish B2'],
        ai_match_score: 60,
        ai_match_reasoning: 'У вас є навички менеджменту, але рівень польської мови може бути недостатнім для цієї позиції.'
      },
      {
        id: 'job-3',
        title: 'Warehouse Specialist',
        company_name: 'Logistix',
        location: 'Wrocław',
        salary_range: '6,000 - 8,000 PLN',
        employment_type: 'Umowa Zlecenie',
        description: 'Organize inventory and manage warehouse logistics.',
        requirements: ['No prior experience required', 'Basic Polish'],
        ai_match_score: 40,
        ai_match_reasoning: 'Ви overqualified для цієї позиції (ваша кваліфікація значно вища за необхідну).'
      }
    ];

    return NextResponse.json({ jobs: mockJobs });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
