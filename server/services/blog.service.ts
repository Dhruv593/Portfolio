import { dbStore, saveJsonStore } from '../db/jsonStore';
import { dbService } from '../db/mongodb';
import { BlogDoc } from '../models/types';

export class BlogService {
  async getAllBlogs(query: { search?: string; status?: string; page?: number; limit?: number }) {
    const search = (query.search || '').toLowerCase();
    const status = query.status || 'All';
    const page = query.page || 1;
    const limit = query.limit || 10;

    let filtered = [...(dbStore.blogs || [])];

    if (status !== 'All') {
      filtered = filtered.filter((b) => b.status === status);
    }

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.category.toLowerCase().includes(search) ||
          b.excerpt.toLowerCase().includes(search) ||
          b.content.toLowerCase().includes(search) ||
          b.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      blogs: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getBlogByIdOrSlug(idOrSlug: string): Promise<BlogDoc | null> {
    const blog = (dbStore.blogs || []).find((b) => b.id === idOrSlug || b.slug === idOrSlug);
    return blog || null;
  }

  async getCategories(): Promise<string[]> {
    if (!dbStore.blogCategories) {
      dbStore.blogCategories = [];
    }
    const categoriesSet = new Set([
      ...dbStore.blogCategories,
      ...(dbStore.blogs || []).map((b) => b.category).filter((c): c is string => Boolean(c && c.trim())),
    ]);
    return Array.from(categoriesSet);
  }

  async addCategory(name: string): Promise<string[]> {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return this.getCategories();
    }
    if (!dbStore.blogCategories) {
      dbStore.blogCategories = [];
    }
    if (!dbStore.blogCategories.includes(trimmed)) {
      dbStore.blogCategories.push(trimmed);
      saveJsonStore();

      const mongoDb = dbService.getDb();
      if (mongoDb) {
        await mongoDb.collection('blog_categories').updateOne(
          { name: trimmed },
          { $set: { name: trimmed, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    }
    return this.getCategories();
  }

  async createBlog(data: any): Promise<BlogDoc> {
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

    const title = data.title || 'Untitled Article';
    const slug =
      data.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      `post-${Date.now()}`;

    const newBlog: BlogDoc = {
      id: `blog-${Date.now()}`,
      title,
      slug,
      category: cat,
      status: data.status === 'Draft' ? 'Draft' : 'Published',
      dateAdded:
        data.dateAdded ||
        new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: data.readTime || '5 min read',
      image:
        data.image ||
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      excerpt: data.excerpt || '',
      content: data.content || '',
      tags: tagsArray,
      author: data.author || 'Portfolio Author',
      featured: Boolean(data.featured),
    };

    if (!dbStore.blogs) dbStore.blogs = [];
    dbStore.blogs.unshift(newBlog);
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('blogs').insertOne({ ...newBlog, _id: newBlog.id } as any);
    }

    return newBlog;
  }

  async updateBlog(id: string, data: any): Promise<BlogDoc | null> {
    if (!dbStore.blogs) dbStore.blogs = [];
    const index = dbStore.blogs.findIndex((b) => b.id === id);
    if (index === -1) return null;

    if (data.category && typeof data.category === 'string') {
      await this.addCategory(data.category.trim());
    }

    const current = dbStore.blogs[index];
    let updatedTags = current.tags;
    if (Array.isArray(data.tags)) {
      updatedTags = data.tags;
    } else if (typeof data.tags === 'string') {
      updatedTags = data.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated: BlogDoc = {
      ...current,
      title: data.title !== undefined ? data.title : current.title,
      slug: data.slug !== undefined ? data.slug : current.slug,
      category: data.category !== undefined ? data.category : current.category,
      status: data.status !== undefined ? data.status : current.status,
      dateAdded: data.dateAdded !== undefined ? data.dateAdded : current.dateAdded,
      readTime: data.readTime !== undefined ? data.readTime : current.readTime,
      image: data.image !== undefined ? data.image : current.image,
      excerpt: data.excerpt !== undefined ? data.excerpt : current.excerpt,
      content: data.content !== undefined ? data.content : current.content,
      tags: updatedTags,
      author: data.author !== undefined ? data.author : current.author,
      featured: data.featured !== undefined ? Boolean(data.featured) : current.featured,
    };

    dbStore.blogs[index] = updated;
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('blogs').replaceOne({ _id: id } as any, { ...updated, _id: id } as any, { upsert: true });
    }

    return updated;
  }

  async deleteBlog(id: string): Promise<boolean> {
    if (!dbStore.blogs) return false;
    const index = dbStore.blogs.findIndex((b) => b.id === id);
    if (index === -1) return false;

    dbStore.blogs.splice(index, 1);
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('blogs').deleteOne({ _id: id } as any);
    }

    return true;
  }
}

export const blogService = new BlogService();
