import { dbStore, saveJsonStore } from '../db/jsonStore';
import { dbService } from '../db/mongodb';
import { ProfileDataDoc } from '../models/types';
import { initialProfile } from '../../src/data/initialData';

export class ProfileService {
  async getProfile(): Promise<ProfileDataDoc> {
    return dbStore.profile[0] || initialProfile;
  }

  async updateProfile(data: Partial<ProfileDataDoc>): Promise<ProfileDataDoc> {
    const current = dbStore.profile[0] || initialProfile;
    const updated = { ...current, ...data };
    dbStore.profile[0] = updated;
    saveJsonStore();

    const mongoDb = dbService.getDb();
    if (mongoDb) {
      await mongoDb.collection('profile').updateOne(
        { _id: 'main-profile' } as any,
        { $set: { ...updated, _id: 'main-profile' } },
        { upsert: true }
      );
    }

    return updated;
  }
}

export const profileService = new ProfileService();
