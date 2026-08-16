import { Router } from 'express';
import projectRoutes from './project.routes';
import blogRoutes from './blog.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';
import skillsRoutes from './skills.routes';
import profileRoutes from './profile.routes';
import contactRoutes from './contact.routes';
import adminRoutes from './admin.routes';
import healthRoutes from './health.routes';

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
