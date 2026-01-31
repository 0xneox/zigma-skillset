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
 */
import { z } from 'zod';
export declare function checkTokenTier(ctx: any): Promise<string>;
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
            handler: (ctx: any, params: any) => Promise<any>;
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
            handler: (ctx: any, params: any) => Promise<any>;
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
            handler: (ctx: any, params: any) => Promise<any>;
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
            handler: (ctx: any, params: any) => Promise<any>;
        };
        portfolio: {
            description: string;
            handler: (ctx: any) => Promise<any>;
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
            handler: (ctx: any, params: any) => Promise<any>;
        };
        arb: {
            description: string;
            handler: (ctx: any) => Promise<any>;
        };
    };
    heartbeat: {
        interval: string;
        handler: (ctx: any) => Promise<void>;
    };
};
export default _default;
//# sourceMappingURL=index-old.d.ts.map