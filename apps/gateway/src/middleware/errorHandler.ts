import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { z } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = null;

  // Handle different types of errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof z.ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
  } else if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database Error';
    details = error.message;
  } else if (error.message.includes('insufficient funds')) {
    statusCode = 400;
    message = 'Insufficient funds for transaction';
  } else if (error.message.includes('gas required exceeds allowance')) {
    statusCode = 400;
    message = 'Transaction would exceed gas limit';
  }

  // Log error with context
  logger.error('Request error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    request: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      trainerAddress: req.trainer?.address
    },
    statusCode
  });

  // Send error response
  const errorResponse: any = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  if (details) {
    errorResponse.details = details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};