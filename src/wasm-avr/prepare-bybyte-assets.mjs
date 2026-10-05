#!/usr/bin/env node
/**
 * Overlay ByByte library waves (W1, W2, …) onto versioned src/assets/wasm/avr-328p/:
 * headers + prebuilt .o (via WASM avr-gcc) + patched firmware-builder.js.
 */
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { access, cp, lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  flattenWaveCatalog,
  loadMergedCatalog,
  mergeBybyteManifest,
  resolveCatalogFile,
} from './libraries-manifest.mjs';
import { compileLibraryObject, setCompileAssetsBase } from './compile-library-object.mjs';
import {
  WASM_FAMILY_AVR_328P,
  bundleDiskPath,
} from './wasm-bundle-paths.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const PKG = join(ROOT, 'node_modules/@horang-corp/avr-gcc-wasm');
const ASSETS_DIR = join(ROOT, 'src/assets');
const DEST = bundleDiskPath(ASSETS_DIR, WASM_FAMILY_AVR_328P, '_staging');
const LEGACY_DEST = join(ASSETS_DIR, 'wasm-avr');
const PORT = 4175;
const MIME = {
  '.wasm': 'application/wasm',
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.o': 'application/octet-stream',
  '.a': 'application/octet-stream',
  '.xn': 'text/plain',
  '.h': 'text/plain',
};

function resolveFrom(...parts) {
  return join(ROOT, ...parts);
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureBaseAssets() {
  if (!(await pathExists(join(PKG, 'assets/manifest.json')))) {
    throw new Error('Missing @horang-corp/avr-gcc-wasm. Run npm install first.');
  }

  if (await pathExists(DEST)) {
    const stat = await lstat(DEST);
    if (stat.isSymbolicLink()) {
      await rm(DEST, { recursive: true, force: true });
    }
  }

  if (!(await pathExists(join(DEST, 'assets/manifest.json')))) {
    await rm(DEST, { recursive: true, force: true });
    await mkdir(dirname(DEST), { recursive: true });
    console.log('Copying avr-gcc-wasm assets…');
    await cp(PKG, DEST, { recursive: true });
  }
}

function virtualToFsPath(virtualPath) {
  return join(DEST, 'assets/fs', virtualPath.replace(/^\//, ''));
}

function virtualToAssetPath(virtualPath) {
  return join(DEST, 'assets', virtualPath.replace(/^\//, ''));
}

async function copyHeaders(catalog) {
  const copied = [];
  for (const lib of catalog.libraries) {
    for (const header of lib.headers || []) {
      const resolved = resolveCatalogFile(catalog, lib, header, resolveFrom);
      const dest = virtualToFsPath(resolved.virtual);
      await mkdir(dirname(dest), { recursive: true });
      await cp(resolved.from, dest);
      copied.push(resolved.virtual);
    }
  }
  return copied;
}

function startStaticServer(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = join(root, urlPath.replace(/^\//, ''));
      if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      });
      createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function compileSources(catalog, manifest) {
  const flat = flattenWaveCatalog(catalog, resolveFrom);
  const compiled = [];

  for (const source of flat.sources) {
    const cpp = await readFile(source.from, 'utf8');
    console.log(`Compiling ${source.id}: ${source.from} → ${source.object}`);
    const extraDefines =
      source.id === 'IRremote' ? ['BYBYTE_WASM_STUB_ISR'] : [];
    const { object, stderr } = await compileLibraryObject({
      source: cpp,
      manifest,
      includePaths: flat.includePaths,
      extraDefines,
    });
    const dest = virtualToAssetPath(source.object);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, object);
    if (stderr.some((line) => /fatal error:|compilation terminated/.test(line))) {
      throw new Error(
        `Failed to compile ${source.id} (${source.from}):\n${stderr.slice(-10).join('\n')}`,
      );
    }
    compiled.push(source.object);
    if (stderr.length) {
      console.log(`  stderr: ${stderr.slice(-2).join(' | ')}`);
    }
  }

  return compiled;
}

async function overlayWasmRuntime() {
  const { patchFirmwareBuilderSource, patchIndexSource, patchWorkerSource } = await import(
    './patch-wasm-bundle.mjs',
  );

  const builderPath = join(DEST, 'firmware-builder.js');
  const stockBuilder = await readFile(join(PKG, 'firmware-builder.js'), 'utf8');
  await writeFile(builderPath, patchFirmwareBuilderSource(stockBuilder));

  const indexPath = join(DEST, 'index.js');
  await writeFile(indexPath, patchIndexSource(await readFile(indexPath, 'utf8')));

  const workerPath = join(DEST, 'worker.js');
  await writeFile(workerPath, patchWorkerSource(await readFile(workerPath, 'utf8')));
}

async function loadCatalog() {
  return loadMergedCatalog(__dirname);
}

async function main() {
  const catalog = await loadCatalog();
  await ensureBaseAssets();

  const headerFiles = await copyHeaders(catalog);
  console.log(`Copied ${headerFiles.length} headers`);

  const stockManifest = JSON.parse(await readFile(join(PKG, 'assets/manifest.json'), 'utf8'));
  const flat = flattenWaveCatalog(catalog, resolveFrom);
  const headersOnlyManifest = mergeBybyteManifest(stockManifest, {
    wave: catalog.wave,
    libraries: flat.libraries,
    headerFiles: flat.headerFiles,
    includePaths: flat.includePaths,
    objectPaths: [],
  });
  await writeFile(
    join(DEST, 'assets/manifest.json'),
    `${JSON.stringify(headersOnlyManifest, null, 2)}\n`,
  );

  await overlayWasmRuntime();
  console.log('Patched firmware-builder.js, index.js, worker.js');

  const server = await startStaticServer(DEST);
  setCompileAssetsBase(`http://127.0.0.1:${PORT}/`);
  console.log(`Serving ${DEST} at http://127.0.0.1:${PORT}/`);

  try {
    const objectPaths = await compileSources(catalog, headersOnlyManifest);
    const finalManifest = mergeBybyteManifest(headersOnlyManifest, {
      wave: catalog.wave,
      generatedAt: new Date().toISOString(),
      libraries: flat.libraries,
      headerFiles: flat.headerFiles,
      includePaths: flat.includePaths,
      objectPaths,
    });
    await writeFile(
      join(DEST, 'assets/manifest.json'),
      `${JSON.stringify(finalManifest, null, 2)}\n`,
    );
    console.log(`Wrote ${objectPaths.length} objects and updated manifest`);
  } finally {
    server.close();
  }

  console.log(`ByByte ${catalog.wave} assets ready: ${DEST}`);

  const { generateCatalog, generateCacheManifest } = await import('./generate-catalog.mjs');
  const wasmCatalog = await generateCatalog({ destDir: DEST, rootDir: ROOT });
  console.log(`Generated wasm-catalog.json (${wasmCatalog.entryCount} files)`);

  const finalDir = bundleDiskPath(ASSETS_DIR, WASM_FAMILY_AVR_328P, wasmCatalog.deployVersion);
  await rm(finalDir, { recursive: true, force: true });
  await rm(LEGACY_DEST, { recursive: true, force: true });
  try {
    await rename(DEST, finalDir);
  } catch {
    await cp(DEST, finalDir, { recursive: true });
    await rm(DEST, { recursive: true, force: true });
  }
  console.log(`Published bundle: ${finalDir}`);

  await generateCacheManifest({ rootDir: ROOT, wasmCatalog });
  console.log('Generated cache-manifest.json');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
