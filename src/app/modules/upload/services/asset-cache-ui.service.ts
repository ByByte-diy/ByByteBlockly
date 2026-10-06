import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AssetCacheManifestService,
  AssetCacheRefreshService,
  AssetCacheRegistry,
  AssetCacheService,
} from '@modules/asset-cache';
import { UploadManagerService } from './upload-manager.service';

export type CompilerUpdateCheckStatus = 'up-to-date' | 'updated' | 'error';

export interface CompilerUpdateCheckResult {
  status: CompilerUpdateCheckStatus;
  invalidatedBundleIds: string[];
  messageKey: string;
  messageParams?: Record<string, string | number>;
  error?: string;
}

/** User-facing cache actions and invalidation feedback (F5). */
@Injectable({ providedIn: 'root' })
export class AssetCacheUiService implements OnDestroy {
  private invalidationSub?: Subscription;

  constructor(
    private readonly cacheService: AssetCacheService,
    private readonly manifestService: AssetCacheManifestService,
    private readonly registry: AssetCacheRegistry,
    private readonly refreshService: AssetCacheRefreshService,
    private readonly uploadManager: UploadManagerService,
  ) {}

  start(): void {
    this.invalidationSub?.unsubscribe();
    this.invalidationSub = this.registry.invalidated$.subscribe((event) => {
      console.info('[AssetCache] Bundles invalidated:', event);
      this.uploadManager.notifyCompilerCacheUpdated();
    });
  }

  ngOnDestroy(): void {
    this.invalidationSub?.unsubscribe();
  }

  async clearDownloadCache(): Promise<void> {
    console.info('[AssetCache] Clearing download cache…');
    await this.cacheService.clearAll();
    this.manifestService.clear();
    console.info('[AssetCache] Download cache cleared');
    this.uploadManager.notifyCacheCleared();
  }

  async checkForCompilerUpdates(): Promise<CompilerUpdateCheckResult> {
    console.info('[AssetCache] Checking compiler updates…');
    try {
      const invalidated = await this.refreshService.refresh();
      console.info('[AssetCache] Compiler update check finished', { invalidated });

      if (!invalidated.length) {
        this.uploadManager.notifyCacheUpToDate();
        return {
          status: 'up-to-date',
          invalidatedBundleIds: [],
          messageKey: 'ui.cache_check_up_to_date',
        };
      }

      return {
        status: 'updated',
        invalidatedBundleIds: invalidated,
        messageKey: 'ui.cache_check_updated',
        messageParams: {
          count: invalidated.length,
          bundles: invalidated.join(', '),
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('[AssetCache] Compiler update check failed:', error);
      return {
        status: 'error',
        invalidatedBundleIds: [],
        messageKey: 'ui.cache_check_failed',
        messageParams: { error: message },
        error: message,
      };
    }
  }
}
