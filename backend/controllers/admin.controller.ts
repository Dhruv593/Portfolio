import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';
import { dbService } from '../db/mongodb.js';
import { resetJsonStore } from '../db/jsonStore.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class AdminController {
  async login(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const result = adminService.authenticate(password);

      if (result.success) {
        return sendSuccess(res, { token: result.token }, 200, 'Login successful');
      }

      return sendError(res, result.error || 'Incorrect passcode', 401);
    } catch (err: any) {
      return sendError(res, err.message || 'Login attempt failed');
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = adminService.getDashboardStats();
      return sendSuccess(res, stats);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch dashboard stats');
    }
  }

  async getMongoStatus(req: Request, res: Response) {
    try {
      const status = dbService.getStatus();
      return res.json(status);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch Mongo status');
    }
  }

  async configMongo(req: Request, res: Response) {
    try {
      const { uri } = req.body;
      const connected = await dbService.connect(uri);

      if (connected) {
        return sendSuccess(res, { message: 'MongoDB connected and synced successfully!' });
      }

      const status = dbService.getStatus();
      return sendError(res, status.error || 'Could not connect to MongoDB cluster', 400);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update Mongo configuration');
    }
  }

  async seedData(req: Request, res: Response) {
    try {
      resetJsonStore();
      return sendSuccess(res, { message: 'Database reset to initial sample data.' });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to seed database');
    }
  }
}

export const adminController = new AdminController();
