import { dbStore, saveJsonStore } from '../db/jsonStore';
import { dbService } from '../db/mongodb';
import { ExperienceItemDoc } from '../models/types';

export class ExperienceService {
  async getExperience(): Promise<ExperienceItemDoc[]> {
    return dbStore.experience;
  }

  async createExperience(data: Partial<ExperienceItemDoc>): Promise<ExperienceItemDoc> {
    const item: ExperienceItemDoc = {
      id: `exp-${Date.now()}`,
      role: data.role || 'New Role',
      company: data.company || 'Company',
      period: data.period || '2023 - Present',
      isCurrent: Boolean(data.isCurrent),
      location: data.location || '',
      description: data.description || '',
    };

    dbStore.experience.unshift(item);
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('experience').insertOne({ ...item, _id: item.id } as any);
    }

    return item;
  }

  async updateExperience(id: string, data: Partial<ExperienceItemDoc>): Promise<ExperienceItemDoc | null> {
    const index = dbStore.experience.findIndex((e) => e.id === id);
    if (index === -1) return null;

    dbStore.experience[index] = { ...dbStore.experience[index], ...data };
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('experience').updateOne({ _id: id } as any, { $set: dbStore.experience[index] });
    }

    return dbStore.experience[index];
  }

  async deleteExperience(id: string): Promise<boolean> {
    const len = dbStore.experience.length;
    dbStore.experience = dbStore.experience.filter((e) => e.id !== id);
    if (dbStore.experience.length === len) return false;

    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('experience').deleteOne({ _id: id } as any);
    }

    return true;
  }
}

export const experienceService = new ExperienceService();
