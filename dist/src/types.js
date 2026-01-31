/**
 * Type definitions for Zigma Oracle
 */
import { z } from 'zod';
// Error types
export class ZigmaError extends Error {
    constructor(message, code, statusCode, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ZigmaError';
    }
}
export class NetworkError extends ZigmaError {
    constructor(message, details) {
        super(message, 'NETWORK_ERROR', undefined, details);
        this.name = 'NetworkError';
    }
}
export class ValidationError extends ZigmaError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}
export class ApiError extends ZigmaError {
    constructor(message, statusCode, details) {
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
//# sourceMappingURL=types.js.map