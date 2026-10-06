#!/usr/bin/env node
/**
 * Prepare AVR Mega2560 WASM bundle: wasm-toolchains avrwasm.tar + ByByte W1–W7 headers/objects.
 */
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
  flattenWaveCatalog,
  loadMergedCatalog,
  resolveCatalogFile,
} from './libraries-manifest.mjs';
import {
  WASM_FAMILY_AVR_MEGA,
  bundleDiskPath,
} from './wasm-bundle-paths.mjs';
import {
  ensureTarExtracted,
  ensureToolchains,
  paths,
  virtualToBundleRel,
} from './wasm-toolchains-dist.cjs';
import { generateMegaCatalog } from './generate-mega-catalog.mjs';
import { generateCacheManifest } from './generate-catalog.mjs';

const require = createRequire(import.meta.url);
const { compileMegaLibraryObject } = require('./compile-mega-library-object.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const ASSETS_DIR = join(ROOT, 'src/assets');
const DEST = bundleDiskPath(ASSETS_DIR, WASM_FAMILY_AVR_MEGA, '_staging');
const HORANG_LIBS = join(ROOT, 'node_modules/@horang-corp/avr-gcc-wasm/assets/fs/libraries');
const USERLIBS = join(ROOT, 'compilation/arduino/userlibs/libraries');
/** cc1 emits a ~444 B stub object when compilation fails but exit code stays 0. */
const FAILED_OBJECT_BYTES = 444;

function resolveFrom(...parts) {
  return join(ROOT, ...parts);
}

function bundlePath(virtualPath) {
  return join(DEST, virtualToBundleRel(virtualPath));
}

async function copyHeaders(catalog) {
  let count = 0;
  for (const lib of catalog.libraries) {
    for (const header of lib.headers || []) {
      const resolved = resolveCatalogFile(catalog, lib, header, resolveFrom);
      const dest = bundlePath(resolved.virtual);
      await mkdir(dirname(dest), { recursive: true });
      await cp(resolved.from, dest);
      count += 1;
    }
  }
  return count;
}

async function copyStockLibraryOverlays() {
  const copies = [
    { from: join(USERLIBS, 'Servo'), to: join(DEST, 'libraries/Servo') },
    { from: join(HORANG_LIBS, 'Adafruit_GFX_Library'), to: join(DEST, 'libraries/Adafruit_GFX_Library') },
    { from: join(HORANG_LIBS, 'Adafruit_BusIO'), to: join(DEST, 'libraries/Adafruit_BusIO') },
    { from: join(HORANG_LIBS, 'Adafruit_Unified_Sensor'), to: join(DEST, 'libraries/Adafruit_Unified_Sensor') },
  ];
  for (const { from, to } of copies) {
    await cp(from, to, { recursive: true });
  }
  return copies.length;
}

function diskIncludePaths(flat) {
  const stock = [
    join(DEST, 'libraries/Wire'),
    join(DEST, 'libraries/SPI'),
    join(DEST, 'libraries/SoftwareSerial'),
    join(DEST, 'libraries/EEPROM'),
    join(DEST, 'arduino/libraries/EEPROM/src'),
    join(DEST, 'arduino/libraries/SoftwareSerial/src'),
    join(DEST, 'libraries/Servo/src'),
    join(DEST, 'libraries/Servo/src/avr'),
    join(DEST, 'libraries/Adafruit_GFX_Library'),
    join(DEST, 'libraries/Adafruit_BusIO'),
    join(DEST, 'libraries/Adafruit_Unified_Sensor'),
  ];
  const fromCatalog = flat.includePaths.map((p) => join(DEST, virtualToBundleRel(p)));
  return [...new Set([...stock, ...fromCatalog])];
}

async function compileSources(catalog, flat) {
  const includeDiskPaths = diskIncludePaths(flat);
  const coreDir = join(DEST, 'arduino-core');
  const compiled = [];

  for (const source of flat.sources) {
    let cpp = await readFile(source.from, 'utf8');
    console.log(`Compiling ${source.id}: ${source.from} → ${source.object}`);
    const extraDefines = source.id === 'IRremote' ? ['BYBYTE_WASM_STUB_ISR'] : [];
    const { object, log } = await compileMegaLibraryObject({
      source: cpp,
      sourcePath: source.from,
      coreDir,
      includeDiskPaths,
      extraDefines,
    });
    const dest = bundlePath(source.object);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, object);
    compiled.push(source.object.replace(/^\//, ''));
    const errLine = log.find((l) => /error:/i.test(l));
    if (errLine) {
      throw new Error(`Failed to compile ${source.id}: ${errLine}`);
    }
    if (object.length <= FAILED_OBJECT_BYTES) {
      throw new Error(
        `Failed to compile ${source.id}: stub object (${object.length} B) — missing include paths or headers`,
      );
    }
  }

  return compiled;
}

async function main() {
  const p = paths(ROOT);
  ensureToolchains(p);
  const distWeb = ensureTarExtracted(p);

  await rm(DEST, { recursive: true, force: true });
  console.log(`Copying ${distWeb} → ${DEST}`);
  await cp(distWeb, DEST, { recursive: true });

  const catalog = await loadMergedCatalog(__dirname);
  const flat = flattenWaveCatalog(catalog, resolveFrom);

  const overlayCount = await copyStockLibraryOverlays();
  console.log(`Copied ${overlayCount} stock library overlays (Servo, Adafruit_GFX, …)`);

  const headerCount = await copyHeaders(catalog);
  console.log(`Copied ${headerCount} ByByte headers`);

  const objectPaths = await compileSources(catalog, flat);
  console.log(`Compiled ${objectPaths.length} objects`);

  const bybyteManifest = {
    wave: flat.wave,
    generatedAt: new Date().toISOString(),
    mcu: 'atmega2560',
    arch: 'avr6',
    headerFiles: flat.headerFiles,
    includePaths: flat.includePaths,
    objectPaths,
    libraries: flat.libraries,
  };
  await writeFile(
    join(DEST, 'bybyte-manifest.json'),
    `${JSON.stringify(bybyteManifest, null, 2)}\n`,
  );

  await cp(join(__dirname, 'mega-browser/index.js'), join(DEST, 'index.js'));
  console.log('Copied mega-browser/index.js');

  const wasmCatalog = await generateMegaCatalog({ destDir: DEST, rootDir: ROOT, bybyteManifest });
  console.log(`Generated wasm-catalog.json (${wasmCatalog.entryCount} files)`);

  const finalDir = bundleDiskPath(ASSETS_DIR, WASM_FAMILY_AVR_MEGA, wasmCatalog.deployVersion);
  await rm(finalDir, { recursive: true, force: true });
  try {
    await rename(DEST, finalDir);
  } catch {
    await cp(DEST, finalDir, { recursive: true });
    await rm(DEST, { recursive: true, force: true });
  }
  console.log(`Published bundle: ${finalDir}`);

  await generateCacheManifest({ rootDir: ROOT, megaCatalog: wasmCatalog });
  console.log('Updated cache-manifest.json');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
