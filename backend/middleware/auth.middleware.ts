import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import { sendError } from '../utils/apiResponse.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    iat: number;
    exp: number;
  };
}

export const isAdminRequest = (req: Request): boolean => {
  const match = /^Bearer (\S+)$/i.exec(req.headers.authorization || '');
  if (!match) return false;
  try {
    const decoded = jwt.verify(match[1], env.JWT_SECRET, { algorithms: ['HS256'] });
    return typeof decoded !== 'string' && decoded.role === 'admin';
  } catch {
    return false;
  }
};

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return sendError(res, 'Unauthorized: Missing authentication token.', 401);
  }

  if (!isAdminRequest(req)) {
    return sendError(res, 'Unauthorized: Invalid or expired token.', 401);
  }
  next();
};
