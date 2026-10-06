'use strict';

/**
 * Node Mega2560 verify build — mirrors browser selective link:
 * compile Arduino core, link prebuilt ByByte .o, compile sketch, archive, link.
 */
const fs = require('fs');
const path = require('path');
const {
  ensureNodeDist,
  ensureToolchains,
  patchToolchainForWindows,
  paths,
} = require('./wasm-toolchains-dist.cjs');

const MEGA_APP_FLASH_BYTES = 253952;
const STUB_OBJECT_BYTES = 444;

function countIntelHexDataBytes(hex) {
  let total = 0;
  for (const line of hex.split(/\r?\n/)) {
    if (!line.startsWith(':') || line.length < 11) continue;
    const count = parseInt(line.slice(1, 3), 16);
    if (line.slice(7, 9) === '00') total += count;
  }
  return total;
}

function bundleIncludeDirs(bundleDir, virtualPaths = []) {
  const stock = [
    path.join(bundleDir, 'arduino-core/cores/arduino'),
    path.join(bundleDir, 'arduino-core/variants/mega'),
    path.join(bundleDir, 'arduino/libraries/EEPROM/src'),
    path.join(bundleDir, 'libraries/Servo/src'),
    path.join(bundleDir, 'libraries/Servo/src/avr'),
  ];
  const extra = virtualPaths.map((virtual) =>
    path.join(bundleDir, virtual.replace(/^\//, '')),
  );
  return [...new Set([...stock, ...extra])];
}

function listCoreSources(coreDir) {
  return fs
    .readdirSync(coreDir)
    .filter((name) => /\.(c|cpp|S)$/.test(name))
    .map((name) => path.join(coreDir, name));
}

function loadBybyteObjects(bundleDir, relativePaths) {
  const objects = [];
  for (const rel of relativePaths) {
    const filePath = path.join(bundleDir, rel.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing prebuilt object: ${rel}`);
    }
    const bytes = fs.readFileSync(filePath);
    if (bytes.length <= STUB_OBJECT_BYTES) {
      throw new Error(`Stub object ${rel} (${bytes.length} B) — run npm run prepare:wasm-avr -- prepare mega`);
    }
    objects.push(bytes);
  }
  return objects;
}

/**
 * @param {object} opts
 * @param {string} opts.bundleDir - published avr-mega bundle root
 * @param {string} opts.sketchPath - absolute path to fixture .cpp
 * @param {string[]} [opts.bybyteObjects] - paths under bundle, e.g. objects/lib_Quad_Quad.o
 * @param {string[]} [opts.includePaths] - virtual include dirs, e.g. /libraries/Quad
 */
async function buildMegaFixture({
  bundleDir,
  sketchPath,
  bybyteObjects = [],
  includePaths = [],
}) {
  const p = paths();
  const distDir = ensureNodeDist(p);
  const toolchains = ensureToolchains(p);
  patchToolchainForWindows(toolchains);

  const R = require(path.join(toolchains, 'tools/arduino-wasm/recipe.js'));
  const { AvrToolchain } = require(path.join(toolchains, 'tools/arduino-wasm/compiler.cjs'));
  const board = R.BOARDS.mega;
  const tc = new AvrToolchain(distDir);

  const coreDir = path.join(bundleDir, 'arduino-core/cores/arduino');
  const incDirs = bundleIncludeDirs(bundleDir, includePaths);
  const plainObjs = [];

  for (const file of listCoreSources(coreDir)) {
    const src = fs.readFileSync(file, 'utf8');
    plainObjs.push(await tc.compileUnit(board, src, file, incDirs));
  }

  plainObjs.push(...loadBybyteObjects(bundleDir, bybyteObjects));

  const sketchSource = R.preprocessIno(fs.readFileSync(sketchPath, 'utf8'));
  const sketchObj = await tc.compileUnit(board, sketchSource, sketchPath, incDirs);
  if (sketchObj.length <= STUB_OBJECT_BYTES) {
    throw new Error(
      `Sketch object too small (${sketchObj.length} B) — check fixture includes and bundle headers`,
    );
  }

  const coreArchive = await tc.archive(new Map(plainObjs.map((bytes, i) => [i, bytes])));
  const elf = await tc.link(board, new Map([[0, sketchObj]]), coreArchive);
  const hex = await tc.elf2hex(elf);
  const flashBytes = countIntelHexDataBytes(hex);

  return {
    hex,
    flashBytes,
    fitsTarget: flashBytes <= MEGA_APP_FLASH_BYTES,
    sketchObjectBytes: sketchObj.length,
    coreObjectCount: plainObjs.length,
  };
}

module.exports = { buildMegaFixture, MEGA_APP_FLASH_BYTES, STUB_OBJECT_BYTES };
