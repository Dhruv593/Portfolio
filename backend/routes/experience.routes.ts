import { Router } from 'express';
import { experienceController } from '../controllers/experience.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { experienceSchema } from '../utils/validators.js';

const router = Router();

router.get('/', experienceController.getExperience);
router.post('/', authenticateAdmin, validateRequest(experienceSchema), experienceController.createExperience);
router.put('/:id', authenticateAdmin, experienceController.updateExperience);
router.delete('/:id', authenticateAdmin, experienceController.deleteExperience);

export default router;
