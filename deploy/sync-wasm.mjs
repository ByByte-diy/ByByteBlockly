#!/usr/bin/env node
/**
 * Copy versioned WASM bundles from src/assets/wasm/ into the production dist tree.
 * Run after `npm run build:web` when the static host serves SPA + WASM from the same origin.
 *
 *   node deploy/sync-wasm.mjs [distRoot]
 *
 * Default distRoot: dist/web
 */
import { access, cp, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = join(ROOT, 'src/assets/cache-manifest.json');
const WASM_SRC_ROOT = join(ROOT, 'src/assets/wasm');
const DEFAULT_DIST = join(ROOT, 'dist/web');

/** @param {string} baseUrl e.g. /assets/wasm/esp32/vesp-v1.0.0/ */
function parseBaseUrl(baseUrl) {
  const match = baseUrl.match(/^\/assets\/wasm\/([^/]+)\/([^/]+)\/?$/);
  if (!match) {
    throw new Error(`Unexpected bundle baseUrl (expected /assets/wasm/{family}/{version}/): ${baseUrl}`);
  }
  return { family: match[1], version: match[2] };
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const distRoot = process.argv[2] ? join(process.cwd(), process.argv[2]) : DEFAULT_DIST;

  if (!(await exists(distRoot))) {
    console.error(`dist root not found: ${distRoot}`);
    console.error('Run npm run build:web first.');
    process.exit(1);
  }

  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  const bundles = manifest.bundles ?? {};

  let copied = 0;
  let totalBytes = 0;

  for (const [bundleId, entry] of Object.entries(bundles)) {
    const { family, version } = parseBaseUrl(entry.baseUrl);
    const srcDir = join(WASM_SRC_ROOT, family, version);
    const destDir = join(distRoot, 'assets/wasm', family, version);

    if (!(await exists(srcDir))) {
      console.error(`Missing prepared bundle for ${bundleId}: ${srcDir}`);
      console.error('Run npm run build:web (or prepare:wasm-avr / prepare:wasm-esp) first.');
      process.exit(1);
    }

    await cp(srcDir, destDir, { recursive: true, force: true });
    copied += 1;
    totalBytes += entry.totalBytes ?? 0;
    console.log(`  ${bundleId} → ${destDir.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
  }

  console.log(
    `Synced ${copied} WASM bundle(s) (~${(totalBytes / 1_000_000).toFixed(0)} MB catalog totalBytes).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
