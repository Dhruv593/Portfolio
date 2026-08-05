import { Response } from 'express';

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
    error,
    ...(details && { details }),
  });
};
