import { describe, it, expect } from 'vitest';
import { BundleCatalog } from '@modules/asset-cache';
import {
  detectWasmSensors,
  parseSketchIncludes,
  resolveWasmLibraries,
  virtualPathToCatalogFile,
  WASM_SENSOR_OLED,
} from '@modules/wasm-compiler/utils/wasm-library-resolver';

function makeCatalog(
  libraries: Record<string, { includes: string[]; depends?: string[]; headers: string[]; objects: string[] }>,
): BundleCatalog {
  return {
    schemaVersion: 1,
    bundleId: 'wasm-avr-328p',
    version: '0.0.0+test',
    contentHash: 'abc',
    assetsBase: '/assets/wasm-avr/',
    fqbn: ['arduino:avr:uno'],
    generatedAt: '2026-01-01T00:00:00.000Z',
    entryCount: 3,
    totalBytes: 100,
    files: {
      'assets/manifest.json': { sha256: 'm', size: 1 },
      'index.js': { sha256: 'i', size: 1 },
      'assets/fs/libraries/Stepper/Stepper.h': { sha256: 'h1', size: 1 },
      'assets/objects/lib_Stepper.o': { sha256: 'o1', size: 1 },
      'assets/objects/lib_Otto.o': { sha256: 'o2', size: 1 },
      'assets/objects/lib_EEPROM.o': { sha256: 'o3', size: 1 },
    },
    tiers: {
      tools: [],
      core: {
        manifest: 'assets/manifest.json',
        glue: ['index.js'],
        headerPaths: ['/libraries/Arduino.h'],
        baseObjects: ['/objects/core.o'],
        linkLibs: [],
        ldscript: 'assets/ldscripts/avr5.xn',
      },
      libraries,
    },
  };
}

describe('wasm-library-resolver', () => {
  it('maps virtual paths to catalog keys (horang layout)', () => {
    expect(virtualPathToCatalogFile('/objects/lib_Foo.o')).toBe('assets/objects/lib_Foo.o');
    expect(virtualPathToCatalogFile('/libraries/Stepper/Stepper.h')).toBe(
      'assets/fs/libraries/Stepper/Stepper.h',
    );
  });

  it('maps virtual paths for wasm-toolchains mega layout', () => {
    const megaCatalog = { layout: 'wasm-toolchains', bundleId: 'wasm-avr-mega' } as BundleCatalog;
    expect(virtualPathToCatalogFile('/objects/lib_Foo.o', megaCatalog)).toBe('objects/lib_Foo.o');
    expect(virtualPathToCatalogFile('/libraries/Otto/Otto.h', megaCatalog)).toBe(
      'libraries/Otto/Otto.h',
    );
  });

  it('parses sketch includes', () => {
    const source = `
#include <Arduino.h>
#include "Stepper.h"
#include <libraries/Otto/Otto.h>
`;
    const names = parseSketchIncludes(source);
    expect(names).toContain('Arduino.h');
    expect(names).toContain('Stepper.h');
    expect(names).toContain('Otto.h');
  });

  it('resolves no libraries for Blink sketch', () => {
    const catalog = makeCatalog({
      Stepper: {
        includes: ['Stepper.h'],
        headers: ['/libraries/Stepper/Stepper.h'],
        objects: ['objects/lib_Stepper.o'],
      },
    });

    const resolved = resolveWasmLibraries(
      '#include <Arduino.h>\nvoid setup() {}\nvoid loop() {}',
      catalog,
    );

    expect(resolved.libraryIds).toEqual([]);
    expect(resolved.bybyteObjects).toEqual([]);
    expect(resolved.headerFiles).toContain('/libraries/Arduino.h');
  });

  it('resolves Stepper library from include', () => {
    const catalog = makeCatalog({
      Stepper: {
        includes: ['Stepper.h'],
        headers: ['/libraries/Stepper/Stepper.h'],
        objects: ['objects/lib_Stepper.o'],
      },
    });

    const resolved = resolveWasmLibraries('#include <Stepper.h>\nvoid setup() {}', catalog);

    expect(resolved.libraryIds).toEqual(['Stepper']);
    expect(resolved.bybyteObjects).toEqual(['/objects/lib_Stepper.o']);
    expect(resolved.prefetchPaths).toContain('assets/fs/libraries/Stepper/Stepper.h');
    expect(resolved.prefetchPaths).toContain('assets/objects/lib_Stepper.o');
  });

  it('expands Quad depends on EEPROM', () => {
    const catalog = makeCatalog({
      EEPROM: {
        includes: ['EEPROM.h'],
        headers: ['/arduino/libraries/EEPROM/src/EEPROM.h'],
        objects: ['objects/lib_eeprom_avr.o'],
      },
      Quad: {
        includes: ['Quad.h'],
        depends: ['EEPROM'],
        headers: ['/libraries/Quad/Quad.h'],
        objects: ['objects/lib_Quad_Quad.o'],
      },
    });

    const resolved = resolveWasmLibraries('#include <Quad.h>\nvoid setup() {}', catalog);

    expect(resolved.libraryIds).toEqual(['Quad', 'EEPROM']);
    expect(resolved.bybyteObjects).toEqual(['/objects/lib_Quad_Quad.o', '/objects/lib_eeprom_avr.o']);
  });

  it('detects OLED sensor flag for GFX-based displays', () => {
    expect(detectWasmSensors('#include <Adafruit_SH1106.h>')).toEqual([WASM_SENSOR_OLED]);
    expect(detectWasmSensors('#include <TM1637Display.h>')).toEqual([]);
  });

  it('does not duplicate stock base objects (Servo) when Otto pulls Servo dependency', () => {
    const catalog = makeCatalog({
      Servo: {
        includes: ['Servo.h'],
        headers: ['/libraries/Servo/src/Servo.h'],
        objects: ['objects/lib_Servo.o'],
      },
      Otto: {
        includes: ['Otto.h'],
        depends: ['Servo'],
        headers: ['/libraries/Otto/Otto.h'],
        objects: ['objects/lib_Otto.o'],
      },
    });
    catalog.tiers!.core!.baseObjects = [
      '/objects/core_main.o',
      '/objects/lib_Servo.o',
    ];
    catalog.files!['assets/objects/lib_Servo.o'] = { sha256: 'servo', size: 1 };

    const resolved = resolveWasmLibraries('#include <Otto.h>\nvoid setup() {}', catalog);

    expect(resolved.libraryIds).toEqual(['Otto', 'Servo']);
    expect(resolved.bybyteObjects).toEqual(['/objects/lib_Otto.o']);
  });

  it('expands Otto depends on EEPROM', () => {
    const catalog = makeCatalog({
      EEPROM: {
        includes: ['EEPROM.h'],
        headers: ['/libraries/EEPROM/EEPROM.h'],
        objects: ['objects/lib_EEPROM.o'],
      },
      Otto: {
        includes: ['Otto.h'],
        depends: ['EEPROM'],
        headers: ['/libraries/Otto/Otto.h'],
        objects: ['objects/lib_Otto.o'],
      },
    });

    const resolved = resolveWasmLibraries('#include <Otto.h>\nvoid setup() {}', catalog);

    expect(resolved.libraryIds).toEqual(['Otto', 'EEPROM']);
    expect(resolved.bybyteObjects).toEqual(['/objects/lib_Otto.o', '/objects/lib_EEPROM.o']);
  });
});
