import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebAvrWasmCompilerService } from '@platform/web/services/web-avr-wasm-compiler.service';
import { WASM_AVR_UNSUPPORTED_MESSAGE } from '@platform/web/services/web-avr-wasm.util';
import { WasmAssetProvider } from '@platform/web/services/wasm-asset.provider';

describe('WebAvrWasmCompilerService', () => {
  let service: WebAvrWasmCompilerService;
  let wasmAssets: Pick<
    WasmAssetProvider,
    'ensureValid' | 'loadCatalog' | 'prefetchCatalogPaths' | 'resolveAssetsBase'
  >;

  beforeEach(() => {
    wasmAssets = {
      ensureValid: vi.fn().mockResolvedValue(undefined),
      loadCatalog: vi.fn().mockResolvedValue({
        files: {},
        tiers: { tools: [], core: { glue: [], manifest: 'assets/manifest.json' }, libraries: {} },
      }),
      prefetchCatalogPaths: vi.fn().mockResolvedValue(undefined),
      resolveAssetsBase: vi
        .fn()
        .mockResolvedValue('http://localhost:4200/assets/wasm/avr-328p/v0.2.0-W1/'),
    };
    service = new WebAvrWasmCompilerService(wasmAssets as WasmAssetProvider);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects unsupported boards without starting WASM', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await firstValueFrom(
      service.compile({
        board: 'arduino:avr:mega',
        code: '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe(WASM_AVR_UNSUPPORTED_MESSAGE);
    expect(result.fqbn).toBe('arduino:avr:mega');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails when WASM assets are not served', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    const result = await firstValueFrom(
      service.compile({
        board: 'arduino:avr:uno',
        code: '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/AVR WASM toolchain is missing/);
  });
});
