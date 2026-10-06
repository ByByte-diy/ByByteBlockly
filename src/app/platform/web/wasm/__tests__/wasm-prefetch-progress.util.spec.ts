import { describe, expect, it } from 'vitest';
import { BundleCatalog } from '@modules/asset-cache';
import { buildWasmPrefetchProgressReport } from '../utils/wasm-prefetch-progress.util';

describe('buildWasmPrefetchProgressReport', () => {
  it('reports file counts and megabytes from catalog sizes', () => {
    const catalog = {
      files: {
        'tools/a.wasm': { sha256: 'a', size: 5 * 1024 * 1024 },
        'tools/b.wasm': { sha256: 'b', size: 3 * 1024 * 1024 },
      },
    } as unknown as BundleCatalog;

    const report = buildWasmPrefetchProgressReport(
      catalog,
      ['tools/a.wasm', 'tools/b.wasm'],
      { completed: 1, total: 2, currentPath: 'tools/a.wasm' },
    );

    expect(report.completed).toBe(1);
    expect(report.total).toBe(2);
    expect(report.downloadedMb).toBe(5);
    expect(report.totalMb).toBe(8);
  });
});
