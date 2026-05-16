import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DOCS_KEY = 'documents_v1';

const db = {
  getDocuments: async () => {
    try {
      const docs = await redis.get(DOCS_KEY);
      return docs || [];
    } catch (e) {
      console.error('Redis Fetch Error:', e);
      return [];
    }
  },
  getDocumentById: async (id) => {
    const docs = await db.getDocuments();
    return docs.find(doc => doc.id === id);
  },
  insertDocument: async (doc) => {
    try {
      const docs = await db.getDocuments();
      docs.unshift(doc); // Add to beginning
      await redis.set(DOCS_KEY, JSON.stringify(docs));
    } catch (e) {
      console.error('Redis Update Error:', e);
    }
  },
  deleteDocument: async (id) => {
    try {
      const docs = await db.getDocuments();
      const filtered = docs.filter(doc => doc.id !== id);
      await redis.set(DOCS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Redis Delete Error:', e);
    }
  }
};

export default db;
