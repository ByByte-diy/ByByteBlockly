import { describe, it, expect } from 'vitest';
import {
  formatWasmCompileLog,
  isAvr328pFqbn,
  prepareSketchForWasm,
  resolveWasmAssetsBase,
} from '@platform/web/services/web-avr-wasm.util';

describe('web-avr-wasm.util', () => {
  it('accepts Uno and Nano FQBNs, including cpu modifiers', () => {
    expect(isAvr328pFqbn('arduino:avr:uno')).toBe(true);
    expect(isAvr328pFqbn('arduino:avr:nano')).toBe(true);
    expect(isAvr328pFqbn('arduino:avr:nano:cpu=atmega328old')).toBe(true);
  });

  it('rejects Mega, ESP and empty FQBNs', () => {
    expect(isAvr328pFqbn('arduino:avr:mega')).toBe(false);
    expect(isAvr328pFqbn('esp32:esp32:esp32')).toBe(false);
    expect(isAvr328pFqbn('')).toBe(false);
  });

  it('prepends Arduino.h when the sketch has no include', () => {
    const prepared = prepareSketchForWasm('void setup() {}\nvoid loop() {}');
    expect(prepared.startsWith('#include <Arduino.h>')).toBe(true);
    expect(prepared).toContain('void setup()');
  });

  it('does not duplicate Arduino.h', () => {
    const source = '#include <Arduino.h>\nvoid setup() {}';
    expect(prepareSketchForWasm(source)).toBe(source);
  });

  it('resolves assets next to the document base', () => {
    expect(resolveWasmAssetsBase('http://localhost:4200/')).toBe(
      'http://localhost:4200/assets/wasm-avr/',
    );
  });

  it('formats wasm stderr and flash stats', () => {
    const log = formatWasmCompileLog({
      stderr: ['[cc1plus] note: ok'],
      timings: { totalMs: 12 },
      flashBytes: 5292,
      fitsTarget: true,
    });

    expect(log).toContain('[cc1plus] note: ok');
    expect(log).toContain('flashBytes: 5292');
    expect(log).toContain('fitsTarget: true');
  });
});
