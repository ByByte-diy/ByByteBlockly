'use strict';

const path = require('path');
const {
  ensureNodeDist,
  ensureToolchains,
  patchToolchainForWindows,
  paths,
} = require('./wasm-toolchains-dist.cjs');

/**
 * Compile one ByByte library .cpp to .o for ATmega2560 (avr6) via wasm-toolchains.
 *
 * @param {object} opts
 * @param {string} opts.source - C++ source
 * @param {string} opts.sourcePath - absolute path to source file (for includes / VFS)
 * @param {string} opts.coreDir - arduino-core root from avrwasm bundle
 * @param {string[]} opts.includeDiskPaths - extra include directories (absolute)
 * @param {string[]} [opts.extraDefines]
 * @returns {Promise<{ object: Buffer, log: string[] }>}
 */
async function compileMegaLibraryObject({
  source,
  sourcePath,
  coreDir,
  includeDiskPaths,
  extraDefines = [],
}) {
  const p = paths();
  const distDir = ensureNodeDist(p);
  const toolchains = ensureToolchains(p);
  patchToolchainForWindows(toolchains);

  const { AvrToolchain } = require(path.join(toolchains, 'tools/arduino-wasm/compiler.cjs'));
  const R = require(path.join(toolchains, 'tools/arduino-wasm/recipe.js'));
  const board = R.BOARDS.mega;
  const tc = new AvrToolchain(distDir);

  let body = source;
  if (extraDefines.length) {
    body = `${extraDefines.map((d) => `#define ${d}\n`).join('')}${body}`;
  }

  const includes = [
    path.join(coreDir, 'cores/arduino'),
    path.join(coreDir, 'variants/mega'),
    ...includeDiskPaths,
  ];

  const log = [];
  const origWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = (chunk, ...args) => {
    const line = String(chunk).trim();
    if (line) log.push(line);
    return origWrite(chunk, ...args);
  };
  try {
    const object = await tc.compileUnit(board, body, sourcePath, includes);
    return { object: Buffer.from(object), log };
  } finally {
    process.stderr.write = origWrite;
  }
}

module.exports = { compileMegaLibraryObject };
