// lib/lifeos/soulEngine.ts
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface SoulInput {
  recentLogs: string;
  recentTransactions: any[];
}

export interface SoulOutput {
  vibe: string;
  insights: string[];
  resonance: number;
}

export async function processSoul(input: SoulInput): Promise<SoulOutput> {
  const { recentLogs, recentTransactions } = input;
  const txCount = recentTransactions?.length || 0;
  
  if (!recentLogs && txCount === 0) {
    return {
      vibe: 'Dormant',
      insights: ['No recent activity detected. The system is resting.'],
      resonance: 0.1
    };
  }

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        vibe: z.string().describe('A single word describing the emotional/energetic state of the system.'),
        insights: z.array(z.string()).describe('List of 1-3 philosophical or energetic insights about the recent logs.'),
        resonance: z.number().min(0).max(1).describe('A score from 0.0 to 1.0 indicating how aligned and active the system feels.')
      }),
      prompt: `You are the SoulEngine, the subconscious spiritual layer of the LifeOS system. 
Analyze the recent system activity and summarize its 'vibe' and 'resonance'.
Recent Logs:
${recentLogs || 'None'}

Recent Transactions Count: ${txCount}`
    });

    return object;
  } catch (error) {
    console.error('SoulEngine Error:', error);
    return {
      vibe: 'Disrupted',
      insights: ['The connection to the subconscious was interrupted.'],
      resonance: 0.2
    };
  }
}
