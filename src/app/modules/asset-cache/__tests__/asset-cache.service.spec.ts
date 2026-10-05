import { describe, it, expect, beforeEach } from 'vitest';
import { AssetCacheService } from '@modules/asset-cache/services/asset-cache.service';
import {
  MemoryAssetCacheStore,
  buildAssetCacheKey,
} from '@modules/asset-cache/services/asset-cache-store';

describe('AssetCacheService', () => {
  let service: AssetCacheService;

  beforeEach(() => {
    service = new AssetCacheService();
    service.useStore(new MemoryAssetCacheStore());
  });

  it('put/get uses content-addressed keys', async () => {
    const bytes = new Uint8Array([1, 2, 3]).buffer;
    await service.put('wasm-avr-328p', 'tools/a.wasm', 'abc123', bytes);
    const loaded = await service.get('wasm-avr-328p', 'tools/a.wasm', 'abc123');
    expect(new Uint8Array(loaded!)).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('different hash is a separate cache entry', async () => {
    await service.put('wasm-avr-328p', 'tools/a.wasm', 'hash1', new ArrayBuffer(1));
    expect(await service.get('wasm-avr-328p', 'tools/a.wasm', 'hash2')).toBeUndefined();
  });

  it('invalidateBundle clears namespace', async () => {
    await service.put('wasm-avr-328p', 'tools/a.wasm', 'abc', new ArrayBuffer(1));
    await service.setBundleMeta('wasm-avr-328p', {
      version: '1',
      contentHash: 'sha256:x',
      updatedAt: Date.now(),
    });

    await service.invalidateBundle('wasm-avr-328p');

    expect(await service.has('wasm-avr-328p', 'tools/a.wasm', 'abc')).toBe(false);
    expect(await service.getBundleMeta('wasm-avr-328p')).toBeUndefined();
  });

  it('buildAssetCacheKey normalizes sha256 prefix', () => {
    expect(buildAssetCacheKey('b', 'sha256:abc', 'path')).toBe('b:abc:path');
  });
});
