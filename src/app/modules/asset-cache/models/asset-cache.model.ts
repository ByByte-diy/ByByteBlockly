/** Root cache manifest served at /assets/cache-manifest.json */
export interface CacheManifest {
  schemaVersion: number;
  appMinVersion: string;
  generatedAt: string;
  bundles: Record<string, BundleManifestEntry>;
}

/** Summary entry for a downloadable bundle */
export interface BundleManifestEntry {
  version: string;
  contentHash: string;
  baseUrl: string;
  catalogUrl: string;
  entryCount: number;
  totalBytes: number;
}

/** Per-bundle catalog with file hashes (e.g. wasm-catalog.json) */
export interface BundleCatalog {
  schemaVersion: number;
  bundleId: string;
  version: string;
  deployVersion?: string;
  contentHash: string;
  assetsBase: string;
  generatedAt: string;
  entryCount: number;
  totalBytes: number;
  files: Record<string, BundleFileEntry>;
  tiers?: Record<string, unknown>;
}

export interface BundleFileEntry {
  sha256: string;
  size: number;
}

/** IndexedDB snapshot for an installed bundle */
export interface BundleInstallMeta {
  version: string;
  contentHash: string;
  updatedAt: number;
}

export interface AssetCacheStats {
  entryCount: number;
  bundleMetas: Record<string, BundleInstallMeta>;
}

export interface AssetPrefetchProgress {
  completed: number;
  total: number;
  currentPath?: string;
}
