#!/usr/bin/env node
/**
 * Verify production web build layout:
 * - cache-manifest.json is shipped with the SPA
 * - WASM blobs are excluded from ng build unless deploy/sync-wasm ran
 *
 *   node deploy/verify-web-build.mjs [--expect-wasm]
 *
 * Default distRoot: dist/web
 */
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_DIST = join(ROOT, 'dist/web');
const WASM_EXTENSIONS = new Set(['.wasm', '.o']);

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** @returns {Promise<string[]>} */
async function collectFiles(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

async function main() {
  const expectWasm = process.argv.includes('--expect-wasm');
  const distRoot = DEFAULT_DIST;

  if (!(await exists(distRoot))) {
    console.error(`dist root not found: ${distRoot}`);
    console.error('Run npm run build:web first.');
    process.exit(1);
  }

  const manifestPath = join(distRoot, 'assets/cache-manifest.json');
  if (!(await exists(manifestPath))) {
    console.error('Missing dist/web/assets/cache-manifest.json — production assets ignore wasm/** but must ship the manifest.');
    process.exit(1);
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const wasmDir = join(distRoot, 'assets/wasm');
  const hasWasmDir = await exists(wasmDir);

  if (!expectWasm) {
    if (hasWasmDir) {
      const wasmFiles = await collectFiles(wasmDir);
      const heavy = wasmFiles.filter((file) => WASM_EXTENSIONS.has(extname(file)));
      if (heavy.length > 0) {
        console.error(
          `Found ${heavy.length} WASM artifact(s) under dist/web/assets/wasm/ after ng build alone.`,
        );
        console.error('angular.json production must ignore wasm/** — or remove stale dist before verify.');
        process.exit(1);
      }
    }
    console.log('OK: SPA ships cache-manifest.json; no WASM blobs in dist (CDN / deploy:sync-wasm path).');
    return;
  }

  if (!hasWasmDir) {
    console.error('Expected WASM bundles after deploy:sync-wasm — dist/web/assets/wasm/ missing.');
    process.exit(1);
  }

  for (const [bundleId, entry] of Object.entries(manifest.bundles ?? {})) {
    const rel = entry.baseUrl.replace(/^\//, '');
    const catalogPath = join(distRoot, rel, 'wasm-catalog.json');
    if (!(await exists(catalogPath))) {
      console.error(`Missing ${catalogPath} for bundle ${bundleId}`);
      process.exit(1);
    }
  }

  const wasmRootStat = await stat(wasmDir);
  console.log(
    `OK: SPA + ${Object.keys(manifest.bundles ?? {}).length} WASM bundle(s) present (~${(
      Object.values(manifest.bundles ?? {}).reduce((sum, b) => sum + (b.totalBytes ?? 0), 0) / 1_000_000
    ).toFixed(0)} MB catalog totalBytes).`,
  );
  console.log(`    dist/web/assets/wasm/ mtime ${wasmRootStat.mtime.toISOString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
