/**
 * Simple in-memory cache with TTL
 */
declare class Cache {
    private cache;
    set<T>(key: string, data: T, ttl?: number): void;
    get<T>(key: string): T | null;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    size(): number;
}
export declare const cache: Cache;
export {};
//# sourceMappingURL=cache.d.ts.map