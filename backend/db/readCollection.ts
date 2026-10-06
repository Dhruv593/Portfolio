import { dbService } from './mongodb.js';

export async function readCollection<T extends { id: string }>(name: string): Promise<T[] | null> {
  const db = dbService.getDb();
  if (!db) return null;

  const docs = await db.collection(name).find({}).toArray();
  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { ...rest, id: String(doc.id || _id) } as T;
  });
}
