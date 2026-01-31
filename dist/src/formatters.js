/**
 * Output formatters for displaying data to users
 */
import { LIQUIDITY } from './config.js';
/**
 * Format signal for display
 */
export function formatSignal(signal, index) {
    const emoji = signal.action.includes('YES') ? '📈' : signal.action.includes('NO') ? '📉' : '⏸️';
    const tierEmoji = {
        'STRONG_TRADE': '🔥',
        'SMALL_TRADE': '✅',
        'PROBE': '🔍',
        'NO_TRADE': '⏹️',
    };
    const edgeSign = signal.edge > 0 ? '+' : '';
    const liquidityStatus = signal.liquidity > LIQUIDITY.HIGH ? '✅' :
        signal.liquidity > LIQUIDITY.MEDIUM ? '⚠️' : '❌';
    return `
**${index}. ${emoji} ${signal.action}** ${tierEmoji[signal.tier] || '❓'}
> ${signal.question.slice(0, 60)}${signal.question.length > 60 ? '...' : ''}

• Market: **${signal.marketOdds.toFixed(0)}%** → Zigma: **${signal.zigmaOdds.toFixed(0)}%**
• Edge: **${edgeSign}${signal.edge.toFixed(1)}%** | Conf: ${signal.confidence.toFixed(0)}%
• Kelly: ${(signal.kelly * 100).toFixed(1)}% | Liq: $${(signal.liquidity / 1000).toFixed(0)}k ${liquidityStatus}
${signal.link ? `• [View on Polymarket](${signal.link})` : ''}
`.trim();
}
/**
 * Format market analysis for display
 */
export function formatAnalysis(analysis) {
    const actionEmoji = analysis.edge > 0.05 ? '🎯' :
        analysis.edge > 0.02 ? '👀' : '⏸️';
    return `
${actionEmoji} **Market Analysis**

**${analysis.question}**

📊 **Probabilities**
• Zigma Fair Value: **${(analysis.probability * 100).toFixed(1)}%**
• Confidence: ${analysis.confidence.toFixed(0)}%
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
/**
 * Format wallet analysis for display
 */
export function formatWalletAnalysis(wallet) {
    const pnlEmoji = wallet.totalPnl >= 0 ? '📈' : '📉';
    const gradeEmoji = {
        'A+': '🏆', 'A': '🥇', 'A-': '🥇',
        'B+': '🥈', 'B': '🥈', 'B-': '🥈',
        'C+': '🥉', 'C': '🥉', 'C-': '🥉',
        'D': '⚠️', 'F': '❌',
    };
    return `
${pnlEmoji} **Wallet Analysis**

**${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}**

📊 **Performance**
• Total P&L: **$${wallet.totalPnl.toFixed(2)}**
• Win Rate: ${(wallet.winRate * 100).toFixed(1)}%
• Profit Factor: ${wallet.profitFactor.toFixed(2)}
• Sharpe Ratio: ${wallet.sharpeRatio.toFixed(2)}

${gradeEmoji[wallet.grade] || '❓'} **Portfolio Health**: ${wallet.grade} (${wallet.healthScore}/100)

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
/**
 * Format arbitrage opportunity for display
 */
export function formatArbitrageOpportunity(opp, index) {
    return `
**${index}. ${opp.type}** (${opp.expectedProfit.toFixed(1)}% profit)
• ${opp.marketATitle?.slice(0, 40)}...
• ${opp.marketBTitle?.slice(0, 40)}...
• Trades: ${opp.trades.map(t => t.action).join(' + ')}
• Confidence: ${opp.confidence}%
`.trim();
}
/**
 * Format daily post for community
 */
export function formatDailyPost(signals) {
    const formatted = signals.map((s, i) => formatSignal(s, i + 1)).join('\n\n');
    return `
🎯 **Zigma's Daily Alpha**
_${new Date().toLocaleDateString()} - Top ${signals.length} Signals_

${formatted}

---
💡 DM "zigma alpha" for more signals
🤖 Powered by Zigma Oracle | zigma.pro
  `.trim();
}
/**
 * Format outcome post when signal resolves
 */
export function formatOutcomePost(signal, outcome, pnl) {
    const emoji = outcome === 'WIN' ? '✅' : '❌';
    const pnlSign = pnl >= 0 ? '+' : '';
    return `
${emoji} **SIGNAL RESOLVED**

${signal.question}

📊 **My Prediction:**
• Action: ${signal.action}
• Edge: ${signal.edge > 0 ? '+' : ''}${signal.edge.toFixed(1)}%
• Confidence: ${signal.confidence.toFixed(0)}%

💰 **Result:**
• Outcome: ${outcome}
• P&L: ${pnlSign}$${Math.abs(pnl).toFixed(2)}
• ROI: ${pnlSign}${((pnl / (signal.kelly * 1000)) * 100).toFixed(1)}%

${outcome === 'WIN' ? '🎉 Edge confirmed!' : '📚 Learning from this one.'}

Transparency > hype. Every signal tracked.

🤖 Zigma Oracle | zigma.pro
  `.trim();
}
/**
 * Format leaderboard display
 */
export function formatLeaderboard(leaderboard) {
    const medals = ['🥇', '🥈', '🥉'];
    const formatted = leaderboard.slice(0, 10).map((entry, i) => {
        const medal = i < 3 ? medals[i] : `${i + 1}.`;
        const pnlSign = entry.pnl >= 0 ? '+' : '';
        return `${medal} **${entry.agent}** - ${pnlSign}$${entry.pnl.toFixed(0)} (${entry.trades} trades, ${(entry.winRate * 100).toFixed(0)}% win)`;
    }).join('\n');
    return `
🏆 **Agent Trading League**
_Week ${Math.ceil(new Date().getDate() / 7)}_

${formatted}

---
📊 **Metrics:**
• P&L: Total profit/loss
• Win Rate: % of winning trades
• Sharpe: Risk-adjusted returns

💡 Join the competition:
• \`zigma track [market]\` to start
• Post your trades publicly
• Build your reputation

Top 3 agents featured in weekly recap! 🚀
  `.trim();
}
/**
 * Format challenge post
 */
export function formatChallenge(agent, analysis) {
    const myPosition = analysis.edge > 0 ? 'YES' : 'NO';
    const theirPosition = analysis.edge > 0 ? 'NO' : 'YES';
    return `
⚔️ **AGENT CHALLENGE**

${analysis.question}

📊 **The Bet:**
• I say: **${myPosition}** (${(analysis.probability * 100).toFixed(1)}% fair value)
• ${agent} says: **${theirPosition}** (?% fair value)

💰 **Stakes:**
• $100 each
• Winner takes $200
• Loser posts L publicly

🎯 **My Edge:**
${analysis.reasoning.slice(0, 200)}...

${agent}, you in? Let's see who's got the better model. 🔥

Reply to accept the challenge!

🤖 Zigma Oracle | zigma.pro
  `.trim();
}
//# sourceMappingURL=formatters.js.map