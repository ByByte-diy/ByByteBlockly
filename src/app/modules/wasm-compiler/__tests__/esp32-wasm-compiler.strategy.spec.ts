import { describe, expect, it } from 'vitest';
import { Esp32WasmCompilerStrategy } from '@modules/wasm-compiler/strategies/esp32-wasm-compiler.strategy';

describe('Esp32WasmCompilerStrategy', () => {
  it('supportsFqbn matches esp32:esp32:esp32', () => {
    expect(Esp32WasmCompilerStrategy.supportsFqbn('esp32:esp32:esp32')).toBe(true);
    expect(Esp32WasmCompilerStrategy.supportsFqbn('esp32:esp32:esp32:PartitionScheme=huge_app')).toBe(
      true,
    );
    expect(Esp32WasmCompilerStrategy.supportsFqbn('arduino:avr:uno')).toBe(false);
    expect(Esp32WasmCompilerStrategy.supportsFqbn('esp8266:esp8266:generic')).toBe(false);
  });

  it('isEsp32Manifest validates wasm-toolchains manifest shape', () => {
    expect(
      Esp32WasmCompilerStrategy.isEsp32Manifest({
        chip: 'esp32',
        output: 'bin',
        boards: { esp32: { mcu: 'esp32' } },
      }),
    ).toBe(true);
    expect(Esp32WasmCompilerStrategy.isEsp32Manifest({ chip: 'esp32', output: 'hex' })).toBe(false);
    expect(Esp32WasmCompilerStrategy.isEsp32Manifest(null)).toBe(false);
  });

  it('prepareSketch adds Arduino.h and setup/loop stubs', () => {
    const out = Esp32WasmCompilerStrategy.prepareSketch('void setup() { pinMode(2, OUTPUT); }');
    expect(out).toContain('#include <Arduino.h>');
    expect(out).toContain('void loop()');
  });
});
