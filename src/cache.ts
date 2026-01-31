/**
 * Simple in-memory cache with TTL
 */

import { GLOBAL_LIMITS } from './config';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class Cache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl: number = GLOBAL_LIMITS.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (Date.now() <= entry.expiry) {
        count++;
      } else {
        this.cache.delete(key);
      }
    }
    return count;
  }
}

export const cache = new Cache();
