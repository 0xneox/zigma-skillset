/**
 * Configuration constants and environment validation
 */
export declare const API_CONFIG: {
    readonly BASE_URL: string;
    readonly API_KEY: string | undefined;
    readonly TIMEOUT: 30000;
    readonly MAX_RETRIES: 3;
    readonly RETRY_DELAY: 1000;
};
export declare function validateConfig(): void;
export declare const LIQUIDITY: {
    readonly HIGH: 50000;
    readonly MEDIUM: 20000;
};
export declare const TIER_LIMITS: {
    readonly FREE: {
        readonly limit: 3;
        readonly signalsPerDay: 3;
        readonly trackedMarkets: 1;
        readonly walletAnalysisPerDay: 1;
        readonly alerts: undefined;
        readonly arbitrage: false;
        readonly apiAccess: false;
    };
    readonly BASIC: {
        readonly limit: 15;
        readonly signalsPerDay: 15;
        readonly trackedMarkets: 5;
        readonly walletAnalysisPerDay: 5;
        readonly alerts: "hourly";
        readonly arbitrage: false;
        readonly apiAccess: false;
    };
    readonly PRO: {
        readonly limit: -1;
        readonly signalsPerDay: -1;
        readonly trackedMarkets: 25;
        readonly walletAnalysisPerDay: -1;
        readonly alerts: "15min";
        readonly arbitrage: true;
        readonly apiAccess: false;
    };
    readonly WHALE: {
        readonly limit: -1;
        readonly signalsPerDay: -1;
        readonly trackedMarkets: -1;
        readonly walletAnalysisPerDay: -1;
        readonly alerts: "realtime";
        readonly arbitrage: true;
        readonly apiAccess: true;
    };
};
export declare const GLOBAL_LIMITS: {
    readonly MAX_TRACKED_MARKETS: 10;
    readonly DEFAULT_SIGNAL_LIMIT: 5;
    readonly DEFAULT_MIN_EDGE: 3;
    readonly DEFAULT_TRACK_THRESHOLD: 5;
    readonly HEARTBEAT_INTERVAL: 15;
    readonly CACHE_TTL: 600000;
    readonly STRONG_SIGNAL_MIN_EDGE: 0.1;
};
export declare const TOKEN_REQUIREMENTS: {
    readonly BASIC: 100;
    readonly PRO: 1000;
    readonly WHALE: 10000;
};
export declare const WALLET_ADDRESS_REGEX: RegExp;
export declare const POLYMARKET_URL_PATTERN: RegExp;
export declare const DEFAULT_MARKET_COUNT = 500;
export declare const LOG_LEVELS: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
};
export declare const ERROR_CODES: {
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly API_ERROR: "API_ERROR";
    readonly RATE_LIMIT: "RATE_LIMIT";
    readonly AUTH_ERROR: "AUTH_ERROR";
    readonly TIMEOUT_ERROR: "TIMEOUT_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
};
//# sourceMappingURL=config.d.ts.map