import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BundleManifestEntry } from '../models/asset-cache.model';
import { AssetCacheManifestService } from './asset-cache-manifest.service';
import { AssetCacheService } from './asset-cache.service';

export interface AssetCacheInvalidatedEvent {
  bundleIds: string[];
  reason: 'version' | 'contentHash' | 'missing' | 'force';
}

@Injectable()
export class AssetCacheRegistry {
  private readonly invalidatedSubject = new Subject<AssetCacheInvalidatedEvent>();
  readonly invalidated$ = this.invalidatedSubject.asObservable();

  constructor(
    private readonly manifestService: AssetCacheManifestService,
    private readonly cacheService: AssetCacheService,
  ) {}

  /**
   * Compare remote manifest with local bundle metas; evict stale namespaces.
   */
  async validate(options?: { force?: boolean }): Promise<string[]> {
    const manifest = await this.manifestService.load(options?.force === true);
    const invalidated: string[] = [];

    for (const [bundleId, entry] of Object.entries(manifest.bundles)) {
      const evicted = await this.validateBundle(bundleId, entry, options?.force === true);
      if (evicted) {
        invalidated.push(bundleId);
      }
    }

    if (invalidated.length) {
      this.invalidatedSubject.next({
        bundleIds: invalidated,
        reason: options?.force ? 'force' : 'version',
      });
    }

    return invalidated;
  }

  async ensureBundleValid(bundleId: string, force = false): Promise<void> {
    const manifest = await this.manifestService.load(force);
    const entry = manifest.bundles[bundleId];
    if (!entry) {
      throw new Error(`Unknown asset bundle: ${bundleId}`);
    }

    const evicted = await this.validateBundle(bundleId, entry, force);
    if (evicted) {
      this.invalidatedSubject.next({
        bundleIds: [bundleId],
        reason: force ? 'force' : 'contentHash',
      });
    }
  }

  async markBundleInstalled(
    bundleId: string,
    entry: Pick<BundleManifestEntry, 'version' | 'contentHash'>,
  ): Promise<void> {
    await this.cacheService.setBundleMeta(bundleId, {
      version: entry.version,
      contentHash: entry.contentHash,
      updatedAt: Date.now(),
    });
  }

  private async validateBundle(
    bundleId: string,
    entry: BundleManifestEntry,
    force: boolean,
  ): Promise<boolean> {
    const installed = await this.cacheService.getBundleMeta(bundleId);

    if (force) {
      await this.cacheService.invalidateBundle(bundleId);
      return true;
    }

    if (!installed?.version || !installed.contentHash) {
      return false;
    }

    if (
      installed.version !== entry.version ||
      installed.contentHash !== entry.contentHash
    ) {
      await this.cacheService.invalidateBundle(bundleId);
      return true;
    }

    return false;
  }
}
