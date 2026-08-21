import { Request, Response } from 'express';
import { experienceService } from '../services/experience.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class ExperienceController {
  async getExperience(req: Request, res: Response) {
    try {
      const experience = await experienceService.getExperience();
      return sendSuccess(res, { experience });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch experience items');
    }
  }

  async createExperience(req: Request, res: Response) {
    try {
      const item = await experienceService.createExperience(req.body);
      return sendSuccess(res, { experience: item }, 201, 'Experience created');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create experience');
    }
  }

  async updateExperience(req: Request, res: Response) {
    try {
      const updated = await experienceService.updateExperience(req.params.id, req.body);
      if (!updated) return sendError(res, 'Experience item not found', 404);
      return sendSuccess(res, { experience: updated });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update experience');
    }
  }

  async deleteExperience(req: Request, res: Response) {
    try {
      const success = await experienceService.deleteExperience(req.params.id);
      if (!success) return sendError(res, 'Experience item not found', 404);
      return sendSuccess(res, { message: 'Experience item deleted' });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete experience');
    }
  }
}

export const experienceController = new ExperienceController();
