import { dbStore, saveJsonStore } from '../db/jsonStore.js';
import { dbService } from '../db/mongodb.js';
import { readCollection } from '../db/readCollection.js';
import { SkillCategoryDoc } from '../models/types.js';

export class SkillsService {
  private async refreshSkills() {
    const items = await readCollection<SkillCategoryDoc>('skills');
    if (items) dbStore.skills = items;
  }

  async getSkills(): Promise<SkillCategoryDoc[]> {
    await this.refreshSkills();
    return dbStore.skills;
  }

  async createSkillCategory(data: Partial<SkillCategoryDoc>): Promise<SkillCategoryDoc> {
    await this.refreshSkills();
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
    await this.refreshSkills();
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
    await this.refreshSkills();
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
