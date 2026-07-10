import { NextResponse } from 'next/server';
import { q } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Insert into kompas_job_applications
    // Since we don't have user authentication fully wired up on the frontend yet,
    // we'll insert a null user_id, which the HR can later link if needed, 
    // or we'll update it once auth is fully integrated.
    await q(
      `INSERT INTO kompas_job_applications (job_id, status) VALUES ($1, 'new')`,
      [jobId]
    );

    // Simulate API delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error: any) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
