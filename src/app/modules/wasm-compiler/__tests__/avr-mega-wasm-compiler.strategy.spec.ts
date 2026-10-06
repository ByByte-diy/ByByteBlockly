import { describe, it, expect } from 'vitest';
import { AvrMegaWasmCompilerStrategy } from '@modules/wasm-compiler/strategies/avr-mega-wasm-compiler.strategy';

describe('AvrMegaWasmCompilerStrategy', () => {
  it('accepts Mega FQBN including cpu modifiers', () => {
    expect(AvrMegaWasmCompilerStrategy.supportsFqbn('arduino:avr:mega')).toBe(true);
    expect(AvrMegaWasmCompilerStrategy.supportsFqbn('arduino:avr:mega:cpu=atmega2560')).toBe(true);
    expect(AvrMegaWasmCompilerStrategy.supportsFqbn('arduino:avr:uno')).toBe(false);
  });

  it('detects Mega bybyte manifest', () => {
    expect(
      AvrMegaWasmCompilerStrategy.isBybyteManifest({ wave: 'W1', objectPaths: ['objects/a.o'] }),
    ).toBe(true);
    expect(AvrMegaWasmCompilerStrategy.isBybyteManifest({ wave: 'W1' })).toBe(false);
  });
});
