/**
 * Simple in-memory cache with TTL
 */
import { GLOBAL_LIMITS } from './config';
class Cache {
    constructor() {
        this.cache = new Map();
    }
    set(key, data, ttl = GLOBAL_LIMITS.CACHE_TTL) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl,
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    has(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return false;
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        let count = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (Date.now() <= entry.expiry) {
                count++;
            }
            else {
                this.cache.delete(key);
            }
        }
        return count;
    }
}
export const cache = new Cache();
//# sourceMappingURL=cache.js.map