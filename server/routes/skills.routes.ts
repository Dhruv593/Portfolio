import { Router } from 'express';
import { skillsController } from '../controllers/skills.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { skillCategorySchema } from '../utils/validators';

const router = Router();

router.get('/', skillsController.getSkills);
router.post('/', authenticateAdmin, validateRequest(skillCategorySchema), skillsController.createSkillCategory);
router.put('/:id', authenticateAdmin, skillsController.updateSkillCategory);
router.delete('/:id', authenticateAdmin, skillsController.deleteSkillCategory);

export default router;
