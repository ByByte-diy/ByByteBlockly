#!/usr/bin/env node
/**
 * Copy Otto Quad library from compilation/userlibs into src/wasm-avr/libraries/Quad.
 * Renames Octosnake Oscillator → OctosnakeOscillator (W1 Otto already ships Oscillator).
 */
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const USERLIBS = join(ROOT, 'compilation/arduino/userlibs/libraries/Quad');
const OUT = join(__dirname, 'libraries/Quad');

async function copyFile(from, to) {
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to);
}

function patchOctosnakeHeader(source) {
  return source
    .replace(/class Oscillator\b/g, 'class OctosnakeOscillator')
    .replace(/Oscillator\(\)/g, 'OctosnakeOscillator()');
}

function patchOctosnakeCpp(source) {
  return source
    .replace(/Oscillator::Oscillator/g, 'OctosnakeOscillator::OctosnakeOscillator')
    .replace(/Oscillator::/g, 'OctosnakeOscillator::');
}

function patchQuadHeader(source) {
  return source.replace(/\bOscillator oscillator\[8\]/g, 'OctosnakeOscillator oscillator[8]');
}

async function main() {
  const files = ['Quad.h', 'Quad.cpp', 'Octosnake.h', 'Octosnake.cpp'];
  for (const file of files) {
    await copyFile(join(USERLIBS, file), join(OUT, file));
  }

  const octoH = join(OUT, 'Octosnake.h');
  const octoCpp = join(OUT, 'Octosnake.cpp');
  const quadH = join(OUT, 'Quad.h');

  await writeFile(octoH, patchOctosnakeHeader(await readFile(octoH, 'utf8')));
  await writeFile(octoCpp, patchOctosnakeCpp(await readFile(octoCpp, 'utf8')));
  await writeFile(quadH, patchQuadHeader(await readFile(quadH, 'utf8')));

  console.log('W7 Quad library synced to', OUT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
