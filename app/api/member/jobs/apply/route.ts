import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = await requireAuth(["member", "admin"]);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { jobId } = await request.json();

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await q(
      `INSERT INTO kompas_job_applications (job_id, status) VALUES ($1, 'new')`,
      [jobId]
    );

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error: any) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
