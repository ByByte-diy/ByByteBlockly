import { Injectable } from '@angular/core';
import { ASSET_CACHE_CONFIG } from '../config/asset-cache.config';
import { BundleManifestEntry, CacheManifest } from '../models/asset-cache.model';

@Injectable()
export class AssetCacheManifestService {
  private manifest: CacheManifest | null = null;
  private loadPromise: Promise<CacheManifest> | null = null;

  get cached(): CacheManifest | null {
    return this.manifest;
  }

  async load(force = false): Promise<CacheManifest> {
    if (this.manifest && !force) {
      return this.manifest;
    }

    if (this.loadPromise && !force) {
      return this.loadPromise;
    }

    this.loadPromise = this.fetchManifest(force);
    try {
      this.manifest = await this.loadPromise;
      return this.manifest;
    } finally {
      this.loadPromise = null;
    }
  }

  getBundle(bundleId: string): BundleManifestEntry | undefined {
    return this.manifest?.bundles[bundleId];
  }

  clear(): void {
    this.manifest = null;
    this.loadPromise = null;
  }

  private async fetchManifest(force: boolean): Promise<CacheManifest> {
    const url = new URL(ASSET_CACHE_CONFIG.manifestUrl, document.baseURI);
    if (force) {
      url.searchParams.set('t', String(Date.now()));
    }

    const response = await fetch(url.href, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load cache manifest (${response.status})`);
    }

    const manifest = (await response.json()) as CacheManifest;
    if (!manifest?.bundles || typeof manifest.bundles !== 'object') {
      throw new Error('Invalid cache-manifest.json shape');
    }
    return manifest;
  }
}
