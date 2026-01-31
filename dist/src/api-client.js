/**
 * API client with retry logic, timeouts, and error handling
 */
import { z } from 'zod';
import { API_CONFIG, ERROR_CODES } from './config.js';
import { logger } from './logger.js';
import { cache } from './cache.js';
import { ZigmaError, NetworkError, ApiError } from './types.js';
/**
 * Fetch with retry logic and exponential backoff
 */
async function fetchWithRetry(url, options = {}, retries = API_CONFIG.MAX_RETRIES) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...(API_CONFIG.API_KEY && { 'Authorization': `Bearer ${API_CONFIG.API_KEY}` }),
                ...options.headers,
            },
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new ApiError(`API error: ${response.status}`, response.status, { url, status: response.status });
        }
        return response;
    }
    catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new NetworkError('Request timeout', { url, timeout: API_CONFIG.TIMEOUT });
        }
        if (retries > 0) {
            const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, API_CONFIG.MAX_RETRIES - retries);
            logger.warn(`Retrying request after ${delay}ms`, { url, retriesLeft: retries });
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1);
        }
        if (error instanceof ApiError || error instanceof NetworkError) {
            throw error;
        }
        throw new NetworkError('Network request failed', { url, error });
    }
}
/**
 * Generic API fetch with caching and validation
 */
export async function zigmaFetch(endpoint, schema, options = {}, useCache = true) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    // Check cache first
    if (useCache) {
        const cached = cache.get(url);
        if (cached) {
            logger.debug('Cache hit', { url });
            return cached;
        }
    }
    logger.debug('Fetching from API', { url });
    try {
        const response = await fetchWithRetry(url, options);
        const data = await response.json();
        // Validate response structure
        const validatedData = schema.parse(data);
        // Cache the result
        if (useCache) {
            cache.set(url, validatedData);
        }
        return validatedData;
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            logger.error('Validation error', { url, errors: error.errors });
            throw new ZigmaError('API response validation failed', ERROR_CODES.VALIDATION_ERROR, undefined, { url, errors: error.errors });
        }
        throw error;
    }
}
/**
 * Get market count
 */
export async function getMarketCount() {
    try {
        const response = await fetchWithRetry(`${API_CONFIG.BASE_URL}/api/v1/stats`);
        const data = await response.json();
        return data.marketCount;
    }
    catch (error) {
        logger.warn('Failed to fetch market count, using default', { error });
        return 500;
    }
}
//# sourceMappingURL=api-client.js.map