import { describe, it, expect } from 'vitest';
import { BundleCatalog } from '@modules/asset-cache';
import { collectTierPrefetchPaths } from '@modules/wasm-compiler/utils/wasm-tier-prefetch.util';

function makeCatalog(): BundleCatalog {
  return {
    schemaVersion: 1,
    bundleId: 'wasm-avr-328p',
    version: '0.0.0',
    contentHash: 'abc',
    assetsBase: '/assets/wasm/avr-328p/v0.0.0/',
    generatedAt: '2026-01-01T00:00:00.000Z',
    entryCount: 5,
    totalBytes: 100,
    files: {
      'tools/cc1plus.wasm': { sha256: 't1', size: 1 },
      'index.js': { sha256: 'g1', size: 1 },
      'assets/manifest.json': { sha256: 'm1', size: 1 },
      'assets/objects/core_main.o': { sha256: 'o1', size: 1 },
      'assets/ldscripts/avr5.xn': { sha256: 'l1', size: 1 },
    },
    tiers: {
      tools: ['tools/cc1plus.wasm'],
      core: {
        manifest: 'assets/manifest.json',
        glue: ['index.js'],
        baseObjects: ['/objects/core_main.o'],
        linkLibs: [],
        ldscript: 'assets/ldscripts/avr5.xn',
      },
      libraries: {},
    },
  };
}

describe('wasm-tier-prefetch.util', () => {
  it('collects tools tier paths', () => {
    expect(collectTierPrefetchPaths(makeCatalog(), 'tools')).toEqual(['tools/cc1plus.wasm']);
  });

  it('collects core glue, manifest, base objects and ldscript', () => {
    const paths = collectTierPrefetchPaths(makeCatalog(), 'core');
    expect(paths).toContain('index.js');
    expect(paths).toContain('assets/manifest.json');
    expect(paths).toContain('assets/objects/core_main.o');
    expect(paths).toContain('assets/ldscripts/avr5.xn');
  });
});
