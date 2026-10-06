import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { adminLoginSchema, mongoConfigSchema } from '../utils/validators.js';
import { distributedAuthRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', distributedAuthRateLimiter, validateRequest(adminLoginSchema), adminController.login);
router.get('/stats', authenticateAdmin, adminController.getStats);
router.get('/mongodb/status', authenticateAdmin, adminController.getMongoStatus);
router.post('/mongodb/config', authenticateAdmin, validateRequest(mongoConfigSchema), adminController.configMongo);
router.post('/seed', authenticateAdmin, adminController.seedData);

export default router;
