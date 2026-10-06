import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { COMPILE_WASM_UNSUPPORTED_BOARD_I18N } from '@core/constants/compile-i18n.const';
import { WASM_AVR_328P_COMPILER } from '@modules/wasm-compiler/constants/wasm-compiler-messages.const';
import { WasmRuntimePort } from '@modules/wasm-compiler/ports/wasm-runtime.port';
import { WasmAssetProvider } from '@modules/wasm-compiler/services/wasm-asset.provider';
import { Avr328pWasmCompilerStrategy } from '@modules/wasm-compiler/strategies/avr-328p-wasm-compiler.strategy';

describe('Avr328pWasmCompilerStrategy', () => {
  let strategy: Avr328pWasmCompilerStrategy;
  let runtime: WasmRuntimePort;
  let wasmAssets: Pick<
    WasmAssetProvider,
    'ensureValid' | 'loadCatalog' | 'prefetchCatalogPaths' | 'resolveAssetsBase' | 'syncBundle'
  >;

  beforeEach(() => {
    runtime = {
      getDocumentBase: () => 'http://localhost:4200/',
      fetch: vi.fn(),
      importModule: vi.fn(),
    };
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
      syncBundle: vi.fn().mockResolvedValue(undefined),
    };
    strategy = new Avr328pWasmCompilerStrategy(
      wasmAssets as WasmAssetProvider,
      runtime,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('accepts Uno and Nano FQBNs, including cpu modifiers', () => {
    expect(Avr328pWasmCompilerStrategy.supportsFqbn('arduino:avr:uno')).toBe(true);
    expect(Avr328pWasmCompilerStrategy.supportsFqbn('arduino:avr:nano')).toBe(true);
    expect(Avr328pWasmCompilerStrategy.supportsFqbn('arduino:avr:nano:cpu=atmega328old')).toBe(
      true,
    );
  });

  it('rejects Mega, ESP and empty FQBNs', () => {
    expect(Avr328pWasmCompilerStrategy.supportsFqbn('arduino:avr:mega')).toBe(false);
    expect(Avr328pWasmCompilerStrategy.supportsFqbn('esp32:esp32:esp32')).toBe(false);
    expect(Avr328pWasmCompilerStrategy.supportsFqbn('')).toBe(false);
  });

  it('detects prepared ByByte manifest', () => {
    expect(Avr328pWasmCompilerStrategy.isBybyteManifest({ bybyte: { wave: 'W1+W2+W3' } })).toBe(
      true,
    );
    expect(
      Avr328pWasmCompilerStrategy.isBybyteManifest({ headerFiles: ['/arduino/core/Arduino.h'] }),
    ).toBe(false);
  });

  it('rejects unsupported boards without starting WASM', async () => {
    const result = await firstValueFrom(
      strategy.compile({
        board: 'arduino:avr:mega',
        code: '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe(COMPILE_WASM_UNSUPPORTED_BOARD_I18N);
    expect(runtime.fetch).not.toHaveBeenCalled();
  });

  it('fails when WASM assets are not served', async () => {
    runtime.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    const result = await firstValueFrom(
      strategy.compile({
        board: 'arduino:avr:uno',
        code: '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('ui.compile_wasm_toolchain_missing_avr');
    expect(result.output).toContain(WASM_AVR_328P_COMPILER.toolchainLabel);
  });
});
