/** Runtime configuration for unified asset cache (WASM and future bundles). */
export const ASSET_CACHE_CONFIG = {
  /** Relative to document base URI */
  manifestUrl: 'assets/cache-manifest.json',
  /** Background manifest revalidation (tab visible + interval). */
  manifestRefreshIntervalMs: 5 * 60 * 1000,
  /**
   * Recommended CDN Cache-Control for cache-manifest.json (see deploy/static-headers).
   * Client always uses fetch cache: 'no-store' + optional ?t= bust.
   */
  manifestCacheControlHint: 'public, max-age=60, stale-while-revalidate=300',
  /** Bump at build time in CI when needed (optional hard check vs fetched manifest) */
  buildId: 'dev',
  /** Max in-memory LRU entries (per tab session) */
  memoryLruMaxEntries: 128,
  /** IndexedDB database name */
  dbName: 'bybyte_asset_cache',
  dbVersion: 1,
} as const;
