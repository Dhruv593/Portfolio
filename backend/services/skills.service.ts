import { dbStore, saveJsonStore } from '../db/jsonStore';
import { dbService } from '../db/mongodb';
import { SkillCategoryDoc } from '../models/types';

export class SkillsService {
  async getSkills(): Promise<SkillCategoryDoc[]> {
    return dbStore.skills;
  }

  async createSkillCategory(data: Partial<SkillCategoryDoc>): Promise<SkillCategoryDoc> {
    const item: SkillCategoryDoc = {
      id: `skill-${Date.now()}`,
      category: data.category || 'Category',
      iconName: data.iconName || 'code',
      skills: Array.isArray(data.skills) ? data.skills : [],
    };

    dbStore.skills.push(item);
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('skills').insertOne({ ...item, _id: item.id } as any);
    }

    return item;
  }

  async updateSkillCategory(id: string, data: Partial<SkillCategoryDoc>): Promise<SkillCategoryDoc | null> {
    const index = dbStore.skills.findIndex((s) => s.id === id);
    if (index === -1) return null;

    dbStore.skills[index] = { ...dbStore.skills[index], ...data };
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('skills').updateOne({ _id: id } as any, { $set: dbStore.skills[index] });
    }

    return dbStore.skills[index];
  }

  async deleteSkillCategory(id: string): Promise<boolean> {
    const len = dbStore.skills.length;
    dbStore.skills = dbStore.skills.filter((s) => s.id !== id);
    if (dbStore.skills.length === len) return false;

    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('skills').deleteOne({ _id: id } as any);
    }

    return true;
  }
}

export const skillsService = new SkillsService();
