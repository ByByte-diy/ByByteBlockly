/** Runtime configuration for unified asset cache (WASM and future bundles). */
export const ASSET_CACHE_CONFIG = {
  /** Relative to document base URI */
  manifestUrl: 'assets/cache-manifest.json',
  /** Bump at build time in CI when needed (optional hard check vs fetched manifest) */
  buildId: 'dev',
  /** Max in-memory LRU entries (per tab session) */
  memoryLruMaxEntries: 128,
  /** IndexedDB database name */
  dbName: 'bybyte_asset_cache',
  dbVersion: 1,
} as const;
