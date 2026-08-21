import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { createProjectSchema, updateProjectSchema } from '../utils/validators.js';

const router = Router();

router.get('/categories', projectController.getCategories);
router.post('/categories', authenticateAdmin, projectController.addCategory);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authenticateAdmin, validateRequest(createProjectSchema), projectController.createProject);
router.put('/:id', authenticateAdmin, validateRequest(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authenticateAdmin, projectController.deleteProject);

export default router;
