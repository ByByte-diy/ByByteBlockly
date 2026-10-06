/**
 * Browser entry for wasm-toolchains AVR Mega (ATmega2560).
 * Exports compile({ source, assetsBase, selectiveLoad, board }) compatible with WebAvrMegaWasmCompilerService.
 */
'use strict';

const MEGA_APP_FLASH_BYTES = 253952;
const TOOL_SCRIPTS = [
  ['tools/cc1.js', 'createModule', 'cc1'],
  ['tools/cc1plus.js', 'createModule', 'cc1plus'],
  ['tools/avr-as.js', 'Module', 'avr-as'],
  ['tools/avr-ld.js', 'Module', 'avr-ld'],
  ['tools/ar.js', 'Module', 'ar'],
  ['tools/objcopy.js', 'Module', 'objcopy'],
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

function catalogPath(virtualPath) {
  return virtualPath.startsWith('/') ? virtualPath.slice(1) : virtualPath;
}

function countIntelHexDataBytes(hex) {
  let total = 0;
  for (const line of hex.split(/\r?\n/)) {
    if (!line.startsWith(':') || line.length < 11) continue;
    const count = parseInt(line.slice(1, 3), 16);
    if (line.slice(7, 9) === '00') total += count;
  }
  return total;
}

async function ensureToolchain(assetsBase) {
  const base = assetsBase.endsWith('/') ? assetsBase : `${assetsBase}/`;
  if (initByBase.has(base)) {
    return initByBase.get(base);
  }

  const promise = (async () => {
    await loadScript(new URL('recipe.js', base).href);
    const R = globalThis.ArduinoRecipe;
    if (!R) throw new Error('recipe.js did not expose ArduinoRecipe');

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
    const dec = (b) => new TextDecoder().decode(b);
    const distToVfs = (rel) => `/${rel}`;
    const SYS_INC = '/sysroot/avr/include';
    const GCC_INC = '/sysroot/gcc-include';

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
          (m) => {
            for (const [p, b] of inputs) {
              const i = p.lastIndexOf('/');
              if (i > 0) m.FS.mkdirTree(p.slice(0, i));
              m.FS.writeFile(p, b);
            }
            for (const o of outputs) {
              const i = o.lastIndexOf('/');
              if (i > 0) m.FS.mkdirTree(o.slice(0, i));
            }
          },
        ],
        postRun: [
          (m) => {
            if (exitCode === 0) {
              for (const o of outputs) {
                try {
                  out.set(o, m.FS.readFile(o));
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
        const err = new Error(`[${label}] compilation failed\n${logText}`);
        err.tool = label;
        throw err;
      }
      if (exitCode !== 0 || outputs.some((o) => !out.has(o))) {
        const err = new Error(`[${label}] exit ${exitCode}\n${logText}`);
        err.tool = label;
        throw err;
      }
      return out;
    }

    async function includeTree(board, libNames, manifest, extraHeaderPaths) {
      const inputs = new Map();
      const want = (rel) =>
        /\.(h|hpp|inc|c|cpp|cc|cxx|S)$/.test(rel) ||
        rel.endsWith('/cores/arduino/new'); // new.h → #include "new"
      const add = async (rel) => {
        inputs.set(distToVfs(rel), await fetchBytes(rel));
      };
      for (const rel of manifest.sysroot) {
        if (rel.startsWith('sysroot/avr/include') || rel.startsWith('sysroot/gcc-include')) {
          await add(rel);
        }
      }
      for (const rel of manifest.core) {
        if (
          want(rel) &&
          (rel.includes('/cores/arduino/') || rel.includes(`/variants/${board.variant}/`))
        ) {
          await add(rel);
        }
      }
      for (const name of libNames) {
        const lib = manifest.libraries[name];
        if (!lib) throw new Error(`unknown library: ${name}`);
        for (const rel of lib.files) {
          if (want(rel)) await add(rel);
        }
      }
      for (const virtual of extraHeaderPaths || []) {
        await add(catalogPath(virtual));
      }
      return inputs;
    }

    function includeDirs(board, libNames, manifest, extraIncludePaths) {
      const dirs = [
        SYS_INC,
        GCC_INC,
        '/arduino-core/cores/arduino',
        `/arduino-core/variants/${board.variant}`,
      ];
      for (const name of libNames) {
        dirs.push(`/${manifest.libraries[name].include}`);
      }
      for (const virtual of extraIncludePaths || []) {
        const dir = virtual.startsWith('/') ? virtual : `/${virtual}`;
        if (!dirs.includes(dir)) {
          dirs.push(dir);
        }
      }
      return dirs;
    }

    async function compileUnit(board, srcVfs, base, incDirs, spec, isAsm) {
      const asmVfs = '/work/unit.s';
      const objVfs = '/work/unit.o';
      const quote = ['-iquote', srcVfs.slice(0, srcVfs.lastIndexOf('/'))];
      const inputs = new Map(base);
      if (isAsm) {
        const argv = [
          '-E',
          '-lang-asm',
          ...R.deviceFlags(spec),
          ...R.defines(board),
          ...quote,
          ...incDirs.flatMap((d) => ['-isystem', d]),
          srcVfs,
          '-o',
          asmVfs,
        ];
        const pp = await runTool(factories.cc1, 'cc1(-E)', argv, inputs, [asmVfs]);
        inputs.set(asmVfs, pp.get(asmVfs));
      } else {
        const cpp = R.isCpp(srcVfs);
        const argv = R.cc1Argv(board, spec, incDirs, srcVfs, asmVfs, false, quote);
        const factory = cpp ? factories.cc1plus : factories.cc1;
        const s = await runTool(factory, cpp ? 'cc1plus' : 'cc1', argv, inputs, [asmVfs]);
        inputs.set(asmVfs, s.get(asmVfs));
      }
      const o = await runTool(
        factories['avr-as'],
        'as',
        ['-mmcu=' + board.mcu, '-o', objVfs, asmVfs],
        new Map([[asmVfs, inputs.get(asmVfs)]]),
        [objVfs],
      );
      return o.get(objVfs);
    }

    async function link(board, sketchObjs, coreArchive) {
      const { arch, mcu, crt } = board;
      const libcDir = `/usr/lib/avr/lib/${arch}`;
      const libgccDir = `/usr/lib/gcc/avr/${arch}`;
      const scriptVfs = `/usr/lib/avr/lib/ldscripts/${arch}.x`;
      const tdata = R.linkTdata(await fetchText(`specs/link-${mcu}.txt`));
      const inputs = new Map();
      inputs.set(scriptVfs, await fetchBytes(`sysroot/avr/lib/ldscripts/${arch}.x`));
      inputs.set(`${libcDir}/${crt}`, await fetchBytes(`sysroot/avr/lib/${arch}/${crt}`));
      inputs.set(`${libcDir}/libc.a`, await fetchBytes(`sysroot/avr/lib/${arch}/libc.a`));
      inputs.set(`${libcDir}/libm.a`, await fetchBytes(`sysroot/avr/lib/${arch}/libm.a`));
      inputs.set(`${libcDir}/lib${mcu}.a`, await fetchBytes(`sysroot/avr/lib/${arch}/lib${mcu}.a`));
      inputs.set(`${libgccDir}/libgcc.a`, await fetchBytes(`sysroot/libgcc/${arch}/libgcc.a`));
      const objNames = sketchObjs.map((bytes, i) => {
        const n = `/work/s${i}.o`;
        inputs.set(n, bytes);
        return n;
      });
      let coreVfs = null;
      if (coreArchive) {
        coreVfs = '/work/core.a';
        inputs.set(coreVfs, coreArchive);
      }
      const argv = R.linkArgv(board, {
        scriptVfs,
        tdata,
        crtVfs: `${libcDir}/${crt}`,
        objVfs: objNames,
        coreVfs,
        libgccDir,
        libcDir,
        outVfs: '/work/sketch.elf',
      });
      return (await runTool(factories['avr-ld'], 'ld', argv, inputs, ['/work/sketch.elf'])).get(
        '/work/sketch.elf',
      );
    }

    function stockLibrariesFromSource(source, manifest) {
      const names = [];
      for (const [name, lib] of Object.entries(manifest.libraries || {})) {
        const header = (lib.files || []).find((f) => f.endsWith('.h'));
        if (!header) continue;
        const headerName = header.split('/').pop();
        const re = new RegExp(`#include\\s*[<"]${headerName.replace('.', '\\.')}[">]`);
        if (re.test(source)) names.push(name);
      }
      return names;
    }

    function logStep(log, msg) {
      log.push(msg);
    }

    function msSince(start) {
      return Math.round(performance.now() - start);
    }

    function baseName(rel) {
      return rel.split('/').pop();
    }

    async function compile(options) {
      const stderr = [];
      const totalStart = performance.now();
      const timings = { coreUnits: 0, stockUnits: 0, bybyteObjects: 0 };
      const boardKey = options.board || 'mega';
      const board = R.BOARDS[boardKey] || R.BOARDS.mega;
      const manifest = await (await fetch(new URL('manifest.json', base).href)).json();
      const stockLibs = stockLibrariesFromSource(options.source, manifest);
      const extraHeaders = options.selectiveLoad?.headerFiles || [];
      const extraIncludePaths = options.selectiveLoad?.includePaths || [];
      const bybyteObjects = options.selectiveLoad?.bybyteObjects || [];
      const baseTree = await includeTree(board, stockLibs, manifest, extraHeaders);
      const incDirs = includeDirs(board, stockLibs, manifest, extraIncludePaths);

      logStep(stderr, '--- WASM AVR compile ---');
      logStep(stderr, `board: ${board.mcu} (${boardKey})`);
      logStep(
        stderr,
        `stock libs: ${stockLibs.length ? stockLibs.join(', ') : '—'}`,
      );
      logStep(stderr, `bybyte .o: ${bybyteObjects.length}`);
      logStep(stderr, '');

      const plainObjs = [];
      logStep(stderr, '[core] Arduino core');
      for (const rel of manifest.core) {
        if (!/\/cores\/arduino\/.+\.(c|cpp|S)$/.test(rel)) continue;
        const unitStart = performance.now();
        const spec = await fetchText(`specs/${R.isAsm(rel) ? 'cc1' : R.isCpp(rel) ? 'cc1plus' : 'cc1'}-${board.mcu}.txt`);
        plainObjs.push(
          await compileUnit(board, distToVfs(rel), baseTree, incDirs, spec, R.isAsm(rel)),
        );
        logStep(stderr, `  ${baseName(rel)} (${msSince(unitStart)} ms)`);
        timings.coreUnits += 1;
      }

      if (stockLibs.length) {
        logStep(stderr, '[stock] libraries');
        for (const name of stockLibs) {
          for (const rel of manifest.libraries[name].files) {
            if (!/\.(c|cpp|cc|cxx|S)$/.test(rel)) continue;
            const unitStart = performance.now();
            const spec = await fetchText(`specs/${R.isAsm(rel) ? 'cc1' : R.isCpp(rel) ? 'cc1plus' : 'cc1'}-${board.mcu}.txt`);
            plainObjs.push(
              await compileUnit(board, distToVfs(rel), baseTree, incDirs, spec, R.isAsm(rel)),
            );
            logStep(stderr, `  ${name}/${baseName(rel)} (${msSince(unitStart)} ms)`);
            timings.stockUnits += 1;
          }
        }
      }

      if (bybyteObjects.length) {
        logStep(stderr, '[bybyte] prebuilt objects');
        for (const virtual of bybyteObjects) {
          const rel = catalogPath(virtual);
          const bytes = await fetchBytes(rel);
          plainObjs.push(bytes);
          logStep(stderr, `  ${baseName(rel)} (${bytes.length} B)`);
          timings.bybyteObjects += 1;
        }
      }

      const sketchVfs = '/sketch/sketch.cpp';
      const sketchBase = new Map(baseTree);
      // Source is already prepared in Angular (Arduino.h, forward decls, setup/loop).
      sketchBase.set(sketchVfs, enc(options.source));
      const sketchSpec = await fetchText(`specs/cc1plus-${board.mcu}.txt`);
      logStep(stderr, '[sketch] sketch.cpp');
      const sketchStart = performance.now();
      const sketchObj = await compileUnit(board, sketchVfs, sketchBase, incDirs, sketchSpec, false);
      if (sketchObj.length <= 444) {
        throw new Error(
          'Sketch compilation produced an empty object (missing headers?). Check compile log for fatal errors.',
        );
      }
      logStep(stderr, `  done (${msSince(sketchStart)} ms, ${sketchObj.length} B)`);

      const arInputs = new Map();
      const archiveNames = plainObjs.map((bytes, i) => {
        const n = `/work/c${i}.o`;
        arInputs.set(n, bytes);
        return n;
      });
      logStep(stderr, `[ar] core.a (${plainObjs.length} objects)`);
      const arStart = performance.now();
      const coreArchive = (
        await runTool(
          factories.ar,
          'ar',
          ['rcs', '/work/core.a', ...archiveNames],
          arInputs,
          ['/work/core.a'],
        )
      ).get('/work/core.a');
      logStep(stderr, `  ${coreArchive.length} B (${msSince(arStart)} ms)`);

      logStep(stderr, '[ld] sketch.elf');
      const ldStart = performance.now();
      const elf = await link(board, [sketchObj], coreArchive);
      logStep(stderr, `  ${elf.length} B (${msSince(ldStart)} ms)`);

      logStep(stderr, '[objcopy] sketch.hex');
      const hexStart = performance.now();
      const hexBytes = (
        await runTool(
          factories.objcopy,
          'objcopy',
          ['-O', 'ihex', '-R', '.eeprom', '/work/sketch.elf', '/work/sketch.hex'],
          new Map([['/work/sketch.elf', elf]]),
          ['/work/sketch.hex'],
        )
      ).get('/work/sketch.hex');
      logStep(stderr, `  ${hexBytes.length} B (${msSince(hexStart)} ms)`);

      const hex = dec(hexBytes);
      const flashBytes = countIntelHexDataBytes(hex);
      timings.totalMs = msSince(totalStart);
      logStep(stderr, '');
      logStep(stderr, `[done] ${timings.totalMs} ms`);

      return {
        hex,
        flashBytes,
        fitsTarget: flashBytes <= MEGA_APP_FLASH_BYTES,
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
