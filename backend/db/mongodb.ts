import { MongoClient, Db } from 'mongodb';
import { env } from '../config/env.config.js';
import { logger } from '../utils/logger.js';
import { dbStore, saveJsonStore } from './jsonStore.js';

class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  private connectionError = '';
  private currentUri = '';
  private runtimeUri = '';
  private lastSyncedAt = '';
  private connectingPromise: Promise<boolean> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(customUri?: string): Promise<boolean> {
    const targetUri = (customUri || this.runtimeUri || env.MONGODB_URI || '').trim();

    if (!targetUri) {
      this.isConnected = false;
      this.connectionError = 'No MONGODB_URI environment variable or configuration found.';
      return false;
    }

    // Return in-flight connection promise to prevent concurrent duplicate connections
    if (this.connectingPromise && !customUri) {
      return this.connectingPromise;
    }

    // Reuse the connection within a warm function instance.
    if (this.isConnected && this.client && this.db && this.currentUri === targetUri && !customUri) {
      return true;
    }

    this.currentUri = targetUri;

    this.connectingPromise = (async () => {
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
        if (customUri) this.runtimeUri = targetUri;
        this.connectionError = '';
        logger.mongoStatus('CONNECTED');

        return true;
      } catch (err: any) {
        this.isConnected = false;
        await this.client?.close().catch(() => {});
        this.db = null;
        this.client = null;
        this.connectionError = 'Failed to connect to MongoDB cluster';
        logger.mongoStatus('FAILED');
        return false;
      } finally {
        this.connectingPromise = null;
      }
    })();

    return this.connectingPromise;
  }

  // Run only when an administrator explicitly configures or migrates storage.
  public async syncCollections() {
    const db = this.db;
    if (!db) return;

    try {
      const syncById = async (
        collectionName: string,
        items: Array<{ id: string }>,
        updateStore: (docs: any[]) => void
      ) => {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        if (count === 0 && items.length > 0) {
          await collection.insertMany(items.map((item) => ({ ...item, _id: item.id } as any)));
        } else if (count > 0) {
          const docs = await collection.find({}).toArray();
          updateStore(docs.map((doc) => {
            const { _id, ...rest } = doc;
            return { id: (doc.id || _id?.toString()) as string, ...rest };
          }));
        }
      };

      // These collections are independent, so sync them concurrently on cold start.
      const syncResults = await Promise.allSettled([
        syncById('projects', dbStore.projects, (docs) => { dbStore.projects = docs; }),
        syncById('blogs', dbStore.blogs || [], (docs) => { dbStore.blogs = docs; }),
        syncById('experience', dbStore.experience, (docs) => { dbStore.experience = docs; }),
        syncById('education', dbStore.education, (docs) => { dbStore.education = docs; }),
        syncById('skills', dbStore.skills, (docs) => { dbStore.skills = docs; }),
        syncById('messages', dbStore.messages || [], (docs) => { dbStore.messages = docs; }),
        (async () => {
          const profileCol = db.collection('profile');
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
        })(),
      ]);
      syncResults.forEach((result) => {
        if (result.status === 'rejected') {
          logger.error('Error during MongoDB collection sync', result.reason);
        }
      });
      if (syncResults[0].status === 'rejected') {
        throw syncResults[0].reason;
      }
      saveJsonStore();
      this.lastSyncedAt = new Date().toISOString();
    } catch (err) {
      logger.error('Error during MongoDB collection sync', err);
      throw err;
    }
  }

  public getDb(): Db | null {
    return this.db;
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      error: this.connectionError,
      dbName: 'portfolio_admin',
      lastSynced: this.lastSyncedAt || undefined,
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
