import { Router } from 'express';
import {
  submitContactMessage,
  getAllMessages,
  deleteMessage,
  toggleMessageReadStatus,
} from '../controllers/contact.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', authenticateAdmin, getAllMessages);
router.delete('/:id', authenticateAdmin, deleteMessage);
router.patch('/:id/read', authenticateAdmin, toggleMessageReadStatus);

export default router;
