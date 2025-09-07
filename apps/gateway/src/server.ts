import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { logger } from './config/logger';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { spiritsRouter } from './api/spirits';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
});

const practiceRunLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // limit each IP to 10 practice runs per day
  message: 'Daily practice run limit exceeded'
});

app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    idempotencyKey: req.get('Idempotency-Key')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'spirit-gateway'
  });
});

// API routes
app.use('/api/v1/spirits', authMiddleware, spiritsRouter);

// Special rate limiting for practice runs
app.use('/api/v1/spirits/:id/run', practiceRunLimiter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error handling
app.use(errorHandler);

// Start server
const port = config.PORT || 3001;
app.listen(port, () => {
  logger.info(`Spirit Gateway server running on port ${port}`, {
    environment: config.NODE_ENV,
    version: config.VERSION
  });
});

export { app };