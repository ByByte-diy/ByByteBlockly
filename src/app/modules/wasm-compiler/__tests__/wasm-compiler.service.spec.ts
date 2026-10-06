import { firstValueFrom, of } from 'rxjs';
import { describe, it, expect, vi } from 'vitest';
import { COMPILE_WASM_UNSUPPORTED_BOARD_I18N } from '@core/constants/compile-i18n.const';
import { COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N } from '@modules/wasm-compiler/constants/compile-wasm-i18n.const';
import { WasmCompilerRegistry } from '@modules/wasm-compiler/services/wasm-compiler-registry.service';
import { WasmCompilerService } from '@modules/wasm-compiler/services/wasm-compiler.service';
import { WasmCompilerStrategy } from '@modules/wasm-compiler/wasm-compiler-strategy.interface';

function mockStrategy(
  family: 'avr-328p' | 'avr-mega' | 'esp32',
  fqbn: string,
): WasmCompilerStrategy {
  return {
    family,
    supportsFqbn: (board) => board.startsWith(fqbn),
    compile: vi
      .fn()
      .mockImplementation((opts) => of({ success: true, output: 'ok', fqbn: opts.board })),
    checkTools: vi.fn().mockResolvedValue(true),
    installCore: vi.fn().mockReturnValue(of('installed')),
  };
}

describe('WasmCompilerService', () => {
  it('resolveFamily maps FQBN via registry', () => {
    const avr328p = mockStrategy('avr-328p', 'arduino:avr:uno');
    const avrMega = mockStrategy('avr-mega', 'arduino:avr:mega');
    const esp32 = mockStrategy('esp32', 'esp32:esp32');
    const registry = new WasmCompilerRegistry([esp32, avrMega, avr328p]);

    expect(registry.resolveFamily('arduino:avr:uno')).toBe('avr-328p');
    expect(registry.resolveFamily('arduino:avr:mega')).toBe('avr-mega');
    expect(registry.resolveFamily('esp32:esp32:esp32')).toBe('esp32');
  });

  it('routes Mega FQBN to mega strategy', async () => {
    const avr328p = mockStrategy('avr-328p', 'arduino:avr:uno');
    const avrMega = mockStrategy('avr-mega', 'arduino:avr:mega');
    const facade = new WasmCompilerService(new WasmCompilerRegistry([avrMega, avr328p]));

    await firstValueFrom(
      facade.compile({
        board: 'arduino:avr:mega',
        code: '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      }),
    );

    expect(avrMega.compile).toHaveBeenCalledOnce();
    expect(avr328p.compile).not.toHaveBeenCalled();
  });

  it('routes Uno FQBN to 328p strategy', async () => {
    const avr328p = mockStrategy('avr-328p', 'arduino:avr:uno');
    const avrMega = mockStrategy('avr-mega', 'arduino:avr:mega');
    const facade = new WasmCompilerService(new WasmCompilerRegistry([avrMega, avr328p]));

    await firstValueFrom(
      facade.compile({
        board: 'arduino:avr:uno',
        code: '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      }),
    );

    expect(avr328p.compile).toHaveBeenCalledOnce();
    expect(avrMega.compile).not.toHaveBeenCalled();
  });

  it('rejects unsupported boards', async () => {
    const facade = new WasmCompilerService(new WasmCompilerRegistry([]));

    const result = await firstValueFrom(
      facade.compile({ board: 'esp32:esp32:esp32', code: 'void setup() {}' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe(COMPILE_WASM_UNSUPPORTED_BOARD_I18N);
  });

  it('returns ESP8266 desktop-only message', async () => {
    const facade = new WasmCompilerService(new WasmCompilerRegistry([]));

    const result = await firstValueFrom(
      facade.compile({ board: 'esp8266:esp8266:generic', code: 'void setup() {}' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe(COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N);
  });
});
