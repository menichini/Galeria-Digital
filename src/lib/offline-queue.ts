import { openDB, DBSchema, IDBPDatabase } from 'idb';

export type PendingUpload = {
  id: string;
  dataUrl: string;
  createdAt: number;
  attempts: number;
  status: 'pending' | 'uploading' | 'failed';
};

interface GaleriaDB extends DBSchema {
  'pending-uploads': {
    key: string;
    value: PendingUpload;
  };
}

const DB_NAME = 'galeria-db';
const STORE_NAME = 'pending-uploads';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GaleriaDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null; // Avoid running on server
  if (!dbPromise) {
    dbPromise = openDB<GaleriaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function savePendingUpload(upload: PendingUpload): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put(STORE_NAME, upload);
}

export async function getPendingUploads(): Promise<PendingUpload[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

export async function removePendingUpload(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete(STORE_NAME, id);
}

export async function updateUploadStatus(
  id: string,
  status: PendingUpload['status'],
  attempts?: number
): Promise<void> {
  const db = await getDB();
  if (!db) return;
  
  const upload = await db.get(STORE_NAME, id);
  if (!upload) return;

  upload.status = status;
  if (attempts !== undefined) {
    upload.attempts = attempts;
  }
  
  await db.put(STORE_NAME, upload);
}
