import { Router } from 'express';
import {
  submitContactMessage,
  getAllMessages,
  deleteMessage,
  toggleMessageReadStatus,
} from '../controllers/contact.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', contactRateLimiter, submitContactMessage);
router.get('/', authenticateAdmin, getAllMessages);
router.delete('/:id', authenticateAdmin, deleteMessage);
router.patch('/:id/read', authenticateAdmin, toggleMessageReadStatus);

export default router;
