#!/usr/bin/env node
/**
 * F4.1 — verify ESP32 WASM Blink fixture (Node harness, WiFi-less sketch).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { resolveEsp32BundleDir } from './wasm-bundle-paths.mjs';

const require = createRequire(import.meta.url);
const R = require('./recipe-esp.js');
const { buildEsp32Sketch } = require('./verify-esp32-build.cjs');
const { paths, ensureTarExtracted } = require('./wasm-toolchains-esp32-dist.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

/** Minimum plausible ESP32 app .bin size (bytes) for a linked sketch. */
const MIN_APP_BIN_BYTES = 100_000;
/** Raw objcopy -O binary spans the ELF VMA and can exceed flash; app images must not. */
const MAX_APP_BIN_BYTES = 4 * 1024 * 1024;

async function resolveDistDir(distOverride) {
  if (distOverride || process.env.DIST) {
    return distOverride || process.env.DIST;
  }
  try {
    return await resolveEsp32BundleDir(ROOT);
  } catch {
    return ensureTarExtracted(paths(ROOT));
  }
}

/**
 * @param {string} [fixtureKey='blink']
 * @param {string} [distOverride] - bundle root (manifest.json directory)
 * @returns {Promise<number>} exit code
 */
export async function verifyEsp32(fixtureKey = 'blink', distOverride) {
  if (fixtureKey !== 'blink') {
    throw new Error(`Unknown ESP32 fixture: ${fixtureKey}`);
  }

  const distDir = await resolveDistDir(distOverride);
  const ino = readFileSync(join(__dirname, 'fixtures/blink-minimal.ino'), 'utf8');
  const sketchSource = R.preprocessIno(ino);

  try {
    const result = await buildEsp32Sketch({ distDir, sketchSource, board: 'esp32' });
    const ok =
      result.outputFormat === 'bin' &&
      result.binBytes >= MIN_APP_BIN_BYTES &&
      result.binBytes <= MAX_APP_BIN_BYTES &&
      result.binContent.length > 0;

    console.log(
      `Blink ESP32: format=${result.outputFormat} bin=${result.binBytes} B ` +
        `sketch.o=${result.sketchObjectBytes} B linkInputs=${result.linkInputCount} ` +
        `flash.app=${result.flash?.app ?? '?'} ${ok ? 'OK' : 'FAIL'}`,
    );

    if (ok) {
      console.log(`binContent (base64 prefix): ${result.binContent.slice(0, 48)}…`);
    }
    return ok ? 0 : 1;
  } catch (error) {
    console.error('Blink ESP32: FAIL');
    console.error(error instanceof Error ? error.message : error);
    return 1;
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const fixture = process.argv[2] || 'blink';
  const distOverride = process.argv[3];
  verifyEsp32(fixture, distOverride)
    .then((code) => process.exit(code))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
