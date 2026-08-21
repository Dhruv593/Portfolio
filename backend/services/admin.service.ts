import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import { dbStore } from '../db/jsonStore.js';

export class AdminService {
  authenticate(password: string): { success: boolean; token?: string; error?: string } {
    const adminPasscode = env.ADMIN_PASSWORD;

    if (password === adminPasscode) {
      const token = jwt.sign(
        { role: 'admin', timestamp: Date.now() },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return { success: true, token };
    }

    return { success: false, error: 'Incorrect admin passcode' };
  }

  getDashboardStats() {
    const totalProjects = dbStore.projects.length;
    const publishedCount = dbStore.projects.filter((p) => p.status === 'Published').length;
    const draftCount = dbStore.projects.filter((p) => p.status === 'Draft').length;

    return {
      totalProjects,
      liveViewers: '1.2k',
      recentActivity: `+${publishedCount}`,
      publishedCount,
      draftCount,
    };
  }
}

export const adminService = new AdminService();
