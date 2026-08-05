import { MongoClient, Db } from 'mongodb';
import { env } from '../config/env.config';
import { logger } from '../utils/logger';
import { dbStore, saveJsonStore } from './jsonStore';

class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  private connectionError = '';
  private currentUri = '';

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(customUri?: string): Promise<boolean> {
    const targetUri = (customUri || env.MONGODB_URI || dbStore.mongoUri || '').trim();

    if (!targetUri) {
      this.isConnected = false;
      this.connectionError = 'No MONGODB_URI environment variable or configuration found.';
      logger.mongoStatus('DISCONNECTED', '', this.connectionError);
      return false;
    }

    this.currentUri = targetUri;

    try {
      if (this.client) {
        await this.client.close().catch(() => {});
      }

      this.client = new MongoClient(targetUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 10,
        minPoolSize: 1,
        retryWrites: true,
      });

      await this.client.connect();
      this.db = this.client.db('portfolio_admin');
      this.isConnected = true;
      this.connectionError = '';
      dbStore.mongoUri = targetUri;
      saveJsonStore();

      logger.mongoStatus('CONNECTED', targetUri);

      // Perform auto-sync between memory/JSON and MongoDB Atlas
      await this.syncCollections();

      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = err.message || 'Failed to connect to MongoDB cluster';
      logger.mongoStatus('FAILED', targetUri, this.connectionError);
      return false;
    }
  }

  private async syncCollections() {
    if (!this.db) return;

    try {
      // 1. Projects collection sync
      const projectsCol = this.db.collection('projects');
      const projCount = await projectsCol.countDocuments();
      if (projCount === 0 && dbStore.projects.length > 0) {
        await projectsCol.insertMany(dbStore.projects.map((p) => ({ ...p, _id: p.id } as any)));
      } else if (projCount > 0) {
        const docs = await projectsCol.find({}).toArray();
        dbStore.projects = docs.map((doc) => {
          const { _id, ...rest } = doc;
          return { id: (doc.id || _id?.toString()) as string, ...rest } as any;
        });
      }

      // 2. Experience collection sync
      const expCol = this.db.collection('experience');
      const expCount = await expCol.countDocuments();
      if (expCount === 0 && dbStore.experience.length > 0) {
        await expCol.insertMany(dbStore.experience.map((e) => ({ ...e, _id: e.id } as any)));
      } else if (expCount > 0) {
        const docs = await expCol.find({}).toArray();
        dbStore.experience = docs.map((doc) => {
          const { _id, ...rest } = doc;
          return { id: (doc.id || _id?.toString()) as string, ...rest } as any;
        });
      }

      // 3. Education collection sync
      const eduCol = this.db.collection('education');
      const eduCount = await eduCol.countDocuments();
      if (eduCount === 0 && dbStore.education.length > 0) {
        await eduCol.insertMany(dbStore.education.map((e) => ({ ...e, _id: e.id } as any)));
      } else if (eduCount > 0) {
        const docs = await eduCol.find({}).toArray();
        dbStore.education = docs.map((doc) => {
          const { _id, ...rest } = doc;
          return { id: (doc.id || _id?.toString()) as string, ...rest } as any;
        });
      }

      // 4. Skills collection sync
      const skillsCol = this.db.collection('skills');
      const skillsCount = await skillsCol.countDocuments();
      if (skillsCount === 0 && dbStore.skills.length > 0) {
        await skillsCol.insertMany(dbStore.skills.map((s) => ({ ...s, _id: s.id } as any)));
      } else if (skillsCount > 0) {
        const docs = await skillsCol.find({}).toArray();
        dbStore.skills = docs.map((doc) => {
          const { _id, ...rest } = doc;
          return { id: (doc.id || _id?.toString()) as string, ...rest } as any;
        });
      }

      // 5. Profile collection sync
      const profileCol = this.db.collection('profile');
      const profileCount = await profileCol.countDocuments();
      if (profileCount === 0 && dbStore.profile.length > 0) {
        await profileCol.insertOne({ ...dbStore.profile[0], _id: 'main-profile' } as any);
      } else if (profileCount > 0) {
        const docs = await profileCol.find({}).toArray();
        if (docs.length > 0) {
          const { _id, ...rest } = docs[0];
          dbStore.profile = [rest as any];
        }
      }

      // 6. Messages collection sync
      const messagesCol = this.db.collection('messages');
      const messagesCount = await messagesCol.countDocuments();
      if (messagesCount === 0 && dbStore.messages && dbStore.messages.length > 0) {
        await messagesCol.insertMany(dbStore.messages.map((m) => ({ ...m, _id: m.id } as any)));
      } else if (messagesCount > 0) {
        const docs = await messagesCol.find({}).toArray();
        dbStore.messages = docs.map((doc) => {
          const { _id, ...rest } = doc;
          return { id: (doc.id || _id?.toString()) as string, ...rest } as any;
        });
      }

      saveJsonStore();
    } catch (err) {
      logger.error('Error during MongoDB collection sync', err);
    }
  }

  public getDb(): Db | null {
    return this.db;
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      error: this.connectionError,
      uri: this.currentUri ? this.currentUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') : '',
      dbName: 'portfolio_admin',
      lastSynced: new Date().toLocaleTimeString(),
    };
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.isConnected = false;
    }
  }
}

export const dbService = DatabaseService.getInstance();
