import { Response } from 'express';
import { env } from '../config/env.config.js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, any>;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
  meta?: Record<string, any>
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  });
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500,
  details?: any
) => {
  return res.status(statusCode).json({
    success: false,
    error: env.IS_PROD && statusCode === 500 ? 'Internal server error' : error,
    ...(details && !(env.IS_PROD && statusCode === 500) && { details }),
  });
};
