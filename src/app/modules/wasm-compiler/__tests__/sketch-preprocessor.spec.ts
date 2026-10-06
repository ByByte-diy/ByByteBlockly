import { describe, it, expect } from 'vitest';
import {
  extractFunctionPrototypes,
  injectForwardDeclarations,
  FORWARD_DECL_BANNER,
} from '@modules/wasm-compiler/utils/sketch-preprocessor';

describe('sketch-preprocessor', () => {
  it('extracts single-line function definitions', () => {
    const source = `
void setup() {
  helper(1);
}

int helper(int value) {
  return value + 1;
}
`;
    expect(extractFunctionPrototypes(source)).toEqual(['int helper(int value)']);
  });

  it('extracts multi-line function signatures', () => {
    const source = `
float readSensor(
  int pin,
  bool smooth
) {
  return analogRead(pin);
}
`;
    expect(extractFunctionPrototypes(source)).toEqual([
      'float readSensor( int pin, bool smooth )',
    ]);
  });

  it('ignores control-flow blocks and type declarations', () => {
    const source = `
void loop() {
  if (digitalRead(2)) {
    while (true) {}
  }
}

struct Point {
  int x;
};
`;
    expect(extractFunctionPrototypes(source)).toEqual([]);
  });

  it('injects forward declarations after includes', () => {
    const source = `#include <Arduino.h>

void setup() {
  blink(13);
}

void loop() {}

void blink(int pin) {
  digitalWrite(pin, HIGH);
}
`;
    const prepared = injectForwardDeclarations(source);
    expect(prepared).toContain(FORWARD_DECL_BANNER);
    expect(prepared.indexOf(FORWARD_DECL_BANNER)).toBeLessThan(prepared.indexOf('void setup()'));
    expect(prepared).toContain('void blink(int pin);');
    expect(prepared).not.toContain('void setup();');
  });

  it('is idempotent', () => {
    const source = `#include <Arduino.h>

void setup() {}

int foo() {
  return 0;
}
`;
    const once = injectForwardDeclarations(source);
    expect(injectForwardDeclarations(once)).toBe(once);
  });

  it('returns unchanged source when no functions are found', () => {
    const source = 'int counter = 0;\n// no functions here\n';
    expect(injectForwardDeclarations(source)).toBe(source);
  });

  it('extracts extern "C" helper signatures', () => {
    const source = `extern "C" void pause(int period) {
  Quad.refresh();
}`;
    expect(extractFunctionPrototypes(source)).toEqual([
      'extern "C" void pause(int period)',
    ]);
  });

  it('injects forward declarations after includes even with section banners', () => {
    const source = `// ========== Libraries (#include) ==========
#include <Quad.h>

// ========== Global variables ==========
Quad Quad;

extern "C" void pause(int period) {
  Quad.refresh();
}

void setup() {}
void loop() {}
`;
    expect(extractFunctionPrototypes(source)).toEqual([
      'extern "C" void pause(int period)',
    ]);
    const prepared = injectForwardDeclarations(source);
    expect(prepared.indexOf('#include <Quad.h>')).toBeLessThan(prepared.indexOf(FORWARD_DECL_BANNER));
    expect(prepared).toContain('extern "C" void pause(int period);');
    expect(prepared.indexOf('extern "C" void pause(int period);')).toBeLessThan(
      prepared.indexOf('extern "C" void pause(int period) {'),
    );
  });
});
