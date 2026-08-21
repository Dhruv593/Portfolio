import { Router } from 'express';
import projectRoutes from './project.routes.js';
import blogRoutes from './blog.routes.js';
import experienceRoutes from './experience.routes.js';
import educationRoutes from './education.routes.js';
import skillsRoutes from './skills.routes.js';
import profileRoutes from './profile.routes.js';
import contactRoutes from './contact.routes.js';
import adminRoutes from './admin.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/blogs', blogRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/skills', skillsRoutes);
router.use('/profile', profileRoutes);
router.use('/contact', contactRoutes);
router.use('/messages', contactRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);

export default router;
