/**
 * API client with retry logic, timeouts, and error handling
 */
import { z } from 'zod';
/**
 * Generic API fetch with caching and validation
 */
export declare function zigmaFetch<T>(endpoint: string, schema: z.ZodSchema<T>, options?: RequestInit, useCache?: boolean): Promise<T>;
/**
 * Get market count
 */
export declare function getMarketCount(): Promise<number>;
//# sourceMappingURL=api-client.d.ts.map