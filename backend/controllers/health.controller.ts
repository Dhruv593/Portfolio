import { Request, Response } from 'express';
import { dbService } from '../db/mongodb.js';

export class HealthController {
  async getHealth(req: Request, res: Response) {
    const mongoStatus = dbService.getStatus();

    return res.status(mongoStatus.connected ? 200 : 503).json({
      status: mongoStatus.connected ? 'OK' : 'UNAVAILABLE',
      database: mongoStatus.connected ? 'CONNECTED' : 'DISCONNECTED',
    });
  }
}

export const healthController = new HealthController();
