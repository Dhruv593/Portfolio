import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class ProjectController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await projectService.getCategories();
      return sendSuccess(res, { categories });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch categories');
    }
  }

  async addCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const categories = await projectService.addCategory(name);
      return sendSuccess(res, { categories }, 201, 'Category added successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to add category');
    }
  }

  async getProjects(req: Request, res: Response) {
    try {
      const search = req.query.search as string;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);

      const result = await projectService.getAllProjects({ search, status, page, limit });
      return sendSuccess(res, result.projects, 200, undefined, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch projects');
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      if (!project) return sendError(res, 'Project not found', 404);
      return sendSuccess(res, project);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch project');
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      const project = await projectService.createProject(req.body);
      return sendSuccess(res, { project }, 201, 'Project created successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create project');
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const updated = await projectService.updateProject(req.params.id, req.body);
      if (!updated) return sendError(res, 'Project not found', 404);
      return sendSuccess(res, { project: updated }, 200, 'Project updated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update project');
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const success = await projectService.deleteProject(req.params.id);
      if (!success) return sendError(res, 'Project not found', 404);
      return sendSuccess(res, { message: 'Project deleted successfully' });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete project');
    }
  }
}

export const projectController = new ProjectController();
