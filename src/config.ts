/**
 * Configuration constants and environment validation
 */

// Environment variables
const ZIGMA_API_BASE = process.env.ZIGMA_API_URL || 'https://api.zigma.pro';
const ZIGMA_API_KEY = process.env.ZIGMA_API_KEY;

// API configuration
export const API_CONFIG = {
  BASE_URL: ZIGMA_API_BASE,
  API_KEY: ZIGMA_API_KEY,
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Validate required environment variables (only in production/runtime)
export function validateConfig(): void {
  if (!ZIGMA_API_KEY) {
    throw new Error('ZIGMA_API_KEY environment variable is required');
  }
}

// Liquidity thresholds
export const LIQUIDITY = {
  HIGH: 50000,
  MEDIUM: 20000,
} as const;

// Tier limits
export const TIER_LIMITS = {
  FREE: {
    limit: 3,
    signalsPerDay: 3,
    trackedMarkets: 1,
    walletAnalysisPerDay: 1,
    alerts: undefined,
    arbitrage: false,
    apiAccess: false,
  },
  BASIC: {
    limit: 15,
    signalsPerDay: 15,
    trackedMarkets: 5,
    walletAnalysisPerDay: 5,
    alerts: 'hourly',
    arbitrage: false,
    apiAccess: false,
  },
  PRO: {
    limit: -1,
    signalsPerDay: -1,
    trackedMarkets: 25,
    walletAnalysisPerDay: -1,
    alerts: '15min',
    arbitrage: true,
    apiAccess: false,
  },
  WHALE: {
    limit: -1,
    signalsPerDay: -1,
    trackedMarkets: -1,
    walletAnalysisPerDay: -1,
    alerts: 'realtime',
    arbitrage: true,
    apiAccess: true,
  },
} as const;

// Global limits
export const GLOBAL_LIMITS = {
  MAX_TRACKED_MARKETS: 10,
  DEFAULT_SIGNAL_LIMIT: 5,
  DEFAULT_MIN_EDGE: 3,
  DEFAULT_TRACK_THRESHOLD: 5,
  HEARTBEAT_INTERVAL: 15, // minutes
  CACHE_TTL: 600000, // 10 minutes in milliseconds
  STRONG_SIGNAL_MIN_EDGE: 0.10, // 10%
} as const;

// Token requirements
export const TOKEN_REQUIREMENTS = {
  BASIC: 100,
  PRO: 1000,
  WHALE: 10000,
} as const;

// Wallet address regex
export const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// Polymarket URL pattern
export const POLYMARKET_URL_PATTERN = /polymarket\.com\/event\/([^\/\?]+)/;

// Default market count estimate
export const DEFAULT_MARKET_COUNT = 500;

// Log levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  API_ERROR: 'API_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  AUTH_ERROR: 'AUTH_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const;
