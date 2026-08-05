import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../server/config/env.config';
import { dbService } from '../server/db/mongodb';
import { loadJsonStore } from '../server/db/jsonStore';
import { apiRateLimiter } from '../server/middleware/rateLimiter';
import { errorHandler } from '../server/middleware/error.middleware';
import apiRouter from '../server/routes/index';

// Initialize the local store cache
loadJsonStore();

const app = express();

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

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use('/api', apiRateLimiter);

// Serverless DB connection middleware
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      dbConnected = await dbService.connect();
    } catch (err) {
      console.error('Database connection failed in serverless handler:', err);
    }
  }
  next();
});

// Mount Routes
app.use('/api', apiRouter);

// Error Handler
app.use(errorHandler);

export default app;
