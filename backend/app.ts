import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config.js';
import { dbService } from './db/mongodb.js';
import { loadJsonStore } from './db/jsonStore.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
import { logger } from './utils/logger.js';

// 1. Initialize local JSON DB Store cache (fallback)
loadJsonStore();

// 2. Instantiate Express App
const app = express();

// 3. Core Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (!env.IS_PROD || isLocalhost) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS policy: Origin ${origin} is not allowed.`), false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// 4. Serverless & Runtime MongoDB lazy connection middleware
app.use(async (_req, _res, next) => {
  if (!dbService.getDb()) {
    try {
      await dbService.connect();
    } catch (err) {
      logger.error('Database connection error in request handler', err);
    }
  }
  next();
});

// 5. Rate Limiter for API Endpoints
app.use('/api', apiRateLimiter);

// 6. Mount API Routes under /api
app.use('/api', apiRouter);

// 7. Centralized Error Handler Middleware
app.use(errorHandler);

export { app };
export default app;
