/**
 * Browser entry for wasm-toolchains ESP32 (Xtensa).
 * Exports compile({ source, assetsBase, board }) → { bin, binContent, binBytes, stderr, timings }.
 */
'use strict';

const TOOL_SCRIPTS = [
  ['tools/cc1plus.js', 'createModule', 'cc1plus'],
  ['tools/xtensa-esp32-elf-as.js', 'createModule', 'as'],
  ['tools/xtensa-esp32-elf-ld.js', 'createModule', 'ld'],
];

const initByBase = new Map();

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve(undefined);
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
}

async function ensureToolchain(assetsBase) {
  const base = assetsBase.endsWith('/') ? assetsBase : `${assetsBase}/`;
  if (initByBase.has(base)) {
    return initByBase.get(base);
  }

  const promise = (async () => {
    await loadScript(new URL('recipe-esp.js', base).href);
    await loadScript(new URL('esp32-elf2image.js', base).href);
    const R = globalThis.EspRecipe;
    if (!R) throw new Error('recipe-esp.js did not expose EspRecipe');
    const Elf2Image = globalThis.Esp32Elf2Image;
    if (!Elf2Image?.esp32ElfToAppBinAsync) {
      throw new Error('esp32-elf2image.js did not expose Esp32Elf2Image');
    }

    const factories = {};
    for (const [rel, globalName, key] of TOOL_SCRIPTS) {
      await loadScript(new URL(rel, base).href);
      factories[key] = globalThis[globalName];
      try {
        delete globalThis[globalName];
      } catch {
        /* ignore */
      }
    }

    const cache = new Map();
    const fetchBytes = async (rel) => {
      if (cache.has(rel)) return cache.get(rel);
      const response = await fetch(new URL(rel, base).href);
      if (!response.ok) throw new Error(`${rel}: HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      cache.set(rel, bytes);
      return bytes;
    };
    const fetchText = async (rel) => new TextDecoder().decode(await fetchBytes(rel));
    const enc = (s) => new TextEncoder().encode(s);

    async function runTool(factory, label, argv, inputs, outputs) {
      const lines = [];
      let exitCode = 0;
      const out = new Map();
      await factory({
        arguments: argv,
        print: (s) => lines.push(s),
        printErr: (s) => lines.push(s),
        quit: (code) => {
          exitCode = code;
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
            if (exitCode === 0) {
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
      const logText = lines.join('\n');
      if (/fatal error:/i.test(logText)) {
        throw new Error(`[${label}] compilation failed\n${logText}`);
      }
      if (exitCode !== 0 || outputs.some((o) => !out.has(o))) {
        throw new Error(`[${label}] exit ${exitCode}\n${logText}`);
      }
      return out;
    }

    async function hydrateBaseFs(bcfg) {
      const inputs = new Map();
      for (const rel of bcfg.headers) {
        inputs.set(rel.replace(/^vfs/, ''), await fetchBytes(rel));
      }
      for (const rel of bcfg.link) {
        inputs.set(rel.replace(/^vfs/, ''), await fetchBytes(rel));
      }
      return inputs;
    }

    function logStep(log, msg) {
      log.push(msg);
    }

    function msSince(start) {
      return Math.round(performance.now() - start);
    }

    function bytesToBase64(bytes) {
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      return btoa(binary);
    }

    async function compile(options) {
      const stderr = [];
      const totalStart = performance.now();
      const boardKey = options.board || 'esp32';
      const manifest = await (await fetch(new URL('manifest.json', base).href)).json();
      const bcfg = manifest.boards[boardKey];
      if (!bcfg) throw new Error(`Unknown ESP32 board: ${boardKey}`);

      logStep(stderr, '--- WASM ESP32 compile ---');
      logStep(stderr, `board: ${bcfg.mcu} (${boardKey})`);
      logStep(stderr, `output: ${manifest.output || 'bin'}`);
      logStep(stderr, '');

      const cc1tpl = (await fetchText(bcfg.templates.cc1plus)).split('\n').filter(Boolean);
      const ldtpl = (await fetchText(bcfg.templates.ld)).split('\n').filter(Boolean);
      const isys = (await fetchText(manifest.isystem)).trim().split('\n').filter(Boolean);

      const sketchVfs = bcfg.sketchSrc;
      const sketchObjVfs = bcfg.sketchObj;
      const elfVfs = '/work/sketch.elf';
      const sVfs = '/work/sketch.s';

      logStep(stderr, '[vfs] loading headers + link closure');
      const vfsStart = performance.now();
      const baseTree = await hydrateBaseFs(bcfg);
      baseTree.set(sketchVfs, enc(options.source));
      logStep(stderr, `  ${baseTree.size} files (${msSince(vfsStart)} ms)`);

      logStep(stderr, '[cc1plus] sketch');
      const cc1Start = performance.now();
      const cc1 = await runTool(
        factories.cc1plus,
        'cc1plus',
        R.cc1Argv(cc1tpl, isys, sketchVfs, sVfs, bcfg.sketchSrc),
        baseTree,
        [sVfs],
      );
      logStep(stderr, `  ${cc1.get(sVfs).length} B asm (${msSince(cc1Start)} ms)`);

      logStep(stderr, '[as] sketch.o');
      const asStart = performance.now();
      const asOut = await runTool(
        factories.as,
        'xtensa-as',
        R.asArgv(bcfg.asFlags, sketchObjVfs, sVfs),
        new Map([[sVfs, cc1.get(sVfs)]]),
        [sketchObjVfs],
      );
      const sketchObj = asOut.get(sketchObjVfs);
      logStep(stderr, `  ${sketchObj.length} B (${msSince(asStart)} ms)`);

      logStep(stderr, '[ld] sketch.elf');
      const ldStart = performance.now();
      const linkIn = await hydrateBaseFs(bcfg);
      linkIn.set(sketchObjVfs, sketchObj);
      const elf = (
        await runTool(factories.ld, 'xtensa-ld', R.ldArgv(ldtpl, elfVfs), linkIn, [elfVfs])
      ).get(elfVfs);
      logStep(stderr, `  ${elf.length} B (${msSince(ldStart)} ms)`);

      logStep(stderr, '[elf2image] sketch.bin');
      const binStart = performance.now();
      const bin = await Elf2Image.esp32ElfToAppBinAsync(elf);
      logStep(stderr, `  ${bin.length} B (${msSince(binStart)} ms)`);

      const timings = { totalMs: msSince(totalStart) };
      logStep(stderr, '');
      logStep(stderr, `[done] ${timings.totalMs} ms`);

      return {
        bin,
        binContent: bytesToBase64(bin),
        binBytes: bin.length,
        outputFormat: manifest.output || 'bin',
        flash: manifest.flash,
        stderr,
        timings,
      };
    }

    return { compile, R };
  })();

  initByBase.set(base, promise);
  return promise;
}

export async function compile(options) {
  if (!options?.assetsBase) {
    throw new Error('compile() requires assetsBase');
  }
  const { compile: run } = await ensureToolchain(options.assetsBase);
  return run(options);
}
