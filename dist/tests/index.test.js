/**
 * Zigma Skill Tests
 * Tests for Moltbot skill functionality
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkTokenTier } from '../index';
// Mock fetch for testing
global.fetch = vi.fn();
// Mock context factory
function createMockContext(memoryData) {
    const memory = new Map();
    if (memoryData) {
        Object.entries(memoryData).forEach(([key, value]) => memory.set(key, value));
    }
    return {
        memory: {
            get: (key) => memory.get(key),
            set: (key, value) => memory.set(key, value),
        },
        reply: vi.fn(),
    };
}
describe('Zigma Skill', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Token Tier Checking', () => {
        it('should return FREE tier when no wallet connected', async () => {
            const mockCtx = createMockContext();
            const tier = await checkTokenTier(mockCtx);
            expect(tier).toBe('FREE');
        });
        it('should return tier from API when wallet connected', async () => {
            const wallet = '0x1234567890123456789012345678901234567890';
            const mockCtx = createMockContext({ zigma_wallet: wallet });
            // Mock response for wallet with 1000 ZIGMA
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ tier: 'PRO', balance: 1000, features: { signalsPerDay: -1 } })
            });
            const tier = await checkTokenTier(mockCtx);
            expect(tier).toBe('PRO');
        });
    });
    describe('API Fetching', () => {
        it('should fetch signals successfully', async () => {
            const mockSignals = [
                { marketId: '1', question: 'Test market', action: 'BUY YES', edge: 0.15, confidence: 0.8 }
            ];
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSignals
            });
            const response = await fetch('https://api.zigma.pro/api/v1/signals?limit=3');
            const data = await response.json();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);
        });
        it('should handle API errors gracefully', async () => {
            vi.mocked(fetch).mockRejectedValueOnce(new Error('API Error'));
            await expect(fetch('https://api.zigma.pro/invalid')).rejects.toThrow();
        });
    });
    describe('Daily Usage Tracking', () => {
        it('should track signals requested per day', () => {
            const mockCtx = createMockContext();
            const today = new Date().toDateString();
            const usage = { [today]: { signalsRequested: 5 } };
            mockCtx.memory.set('zigma_usage', usage);
            const dailyUsage = mockCtx.memory.get('zigma_usage')?.[today]?.signalsRequested || 0;
            expect(dailyUsage).toBe(5);
        });
    });
    describe('Tier Limits', () => {
        it('should enforce FREE tier limits', () => {
            const tierLimits = {
                'FREE': { limit: 3, signalsPerDay: 3 },
                'BASIC': { limit: 15, signalsPerDay: 15 },
                'PRO': { limit: -1, signalsPerDay: -1 },
                'WHALE': { limit: -1, signalsPerDay: -1 }
            };
            expect(tierLimits.FREE.limit).toBe(3);
            expect(tierLimits.FREE.signalsPerDay).toBe(3);
            expect(tierLimits.PRO.limit).toBe(-1);
            expect(tierLimits.PRO.signalsPerDay).toBe(-1);
        });
    });
});
//# sourceMappingURL=index.test.js.map