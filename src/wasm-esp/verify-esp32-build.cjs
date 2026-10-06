'use strict';

/**
 * Node ESP32 verify build — drives the shipped esp32wasm bundle through recipe-esp.js
 * with Xtensa WASM tools (cc1plus → as → ld → elf2image → app .bin).
 */
const fs = require('fs');
const path = require('path');

const R = require('./recipe-esp.js');
const { esp32ElfToAppBinAsync } = require('./esp32-elf2image.js');

const enc = (s) => new TextEncoder().encode(s);

async function runTool(factory, label, argv, inputs, outputs) {
  const lines = [];
  let ec = 0;
  const out = new Map();

  await factory({
    arguments: argv,
    print: (s) => lines.push(s),
    printErr: (s) => lines.push(s),
    quit: (c) => {
      ec = c;
    },
    preRun: [
      (M) => {
        for (const [p, b] of inputs) {
          const i = p.lastIndexOf('/');
          if (i > 0) M.FS.mkdirTree(p.slice(0, i));
          M.FS.writeFile(p, b);
        }
        for (const o of outputs) {
          const i = o.lastIndexOf('/');
          if (i > 0) M.FS.mkdirTree(o.slice(0, i));
        }
      },
    ],
    postRun: [
      (M) => {
        if (ec === 0) {
          for (const o of outputs) {
            try {
              out.set(o, M.FS.readFile(o));
            } catch (e) {
              lines.push(`read ${o}: ${e.message}`);
            }
          }
        }
      },
    ],
  });

  if (ec !== 0 || outputs.some((o) => !out.has(o))) {
    throw new Error(`[${label}] exit ${ec}\n${lines.slice(-20).join('\n')}`);
  }
  return out;
}

function loadTools(distDir) {
  return {
    cc1plus: require(path.join(distDir, 'tools/cc1plus.js')),
    as: require(path.join(distDir, 'tools/xtensa-esp32-elf-as.js')),
    ld: require(path.join(distDir, 'tools/xtensa-esp32-elf-ld.js')),
  };
}

function readManifest(distDir) {
  return JSON.parse(fs.readFileSync(path.join(distDir, 'manifest.json'), 'utf8'));
}

function tpl(distDir, rel) {
  const normalized = rel.replace(/^.*?templates\//, 'templates/');
  return fs.readFileSync(path.join(distDir, normalized), 'utf8');
}

function baseFs(distDir, bcfg) {
  const inputs = new Map();
  const rdBundle = (rel) => fs.readFileSync(path.join(distDir, rel));

  for (const rel of bcfg.headers) {
    inputs.set(rel.replace(/^vfs/, ''), rdBundle(rel));
  }
  for (const rel of bcfg.link) {
    inputs.set(rel.replace(/^vfs/, ''), rdBundle(rel));
  }
  return inputs;
}

/**
 * @param {object} opts
 * @param {string} opts.distDir - esp32 bundle root (manifest.json + tools/ + vfs/)
 * @param {string} opts.sketchSource - preprocessed .cpp source
 * @param {string} [opts.board='esp32']
 */
async function buildEsp32Sketch({ distDir, sketchSource, board = 'esp32' }) {
  const manifest = readManifest(distDir);
  const bcfg = manifest.boards[board];
  if (!bcfg) {
    throw new Error(`Board "${board}" missing from manifest`);
  }

  const F = loadTools(distDir);
  const cc1tpl = tpl(distDir, bcfg.templates.cc1plus).split('\n').filter(Boolean);
  const ldtpl = tpl(distDir, bcfg.templates.ld).split('\n').filter(Boolean);
  const isys = tpl(distDir, manifest.isystem).trim().split('\n').filter(Boolean);

  const sketchVfs = bcfg.sketchSrc;
  const sketchObjVfs = bcfg.sketchObj;
  const elfVfs = '/work/sketch.elf';
  const sVfs = '/work/sketch.s';

  const base = baseFs(distDir, bcfg);
  base.set(sketchVfs, enc(sketchSource));

  const cc1 = await runTool(
    F.cc1plus,
    'cc1plus',
    R.cc1Argv(cc1tpl, isys, sketchVfs, sVfs, bcfg.sketchSrc),
    base,
    [sVfs],
  );

  const asOut = await runTool(
    F.as,
    'xtensa-as',
    R.asArgv(bcfg.asFlags, sketchObjVfs, sVfs),
    new Map([[sVfs, cc1.get(sVfs)]]),
    [sketchObjVfs],
  );

  const linkIn = baseFs(distDir, bcfg);
  linkIn.set(sketchObjVfs, asOut.get(sketchObjVfs));

  const elf = (
    await runTool(F.ld, 'xtensa-ld', R.ldArgv(ldtpl, elfVfs), linkIn, [elfVfs])
  ).get(elfVfs);

  const bin = Buffer.from(await esp32ElfToAppBinAsync(elf));

  return {
    bin,
    binContent: bin.toString('base64'),
    binBytes: bin.length,
    sketchObjectBytes: asOut.get(sketchObjVfs).length,
    linkInputCount: bcfg.link.length,
    outputFormat: manifest.output || 'bin',
    flash: manifest.flash,
    fqbn: 'esp32:esp32:esp32',
  };
}

module.exports = { buildEsp32Sketch };
