import type { Logger } from '../types';

export class ConsoleLogger implements Logger {
  constructor(
    private level: 'debug' | 'info' | 'warn' | 'error' = 'info',
    private requestId?: string
  ) {}

  private log(level: string, message: string, meta?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      request_id: this.requestId,
      ...meta,
    };
    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, meta?: Record<string, any>) {
    if (this.shouldLog('debug')) {
      this.log('debug', message, meta);
    }
  }

  info(message: string, meta?: Record<string, any>) {
    if (this.shouldLog('info')) {
      this.log('info', message, meta);
    }
  }

  warn(message: string, meta?: Record<string, any>) {
    if (this.shouldLog('warn')) {
      this.log('warn', message, meta);
    }
  }

  error(message: string, meta?: Record<string, any>) {
    if (this.shouldLog('error')) {
      this.log('error', message, meta);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevel = levels.indexOf(this.level);
    const messageLevel = levels.indexOf(level);
    return messageLevel >= currentLevel;
  }
}

export function createLogger(requestId: string, logLevel: string = 'info'): Logger {
  return new ConsoleLogger(logLevel as any, requestId);
}