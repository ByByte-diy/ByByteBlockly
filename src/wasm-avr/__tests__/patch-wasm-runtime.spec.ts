import { describe, it, expect } from 'vitest';
import { patchIndexSource, patchWorkerSource } from '../patch-wasm-bundle.mjs';

const INDEX_STOCK = `
async function compile(options) {
  const { source, sensors = [], assetsBase } = options;
  worker.postMessage({ id, source, sensors, assetsBase: assetsBase == null ? undefined : String(assetsBase) });
}
`;

const WORKER_STOCK = `
self.onmessage = async (event) => {
  const { id, sensors, source, assetsBase } = event.data;
  const result = await buildFirmware({ sensors, source, assetsBase });
};
`;

describe('patch-wasm-runtime', () => {
  it('patches index.js for selectiveLoad', () => {
    const patched = patchIndexSource(INDEX_STOCK);
    expect(patched).toContain('selectiveLoad');
    expect(patched).toContain('worker.postMessage({ id, source, sensors, assetsBase: assetsBase == null ? undefined : String(assetsBase), selectiveLoad });');
  });

  it('patches worker.js for selectiveLoad', () => {
    const patched = patchWorkerSource(WORKER_STOCK);
    expect(patched).toContain('selectiveLoad');
    expect(patched).toContain('buildFirmware({ sensors, source, assetsBase, selectiveLoad })');
  });

  it('is idempotent', () => {
    expect(patchIndexSource(patchIndexSource(INDEX_STOCK))).toBe(patchIndexSource(INDEX_STOCK));
    expect(patchWorkerSource(patchWorkerSource(WORKER_STOCK))).toBe(patchWorkerSource(WORKER_STOCK));
  });
});
