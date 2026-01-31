/**
 * Type definitions for Zigma Oracle
 */
import { z } from 'zod';
export type SignalTier = 'STRONG_TRADE' | 'SMALL_TRADE' | 'PROBE' | 'NO_TRADE';
export type Action = 'BUY YES' | 'BUY NO' | 'HOLD';
export type UserTier = 'FREE' | 'BASIC' | 'PRO' | 'WHALE';
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
    news?: Array<{
        title: string;
        source: string;
    }>;
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
    topCategories?: Array<{
        name: string;
        winRate: number;
    }>;
    recommendations?: Array<{
        title: string;
    }>;
}
export interface ArbitrageOpportunity {
    type: string;
    expectedProfit: number;
    marketATitle?: string;
    marketBTitle?: string;
    trades: Array<{
        action: string;
    }>;
    confidence: number;
}
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
export interface MoltbotContext {
    memory: {
        get: (key: string) => unknown;
        set: (key: string, value: unknown) => void;
    };
    reply: (message: string) => Promise<void> | void;
    notify?: (message: string) => Promise<void> | void;
    post?: (options: {
        community: string;
        content: string;
    }) => Promise<void> | void;
    userId?: string;
}
export interface CommandHandler<T = unknown> {
    description: string;
    parameters?: z.ZodSchema<T>;
    handler: (ctx: MoltbotContext, params: T) => Promise<string>;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export declare class ZigmaError extends Error {
    code: string;
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, code: string, statusCode?: number | undefined, details?: unknown | undefined);
}
export declare class NetworkError extends ZigmaError {
    constructor(message: string, details?: unknown);
}
export declare class ValidationError extends ZigmaError {
    constructor(message: string, details?: unknown);
}
export declare class ApiError extends ZigmaError {
    constructor(message: string, statusCode: number, details?: unknown);
}
export declare const SignalSchema: z.ZodObject<{
    marketId: z.ZodString;
    question: z.ZodString;
    action: z.ZodEnum<["BUY YES", "BUY NO", "HOLD"]>;
    marketOdds: z.ZodNumber;
    zigmaOdds: z.ZodNumber;
    edge: z.ZodNumber;
    confidence: z.ZodNumber;
    tier: z.ZodEnum<["STRONG_TRADE", "SMALL_TRADE", "PROBE", "NO_TRADE"]>;
    kelly: z.ZodNumber;
    liquidity: z.ZodNumber;
    reasoning: z.ZodOptional<z.ZodString>;
    link: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    marketId: string;
    question: string;
    action: "BUY YES" | "BUY NO" | "HOLD";
    marketOdds: number;
    zigmaOdds: number;
    edge: number;
    confidence: number;
    tier: "STRONG_TRADE" | "SMALL_TRADE" | "PROBE" | "NO_TRADE";
    kelly: number;
    liquidity: number;
    reasoning?: string | undefined;
    link?: string | undefined;
}, {
    marketId: string;
    question: string;
    action: "BUY YES" | "BUY NO" | "HOLD";
    marketOdds: number;
    zigmaOdds: number;
    edge: number;
    confidence: number;
    tier: "STRONG_TRADE" | "SMALL_TRADE" | "PROBE" | "NO_TRADE";
    kelly: number;
    liquidity: number;
    reasoning?: string | undefined;
    link?: string | undefined;
}>;
export declare const MarketAnalysisSchema: z.ZodObject<{
    id: z.ZodString;
    question: z.ZodString;
    probability: z.ZodNumber;
    confidence: z.ZodNumber;
    edge: z.ZodNumber;
    recommendation: z.ZodString;
    reasoning: z.ZodString;
    news: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        source: string;
    }, {
        title: string;
        source: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    question: string;
    edge: number;
    confidence: number;
    reasoning: string;
    id: string;
    probability: number;
    recommendation: string;
    news?: {
        title: string;
        source: string;
    }[] | undefined;
}, {
    question: string;
    edge: number;
    confidence: number;
    reasoning: string;
    id: string;
    probability: number;
    recommendation: string;
    news?: {
        title: string;
        source: string;
    }[] | undefined;
}>;
export declare const WalletAnalysisSchema: z.ZodObject<{
    address: z.ZodString;
    totalPnl: z.ZodNumber;
    winRate: z.ZodNumber;
    profitFactor: z.ZodNumber;
    sharpeRatio: z.ZodNumber;
    grade: z.ZodString;
    healthScore: z.ZodNumber;
    avgHoldTime: z.ZodNumber;
    tradeFrequency: z.ZodNumber;
    avgPositionSize: z.ZodNumber;
    topCategories: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        winRate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        winRate: number;
        name: string;
    }, {
        winRate: number;
        name: string;
    }>, "many">>;
    recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
    }, {
        title: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
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
    topCategories?: {
        winRate: number;
        name: string;
    }[] | undefined;
    recommendations?: {
        title: string;
    }[] | undefined;
}, {
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
    topCategories?: {
        winRate: number;
        name: string;
    }[] | undefined;
    recommendations?: {
        title: string;
    }[] | undefined;
}>;
export declare const ArbitrageOpportunitySchema: z.ZodObject<{
    type: z.ZodString;
    expectedProfit: z.ZodNumber;
    marketATitle: z.ZodOptional<z.ZodString>;
    marketBTitle: z.ZodOptional<z.ZodString>;
    trades: z.ZodArray<z.ZodObject<{
        action: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        action: string;
    }, {
        action: string;
    }>, "many">;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: string;
    confidence: number;
    expectedProfit: number;
    trades: {
        action: string;
    }[];
    marketATitle?: string | undefined;
    marketBTitle?: string | undefined;
}, {
    type: string;
    confidence: number;
    expectedProfit: number;
    trades: {
        action: string;
    }[];
    marketATitle?: string | undefined;
    marketBTitle?: string | undefined;
}>;
//# sourceMappingURL=types.d.ts.map