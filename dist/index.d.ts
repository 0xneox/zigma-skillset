/**
 * Zigma Oracle - Moltbot Skill
 *
 * Prediction market intelligence via chat
 *
 * Commands:
 *   zigma alpha     - Get top trading signals
 *   zigma analyze   - Analyze a specific market
 *   zigma track     - Track a market for alerts
 *   zigma portfolio - View your tracked positions
 *   zigma wallet    - Analyze a trader's wallet
 *   zigma leaderboard - View agent trading competition
 *   zigma share     - Share a signal to community
 *   zigma challenge - Challenge another agent to a bet
 */
import { z } from 'zod';
import type { MoltbotContext, UserTier } from './src/types.js';
import { AlphaParamsSchema, ConnectParamsSchema, AnalyzeParamsSchema, TrackParamsSchema, WalletParamsSchema } from './src/validators.js';
/**
 * Check token tier for a user
 */
export declare function checkTokenTier(ctx: MoltbotContext): Promise<UserTier>;
/**
 * Alpha command handler
 */
declare function handleAlpha(ctx: MoltbotContext, params: z.infer<typeof AlphaParamsSchema>): Promise<string>;
/**
 * Connect command handler
 */
declare function handleConnect(ctx: MoltbotContext, params: z.infer<typeof ConnectParamsSchema>): Promise<string>;
/**
 * Analyze command handler
 */
declare function handleAnalyze(_ctx: MoltbotContext, params: z.infer<typeof AnalyzeParamsSchema>): Promise<string>;
/**
 * Track command handler
 */
declare function handleTrack(ctx: MoltbotContext, params: z.infer<typeof TrackParamsSchema>): Promise<string>;
/**
 * Portfolio command handler
 */
declare function handlePortfolio(ctx: MoltbotContext): Promise<string>;
/**
 * Wallet command handler
 */
declare function handleWallet(ctx: MoltbotContext, params: z.infer<typeof WalletParamsSchema>): Promise<string>;
/**
 * Arbitrage command handler
 */
declare function handleArb(ctx: MoltbotContext): Promise<string>;
/**
 * Heartbeat handler
 */
declare function handleHeartbeat(ctx: MoltbotContext): Promise<void>;
/**
 * Leaderboard command handler
 */
declare function handleLeaderboard(_ctx: MoltbotContext): Promise<string>;
/**
 * Share command handler
 */
declare function handleShare(ctx: MoltbotContext, params: {
    signalIndex?: number;
}): Promise<string>;
/**
 * Challenge command handler
 */
declare function handleChallenge(ctx: MoltbotContext, params: {
    agent: string;
    market: string;
}): Promise<string>;
declare const _default: {
    name: string;
    description: string;
    version: string;
    commands: {
        alpha: {
            description: string;
            parameters: z.ZodObject<{
                limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
                minEdge: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
                category: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                limit: number;
                minEdge: number;
                category?: string | undefined;
            }, {
                limit?: number | undefined;
                minEdge?: number | undefined;
                category?: string | undefined;
            }>;
            handler: typeof handleAlpha;
        };
        connect: {
            description: string;
            parameters: z.ZodObject<{
                address: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                address: string;
            }, {
                address: string;
            }>;
            handler: typeof handleConnect;
        };
        analyze: {
            description: string;
            parameters: z.ZodObject<{
                market: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                market: string;
            }, {
                market: string;
            }>;
            handler: typeof handleAnalyze;
        };
        track: {
            description: string;
            parameters: z.ZodObject<{
                market: z.ZodString;
                threshold: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            }, "strip", z.ZodTypeAny, {
                market: string;
                threshold: number;
            }, {
                market: string;
                threshold?: number | undefined;
            }>;
            handler: typeof handleTrack;
        };
        portfolio: {
            description: string;
            handler: typeof handlePortfolio;
        };
        wallet: {
            description: string;
            parameters: z.ZodObject<{
                address: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                address: string;
            }, {
                address: string;
            }>;
            handler: typeof handleWallet;
        };
        arb: {
            description: string;
            handler: typeof handleArb;
        };
        leaderboard: {
            description: string;
            handler: typeof handleLeaderboard;
        };
        share: {
            description: string;
            parameters: z.ZodObject<{
                signalIndex: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                signalIndex?: number | undefined;
            }, {
                signalIndex?: number | undefined;
            }>;
            handler: typeof handleShare;
        };
        challenge: {
            description: string;
            parameters: z.ZodObject<{
                agent: z.ZodString;
                market: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                market: string;
                agent: string;
            }, {
                market: string;
                agent: string;
            }>;
            handler: typeof handleChallenge;
        };
    };
    heartbeat: {
        interval: string;
        handler: typeof handleHeartbeat;
    };
};
export default _default;
export { handleAlpha, handleConnect, handleAnalyze, handleTrack, handlePortfolio, handleWallet, handleArb, handleHeartbeat, handleLeaderboard, handleShare, handleChallenge };
//# sourceMappingURL=index.d.ts.map