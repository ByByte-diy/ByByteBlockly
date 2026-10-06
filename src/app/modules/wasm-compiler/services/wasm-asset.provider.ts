import { Injectable } from '@angular/core';
import {
  AssetCacheManifestService,
  AssetCacheRegistry,
  AssetCacheService,
  AssetPrefetchProgress,
  BundleCatalog,
  BundleManifestEntry,
} from '@modules/asset-cache';
import { WasmRuntimePort } from '../ports/wasm-runtime.port';
import { WASM_AVR_328P_BUNDLE_ID } from '../constants/wasm-asset.const';
import { collectTierPrefetchPaths, WasmPrefetchTier } from '../utils/wasm-tier-prefetch.util';

/** WASM bundle asset access via {@link AssetCacheModule} + host {@link WasmRuntimePort}. */
@Injectable()
export class WasmAssetProvider {
  protected readonly bundleId: string = WASM_AVR_328P_BUNDLE_ID;

  private catalog: BundleCatalog | null = null;
  private catalogPromise: Promise<BundleCatalog> | null = null;

  constructor(
    private readonly manifestService: AssetCacheManifestService,
    private readonly registry: AssetCacheRegistry,
    private readonly cacheService: AssetCacheService,
    private readonly runtime: WasmRuntimePort,
  ) {}

  get activeBundleId(): string {
    return this.bundleId;
  }

  async ensureValid(forceRefresh = false): Promise<void> {
    if (forceRefresh) {
      this.manifestService.clear();
      this.clearCatalogCache();
      await this.manifestService.load(true);
    }
    await this.registry.ensureBundleValid(this.bundleId, forceRefresh);
  }

  /**
   * Reload remote manifest, evict stale IndexedDB entries, optionally prefetch tiers.
   * Used before compile and on board-select warm-up when cache may be outdated.
   */
  async syncBundle(options?: {
    force?: boolean;
    prefetchTiers?: WasmPrefetchTier[];
    onPrefetchProgress?: (progress: AssetPrefetchProgress) => void;
  }): Promise<void> {
    const force = options?.force ?? true;
    await this.ensureValid(force);

    if (!options?.prefetchTiers?.length) {
      return;
    }

    for (const tier of options.prefetchTiers) {
      await this.prefetchTier(tier, options.onPrefetchProgress);
    }
  }

  async loadCatalog(force = false): Promise<BundleCatalog> {
    if (this.catalog && !force) {
      return this.catalog;
    }

    if (this.catalogPromise && !force) {
      return this.catalogPromise;
    }

    this.catalogPromise = this.fetchCatalog(force);
    try {
      this.catalog = await this.catalogPromise;
      return this.catalog;
    } finally {
      this.catalogPromise = null;
    }
  }

  resolveAssetUrl(logicalPath: string, baseUrl?: string): string {
    const base = baseUrl ?? this.catalog?.assetsBase ?? this.getBundleEntry()?.baseUrl;
    if (!base) {
      throw new Error('WASM assets base URL is not loaded');
    }
    return new URL(logicalPath, new URL(base, this.runtime.getDocumentBase()).href).href;
  }

  async getBytes(logicalPath: string): Promise<ArrayBuffer> {
    await this.ensureValid();
    const catalog = await this.loadCatalog();
    const file = catalog.files[logicalPath];
    if (!file) {
      throw new Error(`Unknown WASM asset path: ${logicalPath}`);
    }

    return this.cacheService.getOrFetch(
      this.bundleId,
      logicalPath,
      file.sha256,
      (path) => this.resolveAssetUrl(path, catalog.assetsBase),
    );
  }

  async resolveAssetsBase(): Promise<string> {
    await this.ensureValid();
    const catalog = await this.loadCatalog();
    return this.resolveAssetsBaseFromCatalog(catalog.assetsBase);
  }

  resolveAssetsBaseFromCatalog(baseUrl?: string): string {
    const base = baseUrl ?? this.catalog?.assetsBase ?? this.getBundleEntry()?.baseUrl;
    if (!base) {
      throw new Error('WASM assets base URL is not loaded');
    }
    return new URL(base, this.runtime.getDocumentBase()).href;
  }

  async prefetchTier(
    tier: WasmPrefetchTier,
    onProgress?: (progress: AssetPrefetchProgress) => void,
  ): Promise<void> {
    const catalog = await this.loadCatalog();
    const paths = collectTierPrefetchPaths(catalog, tier);
    await this.prefetchCatalogPaths(paths, onProgress);

    const bundleEntry = this.getBundleEntry();
    if (bundleEntry) {
      await this.registry.markBundleInstalled(this.bundleId, bundleEntry);
    }
  }

  async prefetchCatalogPaths(
    paths: string[],
    onProgress?: (progress: AssetPrefetchProgress) => void,
  ): Promise<void> {
    if (!paths.length) {
      return;
    }

    await this.ensureValid();
    const catalog = await this.loadCatalog();
    const entries = paths
      .filter((path) => catalog.files[path])
      .map((path) => ({
        path,
        sha256: catalog.files[path].sha256,
      }));

    await this.cacheService.prefetch(
      this.bundleId,
      entries,
      (logicalPath) => this.resolveAssetUrl(logicalPath, catalog.assetsBase),
      onProgress,
    );
  }

  async prefetch(
    paths: string[],
    onProgress?: (progress: AssetPrefetchProgress) => void,
  ): Promise<void> {
    await this.ensureValid();
    const catalog = await this.loadCatalog();
    const entries = paths.map((path) => {
      const file = catalog.files[path];
      if (!file) {
        throw new Error(`Unknown WASM asset path: ${path}`);
      }
      return { path, sha256: file.sha256 };
    });

    await this.cacheService.prefetch(
      this.bundleId,
      entries,
      (path) => this.resolveAssetUrl(path, catalog.assetsBase),
      onProgress,
    );

    const bundleEntry = this.getBundleEntry();
    if (bundleEntry) {
      await this.registry.markBundleInstalled(this.bundleId, bundleEntry);
    }
  }

  clearCatalogCache(): void {
    this.catalog = null;
    this.catalogPromise = null;
  }

  private getBundleEntry(): BundleManifestEntry | undefined {
    return this.manifestService.getBundle(this.bundleId);
  }

  private async fetchCatalog(force: boolean): Promise<BundleCatalog> {
    const entry = this.getBundleEntry();
    if (!entry?.catalogUrl) {
      await this.manifestService.load(force);
    }

    const bundle = this.getBundleEntry();
    if (!bundle?.catalogUrl) {
      throw new Error(`${this.bundleId} catalogUrl missing from cache-manifest.json`);
    }

    const url = new URL(bundle.catalogUrl, this.runtime.getDocumentBase());
    if (force) {
      url.searchParams.set('t', String(Date.now()));
    }

    const response = await this.runtime.fetch(url.href, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load wasm-catalog.json (${response.status})`);
    }

    return (await response.json()) as BundleCatalog;
  }
}
