import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { profileSchema } from '../utils/validators';

const router = Router();

router.get('/', profileController.getProfile);
router.put('/', authenticateAdmin, validateRequest(profileSchema), profileController.updateProfile);

export default router;
