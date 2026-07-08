import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    const { jobId } = await request.json();

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Since we don't have user authentication fully wired up in this mockup API, we'll return success
    // In a real scenario, we would:
    // 1. Get current user ID
    // 2. Fetch their kompas_member_profile.id
    // 3. Insert into kompas_job_applications (job_id, member_id, status='applied')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error: any) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
