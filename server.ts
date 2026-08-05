import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import { env } from './server/config/env.config';
import { dbService } from './server/db/mongodb';
import { loadJsonStore } from './server/db/jsonStore';
import { apiRateLimiter } from './server/middleware/rateLimiter';
import { errorHandler } from './server/middleware/error.middleware';
import apiRouter from './server/routes/index';
import { logger } from './server/utils/logger';

// 1. Load Local JSON DB Cache
loadJsonStore();

async function startServer() {
  const app = express();

  // 2. Core Security & Parsing Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled for seamless Vite dev server preview & script loading
      crossOriginEmbedderPolicy: false,
    })
  );

  const allowedOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (such as mobile apps, curl, or server-to-server)
        if (!origin) {
          return callback(null, true);
        }

        // Always allow localhost & standard dev/preview configurations for testing and development
        const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (!env.IS_PROD || isLocalhost) {
          return callback(null, true);
        }

        // Match origin against configured ALLOWED_ORIGINS in production
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS policy: Origin ${origin} is not allowed.`), false);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 3. HTTP Request Logging
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  // 4. Rate Limiter for API Endpoints
  app.use('/api', apiRateLimiter);

  // 5. Mount Modular API Routes
  app.use('/api', apiRouter);

  // 6. Global API Error Handler Middleware
  app.use(errorHandler);

  // 7. Initialize Database Connection
  await dbService.connect();

  // 8. Serve Frontend via Vite Middleware or Static Production Assets
  if (!env.IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 9. Start Server
  app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`Luminous Portfolio Server running at http://localhost:${env.PORT}`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to boot application server', err);
});
