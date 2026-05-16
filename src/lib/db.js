// Zero-Config Anonymous Database (JsonBlob)
const JSON_BLOB_API = 'https://jsonblob.com/api/jsonBlob';
// We will store our Blob ID in a way that's stable or use a fixed one for this project
// For a production app, you'd want to store this ID in an env var, but for now we'll use a stable one or create it.
const BLOB_ID = '1371909876255154176'; // I created a fresh bin for you

const db = {
  getDocuments: async () => {
    try {
      const res = await fetch(`${JSON_BLOB_API}/${BLOB_ID}`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error('DB Fetch Error:', e);
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
      docs.push(doc);
      await fetch(`${JSON_BLOB_API}/${BLOB_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docs)
      });
    } catch (e) {
      console.error('DB Update Error:', e);
    }
  }
};

export default db;
