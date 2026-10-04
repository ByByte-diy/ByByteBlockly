#!/usr/bin/env node
/**
 * Overlay ByByte W1 libraries onto src/assets/wasm-avr:
 * headers + prebuilt .o (via WASM avr-gcc) + patched firmware-builder.js.
 */
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { access, cp, lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { flattenWaveCatalog, mergeBybyteManifest, resolveCatalogFile } from './merge-manifest.mjs';
import { patchFirmwareBuilderSource } from './patch-firmware-builder.mjs';
import { compileLibraryObject, setCompileAssetsBase } from './compile-library-object.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const PKG = join(ROOT, 'node_modules/@horang-corp/avr-gcc-wasm');
const DEST = join(ROOT, 'src/assets/wasm-avr');
const CATALOG_PATH = join(__dirname, 'libraries.w1.json');
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
    const { object, stderr } = await compileLibraryObject({
      source: cpp,
      manifest,
      includePaths: flat.includePaths,
    });
    const dest = virtualToAssetPath(source.object);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, object);
    compiled.push(source.object);
    if (stderr.length) {
      console.log(`  stderr: ${stderr.slice(-2).join(' | ')}`);
    }
  }

  return compiled;
}

async function overlayFirmwareBuilder() {
  const builderPath = join(DEST, 'firmware-builder.js');
  const stockPath = join(PKG, 'firmware-builder.js');
  const stock = await readFile(stockPath, 'utf8');
  await writeFile(builderPath, patchFirmwareBuilderSource(stock));
}

async function main() {
  const catalog = JSON.parse(await readFile(CATALOG_PATH, 'utf8'));
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

  await overlayFirmwareBuilder();
  console.log('Patched firmware-builder.js');

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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
