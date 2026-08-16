import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createBlogSchema, updateBlogSchema } from '../utils/validators';

const router = Router();

router.get('/categories', blogController.getCategories);
router.post('/categories', authenticateAdmin, blogController.addCategory);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', authenticateAdmin, validateRequest(createBlogSchema), blogController.createBlog);
router.put('/:id', authenticateAdmin, validateRequest(updateBlogSchema), blogController.updateBlog);
router.delete('/:id', authenticateAdmin, blogController.deleteBlog);

export default router;
