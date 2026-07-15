import { NextResponse } from 'next/server';
import { q, one } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const jobs = await q('SELECT * FROM kompas_jobs_v2 ORDER BY created_at DESC');
    
    // Fetch application counts for each job
    const stats = await q(`
      SELECT job_id, count(*) as count 
      FROM kompas_job_applications 
      GROUP BY job_id
    `);
    
    const statsMap = {};
    stats.forEach(s => { statsMap[s.job_id] = parseInt(s.count, 10); });

    const enrichedJobs = jobs.map(job => ({
      ...job,
      applicationsCount: statsMap[job.id] || 0
    }));

    return NextResponse.json({ jobs: enrichedJobs });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { title, company_name, location, salary_range, employment_type, description, requirements, ai_match_reasoning, ai_match_score, is_active } = body;

    const newJob = await one(`
      INSERT INTO kompas_jobs_v2 (
        title, company_name, location, salary_range, employment_type, 
        description, requirements, ai_match_reasoning, ai_match_score, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      title, company_name, location, salary_range, employment_type, 
      description, JSON.stringify(requirements || []), 
      ai_match_reasoning || 'Система проаналізує ваш профіль для розрахунку синергії.', 
      ai_match_score || 85, 
      is_active !== undefined ? is_active : true
    ]);

    return NextResponse.json({ job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAuth(["admin", "moderator"]);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await q('DELETE FROM kompas_jobs_v2 WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
