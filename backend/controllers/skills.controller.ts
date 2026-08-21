import { Request, Response } from 'express';
import { skillsService } from '../services/skills.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class SkillsController {
  async getSkills(req: Request, res: Response) {
    try {
      const skills = await skillsService.getSkills();
      return sendSuccess(res, { skills });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch skill categories');
    }
  }

  async createSkillCategory(req: Request, res: Response) {
    try {
      const skillCategory = await skillsService.createSkillCategory(req.body);
      return sendSuccess(res, { skillCategory }, 201, 'Skill category created');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create skill category');
    }
  }

  async updateSkillCategory(req: Request, res: Response) {
    try {
      const updated = await skillsService.updateSkillCategory(req.params.id, req.body);
      if (!updated) return sendError(res, 'Skill category not found', 404);
      return sendSuccess(res, { skillCategory: updated });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update skill category');
    }
  }

  async deleteSkillCategory(req: Request, res: Response) {
    try {
      const success = await skillsService.deleteSkillCategory(req.params.id);
      if (!success) return sendError(res, 'Skill category not found', 404);
      return sendSuccess(res, { message: 'Skill category deleted' });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete skill category');
    }
  }
}

export const skillsController = new SkillsController();
