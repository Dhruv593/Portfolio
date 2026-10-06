import { Router } from 'express';
import { educationController } from '../controllers/education.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { educationSchema, updateEducationSchema } from '../utils/validators.js';

const router = Router();

router.get('/', educationController.getEducation);
router.post('/', authenticateAdmin, validateRequest(educationSchema), educationController.createEducation);
router.put('/:id', authenticateAdmin, validateRequest(updateEducationSchema), educationController.updateEducation);
router.delete('/:id', authenticateAdmin, educationController.deleteEducation);

export default router;
