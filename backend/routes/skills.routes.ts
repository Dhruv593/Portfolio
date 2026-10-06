import { Router } from 'express';
import { skillsController } from '../controllers/skills.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { skillCategorySchema, updateSkillCategorySchema } from '../utils/validators.js';

const router = Router();

router.get('/', skillsController.getSkills);
router.post('/', authenticateAdmin, validateRequest(skillCategorySchema), skillsController.createSkillCategory);
router.put('/:id', authenticateAdmin, validateRequest(updateSkillCategorySchema), skillsController.updateSkillCategory);
router.delete('/:id', authenticateAdmin, skillsController.deleteSkillCategory);

export default router;
