/**
 * Structured logging utility
 */

import { LOG_LEVELS } from './config.js';

type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const envLevel = (process.env.LOG_LEVEL || 'info') as LogLevel;
    const levels = [LOG_LEVELS.DEBUG, LOG_LEVELS.INFO, LOG_LEVELS.WARN, LOG_LEVELS.ERROR];
    return levels.indexOf(level) >= levels.indexOf(envLevel);
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      ...(meta && { meta }),
    };

    console.log(JSON.stringify(entry));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }
}

export const logger = new Logger();
