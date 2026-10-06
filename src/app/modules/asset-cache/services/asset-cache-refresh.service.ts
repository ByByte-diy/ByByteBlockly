import { Injectable, OnDestroy } from '@angular/core';
import { ASSET_CACHE_CONFIG } from '../config/asset-cache.config';
import { AssetCacheManifestService } from './asset-cache-manifest.service';
import { AssetCacheRegistry } from './asset-cache-registry.service';

/**
 * Periodically re-fetch cache-manifest.json from the server and evict stale bundles.
 * Complements compile-time force refresh when the SPA shell is cached.
 */
@Injectable()
export class AssetCacheRefreshService implements OnDestroy {
  private intervalId?: ReturnType<typeof setInterval>;

  private readonly onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      void this.refresh();
    }
  };

  constructor(
    private readonly manifestService: AssetCacheManifestService,
    private readonly registry: AssetCacheRegistry,
  ) {}

  start(): void {
    void this.refresh();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.intervalId = setInterval(
      () => void this.refresh(),
      ASSET_CACHE_CONFIG.manifestRefreshIntervalMs,
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  async refresh(): Promise<string[]> {
    this.manifestService.clear();
    return this.registry.validate();
  }
}
