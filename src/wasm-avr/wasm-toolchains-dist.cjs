'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AVR_RELEASE = 'avr-v1.0.0';

const norm = (p) => path.resolve(p).replace(/\\/g, '/');

function paths(root = path.resolve(__dirname, '../..')) {
  const cache = path.join(root, '.cache');
  return {
    root,
    cache,
    tarPath: process.env.AVRWASM_TAR || path.join(cache, 'avrwasm.tar'),
    distWeb: path.join(cache, 'avrwasm-dist'),
    distNode: path.join(cache, 'avrwasm-node-dist'),
    toolchains: process.env.WASM_TOOLCHAINS || path.join(cache, 'wasm-toolchains'),
    release: process.env.AVRWASM_RELEASE || AVR_RELEASE,
  };
}

function ensureTarExtracted(p = paths()) {
  if (!fs.existsSync(p.tarPath)) {
    throw new Error(
      `Missing ${p.tarPath}. Download avrwasm.tar from wasm-toolchains release ${p.release}.`,
    );
  }
  if (!fs.existsSync(path.join(p.distWeb, 'manifest.json'))) {
    fs.mkdirSync(p.distWeb, { recursive: true });
    execSync(`tar -xf "${p.tarPath}" -C "${p.distWeb}"`, { stdio: 'inherit' });
  }
  return p.distWeb;
}

function ensureNodeDist(p = paths()) {
  if (fs.existsSync(path.join(p.distNode, 'cc1plus.js'))) {
    return p.distNode;
  }
  ensureTarExtracted(p);
  fs.mkdirSync(p.distNode, { recursive: true });
  for (const dir of ['specs', 'sysroot']) {
    fs.cpSync(path.join(p.distWeb, dir), path.join(p.distNode, dir), { recursive: true });
  }
  for (const f of fs.readdirSync(path.join(p.distWeb, 'tools'))) {
    fs.copyFileSync(path.join(p.distWeb, 'tools', f), path.join(p.distNode, f));
  }
  return p.distNode;
}

function ensureToolchains(p = paths()) {
  const buildSketch = path.join(p.toolchains, 'tools/arduino-wasm/build-sketch.cjs');
  if (!fs.existsSync(buildSketch)) {
    throw new Error(
      `Missing ${buildSketch}. Clone wasm-toolchains at tag ${p.release} into ${p.toolchains}.`,
    );
  }
  return p.toolchains;
}

function patchToolchainForWindows(toolchainsDir) {
  if (process.platform !== 'win32') return;
  const { AvrToolchain } = require(path.join(toolchainsDir, 'tools/arduino-wasm/compiler.cjs'));
  if (AvrToolchain.prototype._mountTree.__bybyteWinPatch) return;

  AvrToolchain.prototype._systemIncludes = function systemIncludesWin() {
    return [
      norm(path.join(this.sysroot, 'avr', 'include')),
      norm(path.join(this.sysroot, 'gcc-include')),
    ];
  };
  AvrToolchain.prototype._mountTree = function mountTreeWin(dirs) {
    const out = new Map();
    const walk = (dir) => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full);
        else if (ent.isFile()) out.set(norm(full), fs.readFileSync(full));
      }
    };
    for (const d of dirs) if (fs.existsSync(d)) walk(d);
    return out;
  };
  AvrToolchain.prototype._mountTree.__bybyteWinPatch = true;

  const orig = AvrToolchain.prototype.compileUnit;
  AvrToolchain.prototype.compileUnit = async function compileUnitWin(board, source, filename, includes) {
    return orig.call(this, board, source, norm(filename), includes.map(norm));
  };
  AvrToolchain.prototype.compileUnit.__bybyteWinPatch = true;
}

function virtualToBundleRel(virtualPath) {
  return virtualPath.replace(/^\//, '').replace(/\\/g, '/');
}

module.exports = {
  AVR_RELEASE,
  norm,
  paths,
  ensureTarExtracted,
  ensureNodeDist,
  ensureToolchains,
  patchToolchainForWindows,
  virtualToBundleRel,
};
