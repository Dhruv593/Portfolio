import rateLimit from 'express-rate-limit';
import { createHash } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { dbService } from '../db/mongodb.js';
import { env } from '../config/env.config.js';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit admin login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
});

const localContactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many messages. Please try again later.' },
});

let rateLimitIndexReady: Promise<unknown> | undefined;

const distributedRateLimit = (scope: string, maximum: number, windowMs: number, localLimiter: typeof localContactRateLimiter) => async (req: Request, res: Response, next: NextFunction) => {
  const db = dbService.getDb();
  if (!db) {
    if (env.IS_PROD) return res.status(503).json({ success: false, error: 'Service temporarily unavailable.' });
    return localLimiter(req, res, next);
  }

  try {
    const collection = db.collection('request_rate_limits');
    rateLimitIndexReady ??= collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await rateLimitIndexReady;
    const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
    const ipHash = createHash('sha256').update(req.ip || 'unknown').digest('hex');
    const result = await collection.findOneAndUpdate(
      { _id: `${scope}:${ipHash}:${windowStart}` } as any,
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } },
      { upsert: true, returnDocument: 'after' }
    );
    if ((result?.count || 0) > maximum) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    }
    next();
  } catch {
    return res.status(503).json({ success: false, error: 'Service temporarily unavailable.' });
  }
};

export const contactRateLimiter = distributedRateLimit('contact', 5, 60 * 60 * 1000, localContactRateLimiter);
export const distributedAuthRateLimiter = distributedRateLimit('login', 10, 15 * 60 * 1000, authRateLimiter);
