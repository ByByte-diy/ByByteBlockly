import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  flattenWaveCatalog,
  mergeBybyteManifest,
  mergeWaveCatalogs,
  resolveCatalogFile,
  waveCatalogsFromDocument,
} from '../libraries-manifest.mjs';

const wasmAvrDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const waveCatalogs = waveCatalogsFromDocument(
  JSON.parse(readFileSync(join(wasmAvrDir, 'libraries.json'), 'utf8')),
);
const w1Catalog = waveCatalogs.find((entry) => entry.wave === 'W1')!;
const w5Catalog = waveCatalogs.find((entry) => entry.wave === 'W5')!;
const w6Catalog = waveCatalogs.find((entry) => entry.wave === 'W6')!;
const w7Catalog = waveCatalogs.find((entry) => entry.wave === 'W7')!;
const catalog = mergeWaveCatalogs(waveCatalogs.slice(0, 4));

describe('mergeBybyteManifest', () => {
  const base = {
    headerFiles: ['/arduino/core/Arduino.h'],
    objectGroups: { base: ['/objects/core_main.o'] },
  };

  it('adds ByByte headers, include paths and object group without dropping stock entries', () => {
    const merged = mergeBybyteManifest(base, {
      wave: 'W1',
      generatedAt: '2026-10-04T00:00:00.000Z',
      libraries: ['Otto'],
      headerFiles: ['/libraries/Otto/Otto.h'],
      includePaths: ['/libraries/Otto'],
      objectPaths: ['/objects/lib_Otto.o'],
    });

    expect(merged.headerFiles).toEqual(['/arduino/core/Arduino.h', '/libraries/Otto/Otto.h']);
    expect(merged.includePaths).toEqual(['/libraries/Otto']);
    expect(merged.objectGroups.base).toEqual(['/objects/core_main.o']);
    expect(merged.objectGroups.bybyte).toEqual(['/objects/lib_Otto.o']);
    expect(merged.bybyte.wave).toBe('W1');
    expect(merged.bybyte.libraries).toEqual(['Otto']);
  });

  it('deduplicates repeated wave entries', () => {
    const once = mergeBybyteManifest(base, {
      headerFiles: ['/libraries/Otto/Otto.h'],
      includePaths: ['/libraries/Otto'],
      objectPaths: ['/objects/lib_Otto.o'],
    });
    const twice = mergeBybyteManifest(once, {
      headerFiles: ['/libraries/Otto/Otto.h'],
      includePaths: ['/libraries/Otto'],
      objectPaths: ['/objects/lib_Otto.o'],
    });

    expect(twice.headerFiles.filter((path) => path === '/libraries/Otto/Otto.h')).toHaveLength(1);
    expect(twice.objectGroups.bybyte).toEqual(['/objects/lib_Otto.o']);
  });
});

describe('W1–W4 catalog', () => {
  it('merges wave metadata', () => {
    expect(catalog.wave).toBe('W1+W2+W3+W4');
    expect(catalog.libraries.map((lib) => lib.id)).toEqual([
      'EEPROM',
      'Otto',
      'SoftwareSerial',
      'SerialCommand',
      'TM1637',
      'LedControl',
      'LiquidCrystal_I2C',
      'Adafruit_NeoPixel',
      'Adafruit_SH1106',
      'Adafruit_SPITFT',
      'Adafruit_ST7735',
      'Stepper',
      'AFMotor',
    ]);
  });

  it('flattens W1–W4 headers and objects', () => {
    const flat = flattenWaveCatalog(catalog, (...parts) => parts.join('/'));

    expect(flat.wave).toBe('W1+W2+W3+W4');
    expect(flat.libraries).toEqual([
      'EEPROM',
      'Otto',
      'SoftwareSerial',
      'SerialCommand',
      'TM1637',
      'LedControl',
      'LiquidCrystal_I2C',
      'Adafruit_NeoPixel',
      'Adafruit_SH1106',
      'Adafruit_SPITFT',
      'Adafruit_ST7735',
      'Stepper',
      'AFMotor',
    ]);
    expect(flat.sources[0].object).toBe('/objects/lib_eeprom_avr.o');
    expect(flat.headerFiles).toContain('/arduino/libraries/EEPROM/src/EEPROM.h');
    expect(flat.headerFiles).toContain('/libraries/Otto/Otto.h');
    expect(flat.includePaths).toEqual([
      '/arduino/libraries/EEPROM/src',
      '/libraries/Otto',
      '/arduino/libraries/SoftwareSerial/src',
      '/libraries/SerialCommand',
      '/libraries/TM1637',
      '/libraries/LedControl',
      '/libraries/LiquidCrystal_I2C',
      '/libraries/Adafruit_NeoPixel',
      '/libraries/Adafruit_SH1106',
      '/libraries/Adafruit_GFX_Library',
      '/libraries/Adafruit_ST7735',
      '/libraries/Stepper',
      '/libraries/AFMotor',
    ]);
    expect(flat.headerFiles).toContain('/arduino/libraries/SoftwareSerial/src/SoftwareSerial.h');
    expect(flat.headerFiles).toContain('/libraries/SerialCommand/SerialCommand.h');
    expect(flat.headerFiles).toContain('/libraries/TM1637/TM1637Display.h');
    expect(flat.headerFiles).toContain('/libraries/Adafruit_NeoPixel/Adafruit_NeoPixel.h');
    expect(flat.sources.map((source) => source.object)).toEqual([
      '/objects/lib_eeprom_avr.o',
      '/objects/lib_Oscillator.o',
      '/objects/lib_Otto_matrix.o',
      '/objects/lib_Otto.o',
      '/objects/lib_SoftwareSerial.o',
      '/objects/lib_SerialCommand.o',
      '/objects/lib_TM1637Display.o',
      '/objects/lib_LedControl.o',
      '/objects/lib_LiquidCrystal_I2C.o',
      '/objects/lib_Adafruit_NeoPixel.o',
      '/objects/lib_Adafruit_SH1106.o',
      '/objects/lib_Adafruit_SPITFT.o',
      '/objects/lib_Adafruit_ST77xx.o',
      '/objects/lib_Adafruit_ST7735.o',
      '/objects/lib_Stepper.o',
      '/objects/lib_AFMotor.o',
    ]);
  });

  it('resolves repo-relative EEPROM and Otto-root headers', () => {
    const eeprom = w1Catalog.libraries[0];
    const otto = w1Catalog.libraries[1];
    const resolveFrom = (...parts) => parts.join('/');

    expect(resolveCatalogFile(catalog, eeprom, eeprom.headers[0], resolveFrom).from).toBe(
      'src/wasm-avr/libraries/EEPROM.h',
    );
    expect(resolveCatalogFile(catalog, otto, otto.headers[0], resolveFrom).from).toBe(
      'src/wasm-avr/libraries/Otto/Otto.h',
    );
  });
});

describe('W5 catalog', () => {
  it('lists sensing libraries and prebuild objects', () => {
    const flat = flattenWaveCatalog(w5Catalog, (...parts) => parts.join('/'));

    expect(flat.wave).toBe('W5');
    expect(flat.libraries).toContain('RTClib');
    expect(flat.libraries).toContain('MPU6050');
    expect(flat.libraries).toContain('IRremote');
    expect(flat.libraries).toContain('TinyGPSPlus');
    expect(flat.headerFiles).toContain('/libraries/RTClib/RTClib.h');
    expect(flat.headerFiles).toContain('/libraries/MFRC522/MFRC522.h');
    expect(flat.sources.some((source) => source.object.includes('lib_IRremote'))).toBe(true);
    expect(flat.sources.some((source) => source.object.includes('lib_MPU6050'))).toBe(true);
  });
});

describe('W6 catalog', () => {
  it('lists audio libraries and prebuild objects', () => {
    const flat = flattenWaveCatalog(w6Catalog, (...parts) => parts.join('/'));

    expect(flat.wave).toBe('W6');
    expect(flat.libraries).toEqual(['PlayRtttl', 'RedMP3', 'TEA5767']);
    expect(flat.headerFiles).toContain('/libraries/PlayRtttl/PlayRtttl.hpp');
    expect(flat.headerFiles).toContain('/libraries/RedMP3/RedMP3.h');
    expect(flat.headerFiles).toContain('/libraries/TEA5767/TEA5767N.h');
    expect(flat.sources.map((source) => source.object)).toEqual([
      '/objects/lib_RedMP3_RedMP3.o',
      '/objects/lib_TEA5767_TEA5767N.o',
    ]);
  });
});

describe('W7 catalog', () => {
  it('lists Otto Quad library and prebuild objects', () => {
    const flat = flattenWaveCatalog(w7Catalog, (...parts) => parts.join('/'));

    expect(flat.wave).toBe('W7');
    expect(flat.libraries).toEqual(['Quad']);
    expect(flat.headerFiles).toContain('/libraries/Quad/Quad.h');
    expect(flat.headerFiles).toContain('/libraries/Quad/Octosnake.h');
    expect(flat.sources.map((source) => source.object)).toEqual([
      '/objects/lib_Quad_Octosnake.o',
      '/objects/lib_Quad_Quad.o',
    ]);
  });
});
