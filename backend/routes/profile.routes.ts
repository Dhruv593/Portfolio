import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { profileSchema } from '../utils/validators.js';

const router = Router();

router.get('/', profileController.getProfile);
router.put('/', authenticateAdmin, validateRequest(profileSchema), profileController.updateProfile);

export default router;
