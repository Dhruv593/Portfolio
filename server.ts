import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import app from './backend/app.js';
import { env } from './backend/config/env.config.js';
import { dbService } from './backend/db/mongodb.js';
import { logger } from './backend/utils/logger.js';

async function startServer() {
  // 1. Explicitly initialize Database Connection on boot
  await dbService.connect();

  // 2. Serve Frontend via Vite Middleware in Development or Static Assets in Production
  if (!env.IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 3. Start Local / Container Server
  app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`Portfolio Server running at http://localhost:${env.PORT}`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to boot application server', err);
});
