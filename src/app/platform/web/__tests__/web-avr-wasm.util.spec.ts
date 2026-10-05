import { describe, it, expect } from 'vitest';
import {
  detectWasmSensors,
  formatWasmCompileLog,
  isAvr328pFqbn,
  isBybyteWasmManifest,
  prepareSketchForWasm,
  WASM_SENSOR_OLED,
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
    const source = '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}';
    expect(prepareSketchForWasm(source)).toBe(source);
  });

  it('adds empty setup/loop when missing', () => {
    const prepared = prepareSketchForWasm('#include <SoftwareSerial.h>\nSoftwareSerial s(2, 3);');
    expect(prepared).toContain('void setup()');
    expect(prepared).toContain('void loop()');
  });

  it('injects forward declarations for helper functions', () => {
    const source = `#include <Arduino.h>

void setup() {
  helper(1);
}

void loop() {}

int helper(int value) {
  return value + 1;
}
`;
    const prepared = prepareSketchForWasm(source);
    expect(prepared).toContain('int helper(int value);');
    expect(prepared.indexOf('int helper(int value);')).toBeLessThan(
      prepared.indexOf('void setup() {'),
    );
  });

  it('detects prepared ByByte manifest', () => {
    expect(isBybyteWasmManifest({ bybyte: { wave: 'W1+W2+W3' } })).toBe(true);
    expect(isBybyteWasmManifest({ headerFiles: ['/arduino/core/Arduino.h'] })).toBe(false);
  });

  it('detects OLED sensor flag for GFX-based displays', () => {
    expect(detectWasmSensors('#include <Adafruit_SH1106.h>')).toEqual([WASM_SENSOR_OLED]);
    expect(detectWasmSensors('#include <TM1637Display.h>')).toEqual([]);
  });

  it('resolves assets next to the document base', () => {
    expect(
      resolveWasmAssetsBase('/assets/wasm/avr-328p/v0.2.0-W1/', 'http://localhost:4200/'),
    ).toBe('http://localhost:4200/assets/wasm/avr-328p/v0.2.0-W1/');
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
