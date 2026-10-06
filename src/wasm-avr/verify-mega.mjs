#!/usr/bin/env node
/**
 * F3.5 — verify ATmega2560 (Mega) WASM fixtures via Node + wasm-toolchains.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { resolveAvrMegaBundleDir } from './wasm-bundle-paths.mjs';

const require = createRequire(import.meta.url);
const { buildMegaFixture } = require('./verify-mega-build.cjs');

/** @typedef {{ name: string; file: string; bybyteObjects?: string[]; includePaths?: string[] }} MegaVerifyFixture */

/** @type {Record<string, MegaVerifyFixture>} */
export const MEGA_FIXTURES = {
  blink: {
    name: 'Blink',
    file: 'blink-minimal.cpp',
    bybyteObjects: [],
    includePaths: [],
  },
  otto: {
    name: 'Otto',
    file: 'otto-minimal.cpp',
    bybyteObjects: [
      'objects/lib_Otto.o',
      'objects/lib_Otto_matrix.o',
      'objects/lib_Oscillator.o',
      'objects/lib_eeprom_avr.o',
      'objects/lib_Servo.o',
    ],
    includePaths: ['/libraries/Otto'],
  },
  stepper: {
    name: 'Stepper',
    file: 'stepper-minimal.cpp',
    bybyteObjects: ['objects/lib_Stepper.o'],
    includePaths: ['/libraries/Stepper'],
  },
  quad: {
    name: 'Quad',
    file: 'quad-minimal.cpp',
    bybyteObjects: [
      'objects/lib_Quad_Quad.o',
      'objects/lib_Quad_Octosnake.o',
      'objects/lib_eeprom_avr.o',
      'objects/lib_Servo.o',
    ],
    includePaths: ['/libraries/Quad'],
  },
};

/** @type {Record<string, string[]>} */
export const MEGA_VERIFY_WAVES = {
  w1: ['otto'],
  w4: ['stepper'],
  w7: ['quad'],
  mega: ['blink', 'otto', 'stepper', 'quad'],
  all: ['blink', 'otto', 'stepper', 'quad'],
};

/**
 * @param {string} waveKey - mega | all | w1 | w4 | w7
 * @returns {Promise<number>} exit code
 */
export async function verifyMega(waveKey) {
  const key = waveKey?.toLowerCase().replace(/^mega-/, '');
  const fixtureKeys = MEGA_VERIFY_WAVES[key];
  if (!fixtureKeys) {
    throw new Error(`Unknown Mega verify wave: ${waveKey}`);
  }

  const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
  const bundleDir = await resolveAvrMegaBundleDir(rootDir);
  const fixturesDir = join(rootDir, 'src/wasm-avr/fixtures');
  const waveLabel = key.toUpperCase();

  let failed = false;

  for (const fixtureKey of fixtureKeys) {
    const fixture = MEGA_FIXTURES[fixtureKey];
    if (!fixture) {
      throw new Error(`Unknown Mega fixture key: ${fixtureKey}`);
    }

    const sketchPath = join(fixturesDir, fixture.file);
    try {
      const result = await buildMegaFixture({
        bundleDir,
        sketchPath,
        bybyteObjects: fixture.bybyteObjects,
        includePaths: fixture.includePaths,
      });
      console.log(
        `${fixture.name} ${waveLabel}: flash=${result.flashBytes} fits=${result.fitsTarget} ` +
          `sketch.o=${result.sketchObjectBytes}B core+libs=${result.coreObjectCount} hex=${result.hex.length}`,
      );
      if (!result.hex.startsWith(':') || !result.fitsTarget) {
        failed = true;
      }
    } catch (error) {
      console.error(`${fixture.name} ${waveLabel}: FAIL`);
      console.error(error instanceof Error ? error.message : error);
      failed = true;
    }
  }

  return failed ? 1 : 0;
}
