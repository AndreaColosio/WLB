import { prisma } from './prisma.js';

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// Approximate cost per 1M tokens (as of 2024)
const COST_PER_MILLION = {
  'gpt-4o-mini': {
    input: 0.15,  // $0.15 per 1M input tokens
    output: 0.60, // $0.60 per 1M output tokens
  },
  'gpt-4o': {
    input: 2.50,
    output: 10.00,
  },
  'gpt-4-turbo': {
    input: 10.00,
    output: 30.00,
  },
};

export function calculateCost(usage: TokenUsage, model: string): number {
  const costs = COST_PER_MILLION[model as keyof typeof COST_PER_MILLION] || COST_PER_MILLION['gpt-4o-mini'];

  const inputCost = (usage.promptTokens / 1_000_000) * costs.input;
  const outputCost = (usage.completionTokens / 1_000_000) * costs.output;

  return inputCost + outputCost;
}

export function logTokenUsage(
  userId: string,
  model: string,
  usage: TokenUsage,
  endpoint: string
) {
  const cost = calculateCost(usage, model);

  console.log(`[OpenAI Usage] User: ${userId}, Model: ${model}, Endpoint: ${endpoint}`);
  console.log(`  Tokens: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total`);
  console.log(`  Estimated cost: $${cost.toFixed(6)}`);

  // In a production app, you'd save this to a database table
  // For now, we just log it
}

// Track daily/monthly usage per user
interface UsageStats {
  totalTokens: number;
  totalCost: number;
  requestCount: number;
}

const usageCache = new Map<string, UsageStats>();

export function trackUsage(userId: string, usage: TokenUsage, model: string) {
  const key = `${userId}:${new Date().toISOString().split('T')[0]}`; // userId:YYYY-MM-DD

  const stats = usageCache.get(key) || {
    totalTokens: 0,
    totalCost: 0,
    requestCount: 0,
  };

  stats.totalTokens += usage.totalTokens;
  stats.totalCost += calculateCost(usage, model);
  stats.requestCount += 1;

  usageCache.set(key, stats);

  logTokenUsage(userId, model, usage, 'chat');

  return stats;
}

export function getUserDailyUsage(userId: string): UsageStats | null {
  const key = `${userId}:${new Date().toISOString().split('T')[0]}`;
  return usageCache.get(key) || null;
}
