import { Router, Request, Response, NextFunction } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { createProjectSchema, updateProjectSchema, projectPositionSchema, categorySchema } from '../utils/validators.js';
import { dbService } from '../db/mongodb.js';
import { env } from '../config/env.config.js';
import { sendError } from '../utils/apiResponse.js';

const router = Router();

const requireProjectStorage = (_req: Request, res: Response, next: NextFunction) => {
  if ((env.IS_PROD || env.MONGODB_URI) && !dbService.getStatus().connected) {
    return sendError(res, 'MongoDB is unavailable. The project was not saved. Check the database connection and try again.', 503);
  }
  return next();
};

router.use(requireProjectStorage);

router.get('/categories', projectController.getCategories);
router.post('/categories', authenticateAdmin, validateRequest(categorySchema), projectController.addCategory);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authenticateAdmin, validateRequest(createProjectSchema), projectController.createProject);
router.put('/:id/position', authenticateAdmin, validateRequest(projectPositionSchema), projectController.setProjectPosition);
router.put('/:id', authenticateAdmin, validateRequest(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authenticateAdmin, projectController.deleteProject);

export default router;
