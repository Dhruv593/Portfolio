import { Request, Response } from 'express';
import { dbService } from '../db/mongodb.js';
import { env } from '../config/env.config.js';

export class HealthController {
  async getHealth(req: Request, res: Response) {
    const mongoStatus = dbService.getStatus();

    return res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: {
        type: 'MongoDB / Persistent JSON',
        status: mongoStatus.connected ? 'CONNECTED' : 'DISCONNECTED',
        uri: mongoStatus.uri,
        error: mongoStatus.error || null,
      },
    });
  }
}

export const healthController = new HealthController();
