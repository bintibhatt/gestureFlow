import { openDB } from 'idb';
import { DEFAULT_FILTERS, DEFAULT_TRANSFORMS } from '../image/processor';

const DB_NAME = 'GestureFlowDB_V2';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
}

export async function savePhoto(photo) {
  const db = await initDB();
  const photoItem = {
    id: photo.id || `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    originalDataUrl: photo.originalDataUrl || photo.dataUrl,
    currentDataUrl: photo.currentDataUrl || photo.dataUrl,
    timestamp: photo.timestamp || new Date().toISOString(),
    name: photo.name || `Photo ${new Date().toLocaleTimeString()}`,
    filters: photo.filters || { ...DEFAULT_FILTERS },
    transforms: photo.transforms || { ...DEFAULT_TRANSFORMS },
    historyStack: photo.historyStack || [],
    width: photo.width || 640,
    height: photo.height || 480,
  };
  await db.put(STORE_NAME, photoItem);
  return photoItem;
}

export async function getPhotos() {
  const db = await initDB();
  const photos = await db.getAllFromIndex(STORE_NAME, 'timestamp');
  return photos.reverse(); // newest first
}

export async function getLatestPhoto() {
  const photos = await getPhotos();
  return photos.length > 0 ? photos[0] : null;
}

export async function deletePhoto(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
  return id;
}

export async function clearAllPhotos() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}

export async function updatePhoto(photo) {
  const db = await initDB();
  await db.put(STORE_NAME, photo);
  return photo;
}
