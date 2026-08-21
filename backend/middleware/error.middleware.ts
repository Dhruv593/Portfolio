import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error(`API Error on [${req.method}] ${req.originalUrl}`, err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode, {
    name: err.name || 'Error',
    code: err.code || 'UNKNOWN_ERROR',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
