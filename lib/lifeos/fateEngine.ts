// lib/lifeos/fateEngine.ts
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface FateInput {
  recentLogs: string;
  recentTransactions: any[];
}

export interface FateOutput {
  status: string;
  probabilities: Record<string, number>;
  recommendation: string;
}

export async function processFate(input: FateInput): Promise<FateOutput> {
  const { recentLogs, recentTransactions } = input;
  const txCount = recentTransactions?.length || 0;
  
  if (!recentLogs && txCount === 0) {
    return {
      status: 'Stagnant',
      probabilities: { 'growth': 0.1, 'stagnation': 0.9 },
      recommendation: 'Initiate activity to generate momentum.'
    };
  }

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        status: z.string().describe('A 1-2 word status of the system (e.g. "Balanced", "Accelerating", "Overloaded").'),
        probabilities: z.record(z.string(), z.number().min(0).max(1)).describe('A map of 2-3 likely future events and their probability (0.0-1.0). e.g. {"burnout": 0.2, "growth": 0.8}'),
        recommendation: z.string().describe('A 1-2 sentence recommendation on what the Architect should focus on next based on the recent system load.')
      }),
      prompt: `You are the FateEngine, the probability and logic forecasting layer of LifeOS. 
Analyze the recent system activity, identify potential trajectories, and calculate probabilities of future states.
Recent Logs:
${recentLogs || 'None'}

Recent Transactions Count: ${txCount}`
    });

    return object;
  } catch (error) {
    console.error('FateEngine Error:', error);
    return {
      status: 'Unknown',
      probabilities: { 'error': 1.0 },
      recommendation: 'System logic is currently disconnected.'
    };
  }
}
