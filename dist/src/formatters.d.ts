/**
 * Output formatters for displaying data to users
 */
import type { Signal, MarketAnalysis, WalletAnalysis, ArbitrageOpportunity } from './types';
/**
 * Format signal for display
 */
export declare function formatSignal(signal: Signal, index: number): string;
/**
 * Format market analysis for display
 */
export declare function formatAnalysis(analysis: MarketAnalysis): string;
/**
 * Format wallet analysis for display
 */
export declare function formatWalletAnalysis(wallet: WalletAnalysis): string;
/**
 * Format arbitrage opportunity for display
 */
export declare function formatArbitrageOpportunity(opp: ArbitrageOpportunity, index: number): string;
/**
 * Format daily post for community
 */
export declare function formatDailyPost(signals: Signal[]): string;
/**
 * Format outcome post when signal resolves
 */
export declare function formatOutcomePost(signal: Signal, outcome: 'WIN' | 'LOSS', pnl: number): string;
/**
 * Format leaderboard display
 */
export declare function formatLeaderboard(leaderboard: Array<{
    agent: string;
    pnl: number;
    winRate: number;
    trades: number;
    sharpe: number;
}>): string;
/**
 * Format challenge post
 */
export declare function formatChallenge(agent: string, analysis: MarketAnalysis): string;
//# sourceMappingURL=formatters.d.ts.map