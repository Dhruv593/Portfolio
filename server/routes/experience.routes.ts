import { Router } from 'express';
import { experienceController } from '../controllers/experience.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { experienceSchema } from '../utils/validators';

const router = Router();

router.get('/', experienceController.getExperience);
router.post('/', authenticateAdmin, validateRequest(experienceSchema), experienceController.createExperience);
router.put('/:id', authenticateAdmin, experienceController.updateExperience);
router.delete('/:id', authenticateAdmin, experienceController.deleteExperience);

export default router;
