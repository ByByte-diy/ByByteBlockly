import { describe, it, expect, beforeEach } from 'vitest';
import { AssetCacheRegistry } from '@modules/asset-cache/services/asset-cache-registry.service';
import { AssetCacheManifestService } from '@modules/asset-cache/services/asset-cache-manifest.service';
import { AssetCacheService } from '@modules/asset-cache/services/asset-cache.service';
import { MemoryAssetCacheStore } from '@modules/asset-cache/services/asset-cache-store';
import { CacheManifest } from '@modules/asset-cache/models/asset-cache.model';

const manifestV1: CacheManifest = {
  schemaVersion: 1,
  appMinVersion: '0.0.0',
  generatedAt: '2026-01-01T00:00:00Z',
  bundles: {
    'wasm-avr-328p': {
      version: '0.2.0+W1',
      contentHash: 'sha256:aaa',
      baseUrl: '/assets/wasm/avr-328p/v0.2.0-W1/',
      catalogUrl: '/assets/wasm/avr-328p/v0.2.0-W1/wasm-catalog.json',
      entryCount: 1,
      totalBytes: 100,
    },
  },
};

const manifestV2: CacheManifest = {
  ...manifestV1,
  bundles: {
    'wasm-avr-328p': {
      ...manifestV1.bundles['wasm-avr-328p'],
      version: '0.2.0+W1+W2',
      contentHash: 'sha256:bbb',
    },
  },
};

describe('AssetCacheRegistry', () => {
  let cacheService: AssetCacheService;
  let manifestService: AssetCacheManifestService;
  let registry: AssetCacheRegistry;

  beforeEach(() => {
    cacheService = new AssetCacheService();
    cacheService.useStore(new MemoryAssetCacheStore());
    manifestService = new AssetCacheManifestService();
    registry = new AssetCacheRegistry(manifestService, cacheService);
  });

  it('invalidates bundle when contentHash changes', async () => {
    manifestService['manifest'] = manifestV1;
    await cacheService.put('wasm-avr-328p', 'tools/a.wasm', 'deadbeef', new ArrayBuffer(8));
    await registry.markBundleInstalled('wasm-avr-328p', manifestV1.bundles['wasm-avr-328p']);

    manifestService['manifest'] = manifestV2;
    const invalidated = await registry.validate();

    expect(invalidated).toEqual(['wasm-avr-328p']);
    expect(await cacheService.has('wasm-avr-328p', 'tools/a.wasm', 'deadbeef')).toBe(false);
  });

  it('keeps cache when version and hash match', async () => {
    manifestService['manifest'] = manifestV1;
    await cacheService.put('wasm-avr-328p', 'tools/a.wasm', 'deadbeef', new ArrayBuffer(8));
    await registry.markBundleInstalled('wasm-avr-328p', manifestV1.bundles['wasm-avr-328p']);

    const invalidated = await registry.validate();
    expect(invalidated).toEqual([]);
    expect(await cacheService.has('wasm-avr-328p', 'tools/a.wasm', 'deadbeef')).toBe(true);
  });
});
