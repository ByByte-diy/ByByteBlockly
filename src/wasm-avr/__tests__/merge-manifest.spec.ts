import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { flattenWaveCatalog, mergeBybyteManifest, resolveCatalogFile } from '../merge-manifest.mjs';

const catalog = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../libraries.w1.json'), 'utf8'),
);

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

describe('W1 catalog', () => {
  it('flattens EEPROM + Otto headers and objects', () => {
    const flat = flattenWaveCatalog(catalog, (...parts) => parts.join('/'));

    expect(flat.wave).toBe('W1');
    expect(flat.libraries).toEqual(['EEPROM', 'Otto']);
    expect(flat.sources[0].object).toBe('/objects/lib_eeprom_avr.o');
    expect(flat.headerFiles).toContain('/arduino/libraries/EEPROM/src/EEPROM.h');
    expect(flat.headerFiles).toContain('/libraries/Otto/Otto.h');
    expect(flat.includePaths).toEqual([
      '/arduino/libraries/EEPROM/src',
      '/libraries/Otto',
    ]);
    expect(flat.sources.map((source) => source.object)).toEqual([
      '/objects/lib_eeprom_avr.o',
      '/objects/lib_Oscillator.o',
      '/objects/lib_Otto_matrix.o',
      '/objects/lib_Otto.o',
    ]);
  });

  it('resolves repo-relative EEPROM and Otto-root headers', () => {
    const eeprom = catalog.libraries[0];
    const otto = catalog.libraries[1];
    const resolveFrom = (...parts) => parts.join('/');

    expect(resolveCatalogFile(catalog, eeprom, eeprom.headers[0], resolveFrom).from).toBe(
      'src/wasm-avr/libraries/EEPROM.h',
    );
    expect(resolveCatalogFile(catalog, otto, otto.headers[0], resolveFrom).from).toBe(
      'src/wasm-avr/libraries/Otto/Otto.h',
    );
  });
});
