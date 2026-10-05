import { ASSET_CACHE_CONFIG } from '../config/asset-cache.config';
import { BundleInstallMeta } from '../models/asset-cache.model';

export interface AssetCacheStore {
  get(key: string): Promise<ArrayBuffer | undefined>;
  put(key: string, value: ArrayBuffer): Promise<void>;
  delete(key: string): Promise<void>;
  deleteByPrefix(prefix: string): Promise<void>;
  getBundleMeta(bundleId: string): Promise<BundleInstallMeta | undefined>;
  putBundleMeta(bundleId: string, meta: BundleInstallMeta): Promise<void>;
  deleteBundleMeta(bundleId: string): Promise<void>;
  getAllBundleMetas(): Promise<Record<string, BundleInstallMeta>>;
  clear(): Promise<void>;
  countEntries(): Promise<number>;
}

export function buildAssetCacheKey(
  bundleId: string,
  sha256: string,
  logicalPath: string,
): string {
  const hash = sha256.startsWith('sha256:') ? sha256.slice(7) : sha256;
  return `${bundleId}:${hash}:${logicalPath}`;
}

export function createAssetCacheStore(): AssetCacheStore {
  if (typeof indexedDB !== 'undefined') {
    return new IndexedDbAssetCacheStore();
  }
  return new MemoryAssetCacheStore();
}

/** In-memory store for tests and environments without IndexedDB */
export class MemoryAssetCacheStore implements AssetCacheStore {
  private entries = new Map<string, ArrayBuffer>();
  private bundleMetas = new Map<string, BundleInstallMeta>();

  async get(key: string): Promise<ArrayBuffer | undefined> {
    return this.entries.get(key);
  }

  async put(key: string, value: ArrayBuffer): Promise<void> {
    this.entries.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    for (const key of [...this.entries.keys()]) {
      if (key.startsWith(prefix)) {
        this.entries.delete(key);
      }
    }
  }

  async getBundleMeta(bundleId: string): Promise<BundleInstallMeta | undefined> {
    return this.bundleMetas.get(bundleId);
  }

  async putBundleMeta(bundleId: string, meta: BundleInstallMeta): Promise<void> {
    this.bundleMetas.set(bundleId, meta);
  }

  async deleteBundleMeta(bundleId: string): Promise<void> {
    this.bundleMetas.delete(bundleId);
  }

  async getAllBundleMetas(): Promise<Record<string, BundleInstallMeta>> {
    return Object.fromEntries(this.bundleMetas.entries());
  }

  async clear(): Promise<void> {
    this.entries.clear();
    this.bundleMetas.clear();
  }

  async countEntries(): Promise<number> {
    return this.entries.size;
  }
}

class IndexedDbAssetCacheStore implements AssetCacheStore {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDb(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(ASSET_CACHE_CONFIG.dbName, ASSET_CACHE_CONFIG.dbVersion);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('entries')) {
            db.createObjectStore('entries');
          }
          if (!db.objectStoreNames.contains('bundleMeta')) {
            db.createObjectStore('bundleMeta');
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
      });
    }
    return this.dbPromise;
  }

  private async withStore<T>(
    storeName: 'entries' | 'bundleMeta',
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => Promise<T> | T,
  ): Promise<T> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      Promise.resolve(action(store))
        .then(resolve)
        .catch(reject);
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    });
  }

  async get(key: string): Promise<ArrayBuffer | undefined> {
    return this.withStore('entries', 'readonly', (store) =>
      new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result as ArrayBuffer | undefined);
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async put(key: string, value: ArrayBuffer): Promise<void> {
    await this.withStore('entries', 'readwrite', (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.withStore('entries', 'readwrite', (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('entries', 'readwrite');
      const store = tx.objectStore('entries');
      const request = store.openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          return;
        }
        if (typeof cursor.key === 'string' && cursor.key.startsWith(prefix)) {
          cursor.delete();
        }
        cursor.continue();
      };
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getBundleMeta(bundleId: string): Promise<BundleInstallMeta | undefined> {
    return this.withStore('bundleMeta', 'readonly', (store) =>
      new Promise((resolve, reject) => {
        const request = store.get(bundleId);
        request.onsuccess = () => resolve(request.result as BundleInstallMeta | undefined);
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async putBundleMeta(bundleId: string, meta: BundleInstallMeta): Promise<void> {
    await this.withStore('bundleMeta', 'readwrite', (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.put(meta, bundleId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async deleteBundleMeta(bundleId: string): Promise<void> {
    await this.withStore('bundleMeta', 'readwrite', (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.delete(bundleId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async getAllBundleMetas(): Promise<Record<string, BundleInstallMeta>> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('bundleMeta', 'readonly');
      const store = tx.objectStore('bundleMeta');
      const request = store.openCursor();
      const result: Record<string, BundleInstallMeta> = {};
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          return;
        }
        result[String(cursor.key)] = cursor.value as BundleInstallMeta;
        cursor.continue();
      };
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear(): Promise<void> {
    await this.withStore('entries', 'readwrite', (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    );
    await this.withStore('bundleMeta', 'readwrite', (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    );
  }

  async countEntries(): Promise<number> {
    return this.withStore('entries', 'readonly', (store) =>
      new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result ?? 0);
        request.onerror = () => reject(request.error);
      }),
    );
  }
}
