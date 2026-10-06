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
// Vercel forwards the client address through one trusted proxy hop.
if (env.IS_PROD) app.set('trust proxy', 1);

// 3. Core Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

app.use(
  cors((req, callback) => {
    const origin = req.headers.origin;
    let sameOrigin = false;
    if (origin) {
      try {
        const parsed = new URL(origin);
        sameOrigin = parsed.protocol === 'https:' && parsed.host === req.get('host');
      } catch {
        sameOrigin = false;
      }
    }
    const allowed = !origin || !env.IS_PROD || sameOrigin || allowedOrigins.includes(origin);
    callback(null, { origin: allowed, credentials: true });
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// 4. Serverless & Runtime MongoDB lazy connection middleware
app.use('/api', async (_req, res, next) => {
  const started = performance.now();
  try {
    await dbService.connect();
  } catch (err) {
    logger.error('Database connection error in request handler', err);
  }
  res.setHeader('Server-Timing', `mongo-connect;dur=${(performance.now() - started).toFixed(1)}`);
  next();
});

// Never serve bundled sample data or accept non-persistent writes in production.
app.use('/api', (req, res, next) => {
  if (env.IS_PROD && !dbService.getDb() && req.path !== '/health') {
    return res.status(503).json({ success: false, error: 'Portfolio database is temporarily unavailable.' });
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
