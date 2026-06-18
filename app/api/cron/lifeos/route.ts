import { NextResponse } from 'next/server';
import { processSoul } from '@/lib/lifeos/soulEngine';
import { processFate } from '@/lib/lifeos/fateEngine';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client to bypass RLS in Cron
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export async function GET(req: Request) {
  // Vercel Cron Authentication
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
