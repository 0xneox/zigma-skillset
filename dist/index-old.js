/**
 * Zigma Oracle - Moltbot Skill
 *
 * Prediction market intelligence via chat
 *
 * Commands:
 *   zigma alpha     - Get top trading signals
 *   zigma analyze   - Analyze a specific market
 *   zigma track     - Track a market for alerts
 *   zigma portfolio - View your tracked positions
 *   zigma wallet    - Analyze a trader's wallet
 */
import { z } from 'zod';
// Configuration
const ZIGMA_API_BASE = process.env.ZIGMA_API_URL || 'https://api.zigma.pro';
const ZIGMA_API_KEY = process.env.ZIGMA_API_KEY;
// API Client
async function zigmaFetch(endpoint, options) {
    const response = await fetch(`${ZIGMA_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(ZIGMA_API_KEY && { 'Authorization': `Bearer ${ZIGMA_API_KEY}` }),
            ...options?.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`Zigma API error: ${response.status}`);
    }
    return response.json();
}
// Helper function to check token tier
export async function checkTokenTier(ctx) {
    const wallet = ctx.memory.get('zigma_wallet');
    if (!wallet)
        return 'FREE';
    try {
        const response = await fetch(`${ZIGMA_API_BASE}/api/v1/access/${wallet}`);
        const data = await response.json();
        return data.tier || 'FREE';
    }
    catch {
        return 'FREE';
    }
}
// Formatters
function formatSignal(signal, index) {
    const emoji = signal.action.includes('YES') ? '📈' : signal.action.includes('NO') ? '📉' : '⏸️';
    const tierEmoji = {
        'STRONG_TRADE': '🔥',
        'SMALL_TRADE': '✅',
        'PROBE': '🔍',
        'NO_TRADE': '⏹️'
    }[signal.tier] || '❓';
    const edgeSign = signal.edge > 0 ? '+' : '';
    const liquidityStatus = signal.liquidity > 50000 ? '✅' : signal.liquidity > 20000 ? '⚠️' : '❌';
    return `
**${index}. ${emoji} ${signal.action}** ${tierEmoji}
> ${signal.question.slice(0, 60)}${signal.question.length > 60 ? '...' : ''}

• Market: **${signal.marketOdds.toFixed(0)}%** → Zigma: **${signal.zigmaOdds.toFixed(0)}%**
• Edge: **${edgeSign}${signal.edge.toFixed(1)}%** | Conf: ${signal.confidence.toFixed(0)}%
• Kelly: ${(signal.kelly * 100).toFixed(1)}% | Liq: $${(signal.liquidity / 1000).toFixed(0)}k ${liquidityStatus}
${signal.link ? `• [View on Polymarket](${signal.link})` : ''}
`.trim();
}
function formatAnalysis(analysis) {
    const actionEmoji = analysis.edge > 0.05 ? '🎯' : analysis.edge > 0.02 ? '👀' : '⏸️';
    return `
${actionEmoji} **Market Analysis**

**${analysis.question}**

📊 **Probabilities**
• Zigma Fair Value: **${(analysis.probability * 100).toFixed(1)}%**
• Confidence: ${(analysis.confidence).toFixed(0)}%
• Edge: ${analysis.edge > 0 ? '+' : ''}${(analysis.edge * 100).toFixed(1)}%

📝 **Recommendation**: ${analysis.recommendation}

💡 **Analysis**:
${analysis.reasoning}

${analysis.news && analysis.news.length > 0 ? `
📰 **Recent News**:
${analysis.news.slice(0, 3).map(n => `• ${n.title} (${n.source})`).join('\n')}
` : ''}
`.trim();
}
function formatWalletAnalysis(wallet) {
    const pnlEmoji = wallet.totalPnl >= 0 ? '📈' : '📉';
    const gradeEmoji = {
        'A+': '🏆', 'A': '🥇', 'A-': '🥇',
        'B+': '🥈', 'B': '🥈', 'B-': '🥈',
        'C+': '🥉', 'C': '🥉', 'C-': '🥉',
        'D': '⚠️', 'F': '❌'
    }[wallet.grade] || '❓';
    return `
${pnlEmoji} **Wallet Analysis**

**${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}**

📊 **Performance**
• Total P&L: **$${wallet.totalPnl.toFixed(2)}**
• Win Rate: ${(wallet.winRate * 100).toFixed(1)}%
• Profit Factor: ${wallet.profitFactor.toFixed(2)}
• Sharpe Ratio: ${wallet.sharpeRatio.toFixed(2)}

${gradeEmoji} **Portfolio Health**: ${wallet.grade} (${wallet.healthScore}/100)

📈 **Trading Style**
• Avg Hold Time: ${wallet.avgHoldTime.toFixed(1)} hours
• Trade Frequency: ${wallet.tradeFrequency.toFixed(1)}/day
• Avg Position: $${wallet.avgPositionSize.toFixed(2)}

${wallet.topCategories && wallet.topCategories.length > 0 ? `
🏷️ **Best Categories**:
${wallet.topCategories.slice(0, 3).map(c => `• ${c.name}: ${(c.winRate * 100).toFixed(0)}% win rate`).join('\n')}
` : ''}

${wallet.recommendations && wallet.recommendations.length > 0 ? `
💡 **Recommendations**:
${wallet.recommendations.slice(0, 3).map(r => `• ${r.title}`).join('\n')}
` : ''}
`.trim();
}
// Skill Definition
export default {
    name: 'zigma',
    description: 'Polymarket prediction market oracle and trading signals',
    version: '1.0.0',
    // Commands
    commands: {
        alpha: {
            description: 'Get top trading signals with edge',
            parameters: z.object({
                limit: z.number().optional().default(5),
                minEdge: z.number().optional().default(3),
                category: z.string().optional(),
            }),
            handler: async (ctx, params) => {
                try {
                    const tier = await checkTokenTier(ctx);
                    const tierLimits = {
                        'FREE': { limit: 3, signalsPerDay: 3 },
                        'BASIC': { limit: 15, signalsPerDay: 15 },
                        'PRO': { limit: -1, signalsPerDay: -1 },
                        'WHALE': { limit: -1, signalsPerDay: -1 }
                    };
                    const config = tierLimits[tier];
                    // Check daily limit
                    const today = new Date().toDateString();
                    const usage = ctx.memory.get('zigma_usage') || {};
                    const dailyUsage = usage[today]?.signalsRequested || 0;
                    if (config.signalsPerDay > 0 && dailyUsage >= config.signalsPerDay) {
                        return ctx.reply(`
❌ **Daily Limit Reached**

You've used your ${config.signalsPerDay} free signals today.

Upgrade for more:
• Basic (100 $ZIGMA): 15 signals/day
• Pro (1,000 $ZIGMA): Unlimited
• Whale (10,000 $ZIGMA): Unlimited + API access

Connect wallet: \`zigma connect 0x...\` 
            `.trim());
                    }
                    // Enforce limit
                    const effectiveLimit = config.limit === -1 ? (params.limit || 5) : Math.min(params.limit || 5, config.limit);
                    const query = new URLSearchParams({
                        limit: String(effectiveLimit),
                        minEdge: String((params.minEdge || 3) / 100),
                        ...(params.category && { category: params.category }),
                    });
                    const signals = await zigmaFetch(`/api/v1/signals?${query}`);
                    if (!signals || signals.length === 0) {
                        return ctx.reply(`
🔍 **No High-Edge Signals Right Now**

The oracle is scanning ${await getMarketCount()} markets but hasn't found signals meeting your criteria (${params.minEdge}%+ edge).

Try:
• \`zigma alpha --minEdge 2\` for lower threshold
• \`zigma analyze [market]\` for specific market analysis
• Check back in a few hours

_Markets are most volatile after major news events._
            `.trim());
                    }
                    const formatted = signals.map((s, i) => formatSignal(s, i + 1)).join('\n\n---\n\n');
                    // Update usage
                    if (!usage[today])
                        usage[today] = {};
                    usage[today].signalsRequested = dailyUsage + 1;
                    ctx.memory.set('zigma_usage', usage);
                    return ctx.reply(`
🎯 **Top ${signals.length} Zigma Signals**
_Updated: ${new Date().toLocaleTimeString()}_

${formatted}

---
💡 Reply with a number to track, or \`zigma analyze [market]\` for deep dive.
          `.trim());
                }
                catch (error) {
                    console.error('Zigma alpha error:', error);
                    return ctx.reply('❌ Failed to fetch signals. Please try again.');
                }
            },
        },
        connect: {
            description: 'Connect your wallet for premium features',
            parameters: z.object({
                address: z.string().describe('Wallet address (0x...)'),
            }),
            handler: async (ctx, params) => {
                if (!params.address.match(/^0x[a-fA-F0-9]{40}$/)) {
                    return ctx.reply('❌ Invalid wallet address. Please provide a valid Ethereum address (0x...)');
                }
                ctx.memory.set('zigma_wallet', params.address);
                // Check tier
                try {
                    const response = await fetch(`${ZIGMA_API_BASE}/api/v1/access/${params.address}`);
                    const data = await response.json();
                    const tierEmojis = {
                        'FREE': '🆓',
                        'BASIC': '🥉',
                        'PRO': '🥇',
                        'WHALE': '🏆'
                    };
                    return ctx.reply(`
✅ **Wallet Connected**

${tierEmojis[data.tier]} **Current Tier: ${data.tier}**
Balance: ${data.balance} $ZIGMA

**Features Unlocked:**
${data.features.signalsPerDay === -1 ? '✅ Unlimited signals' : `✅ ${data.features.signalsPerDay} signals/day`}
${data.features.alerts ? `✅ ${data.features.alerts} alerts` : '❌ No alerts'}
${data.features.arbitrage ? '✅ Arbitrage scanner' : '❌ No arbitrage'}
${data.features.tracking === -1 ? '✅ Unlimited tracking' : `✅ ${data.features.tracking} markets`}
${data.tier === 'WHALE' ? '✅ API access' : '❌ No API access'}

Upgrade to unlock more features!
          `.trim());
                }
                catch (error) {
                    return ctx.reply('❌ Failed to verify wallet. Please try again.');
                }
            },
        },
        analyze: {
            description: 'Deep analysis of a specific market',
            parameters: z.object({
                market: z.string().describe('Market ID, URL, or search query'),
            }),
            handler: async (ctx, params) => {
                try {
                    // Handle different input formats
                    let marketId = params.market;
                    // Extract ID from Polymarket URL
                    if (params.market.includes('polymarket.com')) {
                        const match = params.market.match(/event\/([^\/\?]+)/);
                        if (match)
                            marketId = match[1];
                    }
                    const analysis = await zigmaFetch(`/api/v1/market/${encodeURIComponent(marketId)}/analysis`);
                    return ctx.reply(formatAnalysis(analysis));
                }
                catch (error) {
                    console.error('Zigma analyze error:', error);
                    return ctx.reply(`
❌ **Analysis Failed**

Couldn't find or analyze market: "${params.market}"

Try:
• Paste the full Polymarket URL
• Use the exact market ID
• Search with \`zigma search [query]\`
          `.trim());
                }
            },
        },
        track: {
            description: 'Track a market for alerts',
            parameters: z.object({
                market: z.string().describe('Market ID or URL'),
                threshold: z.number().optional().default(5).describe('Alert on edge change (%)'),
            }),
            handler: async (ctx, params) => {
                try {
                    const tier = await checkTokenTier(ctx);
                    // Check tier limits for tracking
                    const tierLimits = {
                        'FREE': { trackedMarkets: 1 },
                        'BASIC': { trackedMarkets: 5 },
                        'PRO': { trackedMarkets: 25 },
                        'WHALE': { trackedMarkets: -1 }
                    };
                    const config = tierLimits[tier];
                    // Get current tracked count
                    const tracked = ctx.memory.get('zigma_tracked') || [];
                    if (config.trackedMarkets !== -1 && tracked.length >= config.trackedMarkets) {
                        return ctx.reply(`
❌ **Tracking Limit Reached**

You've reached your limit of ${config.trackedMarkets} tracked markets.

Upgrade to track more:
• Basic (100 $ZIGMA): 5 markets
• Pro (1,000 $ZIGMA): 25 markets
• Whale (10,000 $ZIGMA): Unlimited

Connect wallet: \`zigma connect 0x...\` 
            `.trim());
                    }
                    if (tracked.length >= 10) {
                        return ctx.reply('❌ Maximum 10 tracked markets. Remove one first with `zigma untrack [market]`');
                    }
                    tracked.push({
                        marketId: params.market,
                        threshold: params.threshold,
                        addedAt: new Date().toISOString(),
                    });
                    ctx.memory.set('zigma_tracked', tracked);
                    return ctx.reply(`
✅ **Now Tracking**

Market: ${params.market}
Alert Threshold: ${params.threshold}% edge change

I'll notify you when:
• Edge crosses your threshold
• Market approaches resolution
• Major price movement (>10%)

_View tracked markets: \`zigma portfolio\`_
          `.trim());
                }
                catch (error) {
                    console.error('Zigma track error:', error);
                    return ctx.reply('❌ Failed to track market. Please try again.');
                }
            },
        },
        portfolio: {
            description: 'View your tracked markets and positions',
            handler: async (ctx) => {
                try {
                    const tracked = ctx.memory.get('zigma_tracked') || [];
                    if (tracked.length === 0) {
                        return ctx.reply(`
📊 **Your Zigma Portfolio**

No markets tracked yet!

Get started:
• \`zigma alpha\` - Find signals
• \`zigma track [market]\` - Track a market
• \`zigma wallet [address]\` - Connect your wallet
            `.trim());
                    }
                    // Fetch current status for each
                    const statuses = await Promise.all(tracked.map(async (t) => {
                        try {
                            const analysis = await zigmaFetch(`/api/v1/market/${t.marketId}/analysis`);
                            return { ...t, analysis };
                        }
                        catch {
                            return { ...t, analysis: null };
                        }
                    }));
                    const formatted = statuses.map((s, i) => {
                        if (!s.analysis)
                            return `${i + 1}. ❓ ${s.marketId} (data unavailable)`;
                        const edge = s.analysis.edge * 100;
                        const emoji = edge > s.threshold ? '🔔' : edge > 0 ? '📈' : '📉';
                        return `${i + 1}. ${emoji} ${s.analysis.question.slice(0, 40)}...
   Edge: ${edge > 0 ? '+' : ''}${edge.toFixed(1)}% | Conf: ${s.analysis.confidence.toFixed(0)}%`;
                    }).join('\n\n');
                    return ctx.reply(`
📊 **Your Zigma Portfolio**
_${tracked.length} markets tracked_

${formatted}

---
• \`zigma untrack [number]\` to remove
• \`zigma analyze [number]\` for details
          `.trim());
                }
                catch (error) {
                    console.error('Zigma portfolio error:', error);
                    return ctx.reply('❌ Failed to fetch portfolio. Please try again.');
                }
            },
        },
        wallet: {
            description: 'Analyze a Polymarket wallet',
            parameters: z.object({
                address: z.string().describe('Wallet address (0x...)'),
            }),
            handler: async (ctx, params) => {
                try {
                    const tier = await checkTokenTier(ctx);
                    // Check tier limits for wallet analysis
                    const tierLimits = {
                        'FREE': { walletAnalysisPerDay: 1 },
                        'BASIC': { walletAnalysisPerDay: 5 },
                        'PRO': { walletAnalysisPerDay: -1 },
                        'WHALE': { walletAnalysisPerDay: -1 }
                    };
                    const config = tierLimits[tier];
                    // Check daily usage
                    const today = new Date().toDateString();
                    const usage = ctx.memory.get('zigma_usage') || {};
                    const dailyUsage = usage[today]?.walletAnalyses || 0;
                    if (config.walletAnalysisPerDay !== -1 && dailyUsage >= config.walletAnalysisPerDay) {
                        return ctx.reply(`
❌ **Daily Limit Reached**

You've used your ${config.walletAnalysisPerDay} wallet analyses today.

Upgrade for more:
• Basic (100 $ZIGMA): 5 analyses/day
• Pro (1,000 $ZIGMA): Unlimited
• Whale (10,000 $ZIGMA): Unlimited

Connect wallet: \`zigma connect 0x...\` 
            `.trim());
                    }
                    if (!params.address.match(/^0x[a-fA-F0-9]{40}$/)) {
                        return ctx.reply('❌ Invalid wallet address. Please provide a valid Ethereum address (0x...)');
                    }
                    const analysis = await zigmaFetch(`/api/v1/wallet/${params.address}`);
                    // Update usage
                    if (!usage[today])
                        usage[today] = {};
                    usage[today].walletAnalyses = dailyUsage + 1;
                    ctx.memory.set('zigma_usage', usage);
                    return ctx.reply(formatWalletAnalysis(analysis));
                }
                catch (error) {
                    console.error('Zigma wallet error:', error);
                    return ctx.reply(`
❌ **Wallet Analysis Failed**

Couldn't analyze wallet: ${params.address.slice(0, 10)}...

This could mean:
• No Polymarket activity found
• Address is invalid
• API temporarily unavailable

Try again or check the address.
          `.trim());
                }
            },
        },
        arb: {
            description: 'Scan for arbitrage opportunities',
            handler: async (ctx) => {
                try {
                    const tier = await checkTokenTier(ctx);
                    // Check if arbitrage is available for this tier
                    if (tier === 'FREE' || tier === 'BASIC') {
                        return ctx.reply(`
❌ **Feature Not Available**

Arbitrage scanner is only available for:
• Pro (1,000 $ZIGMA)
• Whale (10,000 $ZIGMA)

Connect wallet: \`zigma connect 0x...\`
            `.trim());
                    }
                    const opportunities = await zigmaFetch('/api/v1/arbitrage');
                    if (!opportunities || opportunities.length === 0) {
                        return ctx.reply(`
🔍 **No Arbitrage Opportunities**

The scanner checked for:
• Related market price discrepancies
• Inverse markets not summing to 100%
• Subset/superset mispricing

Current market efficiency is high. Check back after major news events.
            `.trim());
                    }
                    const formatted = opportunities.slice(0, 5).map((opp, i) => `
**${i + 1}. ${opp.type}** (${opp.expectedProfit.toFixed(1)}% profit)
• ${opp.marketATitle?.slice(0, 40)}...
• ${opp.marketBTitle?.slice(0, 40)}...
• Trades: ${opp.trades.map(t => t.action).join(' + ')}
• Confidence: ${opp.confidence}%
          `.trim()).join('\n\n');
                    return ctx.reply(`
💰 **Arbitrage Opportunities**
_${opportunities.length} found_

${formatted}

⚠️ Execute quickly - arb windows close fast!
          `.trim());
                }
                catch (error) {
                    console.error('Zigma arb error:', error);
                    return ctx.reply('❌ Arbitrage scan failed. Please try again.');
                }
            },
        },
    },
    // Heartbeat - proactive alerts
    heartbeat: {
        interval: '*/15 * * * *', // Every 15 minutes
        handler: async (ctx) => {
            try {
                const tracked = ctx.memory.get('zigma_tracked') || [];
                if (tracked.length === 0)
                    return;
                // Check for signals on tracked markets
                for (const market of tracked) {
                    const analysis = await zigmaFetch(`/api/v1/market/${market.marketId}/analysis`);
                    const edge = Math.abs(analysis.edge * 100);
                    const lastEdge = market.lastEdge || 0;
                    const edgeChange = Math.abs(edge - lastEdge);
                    // Alert if edge crossed threshold
                    if (edgeChange >= market.threshold) {
                        await ctx.notify(`
🔔 **Zigma Alert: Edge Movement**

${analysis.question.slice(0, 50)}...

Edge changed: ${lastEdge.toFixed(1)}% → ${edge.toFixed(1)}%
Current recommendation: ${analysis.recommendation}

Reply "zigma analyze ${market.marketId}" for full analysis
            `.trim());
                    }
                    // Update stored edge
                    market.lastEdge = edge;
                }
                ctx.memory.set('zigma_tracked', tracked);
                // Check for new high-edge signals (optional notification)
                const signals = await zigmaFetch('/api/v1/signals?limit=1&minEdge=0.10');
                if (signals && signals.length > 0 && signals[0].tier === 'STRONG_TRADE') {
                    const lastNotified = ctx.memory.get('zigma_last_strong_signal');
                    if (lastNotified !== signals[0].marketId) {
                        await ctx.notify(`
🔥 **Zigma: Strong Trade Signal**

${formatSignal(signals[0], 1)}

Reply "zigma track ${signals[0].marketId}" to follow this market
            `.trim());
                        ctx.memory.set('zigma_last_strong_signal', signals[0].marketId);
                    }
                }
            }
            catch (error) {
                console.error('Zigma heartbeat error:', error);
            }
        },
    },
};
// Helper functions
async function getMarketCount() {
    try {
        const stats = await zigmaFetch('/api/v1/stats');
        return stats.marketCount;
    }
    catch {
        return 500; // Default estimate
    }
}
//# sourceMappingURL=index-old.js.map