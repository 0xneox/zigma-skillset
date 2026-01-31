/**
 * Structured logging utility
 */
import { LOG_LEVELS } from './config.js';
class Logger {
    shouldLog(level) {
        const envLevel = (process.env.LOG_LEVEL || 'info');
        const levels = [LOG_LEVELS.DEBUG, LOG_LEVELS.INFO, LOG_LEVELS.WARN, LOG_LEVELS.ERROR];
        return levels.indexOf(level) >= levels.indexOf(envLevel);
    }
    log(level, message, meta) {
        if (!this.shouldLog(level))
            return;
        const entry = {
            level,
            message,
            timestamp: Date.now(),
            ...(meta && { meta }),
        };
        console.log(JSON.stringify(entry));
    }
    error(message, meta) {
        this.log(LOG_LEVELS.ERROR, message, meta);
    }
    warn(message, meta) {
        this.log(LOG_LEVELS.WARN, message, meta);
    }
    info(message, meta) {
        this.log(LOG_LEVELS.INFO, message, meta);
    }
    debug(message, meta) {
        this.log(LOG_LEVELS.DEBUG, message, meta);
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map