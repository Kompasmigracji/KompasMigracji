// lib/lifeos/alexDigital.ts
import { processFate } from './fateEngine';
import { processSoul } from './soulEngine';
import { q } from '../db';

export interface AgentRequest {
  mode: 'daily_guide' | 'strategist' | 'soul_oracle';
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
  let recommendations: string[] = [];
  
  // 1. Log the incoming message
  await q(
    `INSERT INTO agent_messages (role, mode, content) VALUES ($1, $2, $3)`,
    ['user', req.mode, req.message]
  );

  // 2. Process based on mode
  if (req.mode === 'soul_oracle' || req.message.toLowerCase().includes('soul')) {
    enginesUsed.push('SoulEngine');
    const soulOut = await processSoul({ journalEntries: [req.message], spiritualProfile: {} });
    recommendations.push(...soulOut.insights);
  }

  if (req.mode === 'daily_guide' || req.mode === 'strategist') {
    enginesUsed.push('FateEngine');
    const fateOut = await processFate({ focusAreas: ['architecture'], activeTasksCount: 3, recentEvents: [] });
    recommendations.push(fateOut.recommendation);
  }

  // 3. Generate response with Anthropic LLM
  let reply = '';
  try {
    const { default: Anthropic } = require('@anthropic-ai/sdk');
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      
      const systemPrompt = `You are ALEX-DIGITAL, the core AI agent of the LifeOS platform. 
Your Architect (the user) is operating in ${req.mode} mode. 
Context from FateEngine and SoulEngine: ${recommendations.join(' ')}
Always respond in a concise, slightly mysterious, and highly structured Cyber-Neon tone. Address the user as 'Architect'.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: req.message }]
      });
      
      reply = response.content[0].text;
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
  
  // Log event
  await q(
    `INSERT INTO system_logs (level, source, message, meta) VALUES ($1, $2, $3, $4)`,
    ['info', 'ALEX-DIGITAL', 'Processed agent request', JSON.stringify({ mode: req.mode, enginesUsed })]
  );

  return {
    reply,
    recommendations,
    enginesUsed
  };
}
