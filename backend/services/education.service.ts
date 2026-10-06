import { dbStore, saveJsonStore } from '../db/jsonStore.js';
import { dbService } from '../db/mongodb.js';
import { readCollection } from '../db/readCollection.js';
import { EducationItemDoc } from '../models/types.js';

export class EducationService {
  private async refreshEducation() {
    const items = await readCollection<EducationItemDoc>('education');
    if (items) dbStore.education = items;
  }

  async getEducation(): Promise<EducationItemDoc[]> {
    await this.refreshEducation();
    return dbStore.education;
  }

  async createEducation(data: Partial<EducationItemDoc>): Promise<EducationItemDoc> {
    await this.refreshEducation();
    const item: EducationItemDoc = {
      id: `edu-${Date.now()}`,
      degree: data.degree || 'Degree',
      institution: data.institution || 'University',
      period: data.period || '2020 - 2024',
      description: data.description || '',
      location: data.location || '',
      gpaOrHonors: data.gpaOrHonors || '',
    };

    dbStore.education.unshift(item);
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('education').insertOne({ ...item, _id: item.id } as any);
    }

    return item;
  }

  async updateEducation(id: string, data: Partial<EducationItemDoc>): Promise<EducationItemDoc | null> {
    await this.refreshEducation();
    const index = dbStore.education.findIndex((e) => e.id === id);
    if (index === -1) return null;

    dbStore.education[index] = { ...dbStore.education[index], ...data };
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('education').updateOne({ _id: id } as any, { $set: dbStore.education[index] });
    }

    return dbStore.education[index];
  }

  async deleteEducation(id: string): Promise<boolean> {
    await this.refreshEducation();
    const len = dbStore.education.length;
    dbStore.education = dbStore.education.filter((e) => e.id !== id);
    if (dbStore.education.length === len) return false;

    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('education').deleteOne({ _id: id } as any);
    }

    return true;
  }
}

export const educationService = new EducationService();
