import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { logger } from '../config/logger';

interface TrainerPayload {
  address: string;
  role: 'trainer' | 'admin';
  exp: number;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      trainer?: TrainerPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authorization header provided'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET) as TrainerPayload;
    
    // Attach trainer info to request
    req.trainer = decoded;
    
    logger.info('Authenticated request', {
      trainerAddress: decoded.address,
      role: decoded.role,
      path: req.path
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
    
    logger.error('Auth middleware error', { error });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error'
    });
  }
};

// Optional auth - allows both authenticated and unauthenticated requests
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  
  // No auth header, continue without authentication
  next();
};

// Admin only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.trainer || req.trainer.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  
  next();
};