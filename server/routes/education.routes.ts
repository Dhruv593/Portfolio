import { Router } from 'express';
import { educationController } from '../controllers/education.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { educationSchema } from '../utils/validators';

const router = Router();

router.get('/', educationController.getEducation);
router.post('/', authenticateAdmin, validateRequest(educationSchema), educationController.createEducation);
router.put('/:id', authenticateAdmin, educationController.updateEducation);
router.delete('/:id', authenticateAdmin, educationController.deleteEducation);

export default router;
