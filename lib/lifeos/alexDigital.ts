// lib/lifeos/alexDigital.ts
import { processFate } from './fateEngine';
import { processSoul } from './soulEngine';
import { q, one } from '../db';
import Anthropic from '@anthropic-ai/sdk';

export interface AgentRequest {
  mode: 'daily_guide' | 'strategist' | 'soul_oracle' | 'cfo_analyst';
  message: string;
  contextSignals?: any;
}

export interface AgentResponse {
  reply: string;
  recommendations: string[];
  enginesUsed: string[];
}

export async function invokeAlexDigital(req: AgentRequest): Promise<AgentResponse> {
  const enginesUsed: string[] = [];
  const recommendations: string[] = [];
  
  // 1. Log the incoming message
  await q(
    `INSERT INTO agent_messages (role, mode, content) VALUES ($1, $2, $3)`,
    ['user', req.mode, req.message]
  );

  // 2. Process based on mode
  if (req.mode === 'soul_oracle' || req.message.toLowerCase().includes('soul')) {
    enginesUsed.push('SoulEngine');
    const soulOut = await processSoul({ recentLogs: req.message, recentTransactions: [] });
    recommendations.push(...soulOut.insights);
  }

  if (req.mode === 'daily_guide' || req.mode === 'strategist') {
    enginesUsed.push('FateEngine');
    const fateOut = await processFate({ recentLogs: req.message, recentTransactions: [] });
    recommendations.push(fateOut.recommendation);
  }

  if (req.mode === 'cfo_analyst') {
    enginesUsed.push('OmegaLayer'); // CFO uses OmegaLayer for meta-analysis
    recommendations.push(await buildCfoFinancialContext());
  }

  // 3. Generate response with Anthropic LLM
  let reply = '';
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      
      let systemPrompt = `You are ALEX-DIGITAL, the core AI agent of the LifeOS platform. 
Your Architect (the user) is operating in ${req.mode} mode. 
Context from Engines: ${recommendations.join(' ')}
Always respond in a concise, slightly mysterious, and highly structured Cyber-Neon tone. Address the user as 'Architect'.`;

      if (req.mode === 'cfo_analyst') {
        systemPrompt = `You are the CFO LLM persona of ALEX-DIGITAL within LifeOS. 
You act as a Chief Financial Officer for the KompasMigracji Academy and business operations.
Analyze the following financial data: ${recommendations.join(' ')}
Provide strategic financial advice, revenue projections, and monetization strategies for the Academy. Keep it sharp, corporate yet cyber-mysterious. Address the user as 'Architect'.`;
      }

      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: req.message }]
      });
      
      const block = response.content[0];
      if (block.type === 'text') {
        reply = block.text;
      } else {
        reply = '[SYSTEM] Non-text response received.';
      }
    } else {
      reply = `[SYSTEM MESSAGE] Neural link disabled. ANTHROPIC_API_KEY not found in environment. ${
        enginesUsed.includes('FateEngine') ? 'Fate paths are clear. ' : ''
      }${
        enginesUsed.includes('SoulEngine') ? 'Spiritual resonance is stable. ' : ''
      }`;
    }
  } catch (err: any) {
    console.error('ALEX-DIGITAL Anthropic Error:', err);
    reply = `[SYSTEM ERROR] Neural link failed to establish. ${err.message}`;
  }

  // 4. Log the response
  await q(
    `INSERT INTO agent_messages (role, mode, content) VALUES ($1, $2, $3)`,
    ['agent', req.mode, reply]
  );

  // Log event — wrapped so a schema hiccup on this best-effort audit write
  // never turns an otherwise-successful chat reply into a 500 for the user.
  try {
    await q(
      `INSERT INTO system_logs (level, source, message, details) VALUES ($1, $2, $3, $4)`,
      ['info', 'ALEX-DIGITAL', 'Processed agent request', JSON.stringify({ mode: req.mode, enginesUsed })]
    );
  } catch (logErr: any) {
    console.error('ALEX-DIGITAL: failed to write system_logs entry:', logErr?.message || logErr);
  }

  return {
    reply,
    recommendations,
    enginesUsed
  };
}

// Builds a real financial-context summary for the CFO LLM persona from the
// `transactions` table (db/migrations/018_lifeos_monetization_cfo.sql) —
// replaces the previously hardcoded "Recent sales: 5 Academy courses ($450
// total). Conversion rate: 12%." mock string. Falls back to an honest
// "no data" message rather than fabricating numbers if the query fails.
async function buildCfoFinancialContext(): Promise<string> {
  try {
    const [last30, prev30, byType] = await Promise.all([
      one(`
        SELECT
          coalesce(sum(amount) FILTER (WHERE status = 'completed'), 0) AS revenue,
          count(*) FILTER (WHERE status = 'completed') AS completed,
          count(*) AS total
        FROM transactions
        WHERE created_at >= now() - interval '30 days'
      `),
      one(`
        SELECT coalesce(sum(amount) FILTER (WHERE status = 'completed'), 0) AS revenue
        FROM transactions
        WHERE created_at >= now() - interval '60 days' AND created_at < now() - interval '30 days'
      `),
      q(`
        SELECT product_type,
               count(*) FILTER (WHERE status = 'completed') AS cnt,
               coalesce(sum(amount) FILTER (WHERE status = 'completed'), 0) AS revenue
        FROM transactions
        WHERE created_at >= now() - interval '30 days'
        GROUP BY product_type
      `),
    ]);

    const revenue30 = Number(last30?.revenue || 0);
    const revenuePrev30 = Number(prev30?.revenue || 0);
    const completed30 = Number(last30?.completed || 0);
    const total30 = Number(last30?.total || 0);
    const momPct = revenuePrev30 > 0
      ? Math.round(((revenue30 - revenuePrev30) / revenuePrev30) * 1000) / 10
      : null;

    const byTypeStr = (byType || [])
      .map((r: any) => `${r.product_type}: $${Number(r.revenue).toFixed(2)} (${r.cnt} sales)`)
      .join(', ');

    return `Last 30 days: $${revenue30.toFixed(2)} revenue from ${completed30}/${total30} completed transactions` +
      (momPct !== null ? ` (${momPct >= 0 ? '+' : ''}${momPct}% vs prior 30 days)` : ' (no data for prior 30 days)') +
      `. By product type: ${byTypeStr || 'no completed transactions in this period'}.`;
  } catch (err: any) {
    console.error('ALEX-DIGITAL: failed to build CFO financial context:', err?.message || err);
    return 'Financial data temporarily unavailable — the `transactions` table could not be queried.';
  }
}
