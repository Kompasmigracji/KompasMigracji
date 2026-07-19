import { NextResponse } from 'next/server';
import { processSoul } from '@/lib/lifeos/soulEngine';
import { processFate } from '@/lib/lifeos/fateEngine';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client to bypass RLS in Cron
export async function GET(req: Request) {
  // Vercel Cron Authentication: secret-first, header fallback when no secret is set
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const authorized = cronSecret
    ? authHeader === `Bearer ${cronSecret}`
    : req.headers.get('x-vercel-cron') === '1';
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Supabase URL missing' }, { status: 500 });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    // 1. Gather recent system activity
    const { data: recentLogs } = await supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
      
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    const logMessages = recentLogs?.map(l => `[${l.source}] ${l.message}`).join('\n') || '';

    // 2. Trigger SoulEngine (Subconscious & Emotion)
    const soulOutput = await processSoul({
      recentLogs: logMessages,
      recentTransactions: recentTransactions || []
    });

    // 3. Trigger FateEngine (Logic & Probability)
    const fateOutput = await processFate({
      recentLogs: logMessages,
      recentTransactions: recentTransactions || []
    });

    // 4. Save Insights back to System Logs
    await supabase.from('system_logs').insert([
      {
        level: 'info',
        source: 'SoulEngine',
        message: `SoulEngine Cycle Completed: Vibe is ${soulOutput.vibe}`,
        details: { insights: soulOutput.insights, resonance: soulOutput.resonance }
      },
      {
        level: 'info',
        source: 'FateEngine',
        message: `FateEngine Cycle Completed: Status is ${fateOutput.status}`,
        details: { probabilities: fateOutput.probabilities, recommendation: fateOutput.recommendation }
      }
    ]);

    return NextResponse.json({
      success: true,
      soul: soulOutput,
      fate: fateOutput
    });
  } catch (error: unknown) {
    console.error('LifeOS Cron Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
