type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  service?: string;
  agentId?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const service = context?.service ? `[${context.service}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${service} ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && this.shouldLog('debug')) {
      console.debug(this.format('debug', message, context), context);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      // In production, this would go to a logging service
      if (this.isDevelopment) {
        console.info(this.format('info', message, context));
      }
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      // In production, this would go to a logging service
      console.warn(this.format('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      // In production, this would go to a logging service
      console.error(this.format('error', message, context), error);
    }
  }
}

export const logger = new Logger();