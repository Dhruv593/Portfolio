import { Request, Response } from 'express';
import { blogService } from '../services/blog.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class BlogController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await blogService.getCategories();
      return sendSuccess(res, { categories });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch blog categories');
    }
  }

  async addCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const categories = await blogService.addCategory(name);
      return sendSuccess(res, { categories }, 201, 'Blog category added successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to add blog category');
    }
  }

  async getBlogs(req: Request, res: Response) {
    try {
      const search = req.query.search as string;
      const status = req.query.status as string;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const result = await blogService.getAllBlogs({ search, status, page, limit });
      return sendSuccess(res, result.blogs, 200, undefined, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch blogs');
    }
  }

  async getBlogById(req: Request, res: Response) {
    try {
      const blog = await blogService.getBlogByIdOrSlug(req.params.id);
      if (!blog) return sendError(res, 'Blog post not found', 404);
      return sendSuccess(res, blog);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch blog post');
    }
  }

  async createBlog(req: Request, res: Response) {
    try {
      const blog = await blogService.createBlog(req.body);
      return sendSuccess(res, { blog }, 201, 'Blog post created successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create blog post');
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const updated = await blogService.updateBlog(req.params.id, req.body);
      if (!updated) return sendError(res, 'Blog post not found', 404);
      return sendSuccess(res, { blog: updated }, 200, 'Blog post updated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update blog post');
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      const success = await blogService.deleteBlog(req.params.id);
      if (!success) return sendError(res, 'Blog post not found', 404);
      return sendSuccess(res, { message: 'Blog post deleted successfully' });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete blog post');
    }
  }
}

export const blogController = new BlogController();
