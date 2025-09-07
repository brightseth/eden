import winston from 'winston';
import { config } from './config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'spirit-gateway' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON_OBJECT`
if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;