/**
 * Type definitions for Zigma Oracle
 */

import { z } from 'zod';

// Signal tier types
export type SignalTier = 'STRONG_TRADE' | 'SMALL_TRADE' | 'PROBE' | 'NO_TRADE';
export type Action = 'BUY YES' | 'BUY NO' | 'HOLD';
export type UserTier = 'FREE' | 'BASIC' | 'PRO' | 'WHALE';

// Core data structures
export interface Signal {
  marketId: string;
  question: string;
  action: Action;
  marketOdds: number;
  zigmaOdds: number;
  edge: number;
  confidence: number;
  tier: SignalTier;
  kelly: number;
  liquidity: number;
  reasoning?: string;
  link?: string;
}

export interface MarketAnalysis {
  id: string;
  question: string;
  probability: number;
  confidence: number;
  edge: number;
  recommendation: string;
  reasoning: string;
  news?: Array<{ title: string; source: string }>;
}

export interface WalletAnalysis {
  address: string;
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  grade: string;
  healthScore: number;
  avgHoldTime: number;
  tradeFrequency: number;
  avgPositionSize: number;
  topCategories?: Array<{ name: string; winRate: number }>;
  recommendations?: Array<{ title: string }>;
}

export interface ArbitrageOpportunity {
  type: string;
  expectedProfit: number;
  marketATitle?: string;
  marketBTitle?: string;
  trades: Array<{ action: string }>;
  confidence: number;
}

// Configuration types
export interface TierLimits {
  limit: number;
  signalsPerDay: number;
  trackedMarkets: number;
  walletAnalysisPerDay: number;
  alerts?: string;
  arbitrage?: boolean;
  apiAccess?: boolean;
}

export interface UsageRecord {
  signalsRequested: number;
  walletAnalyses: number;
}

export interface TrackedMarket {
  marketId: string;
  threshold: number;
  addedAt: string;
  lastEdge?: number;
}

// Moltbot context types
export interface MoltbotContext {
  memory: {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
  };
  reply: (message: string) => Promise<void> | void;
  notify?: (message: string) => Promise<void> | void;
  post?: (options: { community: string; content: string }) => Promise<void> | void;
  userId?: string;
}

export interface CommandHandler<T = unknown> {
  description: string;
  parameters?: z.ZodSchema<T>;
  handler: (ctx: MoltbotContext, params: T) => Promise<string>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Error types
export class ZigmaError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ZigmaError';
  }
}

export class NetworkError extends ZigmaError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ZigmaError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class ApiError extends ZigmaError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'ApiError';
  }
}

// Zod schemas for validation
export const SignalSchema = z.object({
  marketId: z.string(),
  question: z.string(),
  action: z.enum(['BUY YES', 'BUY NO', 'HOLD']),
  marketOdds: z.number(),
  zigmaOdds: z.number(),
  edge: z.number(),
  confidence: z.number(),
  tier: z.enum(['STRONG_TRADE', 'SMALL_TRADE', 'PROBE', 'NO_TRADE']),
  kelly: z.number(),
  liquidity: z.number(),
  reasoning: z.string().optional(),
  link: z.string().optional(),
});

export const MarketAnalysisSchema = z.object({
  id: z.string(),
  question: z.string(),
  probability: z.number(),
  confidence: z.number(),
  edge: z.number(),
  recommendation: z.string(),
  reasoning: z.string(),
  news: z.array(z.object({ title: z.string(), source: z.string() })).optional(),
});

export const WalletAnalysisSchema = z.object({
  address: z.string(),
  totalPnl: z.number(),
  winRate: z.number(),
  profitFactor: z.number(),
  sharpeRatio: z.number(),
  grade: z.string(),
  healthScore: z.number(),
  avgHoldTime: z.number(),
  tradeFrequency: z.number(),
  avgPositionSize: z.number(),
  topCategories: z.array(z.object({ name: z.string(), winRate: z.number() })).optional(),
  recommendations: z.array(z.object({ title: z.string() })).optional(),
});

export const ArbitrageOpportunitySchema = z.object({
  type: z.string(),
  expectedProfit: z.number(),
  marketATitle: z.string().optional(),
  marketBTitle: z.string().optional(),
  trades: z.array(z.object({ action: z.string() })),
  confidence: z.number(),
});
