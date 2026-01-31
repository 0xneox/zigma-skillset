/**
 * Input validators
 */
import { z } from 'zod';
/**
 * Validate wallet address
 */
export declare function validateWalletAddress(address: string): void;
/**
 * Extract market ID from Polymarket URL
 */
export declare function extractMarketId(input: string): string;
/**
 * Validate market ID
 */
export declare function validateMarketId(marketId: string): void;
/**
 * Validate threshold value
 */
export declare function validateThreshold(threshold: number): void;
/**
 * Validate limit value
 */
export declare function validateLimit(limit: number): void;
/**
 * Validate min edge value
 */
export declare function validateMinEdge(minEdge: number): void;
/**
 * Validate category string
 */
export declare function validateCategory(category: string): void;
export declare const AlphaParamsSchema: z.ZodObject<{
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
export declare const ConnectParamsSchema: z.ZodObject<{
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    address: string;
}, {
    address: string;
}>;
export declare const AnalyzeParamsSchema: z.ZodObject<{
    market: z.ZodString;
}, "strip", z.ZodTypeAny, {
    market: string;
}, {
    market: string;
}>;
export declare const TrackParamsSchema: z.ZodObject<{
    market: z.ZodString;
    threshold: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    market: string;
    threshold: number;
}, {
    market: string;
    threshold?: number | undefined;
}>;
export declare const WalletParamsSchema: z.ZodObject<{
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    address: string;
}, {
    address: string;
}>;
//# sourceMappingURL=validators.d.ts.map