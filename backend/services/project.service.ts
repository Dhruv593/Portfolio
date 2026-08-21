import { dbStore, saveJsonStore } from '../db/jsonStore.js';
import { dbService } from '../db/mongodb.js';
import { ProjectDoc } from '../models/types.js';

export class ProjectService {
  async getAllProjects(query: { search?: string; status?: string; page?: number; limit?: number }) {
    const search = (query.search || '').toLowerCase();
    const status = query.status || 'All';
    const page = query.page || 1;
    const limit = query.limit || 10;

    let filtered = [...dbStore.projects];

    if (status !== 'All') {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      projects: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getProjectById(id: string): Promise<ProjectDoc | null> {
    const project = dbStore.projects.find((p) => p.id === id);
    return project || null;
  }

  async getCategories(): Promise<string[]> {
    if (!dbStore.categories) {
      dbStore.categories = [];
    }
    const categoriesSet = new Set([
      ...dbStore.categories,
      ...dbStore.projects.map((p) => p.category).filter((c): c is string => Boolean(c && c.trim())),
    ]);
    return Array.from(categoriesSet);
  }

  async addCategory(name: string): Promise<string[]> {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return this.getCategories();
    }
    if (!dbStore.categories) {
      dbStore.categories = [];
    }
    if (!dbStore.categories.includes(trimmed)) {
      dbStore.categories.push(trimmed);
      saveJsonStore();

      const mongoDb = dbService.getDb();
      if (mongoDb) {
        await mongoDb.collection('categories').updateOne(
          { name: trimmed },
          { $set: { name: trimmed, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    }
    return this.getCategories();
  }

  async createProject(data: any): Promise<ProjectDoc> {
    let tagsArray: string[] = [];
    if (Array.isArray(data.tags)) {
      tagsArray = data.tags;
    } else if (typeof data.tags === 'string' && data.tags.trim() !== '') {
      tagsArray = data.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const cat = (data.category || 'General').trim();
    if (cat) {
      await this.addCategory(cat);
    }

    const newProject: ProjectDoc = {
      id: `proj-${Date.now()}`,
      name: data.name || 'Untitled Project',
      category: cat,
      status: data.status === 'Draft' ? 'Draft' : 'Published',
      dateAdded:
        data.dateAdded ||
        new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      image:
        data.image ||
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80',
      description: data.description || '',
      longDescription: data.longDescription || '',
      githubUrl: data.githubUrl || '',
      liveUrl: data.liveUrl || '',
      tags: tagsArray,
      featured: Boolean(data.featured),
    };

    dbStore.projects.unshift(newProject);
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').insertOne({ ...newProject, _id: newProject.id } as any);
    }

    return newProject;
  }

  async updateProject(id: string, data: any): Promise<ProjectDoc | null> {
    const index = dbStore.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    if (data.category && typeof data.category === 'string') {
      await this.addCategory(data.category.trim());
    }

    const current = dbStore.projects[index];
    let updatedTags = current.tags;
    if (Array.isArray(data.tags)) {
      updatedTags = data.tags;
    } else if (typeof data.tags === 'string') {
      updatedTags = data.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated: ProjectDoc = {
      ...current,
      name: data.name !== undefined ? data.name : current.name,
      category: data.category !== undefined ? data.category : current.category,
      status: data.status !== undefined ? data.status : current.status,
      image: data.image !== undefined ? data.image : current.image,
      description: data.description !== undefined ? data.description : current.description,
      longDescription: data.longDescription !== undefined ? data.longDescription : current.longDescription,
      githubUrl: data.githubUrl !== undefined ? data.githubUrl : current.githubUrl,
      liveUrl: data.liveUrl !== undefined ? data.liveUrl : current.liveUrl,
      tags: updatedTags,
      featured: data.featured !== undefined ? data.featured : current.featured,
    };

    dbStore.projects[index] = updated;
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').updateOne({ _id: id } as any, { $set: updated });
    }

    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const initialLength = dbStore.projects.length;
    dbStore.projects = dbStore.projects.filter((p) => p.id !== id);

    if (dbStore.projects.length === initialLength) {
      return false;
    }

    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').deleteOne({ _id: id } as any);
    }

    return true;
  }
}

export const projectService = new ProjectService();
