import { dbStore, saveJsonStore } from '../db/jsonStore.js';
import { dbService } from '../db/mongodb.js';
import { ProjectDoc } from '../models/types.js';
import { randomUUID } from 'node:crypto';

export class ProjectService {
  private async refreshProjects() {
    const mongoDb = dbService.getDb();
    if (!mongoDb) return;
    const docs = await mongoDb.collection('projects').find({}).toArray();
    dbStore.projects = docs.map((doc) => {
      const { _id, ...rest } = doc;
      return { ...rest, id: String(doc.id || _id) } as ProjectDoc;
    });
  }

  async getAllProjects(query: { search?: string; status?: string; page?: number; limit?: number }) {
    await this.refreshProjects();
    const search = (query.search || '').toLowerCase();
    const status = query.status || 'All';
    const page = query.page || 1;
    const limit = query.limit || 10;

    let filtered = [...dbStore.projects].sort((a, b) =>
      (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
    );

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
    await this.refreshProjects();
    const project = dbStore.projects.find((p) => p.id === id);
    return project || null;
  }

  async getCategories(): Promise<string[]> {
    await this.refreshProjects();
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
    await this.refreshProjects();
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
      id: `proj-${randomUUID()}`,
      name: data.name || 'Untitled Project',
      category: cat,
      status: data.status === 'Draft' ? 'Draft' : 'Published',
      dateAdded:
        data.dateAdded ||
        new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      displayOrder: Math.min(0, ...dbStore.projects.map((project) => project.displayOrder ?? 0)) - 1,
      image:
        data.image ||
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80',
      imagePosition: data.imagePosition || '50% 50%',
      imageFit: data.imageFit || 'cover',
      imageScale: data.imageScale ?? 1,
      description: data.description || '',
      longDescription: data.longDescription || '',
      githubUrl: data.githubUrl || '',
      liveUrl: data.liveUrl || '',
      tags: tagsArray,
      featured: Boolean(data.featured),
    };

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').insertOne({ ...newProject, _id: newProject.id } as any);
    }

    dbStore.projects.unshift(newProject);
    saveJsonStore();

    return newProject;
  }

  async setProjectPosition(id: string, position: number): Promise<boolean> {
    await this.refreshProjects();
    const ordered = [...dbStore.projects].sort((a, b) =>
      (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
    );
    const currentIndex = ordered.findIndex((project) => project.id === id);
    if (currentIndex === -1) return false;

    const [project] = ordered.splice(currentIndex, 1);
    ordered.splice(Math.max(0, Math.min(position - 1, ordered.length)), 0, project);
    const updated = ordered.map((item, index) => ({ ...item, displayOrder: index }));

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').bulkWrite(updated.map((item) => ({
        updateOne: { filter: { _id: item.id } as any, update: { $set: { displayOrder: item.displayOrder } } },
      })));
    }

    dbStore.projects = updated;
    saveJsonStore();
    return true;
  }

  async updateProject(id: string, data: any): Promise<ProjectDoc | null> {
    await this.refreshProjects();
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
      imagePosition: data.imagePosition !== undefined ? data.imagePosition : current.imagePosition,
      imageFit: data.imageFit !== undefined ? data.imageFit : current.imageFit,
      imageScale: data.imageScale !== undefined ? data.imageScale : current.imageScale,
      description: data.description !== undefined ? data.description : current.description,
      longDescription: data.longDescription !== undefined ? data.longDescription : current.longDescription,
      githubUrl: data.githubUrl !== undefined ? data.githubUrl : current.githubUrl,
      liveUrl: data.liveUrl !== undefined ? data.liveUrl : current.liveUrl,
      tags: updatedTags,
      featured: data.featured !== undefined ? data.featured : current.featured,
    };

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').updateOne({ _id: id } as any, { $set: updated });
    }

    dbStore.projects[index] = updated;
    saveJsonStore();

    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    await this.refreshProjects();
    if (!dbStore.projects.some((p) => p.id === id)) {
      return false;
    }

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('projects').deleteOne({ _id: id } as any);
    }

    dbStore.projects = dbStore.projects.filter((p) => p.id !== id);
    saveJsonStore();

    return true;
  }
}

export const projectService = new ProjectService();
