import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import { dbStore } from '../db/jsonStore.js';
import { dbService } from '../db/mongodb.js';

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

  async getDashboardStats() {
    const db = dbService.getDb();
    const projects = db
      ? await db.collection('projects').find({}, { projection: { status: 1 } }).toArray()
      : dbStore.projects;
    const totalProjects = projects.length;
    const publishedCount = projects.filter((p) => p.status === 'Published').length;
    const draftCount = projects.filter((p) => p.status === 'Draft').length;

    return {
      totalProjects,
      liveViewers: '—',
      recentActivity: '—',
      publishedCount,
      draftCount,
    };
  }
}

export const adminService = new AdminService();
