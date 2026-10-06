import { describe, expect, it, vi } from 'vitest';
import { WASM_AVR_328P_COMPILER } from '@modules/wasm-compiler/constants/wasm-compiler-messages.const';
import { WasmRuntimePort } from '@modules/wasm-compiler/ports/wasm-runtime.port';
import { WasmAssetProvider } from '@modules/wasm-compiler/services/wasm-asset.provider';
import {
  isWasmProbeRecoverable,
  probeWasmToolchain,
} from '@modules/wasm-compiler/utils/wasm-toolchain-probe.util';

describe('wasm-toolchain-probe.util', () => {
  it('isWasmProbeRecoverable rejects unknown bundle errors', () => {
    expect(isWasmProbeRecoverable('asset cache: Unknown asset bundle: wasm-esp32')).toBe(false);
    expect(isWasmProbeRecoverable('404 http://localhost/manifest.json')).toBe(true);
    expect(isWasmProbeRecoverable('asset cache: catalogUrl missing')).toBe(true);
  });

  it('probeWasmToolchain recovers after syncBundle on recoverable failure', async () => {
    const runtime: WasmRuntimePort = {
      getDocumentBase: () => 'http://localhost:4200/',
      fetch: vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ bybyte: { wave: 'W1' } }),
        }),
      importModule: vi.fn(),
    };

    const wasmAssets = {
      ensureValid: vi.fn().mockResolvedValue(undefined),
      loadCatalog: vi.fn().mockResolvedValue({ files: {}, tiers: {} }),
      resolveAssetsBase: vi
        .fn()
        .mockResolvedValue('http://localhost:4200/assets/wasm/avr-328p/v0.2.0/'),
      syncBundle: vi.fn().mockResolvedValue(undefined),
    } as unknown as WasmAssetProvider;

    const onUpdating = vi.fn();
    const result = await probeWasmToolchain(
      wasmAssets,
      runtime,
      WASM_AVR_328P_COMPILER,
      (manifest) => Boolean((manifest as { bybyte?: unknown }).bybyte),
      { onUpdating },
    );

    expect(result.ok).toBe(true);
    expect(onUpdating).toHaveBeenCalledOnce();
    expect(wasmAssets.ensureValid).toHaveBeenCalledWith(false);
    expect(wasmAssets.syncBundle).toHaveBeenCalledWith({
      force: true,
      prefetchTiers: ['tools', 'core'],
    });
  });
});
