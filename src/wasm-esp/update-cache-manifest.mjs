#!/usr/bin/env node
/**
 * Merge wasm-esp32 bundle entry into src/assets/cache-manifest.json.
 */
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashAggregate, hashFile, formatSha256 } from '../wasm-avr/hash-utils.mjs';
import { generateCacheManifest } from '../wasm-avr/generate-catalog.mjs';
import {
  WASM_ESP32_BUNDLE_ID,
  WASM_FAMILY_ESP32,
  ESP32_TOOLCHAIN_VERSION,
  bundleBaseUrl,
  bundleDiskPath,
  sanitizeDeployVersion,
} from './wasm-bundle-paths.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '../..');

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * @param {object} opts
 * @param {string} opts.bundleDir - published ESP32 bundle root
 * @param {string} [opts.rootDir]
 */
export async function buildEsp32BundleCatalog({ bundleDir, rootDir = ROOT }) {
  const deployVersion = sanitizeDeployVersion(ESP32_TOOLCHAIN_VERSION);
  const assetsBase = bundleBaseUrl(WASM_FAMILY_ESP32, deployVersion);
  const filesOnDisk = await walkFiles(bundleDir);

  /** @type {Record<string, { sha256: string, bytes: number }>} */
  const files = {};
  let totalBytes = 0;

  for (const filePath of filesOnDisk) {
    const rel = relative(bundleDir, filePath).replace(/\\/g, '/');
    const sha256 = await hashFile(filePath);
    const st = await stat(filePath);
    totalBytes += st.size;
    files[rel] = { sha256, bytes: st.size };
  }

  const contentHash = formatSha256(hashAggregate(files));

  return {
    bundleId: WASM_ESP32_BUNDLE_ID,
    version: ESP32_TOOLCHAIN_VERSION,
    deployVersion,
    contentHash,
    assetsBase,
    fqbn: ['esp32:esp32:esp32'],
    generatedAt: new Date().toISOString(),
    entryCount: Object.keys(files).length,
    totalBytes,
    files,
    manifestPath: 'manifest.json',
    outputFormat: 'bin',
  };
}

/**
 * @param {object} opts
 * @param {string} opts.bundleDir
 * @param {string} [opts.rootDir]
 */
export async function updateCacheManifestWithEsp32({ bundleDir, rootDir = ROOT }) {
  const espCatalog = await buildEsp32BundleCatalog({ bundleDir, rootDir });
  const manifest = await generateCacheManifest({ rootDir });

  manifest.bundles[WASM_ESP32_BUNDLE_ID] = {
    version: espCatalog.version,
    contentHash: espCatalog.contentHash,
    baseUrl: espCatalog.assetsBase,
    catalogUrl: `${espCatalog.assetsBase}wasm-catalog.json`,
    manifestUrl: `${espCatalog.assetsBase}manifest.json`,
    entryCount: espCatalog.entryCount,
    totalBytes: espCatalog.totalBytes,
    outputFormat: 'bin',
  };
  manifest.generatedAt = new Date().toISOString();

  const outPath = join(rootDir, 'src/assets/cache-manifest.json');
  await writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { manifest, espCatalog };
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const bundleDir =
    process.argv[2] ||
    bundleDiskPath(join(ROOT, 'src/assets'), WASM_FAMILY_ESP32, sanitizeDeployVersion(ESP32_TOOLCHAIN_VERSION));

  updateCacheManifestWithEsp32({ bundleDir })
    .then(({ espCatalog }) => {
      console.log(
        `Updated cache-manifest.json — ${WASM_ESP32_BUNDLE_ID} ${espCatalog.version} ` +
          `(${espCatalog.entryCount} files, ${(espCatalog.totalBytes / 1048576).toFixed(1)} MB)`,
      );
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
