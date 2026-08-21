import { Request, Response } from 'express';
import { educationService } from '../services/education.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class EducationController {
  async getEducation(req: Request, res: Response) {
    try {
      const education = await educationService.getEducation();
      return sendSuccess(res, { education });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch education items');
    }
  }

  async createEducation(req: Request, res: Response) {
    try {
      const item = await educationService.createEducation(req.body);
      return sendSuccess(res, { education: item }, 201, 'Education created');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create education');
    }
  }

  async updateEducation(req: Request, res: Response) {
    try {
      const updated = await educationService.updateEducation(req.params.id, req.body);
      if (!updated) return sendError(res, 'Education item not found', 404);
      return sendSuccess(res, { education: updated });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update education');
    }
  }

  async deleteEducation(req: Request, res: Response) {
    try {
      const success = await educationService.deleteEducation(req.params.id);
      if (!success) return sendError(res, 'Education item not found', 404);
      return sendSuccess(res, { message: 'Education item deleted' });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete education');
    }
  }
}

export const educationController = new EducationController();
