/**
 * Compile one Arduino library .cpp to .o with the packaged WASM avr-gcc.
 */
import createCc1plus from '../../node_modules/@horang-corp/avr-gcc-wasm/tools/cc1plus.mjs';
import createAvrAs from '../../node_modules/@horang-corp/avr-gcc-wasm/tools/avr-as.mjs';
import { setAssetsBase } from '../../node_modules/@horang-corp/avr-gcc-wasm/firmware-builder.js';

const MULTILIB = 'avr5';
const WASM_FILE_BY_TOOL = Object.freeze({
  cc1plus: 'cc1plus.wasm',
  'avr-as': 'avr-as.wasm',
});

let assetsBase;

export function setCompileAssetsBase(base) {
  assetsBase = new URL(base);
  setAssetsBase(assetsBase);
}

function ensureDir(fs, dir) {
  if (!dir || dir === '/') return;
  const parts = dir.split('/').filter(Boolean);
  let current = '';
  for (const part of parts) {
    current += `/${part}`;
    try {
      fs.mkdir(current);
    } catch (error) {
      if (error?.errno !== 20) {
        try {
          fs.stat(current);
        } catch {
          throw error;
        }
      }
    }
  }
}

function writeFile(fs, path, data) {
  ensureDir(fs, path.split('/').slice(0, -1).join('/'));
  fs.writeFile(path, data);
}

function assetUrl(path) {
  return new URL(`assets/${path.replace(/^\/+/, '')}`, assetsBase);
}

async function fetchBytes(path) {
  const res = await fetch(assetUrl(path));
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function loadHeaders(fs, manifest) {
  const concurrency = 8;
  const queue = [...manifest.headerFiles];
  async function worker() {
    while (queue.length) {
      const virtualPath = queue.shift();
      writeFile(fs, virtualPath, await fetchBytes(`/fs${virtualPath}`));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

function compileArgs(includePaths) {
  return [
    '-quiet',
    '-imultilib', MULTILIB,
    '-D__AVR_ATmega328P__',
    '-D__AVR_DEVICE_NAME__=atmega328p',
    '-DF_CPU=16000000L',
    '-DARDUINO=10819',
    '-DARDUINO_AVR_UNO',
    '-DARDUINO_ARCH_AVR',
    '-isystem', '/sysroot/gcc/include',
    '-isystem', '/sysroot/avr/include',
    '-I', '/arduino/core',
    '-I', '/arduino/variant',
    '-I', '/arduino/libraries/Wire/src',
    '-I', '/arduino/libraries/SPI/src',
    '-I', '/arduino/libraries/Wire/src/utility',
    '-I', '/libraries/Servo/src',
    '-I', '/libraries/Servo/src/avr',
    ...includePaths.flatMap((p) => ['-I', p]),
    '/build/Library.cpp',
    '-mn-flash=1',
    '-mno-skip-bug',
    '-quiet',
    '-dumpbase', 'Library.cpp',
    '-mmcu=avr5',
    '-auxbase-strip', '/build/Library.s',
    '-Os',
    '-std=gnu++11',
    '-fpermissive',
    '-fno-exceptions',
    '-fno-threadsafe-statics',
    '-fno-rtti',
    '-fno-enforce-eh-specs',
    '-ffunction-sections',
    '-fdata-sections',
    '-o', '/build/Library.s',
  ];
}

function createModuleOptions(toolName, stderr) {
  return {
    noInitialRun: true,
    locateFile(path) {
      const wasmFile = path.endsWith('.wasm') ? WASM_FILE_BY_TOOL[toolName] || path : path;
      return new URL(`tools/${wasmFile}`, assetsBase).href;
    },
    print() {},
    printErr(line) {
      if (line) stderr.push(`[${toolName}] ${line}`);
    },
  };
}

async function runTool(toolName, factory, args, setup, outputPath, stderr) {
  const mod = await factory(createModuleOptions(toolName, stderr));
  if (setup) await setup(mod.FS);
  try {
    mod.callMain(args);
  } catch (error) {
    const message = String(error?.message || error);
    if (error?.status !== 0 && !/Program terminated with exit\(0\)/.test(message)) {
      throw new Error(`${toolName} failed: ${message}\n${stderr.slice(-20).join('\n')}`);
    }
  }
  try {
    return mod.FS.readFile(outputPath);
  } catch (error) {
    throw new Error(`${toolName} did not produce ${outputPath}: ${error.message}\n${stderr.slice(-20).join('\n')}`);
  }
}

export async function compileLibraryObject({ source, manifest, includePaths }) {
  if (!assetsBase) {
    throw new Error('setCompileAssetsBase() first');
  }
  const stderr = [];

  const assembly = await runTool(
    'cc1plus',
    createCc1plus,
    compileArgs(includePaths),
    async (fs) => {
      await loadHeaders(fs, manifest);
      writeFile(fs, '/build/Library.cpp', source);
    },
    '/build/Library.s',
    stderr,
  );

  const object = await runTool(
    'avr-as',
    createAvrAs,
    ['-mmcu=atmega328p', '-o', '/build/Library.o', '/build/Library.s'],
    (fs) => writeFile(fs, '/build/Library.s', assembly),
    '/build/Library.o',
    stderr,
  );

  return { object, stderr };
}
