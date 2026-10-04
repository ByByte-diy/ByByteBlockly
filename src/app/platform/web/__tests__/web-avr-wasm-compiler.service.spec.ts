import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebAvrWasmCompilerService } from '@platform/web/services/web-avr-wasm-compiler.service';
import { WASM_AVR_UNSUPPORTED_MESSAGE } from '@platform/web/services/web-avr-wasm.util';

describe('WebAvrWasmCompilerService', () => {
  let service: WebAvrWasmCompilerService;

  beforeEach(() => {
    service = new WebAvrWasmCompilerService();
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
