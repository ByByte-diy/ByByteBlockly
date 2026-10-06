import { describe, it, expect } from 'vitest';
import { AvrWasmCompilerStrategyBase } from '@modules/wasm-compiler/strategies/avr-wasm-compiler.strategy.base';

describe('AvrWasmCompilerStrategyBase', () => {
  it('prepends Arduino.h when the sketch has no include', () => {
    const prepared = AvrWasmCompilerStrategyBase.prepareSketch('void setup() {}\nvoid loop() {}');
    expect(prepared.startsWith('#include <Arduino.h>')).toBe(true);
    expect(prepared).toContain('void setup()');
  });

  it('does not duplicate Arduino.h', () => {
    const source = '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}';
    expect(AvrWasmCompilerStrategyBase.prepareSketch(source)).toBe(source);
  });

  it('adds empty setup/loop when missing', () => {
    const prepared = AvrWasmCompilerStrategyBase.prepareSketch(
      '#include <SoftwareSerial.h>\nSoftwareSerial s(2, 3);',
    );
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
    const prepared = AvrWasmCompilerStrategyBase.prepareSketch(source);
    expect(prepared).toContain('int helper(int value);');
    expect(prepared.indexOf('int helper(int value);')).toBeLessThan(
      prepared.indexOf('void setup() {'),
    );
  });

  it('formats wasm compile process log', () => {
    const log = AvrWasmCompilerStrategyBase.formatCompileLog({
      stderr: ['--- WASM AVR compile ---', '[sketch] sketch.cpp', '  done (42 ms, 2520 B)'],
      timings: { totalMs: 1200 },
    });

    expect(log).toContain('[sketch] sketch.cpp');
    expect(log).not.toContain('flashBytes');
  });

  it('normalizes FQBN to board id (first three segments)', () => {
    expect(AvrWasmCompilerStrategyBase.normalizeFqbn('arduino:avr:nano:cpu=atmega328old')).toBe(
      'arduino:avr:nano',
    );
    expect(AvrWasmCompilerStrategyBase.normalizeFqbn('')).toBe('');
  });
});
