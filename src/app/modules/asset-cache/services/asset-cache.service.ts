import { Injectable } from '@angular/core';
import {
  AssetCacheStats,
  AssetPrefetchProgress,
  BundleInstallMeta,
} from '../models/asset-cache.model';
import { ASSET_CACHE_CONFIG } from '../config/asset-cache.config';
import {
  AssetCacheStore,
  buildAssetCacheKey,
  createAssetCacheStore,
} from './asset-cache-store';

export type AssetFetchFn = (url: string) => Promise<ArrayBuffer>;

@Injectable()
export class AssetCacheService {
  private store: AssetCacheStore;
  private readonly memoryLru = new Map<string, ArrayBuffer>();

  constructor() {
    this.store = createAssetCacheStore();
  }

  /** Visible for unit tests */
  useStore(store: AssetCacheStore): void {
    this.store = store;
    this.memoryLru.clear();
  }

  async get(
    bundleId: string,
    logicalPath: string,
    sha256: string,
  ): Promise<ArrayBuffer | undefined> {
    const key = buildAssetCacheKey(bundleId, sha256, logicalPath);
    const mem = this.memoryLru.get(key);
    if (mem) {
      this.touchMemory(key, mem);
      return mem;
    }

    const stored = await this.store.get(key);
    if (stored) {
      this.touchMemory(key, stored);
    }
    return stored;
  }

  async put(
    bundleId: string,
    logicalPath: string,
    sha256: string,
    bytes: ArrayBuffer,
  ): Promise<void> {
    const key = buildAssetCacheKey(bundleId, sha256, logicalPath);
    await this.store.put(key, bytes);
    this.touchMemory(key, bytes);
  }

  async has(bundleId: string, logicalPath: string, sha256: string): Promise<boolean> {
    const key = buildAssetCacheKey(bundleId, sha256, logicalPath);
    if (this.memoryLru.has(key)) {
      return true;
    }
    const stored = await this.store.get(key);
    return stored != null;
  }

  async getOrFetch(
    bundleId: string,
    logicalPath: string,
    sha256: string,
    resolveUrl: (path: string) => string,
    fetchFn: AssetFetchFn = defaultFetch,
  ): Promise<ArrayBuffer> {
    const cached = await this.get(bundleId, logicalPath, sha256);
    if (cached) {
      return cached;
    }

    const url = resolveUrl(logicalPath);
    const bytes = await fetchFn(url);
    await this.put(bundleId, logicalPath, sha256, bytes);
    return bytes;
  }

  async prefetch(
    bundleId: string,
    paths: Array<{ path: string; sha256: string }>,
    resolveUrl: (path: string) => string,
    onProgress?: (progress: AssetPrefetchProgress) => void,
    fetchFn: AssetFetchFn = defaultFetch,
  ): Promise<void> {
    let completed = 0;
    const total = paths.length;

    for (const entry of paths) {
      onProgress?.({ completed, total, currentPath: entry.path });
      if (!(await this.has(bundleId, entry.path, entry.sha256))) {
        await this.getOrFetch(bundleId, entry.path, entry.sha256, resolveUrl, fetchFn);
      }
      completed += 1;
      onProgress?.({ completed, total, currentPath: entry.path });
    }
  }

  async invalidateBundle(bundleId: string): Promise<void> {
    await this.store.deleteByPrefix(`${bundleId}:`);
    await this.store.deleteBundleMeta(bundleId);

    for (const key of [...this.memoryLru.keys()]) {
      if (key.startsWith(`${bundleId}:`)) {
        this.memoryLru.delete(key);
      }
    }
  }

  async clearAll(): Promise<void> {
    await this.store.clear();
    this.memoryLru.clear();
  }

  async getBundleMeta(bundleId: string): Promise<BundleInstallMeta | undefined> {
    return this.store.getBundleMeta(bundleId);
  }

  async setBundleMeta(bundleId: string, meta: BundleInstallMeta): Promise<void> {
    await this.store.putBundleMeta(bundleId, meta);
  }

  async getStats(): Promise<AssetCacheStats> {
    const entryCount = await this.store.countEntries();
    const bundleMetas = await this.store.getAllBundleMetas();
    return { entryCount, bundleMetas };
  }

  private touchMemory(key: string, value: ArrayBuffer): void {
    if (this.memoryLru.has(key)) {
      this.memoryLru.delete(key);
    }
    this.memoryLru.set(key, value);
    while (this.memoryLru.size > ASSET_CACHE_CONFIG.memoryLruMaxEntries) {
      const oldest = this.memoryLru.keys().next().value;
      if (oldest) {
        this.memoryLru.delete(oldest);
      } else {
        break;
      }
    }
  }
}

async function defaultFetch(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Asset fetch failed ${response.status}: ${url}`);
  }
  return response.arrayBuffer();
}
