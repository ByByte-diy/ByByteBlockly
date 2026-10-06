import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetCacheService } from './services/asset-cache.service';
import { AssetCacheManifestService } from './services/asset-cache-manifest.service';
import { AssetCacheRegistry } from './services/asset-cache-registry.service';
import { AssetCacheRefreshService } from './services/asset-cache-refresh.service';

/**
 * Unified downloadable asset cache (IndexedDB + manifest validation).
 * Import once in AppModule; platform providers (e.g. WasmAssetProvider) consume these services.
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    AssetCacheService,
    AssetCacheManifestService,
    AssetCacheRegistry,
    AssetCacheRefreshService,
  ],
})
export class AssetCacheModule {
  constructor(@Optional() @SkipSelf() parentModule?: AssetCacheModule) {
    if (parentModule) {
      throw new Error('AssetCacheModule is already loaded. Import it only in AppModule.');
    }
  }
}
